import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type View = "Side" | "Top" | "Outsole";
type Candidate = { imageUrl: string; pageUrl: string; index: number; score: number };
type Analyzed = Candidate & { buffer: Buffer; ratio: number; sideHint: boolean; topHint: boolean; soleHint: boolean };

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
    .filter((token) => token.length > 1 && !["men", "mens", "women", "womens", "shoe", "shoes", "running"].includes(token));
}

function candidateScore(imageUrl: string, pageUrl: string, tokens: string[]) {
  const hay = decodeURIComponent(`${imageUrl} ${pageUrl}`).toLowerCase();
  let score = 0;
  for (const token of tokens) if (hay.includes(token)) score += token.length >= 5 ? 4 : 2;
  if (/product|shoe|running|footwear|cdn|media|images/.test(hay)) score += 2;
  if (/pinterest|ebay|amazon|aliexpress|logo|icon|banner|sprite|avatar|review|video|watermark/.test(hay)) score -= 12;
  return score;
}

function imageFamilyKey(candidate: Candidate) {
  try {
    if (candidate.pageUrl) return new URL(candidate.pageUrl).toString().split("#")[0];
    const url = new URL(candidate.imageUrl);
    const parts = url.pathname.split("/");
    parts.pop();
    return `${url.host}${parts.join("/")}`;
  } catch {
    return candidate.pageUrl || candidate.imageUrl;
  }
}

function parseProductPage(html: string, baseUrl: string, tokens: string[]): Candidate[] {
  const decoded = decodeHtml(html);
  const absolute = decoded.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
  const quoted = Array.from(decoded.matchAll(/(?:src|srcset|data-src|data-zoom-image|content)=["']([^"']+)["']/gi)).map((match) => match[1]);
  const raws = [...absolute, ...quoted.flatMap((value) => value.split(/\s*,\s*/).map((part) => part.trim().split(/\s+/)[0]))];
  const seen = new Set<string>();
  const result: Candidate[] = [];
  for (const raw of raws) {
    if (!raw || raw.startsWith("data:")) continue;
    try {
      const imageUrl = new URL(raw, baseUrl).toString();
      if (!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(imageUrl) && !/(?:image|cdn|media|scene7|cloudinary|contentful|static)/i.test(imageUrl)) continue;
      if (seen.has(imageUrl)) continue;
      seen.add(imageUrl);
      result.push({ imageUrl, pageUrl: baseUrl, index: result.length, score: candidateScore(imageUrl, baseUrl, tokens) });
    } catch {
      // Ignore malformed URLs.
    }
  }
  return result.sort((a, b) => b.score - a.score).slice(0, 40);
}

