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
  edgeScore: number;
};
type Gallery = Record<View, Analyzed>;

const VIEWS: View[] = ["Side", "Top", "Outsole"];
const CANVAS = { width: 1200, height: 900 };
const TRUSTED_RETAILERS = [
  "fleetfeet.com",
  "runningwarehouse.com",
  "roadrunnersports.com",
  "sportsshoes.com",
  "misterrunning.com",
  "runningxpert.com",
  "holabirdsports.com",
  "run4it.com",
  "achillesheel.co.uk",
  "fit2run.com",
  "paceathletic.com",
  "thelooprunning.com",
  "ncrsport.com",
  "startinglane.co.id",
  "topscore.id",
  "blibli.com",
];

const OFFICIAL_DOMAINS: Record<string, string> = {
  adidas: "adidas.com",
  nike: "nike.com",
  asics: "asics.com",
  hoka: "hoka.com",
  "new balance": "newbalance.com",
  puma: "puma.com",
  saucony: "saucony.com",
  brooks: "brooksrunning.com",
  on: "on.com",
  mizuno: "mizunousa.com",
  skechers: "skechers.com",
  "910 nineten": "910.id",
  ortuseight: "ortuseight.com",
  mills: "mills.co.id",
};

function decodeHtml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\\u002[fF]/g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/\\\//g, "/");
}

