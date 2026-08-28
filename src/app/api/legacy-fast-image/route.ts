import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type View = "Side" | "Top" | "Outsole";

function decodeHtml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("\\u002F", "/")
    .replaceAll("\\/", "/");
}

function tokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !["men", "mens", "women", "womens", "shoe", "shoes", "running", "road"].includes(token));
}

function normalizeView(value: string | null): View {
  if (value === "Top" || value === "Outsole") return value;
  return "Side";
}

function viewTerms(view: View) {
  if (view === "Top") return "top overhead upper view";
  if (view === "Outsole") return "outsole bottom sole tread view";
  return "side lateral profile view";
}

function angleScore(hay: string, view: View) {
  const side = /side|lateral|profile|phsrh|phslh|sr_rt|sr_lt|side_lateral|[_/-]01(?:[_.?/-]|$)|\/sv01\//.test(hay);
  const top = /top|overhead|upper|phst|phcth|sb_tp|[_/-]tp[_/.-]|topview|[_/-]03(?:[_.?/-]|$)/.test(hay);
  const outsole = /outsole|bottom|sole|tread|phsbt|sb_bt|[_/-]bt[_/.-]|bottomview|[_/-]05(?:[_.?/-]|$)|\/bv\//.test(hay);
  if (view === "Side") return (side ? 24 : 0) - (top || outsole ? 14 : 0);
  if (view === "Top") return (top ? 28 : 0) - (side || outsole ? 14 : 0);
  return (outsole ? 28 : 0) - (side || top ? 14 : 0);
}

function score(url: string, pageUrl: string, brand: string, model: string, view: View) {
  const hay = decodeURIComponent(`${url} ${pageUrl}`).toLowerCase();
  let value = 0;
  for (const token of tokens(`${brand} ${model}`)) {
    if (hay.includes(token)) value += token.length >= 5 ? 6 : 2;
  }
  value += angleScore(hay, view);
  if (/product|products|footwear|shoe|cdn|media|images/.test(hay)) value += 4;
  if (/pinterest|ebay|amazon|aliexpress|temu|logo|icon|banner|sprite|avatar|review|video|watermark/.test(hay)) value -= 40;
  return value;
}

function parseProductPage(html: string, baseUrl: string, brand: string, model: string, view: View) {
  const decoded = decodeHtml(html);
  const candidates: Array<{ url: string; score: number }> = [];
  const seen = new Set<string>();
  const imageTags = Array.from(decoded.matchAll(/<img\b[^>]*>/gi)).map((match) => match[0]);
  const raws: string[] = [];

  for (const tag of imageTags) {
    for (const match of tag.matchAll(/(?:src|data-src|data-zoom-image)=["']([^"']+)["']/gi)) raws.push(match[1]);
    for (const match of tag.matchAll(/srcset=["']([^"']+)["']/gi)) {
      raws.push(...match[1].split(/\s*,\s*/).map((part) => part.trim().split(/\s+/)[0]));
    }
  }

  for (const raw of raws) {
    if (!raw || raw.startsWith("data:")) continue;
    try {
      const url = new URL(raw, baseUrl).toString();
      if (seen.has(url)) continue;
      if (!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(url) && !/(?:images\.|media\.|cdn\.|cloudinary|scene7)/i.test(url)) continue;
      seen.add(url);
      candidates.push({ url, score: score(url, baseUrl, brand, model, view) });
    } catch {
      // Ignore malformed image URLs.
    }
  }

  return candidates.sort((a, b) => b.score - a.score).map((item) => item.url);
}

function parseBing(html: string, brand: string, model: string, view: View) {
  const candidates: Array<{ url: string; score: number }> = [];
  const seen = new Set<string>();
  const attrs = Array.from(html.matchAll(/\sm=(?:"([^"]+)"|'([^']+)')/gi));

  for (const match of attrs) {
    const raw = decodeHtml(match[1] ?? match[2] ?? "");
    if (!raw.includes("murl")) continue;
    try {
      const item = JSON.parse(raw) as { murl?: string; purl?: string };
      if (!item.murl || !/^https?:\/\//i.test(item.murl) || seen.has(item.murl)) continue;
      const pageUrl = item.purl ?? "";
      const candidateScore = score(item.murl, pageUrl, brand, model, view);
      if (candidateScore < 4) continue;
      seen.add(item.murl);
      candidates.push({ url: item.murl, score: candidateScore });
    } catch {
      // Ignore malformed Bing metadata.
    }
  }

  return candidates.sort((a, b) => b.score - a.score).map((item) => item.url);
}

async function fetchWithTimeout(url: string, timeoutMs: number, accept: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept,
      },
      cache: "force-cache",
    });
  } finally {
    clearTimeout(timeout);
  }
}

function unsupportedDecoderPayload(contentType: string, body: ArrayBuffer) {
  if (/avif|heif|heic/i.test(contentType)) return true;
  const marker = Buffer.from(body).subarray(4, 20).toString("ascii").toLowerCase();
  return /ftyp(?:avif|avis|heic|heix|mif1|msf1)/.test(marker);
}

async function fetchFirstImage(candidates: string[]) {
  for (const candidate of candidates.slice(0, 16)) {
    try {
      const response = await fetchWithTimeout(candidate, 4500, "image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5");
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) continue;
      const body = await response.arrayBuffer();
      if (body.byteLength < 5000 || unsupportedDecoderPayload(contentType, body)) continue;
      return { body, contentType };
    } catch {
      // Try the next candidate.
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const brand = request.nextUrl.searchParams.get("brand")?.trim() ?? "";
  const model = request.nextUrl.searchParams.get("model")?.trim() ?? "";
  const source = request.nextUrl.searchParams.get("source")?.trim() ?? "";
  const view = normalizeView(request.nextUrl.searchParams.get("view"));

  if (!brand || !model) return new Response("Missing historical shoe identity", { status: 400 });

  const candidates: string[] = [];

  if (/^https?:\/\//i.test(source)) {
    try {
      const page = await fetchWithTimeout(source, 5000, "text/html,application/xhtml+xml");
      if (page.ok) candidates.push(...parseProductPage(await page.text(), source, brand, model, view));
    } catch {
      // Fall through to image search.
    }
  }

  try {
    const query = `\"${brand} ${model}\" ${viewTerms(view)} product shoe`;
    const search = await fetchWithTimeout(
      `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3`,
      5500,
      "text/html,application/xhtml+xml",
    );
    if (search.ok) candidates.push(...parseBing(await search.text(), brand, model, view));
  } catch {
    // Return unavailable below.
  }

  const unique = Array.from(new Set(candidates));
  const image = await fetchFirstImage(unique);
  if (!image) {
    return new Response("Historical shoe image unavailable", {
      status: 404,
      headers: { "cache-control": "public, max-age=300, s-maxage=900" },
    });
  }

  return new Response(image.body, {
    status: 200,
    headers: {
      "content-type": image.contentType,
      "cache-control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=604800",
      "x-runned-fallback-view": view,
    },
  });
}