function parseBing(html: string, tokens: string[]): Candidate[] {
  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  const attrs = Array.from(html.matchAll(/\sm=(?:"([^"]+)"|'([^']+)')/gi));
  for (const match of attrs) {
    const raw = decodeHtml(match[1] ?? match[2] ?? "");
    if (!raw.includes("murl")) continue;
    try {
      const item = JSON.parse(raw) as { murl?: string; purl?: string };
      if (!item.murl || !/^https?:\/\//i.test(item.murl) || seen.has(item.murl)) continue;
      seen.add(item.murl);
      const pageUrl = item.purl ?? "";
      candidates.push({
        imageUrl: item.murl,
        pageUrl,
        index: candidates.length,
        score: candidateScore(item.murl, pageUrl, tokens),
      });
    } catch {
      // Ignore malformed search metadata.
    }
  }
  return candidates.sort((a, b) => b.score - a.score).slice(0, 60);
}

function bestFamily(candidates: Candidate[]) {
  const groups = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    const key = imageFamilyKey(candidate);
    const group = groups.get(key) ?? [];
    group.push(candidate);
    groups.set(key, group);
  }
  const ranked = [...groups.values()].sort((a, b) => {
    const aScore = Math.min(a.length, 6) * 10 + a.reduce((sum, item) => sum + item.score, 0);
    const bScore = Math.min(b.length, 6) * 10 + b.reduce((sum, item) => sum + item.score, 0);
    return bScore - aScore;
  });
  const best = ranked.find((group) => group.length >= 3);
  return (best ?? candidates.slice(0, 12)).slice(0, 12);
}

async function fetchCandidates(candidates: Candidate[]) {
  const settled = await Promise.allSettled(
    candidates.slice(0, 10).map(async (candidate): Promise<Analyzed> => {
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
      const { data, info } = await sharp(original, { failOn: "none", animated: false })
        .rotate()
        .flatten({ background: "#ffffff" })
        .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
        .trim({ background: "#ffffff", threshold: 18 })
        .png()
        .toBuffer({ resolveWithObject: true });
      const text = decodeURIComponent(candidate.imageUrl).toLowerCase();
      return {
        ...candidate,
        buffer: data,
        ratio: (info.width || 1) / (info.height || 1),
        sideHint: /side|lateral|profile|sv01|phsrh|_01(?:\.|_|-)|-01(?:\.|_|-)/.test(text),
        topHint: /top|overhead|bird|sv0?[45]|phst|_0?[45](?:\.|_|-)/.test(text),
        soleHint: /outsole|bottom|sole|sv0?[67]|phsbt|_0?[67](?:\.|_|-)/.test(text),
      };
    }),
  );
  return settled.flatMap((item) => (item.status === "fulfilled" ? [item.value] : []));
}

function pickImage(images: Analyzed[], view: View) {
  if (!images.length) return null;
  const byIndex = [...images].sort((a, b) => a.index - b.index);
  const horizontal = byIndex.filter((item) => item.ratio >= 1.15);
  const vertical = byIndex.filter((item) => item.ratio <= 0.95);

  if (view === "Side") return byIndex.find((item) => item.sideHint) ?? horizontal[0] ?? byIndex[0];
  if (view === "Top") {
    return byIndex.find((item) => item.topHint && !item.soleHint)
      ?? vertical.find((item) => !item.soleHint)
      ?? byIndex[Math.min(1, byIndex.length - 1)];
  }
  return [...byIndex].reverse().find((item) => item.soleHint)
    ?? [...vertical].reverse().find((item) => !item.topHint)
    ?? byIndex[Math.min(2, byIndex.length - 1)];
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
  if (!brand || !model || !requestedView || !["Side", "Top", "Outsole"].includes(requestedView)) {
    return new Response("Invalid historical shoe image request", { status: 400 });
  }

  const tokens = modelTokens(brand, model);
  try {
    let candidates: Candidate[] = [];
    if (source && /^https?:\/\//i.test(source)) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      const response = await fetch(source, {
        signal: controller.signal,
        headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
        cache: "force-cache",
      });
      clearTimeout(timeout);
      if (response.ok) candidates = parseProductPage(await response.text(), source, tokens);
    }

    if (candidates.length < 3) {
      const query = encodeURIComponent(`${brand} ${model} running shoes product side top outsole -ebay -amazon -pinterest`);
      const response = await fetch(`https://www.bing.com/images/search?q=${query}&form=HDRSC3`, {
        headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
        cache: "force-cache",
      });
      if (!response.ok) throw new Error(`search ${response.status}`);
      candidates = parseBing(await response.text(), tokens);
    }

    const analyzed = await fetchCandidates(bestFamily(candidates));
    const picked = pickImage(analyzed, requestedView);
    if (!picked) throw new Error("no usable image candidates");
    const output = await normalize(picked.buffer, requestedView);
    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=604800",
        "x-runned-image-source": picked.pageUrl || picked.imageUrl,
      },
    });
  } catch (error) {
    console.error("Historical shoe image resolution failed", { brand, model, requestedView, error });
    return new Response("Unable to resolve historical shoe image", { status: 502 });
  }
}