function modelTokens(brand: string, model: string) {
  return `${brand} ${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !["men", "mens", "women", "womens", "shoe", "shoes", "running", "road"].includes(token));
}

function significantTokens(tokens: string[]) {
  return tokens.filter((token) => token.length >= 3 && !/^v?\d+$/.test(token));
}

function variantKey(url: string) {
  const decoded = decodeURIComponent(url).toLowerCase();
  const puma = decoded.match(/\/global\/([^/]+)\/([^/]+)\//);
  if (puma) return `puma:${puma[1]}:${puma[2]}`;
  const asics = decoded.match(/(\d{4}[a-z]\d{3,4})[_-](\d{3})/i);
  if (asics) return `asics:${asics[1]}-${asics[2]}`;
  const hoka = decoded.match(/(?:^|\/)(\d{6,8}-[a-z0-9]+)(?:_[a-z0-9]+)?(?:[_-]0?[1-9])?\.(?:png|jpe?g|webp)/i);
  if (hoka) return `hoka:${hoka[1]}`;
  const nike = decoded.match(/([a-z]{2}\d{4}-\d{3})/i);
  if (nike) return `nike:${nike[1]}`;
  const adidas = decoded.match(/(?:^|[\/_-])([a-z]{2}\d{4})(?:[\/_\-.]|$)/i);
  if (adidas) return `adidas:${adidas[1]}`;
  const nb = decoded.match(/(?:^|\/)([a-z0-9]{5,12})_nb_\d{2}_i(?:\.|\?|$)/i);
  if (nb) return `newbalance:${nb[1]}`;
  const mizuno = decoded.match(/(?:sh_)?(j\d[a-z]{2}\d{6})[_-]\d{2}/i);
  if (mizuno) return `mizuno:${mizuno[1]}`;
  const skechers = decoded.match(/(?:^|\/)(\d{5,7})[_-]([a-z0-9]{2,6})[_-](?:\d+|\dx)/i);
  if (skechers) return `skechers:${skechers[1]}-${skechers[2]}`;
  const saucony = decoded.match(/\b(s\d{5}-\d{2,4})\b/i);
  if (saucony) return `saucony:${saucony[1]}`;
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

function pageHost(url: string) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isTrustedPage(url: string, officialDomain?: string) {
  const host = pageHost(url);
  if (!host) return false;
  if (officialDomain && (host === officialDomain || host.endsWith(`.${officialDomain}`))) return true;
  return TRUSTED_RETAILERS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function familyKey(candidate: Candidate, seedKey: string | null) {
  const key = variantKey(candidate.imageUrl);
  if (seedKey && key === seedKey) return seedKey;
  if (key) return key;
  if (candidate.pageUrl) return `page:${normalizedPage(candidate.pageUrl)}`;
  try {
    const parsed = new URL(candidate.imageUrl);
    const stem = parsed.pathname
      .replace(/\.(?:png|jpe?g|webp|avif)$/i, "")
      .replace(/(?:[_-](?:side|lateral|top|upper|bottom|outsole|sole|front|rear|heel|\d{1,2}|\d+x))+$\/i, "");
    return `stem:${parsed.host}${stem}`;
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
  if (/pinterest|ebay|amazon|aliexpress|temu|logo|icon|banner|sprite|avatar|review|video|watermark|shoe box|shoebox|packaging/.test(hay)) score -= 50;
  const key = variantKey(imageUrl);
  if (seedKey && key === seedKey) score += 80;
  else if (seedKey && key && key !== seedKey) score -= 120;
  return score;
}

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return decodeHtml(match?.[1] ?? match?.[2] ?? "");
}

function pageMatchesModel(html: string, tokens: string[]) {
  const hay = decodeHtml(html).toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const important = significantTokens(tokens);
  if (!important.length) return true;
  const matched = important.filter((token) => hay.includes(token)).length;
  return matched >= Math.max(1, Math.ceil(important.length * 0.5));
}

function parseProductPage(html: string, baseUrl: string, tokens: string[], seedKey: string | null) {
  if (!pageMatchesModel(html, tokens)) return [] as Candidate[];
  const decoded = decodeHtml(html);
  const seen = new Set<string>();
  const result: Candidate[] = [];

  const add = (raw: string, hintText: string) => {
    if (!raw || raw.startsWith("data:")) return;
    try {
      const cleaned = raw.replace(/^['\"]|['\"]$/g, "").replace(/\\u0026/g, "&");
      const imageUrl = new URL(cleaned, baseUrl).toString();
      if (!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(imageUrl) && !/(?:images\.puma|images\.asics|scene7|media\.|cdn\.|cloudinary|contentful|static-src|img\.susercontent)/i.test(imageUrl)) return;
      if (seen.has(imageUrl)) return;
      const score = candidateScore(imageUrl, baseUrl, hintText, tokens, seedKey);
      if (score < -5) return;
      seen.add(imageUrl);
      result.push({ imageUrl, pageUrl: baseUrl, hintText: decodeHtml(hintText), index: result.length, score });
    } catch {
      // Ignore malformed image URLs.
    }
  };

  for (const match of decoded.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const tag = match[0];
    const hintText = [
      attr(tag, "alt"), attr(tag, "title"), attr(tag, "aria-label"), attr(tag, "data-testid"),
      attr(tag, "class"), attr(tag, "data-alt"), attr(tag, "data-image-role"), attr(tag, "data-view"),
    ].filter(Boolean).join(" ");
    const values = [
      attr(tag, "src"), attr(tag, "data-src"), attr(tag, "data-zoom-image"), attr(tag, "srcset"),
      attr(tag, "data-srcset"), attr(tag, "data-image"), attr(tag, "data-image-url"),
    ];
    for (const value of values) {
      for (const part of value.split(/\s*,\s*/)) add(part.trim().split(/\s+/)[0] ?? "", hintText);
    }
  }

  for (const match of decoded.matchAll(/<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi)) {
    add(attr(match[0], "content"), "primary product image side hero");
  }

  // Modern commerce sites frequently keep the complete product gallery in JSON/script data.
  // Preserve a context window around each URL so fields such as altText, view, position,
  // imageRole, Top Portrait View and Bottom View become angle evidence.
  const urlRegex = /(?:https?:)?\\?\/\\?\/[a-z0-9._~:/?#\[\]@!$&'()*+,;=%\\-]+?(?:\.png|\.jpe?g|\.webp|\.avif)(?:\?[^\s"'<>\\}]*)?/gi;
  for (const match of decoded.matchAll(urlRegex)) {
    const raw = match[0].replace(/\\/g, "");
    const start = Math.max(0, (match.index ?? 0) - 360);
    const end = Math.min(decoded.length, (match.index ?? 0) + match[0].length + 360);
    add(raw.startsWith("//") ? `https:${raw}` : raw, decoded.slice(start, end));
  }

  const relativeRegex = /["'](\/\/(?:cdn|images|media|static)[^"']+|\/(?:cdn|media|images)\/[^"']+?\.(?:png|jpe?g|webp|avif)(?:\?[^"']*)?)["']/gi;
  for (const match of decoded.matchAll(relativeRegex)) {
    const start = Math.max(0, (match.index ?? 0) - 300);
    const end = Math.min(decoded.length, (match.index ?? 0) + match[0].length + 300);
    const raw = match[1].startsWith("//") ? `https:${match[1]}` : match[1];
    add(raw, decoded.slice(start, end));
  }

  return result.sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 90);
}

function parseBing(html: string, tokens: string[], seedKey: string | null, officialDomain?: string) {
  const result: Candidate[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/\sm=(?:"([^"]+)"|'([^']+)')/gi)) {
    const raw = decodeHtml(match[1] ?? match[2] ?? "");
    if (!raw.includes("murl")) continue;
    try {
      const item = JSON.parse(raw) as { murl?: string; purl?: string; t?: string };
      if (!item.murl || !/^https?:\/\//i.test(item.murl) || seen.has(item.murl)) continue;
      const pageUrl = item.purl ?? "";
      if (!isTrustedPage(pageUrl, officialDomain)) continue;
      const hintText = item.t ?? "";
      const score = candidateScore(item.murl, pageUrl, hintText, tokens, seedKey);
      if (score < 2) continue;
      seen.add(item.murl);
      result.push({ imageUrl: item.murl, pageUrl, hintText, index: result.length, score });
    } catch {
      // Ignore malformed search metadata.
    }
  }
  return result.sort((a, b) => b.score - a.score).slice(0, 90);
}

function deterministicSeedCandidates(seed: string, tokens: string[], seedKey: string | null) {
  if (!seed || !/^https?:\/\//i.test(seed)) return [] as Candidate[];
  const urls: Array<{ url: string; hint: string }> = [];
  const lower = seed.toLowerCase();

  if (lower.includes("images.puma.com") || lower.includes("images.puma.net")) {
    const match = seed.match(/(\/global\/[^/]+\/[^/]+\/)([^/]+)(\/fnd\/)/i);
    if (match) {
      urls.push({ url: seed.replace(match[0], `${match[1]}sv01${match[3]}`), hint: "side lateral view puma sv01" });
      urls.push({ url: seed.replace(match[0], `${match[1]}bv${match[3]}`), hint: "outsole bottom view puma bv" });
      for (const code of ["sv02", "sv03", "sv04", "sv05"]) {
        urls.push({ url: seed.replace(match[0], `${match[1]}${code}${match[3]}`), hint: `puma alternate product view ${code}` });
      }
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

  const nikeCode = seed.match(/^(.*?)(?:PHSRH|PHSLH|PHST|PHSBT)(\d{3}[^/]*)$/i);
  if (nikeCode) {
    urls.push({ url: `${nikeCode[1]}PHSRH${nikeCode[2]}`, hint: "side lateral view nike PHSRH" });
    urls.push({ url: `${nikeCode[1]}PHST${nikeCode[2]}`, hint: "top overhead view nike PHST" });
    urls.push({ url: `${nikeCode[1]}PHSBT${nikeCode[2]}`, hint: "outsole bottom view nike PHSBT" });
  }

  const nb = seed.match(/^(.*?_nb_)\d{2}(_i(?:\.[a-z]+)?(?:\?.*)?)$/i);
  if (nb) {
    for (let i = 1; i <= 9; i += 1) {
      urls.push({ url: `${nb[1]}${String(i).padStart(2, "0")}${nb[2]}`, hint: `new balance product gallery view ${i}` });
    }
  }

  const mizuno = seed.match(/^(.*?(?:SH_)?J\d[A-Z]{2}\d{6}[_-])\d{2}((?:\.[a-z]+)?(?:\?.*)?)$/i);
  if (mizuno) {
    for (let i = 1; i <= 9; i += 1) {
      urls.push({ url: `${mizuno[1]}${String(i).padStart(2, "0")}${mizuno[2]}`, hint: `mizuno product gallery view ${i}` });
    }
  }

  return [...new Map(urls.map((item) => [item.url, item])).values()].map(({ url, hint }, index) => ({
    imageUrl: url,
    pageUrl: "",
    hintText: hint,
    index,
    score: candidateScore(url, "", hint, tokens, seedKey) + 50,
  }));
}

function explicitEvidence(candidate: Analyzed, view: View) {
  const text = decodeURIComponent(`${candidate.imageUrl} ${candidate.hintText}`).toLowerCase();
  if (/watermark|shoe box|shoebox|packaging|with box|box included/.test(text)) return -100;
  const side = /\b(side|side profile|lateral|profile|medial|outer view|inner view|side lateral center view)\b|phsrh|phslh|_sr_rt_|_sr_lt_|\/sv01\//i.test(text);
  const top = /\b(top view|top portrait view|top-down|top down|overhead|bird.?s.?eye|upper view)\b|phst|sb_tp|_tp_/i.test(text);
  const outsole = /\b(outsole|bottom view|bottom outsole|sole view|tread view)\b|phsbt|sb_bt|_bt_|\/bv\//i.test(text);
  const frontRear = /\b(front view|rear view|heel view|back view)\b/.test(text);
  if (view === "Side") return side && !top && !outsole && !frontRear ? 30 : -100;
  if (view === "Top") return top && !side && !outsole && !frontRear ? 30 : -100;
  return outsole && !side && !top && !frontRear ? 30 : -100;
}

async function edgeScore(buffer: Buffer) {
  const { data, info } = await sharp(buffer)
    .flatten({ background: "#ffffff" })
    .resize(96, 96, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  let count = 0;
  for (let y = 1; y < info.height; y += 1) {
    for (let x = 1; x < info.width; x += 1) {
      const i = y * info.width + x;
      sum += Math.abs(data[i] - data[i - 1]);
      sum += Math.abs(data[i] - data[i - info.width]);
      count += 2;
    }
  }
  return count ? sum / count : 0;
}

async function analyze(candidate: Candidate, seedKey: string | null): Promise<Analyzed> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(candidate.imageUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/4.0)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "no-store",
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
      edgeScore: await edgeScore(data),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeMany(candidates: Candidate[], seedKey: string | null, limit = 36) {
  const selected = candidates.slice(0, limit);
  const output: Analyzed[] = [];
  for (let i = 0; i < selected.length; i += 8) {
    const settled = await Promise.allSettled(selected.slice(i, i + 8).map((candidate) => analyze(candidate, seedKey)));
    output.push(...settled.flatMap((item) => item.status === "fulfilled" ? [item.value] : []));
  }
  return output;
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
    let total = key === seedKey ? 120 : 0;

    const explicitSide = group
      .filter((image) => explicitEvidence(image, "Side") >= 30)
      .sort((a, b) => b.score - a.score || b.ratio - a.ratio)[0];
    const visualSide = group
      .filter((image) => image.ratio >= 1.18)
      .sort((a, b) => b.ratio - a.ratio || b.score - a.score)[0];
    const side = explicitSide ?? visualSide;
    if (!side) continue;
    selected.Side = side;
    used.add(side.imageUrl);
    total += (explicitSide ? 35 : 20) + side.score;

    const explicitTop = group
      .filter((image) => !used.has(image.imageUrl) && explicitEvidence(image, "Top") >= 30)
      .sort((a, b) => b.score - a.score)[0];
    const explicitOutsole = group
      .filter((image) => !used.has(image.imageUrl) && explicitEvidence(image, "Outsole") >= 30)
      .sort((a, b) => b.score - a.score)[0];

    if (explicitTop) {
      selected.Top = explicitTop;
      used.add(explicitTop.imageUrl);
      total += 35 + explicitTop.score;
    }
    if (explicitOutsole && !used.has(explicitOutsole.imageUrl)) {
      selected.Outsole = explicitOutsole;
      used.add(explicitOutsole.imageUrl);
      total += 35 + explicitOutsole.score;
    }

    const portrait = group
      .filter((image) => !used.has(image.imageUrl) && image.ratio >= 0.28 && image.ratio <= 0.82)
      .sort((a, b) => b.score - a.score);

    if (!selected.Top || !selected.Outsole) {
      if (portrait.length < Number(!selected.Top) + Number(!selected.Outsole)) continue;
      const byTexture = [...portrait].sort((a, b) => a.edgeScore - b.edgeScore);
      if (!selected.Top) {
        selected.Top = byTexture[0];
        used.add(byTexture[0].imageUrl);
        total += 18 + byTexture[0].score;
      }
      if (!selected.Outsole) {
        const remaining = byTexture.filter((image) => !used.has(image.imageUrl));
        if (!remaining.length) continue;
        const outsole = remaining[remaining.length - 1];
        // Pixel fallback is accepted only when the presumed outsole is measurably
        // more textured than the presumed upper/top view.
        if (!explicitOutsole && outsole.edgeScore < selected.Top.edgeScore * 1.04) continue;
        selected.Outsole = outsole;
        used.add(outsole.imageUrl);
        total += 18 + outsole.score;
      }
    }

    if (new Set(VIEWS.map((view) => selected[view]?.imageUrl)).size !== 3) continue;
    const families = new Set(VIEWS.map((view) => selected[view]?.familyKey));
    if (families.size !== 1) continue;
    if (!best || total > best.score) best = { gallery: selected, score: total };
  }
  return best?.gallery ?? null;
}

async function deterministicGalleryFromCandidates(candidates: Candidate[], tokens: string[], seedKey: string | null) {
  for (const candidate of candidates.slice(0, 28)) {
    const derivedKey = variantKey(candidate.imageUrl) ?? seedKey;
    const derived = deterministicSeedCandidates(candidate.imageUrl, tokens, derivedKey);
    if (derived.length < 3) continue;
    const gallery = chooseGallery(await analyzeMany(derived, derivedKey, 14), derivedKey);
    if (gallery) return gallery;
  }
  return null;
}

async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
      cache: "no-store",
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
  if (!candidates.length) return null;
  const deterministic = await deterministicGalleryFromCandidates(candidates, tokens, seedKey);
  if (deterministic) return deterministic;
  return chooseGallery(await analyzeMany(candidates, seedKey, 56), seedKey);
}

async function searchCandidates(query: string, tokens: string[], seedKey: string | null, officialDomain?: string) {
  const response = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3`, {
    headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
    cache: "no-store",
  });
  if (!response.ok) return [] as Candidate[];
  return parseBing(await response.text(), tokens, seedKey, officialDomain);
}

