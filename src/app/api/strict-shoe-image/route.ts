import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type View = "Side" | "Top" | "Outsole";
type Candidate = {
  imageUrl: string;
  pageUrl: string;
  hintText: string;
  index: number;
  score: number;
};
type Analyzed = Candidate & {
  buffer: Buffer;
  ratio: number;
  familyKey: string;
};
type Gallery = Record<View, Analyzed>;

const VIEWS: View[] = ["Side", "Top", "Outsole"];
const CANVAS = { width: 1200, height: 900 };

function decodeHtml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("\\u002F", "/")
    .replaceAll("\\/", "/");
}

function modelTokens(brand: string, model: string) {
  return `${brand} ${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !["men", "mens", "women", "womens", "shoe", "shoes", "running", "road"].includes(token));
}

function variantKey(url: string) {
  const decoded = decodeURIComponent(url).toLowerCase();
  const puma = decoded.match(/\/global\/([^/]+)\/([^/]+)\//);
  if (puma) return `puma:${puma[1]}:${puma[2]}`;
  const asics = decoded.match(/(\d{4}[a-z]\d{3,4})[_-](\d{3})/i);
  if (asics) return `asics:${asics[1]}-${asics[2]}`;
  const hoka = decoded.match(/\/(\d{6,8}-[a-z0-9]+)(?:_[a-z0-9]+)?_0?[1-9]\.(?:png|jpe?g|webp)/i);
  if (hoka) return `hoka:${hoka[1]}`;
  const nike = decoded.match(/([a-z]{2}\d{4}-\d{3})/i);
  if (nike) return `nike:${nike[1]}`;
  const adidas = decoded.match(/(?:^|[\/_-])([a-z]{2}\d{4})(?:[\/_\-.]|$)/i);
  if (adidas) return `adidas:${adidas[1]}`;
  return null;
}

function normalizedPage(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    for (const key of [...parsed.searchParams.keys()]) {
      if (/utm_|ref|source|campaign|size/i.test(key)) parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function familyKey(candidate: Candidate, seedKey: string | null) {
  const key = variantKey(candidate.imageUrl);
  if (seedKey && key === seedKey) return seedKey;
  if (key) return key;
  if (candidate.pageUrl) return `page:${normalizedPage(candidate.pageUrl)}`;
  try {
    const parsed = new URL(candidate.imageUrl);
    const parts = parsed.pathname.split("/");
    parts.pop();
    return `path:${parsed.host}${parts.join("/")}`;
  } catch {
    return candidate.imageUrl;
  }
}

function candidateScore(imageUrl: string, pageUrl: string, hintText: string, tokens: string[], seedKey: string | null) {
  const hay = decodeURIComponent(`${imageUrl} ${pageUrl} ${hintText}`).toLowerCase();
  let score = 0;
  let matched = 0;
  for (const token of tokens) {
    if (!hay.includes(token)) continue;
    matched += 1;
    score += token.length >= 5 ? 5 : 2;
  }
  if (tokens.length && matched / tokens.length >= 0.5) score += 12;
  if (/product|products|\/pd\/|shoe|running|footwear|cdn|media|images/.test(hay)) score += 3;
  if (/pinterest|ebay|amazon|aliexpress|temu|logo|icon|banner|sprite|avatar|review|video|watermark/.test(hay)) score -= 30;
  const key = variantKey(imageUrl);
  if (seedKey && key === seedKey) score += 70;
  else if (seedKey && key && key !== seedKey) score -= 80;
  return score;
}

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return decodeHtml(match?.[1] ?? match?.[2] ?? "");
}

function parseProductPage(html: string, baseUrl: string, tokens: string[], seedKey: string | null) {
  const decoded = decodeHtml(html);
  const seen = new Set<string>();
  const result: Candidate[] = [];

  const add = (raw: string, hintText: string) => {
    if (!raw || raw.startsWith("data:")) return;
    try {
      const imageUrl = new URL(raw, baseUrl).toString();
      if (!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(imageUrl) && !/(?:images\.puma|images\.asics|media\.|cdn\.|cloudinary|scene7|contentful|static)/i.test(imageUrl)) return;
      if (seen.has(imageUrl)) return;
      seen.add(imageUrl);
      const score = candidateScore(imageUrl, baseUrl, hintText, tokens, seedKey);
      if (score < -5) return;
      result.push({ imageUrl, pageUrl: baseUrl, hintText, index: result.length, score });
    } catch {
      // Ignore malformed image URLs.
    }
  };

  for (const match of decoded.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const hintText = [attr(tag, "alt"), attr(tag, "title"), attr(tag, "aria-label"), attr(tag, "data-testid"), attr(tag, "class")]
      .filter(Boolean)
      .join(" ");
    const values = [attr(tag, "src"), attr(tag, "data-src"), attr(tag, "data-zoom-image"), attr(tag, "srcset"), attr(tag, "data-srcset")];
    for (const value of values) {
      for (const part of value.split(/\s*,\s*/)) add(part.trim().split(/\s+/)[0] ?? "", hintText);
    }
  }

  for (const match of decoded.matchAll(/<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi)) {
    add(attr(match[0], "content"), "primary product image");
  }

  return result.sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 48);
}

function parseBing(html: string, tokens: string[], seedKey: string | null) {
  const result: Candidate[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/\sm=(?:"([^"]+)"|'([^']+)')/gi)) {
    const raw = decodeHtml(match[1] ?? match[2] ?? "");
    if (!raw.includes("murl")) continue;
    try {
      const item = JSON.parse(raw) as { murl?: string; purl?: string; t?: string };
      if (!item.murl || !/^https?:\/\//i.test(item.murl) || seen.has(item.murl)) continue;
      const pageUrl = item.purl ?? "";
      if (/pinterest|ebay|amazon|aliexpress|temu/i.test(pageUrl)) continue;
      const hintText = item.t ?? "";
      const score = candidateScore(item.murl, pageUrl, hintText, tokens, seedKey);
      if (score < 2) continue;
      seen.add(item.murl);
      result.push({ imageUrl: item.murl, pageUrl, hintText, index: result.length, score });
    } catch {
      // Ignore malformed search metadata.
    }
  }
  return result.sort((a, b) => b.score - a.score).slice(0, 80);
}

function deterministicSeedCandidates(seed: string, tokens: string[], seedKey: string | null) {
  if (!seed || !/^https?:\/\//i.test(seed)) return [] as Candidate[];
  const urls: Array<{ url: string; hint: string }> = [];
  const lower = seed.toLowerCase();

  if (lower.includes("images.puma.com")) {
    const match = seed.match(/(\/global\/[^/]+\/[^/]+\/)([^/]+)(\/fnd\/)/i);
    if (match) {
      urls.push({ url: seed.replace(match[0], `${match[1]}sv01${match[3]}`), hint: "side lateral view" });
      urls.push({ url: seed.replace(match[0], `${match[1]}sv05${match[3]}`), hint: "top overhead view" });
      urls.push({ url: seed.replace(match[0], `${match[1]}bv${match[3]}`), hint: "outsole bottom view" });
    }
  }

  if (lower.includes("images.asics.com")) {
    const match = seed.match(/^(.*?)(?:_SR_(?:LT|RT)|_SB_TP|_SB_BT)_GLB(.*)$/i);
    if (match) {
      urls.push({ url: `${match[1]}_SR_RT_GLB${match[2]}`, hint: "side lateral view" });
      urls.push({ url: `${match[1]}_SB_TP_GLB${match[2]}`, hint: "top overhead view" });
      urls.push({ url: `${match[1]}_SB_BT_GLB${match[2]}`, hint: "outsole bottom view" });
    }
  }

  return urls.map(({ url, hint }, index) => ({
    imageUrl: url,
    pageUrl: "",
    hintText: hint,
    index,
    score: candidateScore(url, "", hint, tokens, seedKey) + 50,
  }));
}

function viewEvidence(candidate: Analyzed, view: View) {
  const text = decodeURIComponent(`${candidate.imageUrl} ${candidate.hintText}`).toLowerCase();
  const side = /\b(side|lateral|profile|medial|outer view|inner view)\b|phsrh|phslh|_sr_rt_|_sr_lt_|\/sv01\//i.test(text);
  const top = /\b(top view|top-down|top down|overhead|bird.?s.?eye|upper view)\b|phst|sb_tp|_tp_|\/sv05\//i.test(text);
  const outsole = /\b(outsole|bottom view|sole view|tread view)\b|phsbt|sb_bt|_bt_|\/bv\//i.test(text);
  const frontRear = /\b(front|rear|heel view|back view)\b/.test(text);

  if (view === "Side") {
    if (!side || top || outsole || frontRear) return -100;
    return 20 + (candidate.ratio >= 1.1 ? 4 : 0);
  }
  if (view === "Top") {
    if (!top || side || outsole || frontRear) return -100;
    return 20 + (candidate.ratio <= 1.1 ? 4 : 0);
  }
  if (!outsole || side || top || frontRear) return -100;
  return 20 + (candidate.ratio <= 1.1 ? 4 : 0);
}

async function analyze(candidate: Candidate, seedKey: string | null): Promise<Analyzed> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);
  try {
    const response = await fetch(candidate.imageUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/2.0)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });
    if (!response.ok) throw new Error(`image ${response.status}`);
    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) throw new Error("not image");
    const input = Buffer.from(await response.arrayBuffer());
    const { data, info } = await sharp(input, { failOn: "none", animated: false })
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .trim({ background: "#ffffff", threshold: 18 })
      .png()
      .toBuffer({ resolveWithObject: true });
    return {
      ...candidate,
      buffer: data,
      ratio: (info.width || 1) / (info.height || 1),
      familyKey: familyKey(candidate, seedKey),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeMany(candidates: Candidate[], seedKey: string | null, limit = 24) {
  const settled = await Promise.allSettled(candidates.slice(0, limit).map((candidate) => analyze(candidate, seedKey)));
  return settled.flatMap((item) => item.status === "fulfilled" ? [item.value] : []);
}

function chooseGallery(images: Analyzed[], seedKey: string | null): Gallery | null {
  const groups = new Map<string, Analyzed[]>();
  for (const image of images) {
    const group = groups.get(image.familyKey) ?? [];
    group.push(image);
    groups.set(image.familyKey, group);
  }

  let best: { gallery: Gallery; score: number } | null = null;
  for (const [key, group] of groups) {
    if (group.length < 3) continue;
    const selected = {} as Gallery;
    const used = new Set<string>();
    let total = key === seedKey ? 100 : 0;
    let valid = true;

    for (const view of VIEWS) {
      const ranked = group
        .map((image) => ({ image, evidence: viewEvidence(image, view) }))
        .filter(({ image, evidence }) => evidence >= 20 && !used.has(image.imageUrl))
        .sort((a, b) => b.evidence - a.evidence || b.image.score - a.image.score);
      const winner = ranked[0]?.image;
      if (!winner) {
        valid = false;
        break;
      }
      selected[view] = winner;
      used.add(winner.imageUrl);
      total += ranked[0].evidence + winner.score;
    }

    if (valid && (!best || total > best.score)) best = { gallery: selected, score: total };
  }
  return best?.gallery ?? null;
}

async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
      cache: "force-cache",
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("text/html")) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function galleryFromPage(url: string, tokens: string[], seedKey: string | null) {
  const html = await fetchHtml(url);
  if (!html) return null;
  const candidates = parseProductPage(html, url, tokens, seedKey);
  return chooseGallery(await analyzeMany(candidates, seedKey, 30), seedKey);
}

async function resolveGallery(brand: string, model: string, source: string, seed: string) {
  const tokens = modelTokens(brand, model);
  const seedKey = variantKey(seed);

  const deterministic = deterministicSeedCandidates(seed, tokens, seedKey);
  if (deterministic.length === 3) {
    const gallery = chooseGallery(await analyzeMany(deterministic, seedKey, 3), seedKey);
    if (gallery) return { gallery, pageUrl: "deterministic-seed" };
  }

  if (source && /^https?:\/\//i.test(source)) {
    const gallery = await galleryFromPage(source, tokens, seedKey);
    if (gallery) return { gallery, pageUrl: source };
  }

  const query = encodeURIComponent(`\"${brand} ${model}\" running shoes product side top outsole -ebay -amazon -pinterest`);
  const response = await fetch(`https://www.bing.com/images/search?q=${query}&form=HDRSC3`, {
    headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
    cache: "force-cache",
  });
  if (!response.ok) return null;
  const searched = parseBing(await response.text(), tokens, seedKey);

  const direct = chooseGallery(await analyzeMany(searched, seedKey, 36), seedKey);
  if (direct) {
    const pageUrl = direct.Side.pageUrl || direct.Top.pageUrl || direct.Outsole.pageUrl;
    return { gallery: direct, pageUrl };
  }

  const pages = [...new Set(searched.map((candidate) => candidate.pageUrl).filter((url) => /^https?:\/\//i.test(url)))].slice(0, 5);
  for (const pageUrl of pages) {
    const gallery = await galleryFromPage(pageUrl, tokens, seedKey);
    if (gallery) return { gallery, pageUrl };
  }

  return null;
}

async function normalize(buffer: Buffer, view: View) {
  const target = view === "Side" ? { width: 1000, height: 620 } : { width: 720, height: 800 };
  const object = await sharp(buffer)
    .flatten({ background: "#ffffff" })
    .trim({ background: "#ffffff", threshold: 18 })
    .resize({ ...target, fit: "contain", background: "#ffffff", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const meta = await sharp(object).metadata();
  const width = meta.width ?? target.width;
  const height = meta.height ?? target.height;
  return sharp({ create: { width: CANVAS.width, height: CANVAS.height, channels: 4, background: "#ffffff" } })
    .composite([{ input: object, left: Math.floor((CANVAS.width - width) / 2), top: Math.floor((CANVAS.height - height) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function GET(request: NextRequest) {
  const brand = request.nextUrl.searchParams.get("brand")?.trim() ?? "";
  const model = request.nextUrl.searchParams.get("model")?.trim() ?? "";
  const view = request.nextUrl.searchParams.get("view") as View | null;
  const source = request.nextUrl.searchParams.get("source")?.trim() ?? "";
  const seed = request.nextUrl.searchParams.get("seed")?.trim() ?? "";

  if (!brand || !model || !view || !VIEWS.includes(view)) {
    return new Response("Invalid shoe image request", { status: 400 });
  }

  try {
    const resolved = await resolveGallery(brand, model, source, seed);
    if (!resolved) throw new Error("no single-family gallery with explicit Side/Top/Outsole evidence");
    const picked = resolved.gallery[view];
    const output = await normalize(picked.buffer, view);
    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=604800",
        "x-runned-gallery-page": resolved.pageUrl,
        "x-runned-image-family": picked.familyKey,
        "x-runned-image-candidate": picked.imageUrl,
        "x-runned-image-view": view,
        "x-runned-angle-evidence": String(viewEvidence(picked, view)),
      },
    });
  } catch (error) {
    console.error("Strict shoe image resolution rejected", { brand, model, view, source, seed, error });
    return new Response("No verified three-view gallery available", {
      status: 422,
      headers: { "cache-control": "public, max-age=900, s-maxage=900" },
    });
  }
}
