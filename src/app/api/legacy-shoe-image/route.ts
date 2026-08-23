import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type View = "Side" | "Top" | "Outsole";
type Candidate = {
  imageUrl: string;
  pageUrl: string;
  index: number;
  score: number;
  searchView?: View | null;
};
type Analyzed = Candidate & {
  buffer: Buffer;
  ratio: number;
  sideHint: boolean;
  topHint: boolean;
  soleHint: boolean;
  multipleSubjects: boolean;
  familyKey: string;
};

type Gallery = Record<View, Analyzed>;

const CANVAS = { width: 1200, height: 900 };
const views: View[] = ["Side", "Top", "Outsole"];

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

function variantKey(url: string) {
  const decoded = decodeURIComponent(url).toLowerCase();
  const puma = decoded.match(/\/global\/([^/]+)\/([^/]+)\//);
  if (puma) return `puma:${puma[1]}:${puma[2]}`;

  const hoka = decoded.match(/\/(\d{6,8}-[a-z0-9]+)(?:_[a-z0-9]+)?_0?[1-9]\.(?:png|jpe?g|webp)/i);
  if (hoka) return `hoka:${hoka[1]}`;

  const asics = decoded.match(/(\d{4}[a-z]\d{3,4})[_-](\d{3})/i);
  if (asics) return `asics:${asics[1]}-${asics[2]}`;

  const nike = decoded.match(/([a-z]{2}\d{4}-\d{3})/i);
  if (nike) return `nike:${nike[1]}`;

  const adidas = decoded.match(/(?:^|[\/_-])([a-z]{2}\d{4})(?:[\/_\-.]|$)/i);
  if (adidas) return `adidas:${adidas[1]}`;

  return null;
}

function candidateScore(imageUrl: string, pageUrl: string, tokens: string[], seedKey: string | null) {
  const hay = decodeURIComponent(`${imageUrl} ${pageUrl}`).toLowerCase();
  let score = 0;
  let matched = 0;
  for (const token of tokens) {
    if (!hay.includes(token)) continue;
    matched += 1;
    score += token.length >= 5 ? 5 : 2;
  }
  if (tokens.length && matched / tokens.length >= 0.5) score += 12;
  if (/product|products|\/pd\/|shoe|running|footwear|cdn|media|images/.test(hay)) score += 3;
  if (/pinterest|ebay|amazon|aliexpress|temu|logo|icon|banner|sprite|avatar|review|video|watermark/.test(hay)) score -= 25;

  const key = variantKey(imageUrl);
  if (seedKey && key === seedKey) score += 60;
  else if (seedKey && key && key !== seedKey) score -= 60;
  return score;
}

function sourceLooksProductSpecific(source: string, tokens: string[]) {
  if (!source) return false;
  const lower = decodeURIComponent(source).toLowerCase();
  if (/\/pd\/|\/product\/|\/products\//.test(lower)) return true;
  const distinctive = tokens.filter((token) => token.length >= 4);
  return distinctive.some((token) => lower.includes(token));
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

function parseProductPage(html: string, baseUrl: string, tokens: string[], seedKey: string | null): Candidate[] {
  const decoded = decodeHtml(html);
  const imageTags = Array.from(decoded.matchAll(/<img\b[^>]*>/gi)).map((match) => match[0]);
  const fromTags: string[] = [];
  for (const tag of imageTags) {
    for (const match of tag.matchAll(/(?:src|data-src|data-zoom-image)=["']([^"']+)["']/gi)) fromTags.push(match[1]);
    for (const match of tag.matchAll(/srcset=["']([^"']+)["']/gi)) {
      fromTags.push(...match[1].split(/\s*,\s*/).map((part) => part.trim().split(/\s+/)[0]));
    }
  }
  const absolute = decoded.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
  const raws = [...fromTags, ...absolute];
  const seen = new Set<string>();
  const result: Candidate[] = [];

  for (const raw of raws) {
    if (!raw || raw.startsWith("data:")) continue;
    try {
      const imageUrl = new URL(raw, baseUrl).toString();
      if (!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(imageUrl) && !/(?:images\.puma|images\.asics|media\.|cdn\.|cloudinary|scene7)/i.test(imageUrl)) continue;
      if (seen.has(imageUrl)) continue;
      seen.add(imageUrl);
      const score = candidateScore(imageUrl, baseUrl, tokens, seedKey);
      if (score < -10) continue;
      result.push({ imageUrl, pageUrl: baseUrl, index: result.length, score, searchView: null });
    } catch {
      // Ignore malformed URLs.
    }
  }
  return result.sort((a, b) => b.score - a.score).slice(0, 70);
}

function parseBing(html: string, tokens: string[], seedKey: string | null, searchView: View | null): Candidate[] {
  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  const attrs = Array.from(html.matchAll(/\sm=(?:"([^"]+)"|'([^']+)')/gi));
  for (const match of attrs) {
    const raw = decodeHtml(match[1] ?? match[2] ?? "");
    if (!raw.includes("murl")) continue;
    try {
      const item = JSON.parse(raw) as { murl?: string; purl?: string };
      if (!item.murl || !/^https?:\/\//i.test(item.murl) || seen.has(item.murl)) continue;
      const pageUrl = item.purl ?? "";
      if (/pinterest|ebay|amazon|aliexpress|temu/i.test(pageUrl)) continue;
      const score = candidateScore(item.murl, pageUrl, tokens, seedKey);
      if (score < 2) continue;
      seen.add(item.murl);
      candidates.push({ imageUrl: item.murl, pageUrl, index: candidates.length, score, searchView });
    } catch {
      // Ignore malformed search metadata.
    }
  }
  return candidates.sort((a, b) => b.score - a.score).slice(0, 50);
}

function seedSiblingCandidates(seed: string, tokens: string[], seedKey: string | null): Candidate[] {
  if (!seed || !/^https?:\/\//i.test(seed)) return [];
  const result: string[] = [seed];
  const lower = seed.toLowerCase();

  if (lower.includes("images.puma.com") && /\/global\/[^/]+\/[^/]+\//i.test(seed)) {
    const match = seed.match(/(\/global\/[^/]+\/[^/]+\/)([^/]+)(\/fnd\/)/i);
    if (match) {
      for (const viewCode of ["sv01", "sv02", "sv03", "sv04", "sv05", "bv"]) {
        result.push(seed.replace(match[0], `${match[1]}${viewCode}${match[3]}`));
      }
    }
  }

  if (lower.includes("images.asics.com")) {
    const match = seed.match(/^(.*?)(?:_SR_(?:LT|RT)|_SB_TP|_SB_BT)_GLB(.*)$/i);
    if (match) {
      result.push(`${match[1]}_SR_RT_GLB${match[2]}`);
      result.push(`${match[1]}_SB_TP_GLB${match[2]}`);
      result.push(`${match[1]}_SB_BT_GLB${match[2]}`);
    }
  }

  if (/media\.(?:au|nz)\.hoka\.com/i.test(seed)) {
    const match = seed.match(/(_0?1)(\.(?:png|jpe?g|webp)(?:\?.*)?)$/i);
    if (match) {
      result.push(seed.replace(match[1], "_02"));
      result.push(seed.replace(match[1], "_05"));
    }
  }

  return Array.from(new Set(result)).map((imageUrl, index) => ({
    imageUrl,
    pageUrl: "",
    index,
    score: candidateScore(imageUrl, "", tokens, seedKey) + 30,
    searchView: null,
  }));
}

async function searchCandidates(brand: string, model: string, tokens: string[], seedKey: string | null) {
  const queryBase = `\"${brand} ${model}\" running shoes`;
  const queries: Array<[string, View | null]> = [
    [`${queryBase} product`, null],
    [`${queryBase} side lateral view`, "Side"],
    [`${queryBase} top overhead view`, "Top"],
    [`${queryBase} outsole bottom sole view`, "Outsole"],
  ];

  const settled = await Promise.allSettled(queries.map(async ([query, searchView]) => {
    const response = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3`, {
      headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
      cache: "force-cache",
    });
    if (!response.ok) return [];
    return parseBing(await response.text(), tokens, seedKey, searchView);
  }));

  const all = settled.flatMap((item) => item.status === "fulfilled" ? item.value : []);
  const seen = new Set<string>();
  return all.filter((candidate) => {
    if (seen.has(candidate.imageUrl)) return false;
    seen.add(candidate.imageUrl);
    return true;
  });
}

function hints(imageUrl: string, searchView: View | null) {
  const text = decodeURIComponent(imageUrl).toLowerCase();
  const puma = text.includes("images.puma.com");
  const sideHint = /side|lateral|profile|phsrh|sr_lt|sr_rt|side_lateral|\/sv01\//.test(text) || searchView === "Side";
  const topHint = /top|overhead|bird|phst|sb_tp|[_/-]tp[_/.-]|topview/.test(text) || (puma && /\/sv05\//.test(text)) || searchView === "Top";
  const soleHint = /outsole|bottom|sole|phsbt|sb_bt|[_/-]bt[_/.-]|bottomview/.test(text) || (puma && /\/bv\//.test(text)) || searchView === "Outsole";
  return { sideHint, topHint, soleHint };
}

function countMajorForegroundComponents(data: Buffer, width: number, height: number, channels: number) {
  const total = width * height;
  const mask = new Uint8Array(total);
  for (let i = 0; i < total; i += 1) {
    const offset = i * channels;
    const r = data[offset] ?? 255;
    const g = data[offset + 1] ?? r;
    const b = data[offset + 2] ?? r;
    const distance = Math.abs(255 - r) + Math.abs(255 - g) + Math.abs(255 - b);
    if (distance > 42) mask[i] = 1;
  }

  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  const areas: number[] = [];
  for (let start = 0; start < total; start += 1) {
    if (!mask[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    let area = 0;
    queue[tail++] = start;
    visited[start] = 1;
    while (head < tail) {
      const index = queue[head++];
      area += 1;
      const x = index % width;
      const y = Math.floor(index / width);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const next = ny * width + nx;
          if (!mask[next] || visited[next]) continue;
          visited[next] = 1;
          queue[tail++] = next;
        }
      }
    }
    if (area >= Math.max(35, total * 0.0025)) areas.push(area);
  }
  areas.sort((a, b) => b - a);
  if (areas.length < 2) return areas.length;
  const largest = areas[0];
  return areas.filter((area) => area >= largest * 0.28 && area >= total * 0.012).length;
}

async function analyzeCandidate(candidate: Candidate, seedKey: string | null): Promise<Analyzed> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  const response = await fetch(candidate.imageUrl, {
    signal: controller.signal,
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; Runned/1.0)",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
    cache: "force-cache",
  });
  clearTimeout(timeout);
  if (!response.ok) throw new Error(`image ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error("not image");

  const original = Buffer.from(await response.arrayBuffer());
  const trimmed = await sharp(original, { failOn: "none", animated: false })
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .trim({ background: "#ffffff", threshold: 18 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const probe = await sharp(trimmed.data)
    .resize({ width: 320, height: 320, fit: "inside", withoutEnlargement: true, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const majorComponents = countMajorForegroundComponents(probe.data, probe.info.width, probe.info.height, probe.info.channels);
  const hint = hints(candidate.imageUrl, candidate.searchView ?? null);
  return {
    ...candidate,
    buffer: trimmed.data,
    ratio: (trimmed.info.width || 1) / (trimmed.info.height || 1),
    ...hint,
    multipleSubjects: majorComponents > 1,
    familyKey: familyKey(candidate, seedKey),
  };
}

async function fetchAnalyzed(candidates: Candidate[], seedKey: string | null) {
  const ranked = [...candidates].sort((a, b) => b.score - a.score).slice(0, 36);
  const settled: PromiseSettledResult<Analyzed>[] = [];
  for (let i = 0; i < ranked.length; i += 8) {
    const batch = await Promise.allSettled(ranked.slice(i, i + 8).map((candidate) => analyzeCandidate(candidate, seedKey)));
    settled.push(...batch);
    const usable = settled.filter((item): item is PromiseFulfilledResult<Analyzed> => item.status === "fulfilled" && !item.value.multipleSubjects).map((item) => item.value);
    const families = new Map<string, number>();
    for (const item of usable) families.set(item.familyKey, (families.get(item.familyKey) ?? 0) + 1);
    if ([...families.values()].some((count) => count >= 5)) break;
  }
  return settled.flatMap((item) => item.status === "fulfilled" && !item.value.multipleSubjects ? [item.value] : []);
}

function scoreForView(image: Analyzed, view: View) {
  let score = image.score;
  if (view === "Side") {
    if (image.sideHint) score += 45;
    if (image.ratio >= 1.18) score += 20;
    if (image.topHint || image.soleHint) score -= 30;
  } else if (view === "Top") {
    if (image.topHint) score += 50;
    if (image.ratio <= 1.02) score += 15;
    if (image.sideHint || image.soleHint) score -= 28;
  } else {
    if (image.soleHint) score += 55;
    if (image.ratio <= 1.02) score += 10;
    if (image.sideHint || image.topHint) score -= 28;
  }
  return score;
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
    const sidePool = group.filter((image) => image.sideHint || image.ratio >= 1.18).sort((a, b) => scoreForView(b, "Side") - scoreForView(a, "Side"));
    const topPool = group.filter((image) => image.topHint || (image.ratio <= 1.02 && !image.soleHint)).sort((a, b) => scoreForView(b, "Top") - scoreForView(a, "Top"));
    const solePool = group.filter((image) => image.soleHint || (image.ratio <= 1.02 && !image.topHint)).sort((a, b) => scoreForView(b, "Outsole") - scoreForView(a, "Outsole"));

    for (const side of sidePool.slice(0, 5)) {
      for (const top of topPool.slice(0, 6)) {
        if (top.imageUrl === side.imageUrl) continue;
        for (const sole of solePool.slice(0, 6)) {
          if (sole.imageUrl === side.imageUrl || sole.imageUrl === top.imageUrl) continue;
          const strongAngles = side.sideHint && top.topHint && sole.soleHint;
          const exactSeedFamily = Boolean(seedKey && key === seedKey);
          if (!strongAngles && !exactSeedFamily && group.length < 5) continue;
          let score = scoreForView(side, "Side") + scoreForView(top, "Top") + scoreForView(sole, "Outsole");
          if (strongAngles) score += 80;
          if (exactSeedFamily) score += 100;
          if (!best || score > best.score) best = { gallery: { Side: side, Top: top, Outsole: sole }, score };
        }
      }
    }
  }
  return best?.gallery ?? null;
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
  const requestedView = request.nextUrl.searchParams.get("view") as View | null;
  const source = request.nextUrl.searchParams.get("source")?.trim() ?? "";
  const seed = request.nextUrl.searchParams.get("seed")?.trim() ?? "";
  if (!brand || !model || !requestedView || !views.includes(requestedView)) {
    return new Response("Invalid historical shoe image request", { status: 400 });
  }

  const tokens = modelTokens(brand, model);
  const seedKey = variantKey(seed);
  try {
    const candidates: Candidate[] = [...seedSiblingCandidates(seed, tokens, seedKey)];

    if (source && /^https?:\/\//i.test(source) && sourceLooksProductSpecific(source, tokens)) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      const response = await fetch(source, {
        signal: controller.signal,
        headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
        cache: "force-cache",
      });
      clearTimeout(timeout);
      if (response.ok) candidates.push(...parseProductPage(await response.text(), source, tokens, seedKey));
    }

    const initial = await fetchAnalyzed(candidates, seedKey);
    let gallery = chooseGallery(initial, seedKey);

    if (!gallery) {
      const searched = await searchCandidates(brand, model, tokens, seedKey);
      const merged = [...candidates, ...searched];
      const seen = new Set<string>();
      const unique = merged.filter((candidate) => {
        if (seen.has(candidate.imageUrl)) return false;
        seen.add(candidate.imageUrl);
        return true;
      });
      gallery = chooseGallery(await fetchAnalyzed(unique, seedKey), seedKey);
    }

    if (!gallery) throw new Error("no complete single-family Side/Top/Outsole gallery found");
    const picked = gallery[requestedView];
    const output = await normalize(picked.buffer, requestedView);
    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=604800",
        "x-runned-image-source": picked.pageUrl || picked.imageUrl,
        "x-runned-image-candidate": picked.imageUrl,
        "x-runned-image-family": picked.familyKey,
        "x-runned-image-view": requestedView,
      },
    });
  } catch (error) {
    console.error("Historical shoe image resolution failed", { brand, model, requestedView, source, seedKey, error });
    return new Response("Unable to resolve a compliant three-view gallery", { status: 502 });
  }
}