async function galleryFromSearch(query: string, tokens: string[], seedKey: string | null, officialDomain?: string) {
  const searched = await searchCandidates(query, tokens, seedKey, officialDomain);
  if (!searched.length) return null;
  const deterministic = await deterministicGalleryFromCandidates(searched, tokens, seedKey);
  if (deterministic) return { gallery: deterministic, pageUrl: "deterministic-search" };
  const pages = [...new Set(searched.map((candidate) => candidate.pageUrl).filter(Boolean))].slice(0, 8);
  for (const pageUrl of pages) {
    const gallery = await galleryFromPage(pageUrl, tokens, seedKey);
    if (gallery) return { gallery, pageUrl };
  }
  const direct = chooseGallery(await analyzeMany(searched, seedKey, 42), seedKey);
  if (direct) {
    const pageUrl = direct.Side.pageUrl || direct.Top.pageUrl || direct.Outsole.pageUrl;
    return { gallery: direct, pageUrl };
  }
  return null;
}

async function resolveGallery(brand: string, model: string, source: string, seed: string) {
  const tokens = modelTokens(brand, model);
  const seedKey = variantKey(seed);
  const officialDomain = OFFICIAL_DOMAINS[brand.toLowerCase()];

  const deterministic = deterministicSeedCandidates(seed, tokens, seedKey);
  if (deterministic.length >= 3) {
    const gallery = chooseGallery(await analyzeMany(deterministic, seedKey, 14), seedKey);
    if (gallery) return { gallery, pageUrl: "deterministic-seed" };
  }

  if (source && /^https?:\/\//i.test(source)) {
    const gallery = await galleryFromPage(source, tokens, seedKey);
    if (gallery) return { gallery, pageUrl: source };
  }

  if (officialDomain) {
    const official = await galleryFromSearch(`site:${officialDomain} \"${brand} ${model}\" running shoes`, tokens, seedKey, officialDomain);
    if (official) return official;
  }

  for (const domain of ["fleetfeet.com", "runningwarehouse.com", "run4it.com", "holabirdsports.com", "paceathletic.com"]) {
    const result = await galleryFromSearch(`site:${domain} \"${brand} ${model}\"`, tokens, seedKey, officialDomain);
    if (result) return result;
  }

  return galleryFromSearch(`\"${brand} ${model}\" running shoes side top outsole`, tokens, seedKey, officialDomain);
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

function verificationMethod(image: Analyzed, view: View) {
  return explicitEvidence(image, view) >= 30 ? "metadata" : "pixel-shape-texture";
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
    if (!resolved) throw new Error("no verified single-family Side/Top/Outsole gallery");
    const picked = resolved.gallery[view];
    const output = await normalize(picked.buffer, view);
    const method = verificationMethod(picked, view);
    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=604800",
        "x-runned-gallery-page": resolved.pageUrl,
        "x-runned-image-family": picked.familyKey,
        "x-runned-image-candidate": picked.imageUrl,
        "x-runned-image-view": view,
        "x-runned-angle-evidence": method === "metadata" ? "30" : "20",
        "x-runned-verification-method": method,
        "x-runned-edge-score": picked.edgeScore.toFixed(3),
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
