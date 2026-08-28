import { NextRequest } from "next/server";
import sharp from "sharp";
import { demoShoes } from "@/lib/data/catalog";
import { GET as getLegacyFastImage } from "@/app/api/legacy-fast-image/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

const allowedRemoteUrls = new Set(
  demoShoes.flatMap((shoe) => (shoe.detailImages ?? []).map((image) => image.url).filter((url) => /^https?:\/\//i.test(url))),
);

type RGB = { r: number; g: number; b: number };
type ImageChannels = 1 | 2 | 3 | 4;
type RawImage = { data: Buffer; width: number; height: number; channels: ImageChannels };

function pixelOffset(x: number, y: number, width: number, channels: number) {
  return (y * width + x) * channels;
}

async function rawFromSharp(pipeline: sharp.Sharp): Promise<RawImage> {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels as ImageChannels };
}

function sampleCornerBackground(data: Buffer, width: number, height: number, channels: number) {
  const patch = Math.max(3, Math.min(18, Math.floor(Math.min(width, height) * 0.035)));
  const starts = [
    [0, 0],
    [Math.max(0, width - patch), 0],
    [0, Math.max(0, height - patch)],
    [Math.max(0, width - patch), Math.max(0, height - patch)],
  ] as const;

  let visible = 0;
  let transparent = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  const samples: RGB[] = [];

  for (const [sx, sy] of starts) {
    for (let y = sy; y < Math.min(height, sy + patch); y += 1) {
      for (let x = sx; x < Math.min(width, sx + patch); x += 1) {
        const offset = pixelOffset(x, y, width, channels);
        const alpha = channels >= 4 ? data[offset + 3] : 255;
        if (alpha < 32) {
          transparent += 1;
          continue;
        }
        const sample = { r: data[offset], g: data[offset + 1], b: data[offset + 2] };
        samples.push(sample);
        r += sample.r;
        g += sample.g;
        b += sample.b;
        visible += 1;
      }
    }
  }

  if (!visible || transparent > visible * 2) {
    return { transparent: true, color: { r: 255, g: 255, b: 255 }, threshold: 12 };
  }

  const color = { r: Math.round(r / visible), g: Math.round(g / visible), b: Math.round(b / visible) };
  let spread = 0;
  for (const sample of samples) {
    spread = Math.max(spread, Math.abs(sample.r - color.r), Math.abs(sample.g - color.g), Math.abs(sample.b - color.b));
  }

  return {
    transparent: false,
    color,
    threshold: Math.max(12, Math.min(44, spread + 14)),
  };
}

function nearColor(data: Buffer, offset: number, background: RGB, threshold: number) {
  return (
    Math.abs(data[offset] - background.r) <= threshold &&
    Math.abs(data[offset + 1] - background.g) <= threshold &&
    Math.abs(data[offset + 2] - background.b) <= threshold
  );
}

function removeConnectedBackground(raw: RawImage, background: RGB, threshold: number) {
  const { data, width, height, channels } = raw;
  if (channels < 4) return;

  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const enqueue = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    const offset = index * channels;
    const alpha = data[offset + 3];
    if (alpha < 20 || nearColor(data, offset, background, threshold)) {
      visited[index] = 1;
      queue[tail++] = index;
    }
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);
    data[index * channels + 3] = 0;
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  const haloThreshold = Math.min(76, threshold + 10);
  for (let pass = 0; pass < 3; pass += 1) {
    const clear: number[] = [];
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        const offset = index * channels;
        if (data[offset + 3] === 0 || !nearColor(data, offset, background, haloThreshold)) continue;
        const neighbors = [index - 1, index + 1, index - width, index + width];
        if (neighbors.some((neighbor) => data[neighbor * channels + 3] === 0)) clear.push(index);
      }
    }
    for (const index of clear) data[index * channels + 3] = 0;
  }
}

function opaqueEdgeCoverage(raw: RawImage) {
  const { data, width, height, channels } = raw;
  if (channels < 4 || !width || !height) return [0, 0, 0, 0];
  const band = Math.max(2, Math.min(6, Math.floor(Math.min(width, height) * 0.01)));
  const visible = (x: number, y: number) => data[pixelOffset(x, y, width, channels) + 3] > 24;
  let top = 0;
  let topTotal = 0;
  let right = 0;
  let rightTotal = 0;
  let bottom = 0;
  let bottomTotal = 0;
  let left = 0;
  let leftTotal = 0;

  for (let y = 0; y < Math.min(height, band); y += 1) {
    for (let x = 0; x < width; x += 1) {
      topTotal += 1;
      if (visible(x, y)) top += 1;
    }
  }
  for (let y = Math.max(0, height - band); y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      bottomTotal += 1;
      if (visible(x, y)) bottom += 1;
    }
  }
  for (let x = 0; x < Math.min(width, band); x += 1) {
    for (let y = 0; y < height; y += 1) {
      leftTotal += 1;
      if (visible(x, y)) left += 1;
    }
  }
  for (let x = Math.max(0, width - band); x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      rightTotal += 1;
      if (visible(x, y)) right += 1;
    }
  }

  return [top / Math.max(1, topTotal), right / Math.max(1, rightTotal), bottom / Math.max(1, bottomTotal), left / Math.max(1, leftTotal)];
}

async function trimRaw(raw: RawImage): Promise<RawImage> {
  return rawFromSharp(
    sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: raw.channels } }).trim({
      background: TRANSPARENT,
      threshold: 8,
    }),
  );
}

async function removeNestedCanvases(input: Buffer, aggressive = false) {
  let raw = await rawFromSharp(
    sharp(input, { failOn: "none", animated: false })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }),
  );

  for (let pass = 0; pass < 7; pass += 1) {
    const background = sampleCornerBackground(raw.data, raw.width, raw.height, raw.channels);
    if (!background.transparent) removeConnectedBackground(raw, background.color, background.threshold);
    raw = await trimRaw(raw);

    // A surviving product-card rectangle has opaque coverage along most of
    // the trimmed boundary. Legacy search images are more likely to contain
    // gray/cream cards, so only those get the stronger rescue threshold.
    const edges = opaqueEdgeCoverage(raw);
    const rectangularEdges = edges.filter((value) => value >= 0.58).length;
    if (rectangularEdges >= 3) {
      const innerBackground = sampleCornerBackground(raw.data, raw.width, raw.height, raw.channels);
      if (!innerBackground.transparent) {
        const rescueThreshold = aggressive ? 108 : 64;
        removeConnectedBackground(raw, innerBackground.color, Math.max(rescueThreshold, innerBackground.threshold));
        raw = await trimRaw(raw);
      }
    }
  }

  return raw;
}

function targetBox(view: string | null, width: number, height: number) {
  const vertical = height > width * 1.12;
  if (view === "Top" || (view === "Outsole" && vertical) || vertical) return { width: 720, height: 800 };
  return { width: 1000, height: 620 };
}

async function normalize(input: Buffer, view: string | null, aggressive = false) {
  const raw = await removeNestedCanvases(input, aggressive);
  const target = targetBox(view, raw.width, raw.height);
  const fitted = await sharp(raw.data, {
    raw: { width: raw.width, height: raw.height, channels: raw.channels },
  })
    .resize({ width: target.width, height: target.height, fit: "contain", background: TRANSPARENT })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const meta = await sharp(fitted).metadata();
  const fittedWidth = meta.width ?? target.width;
  const fittedHeight = meta.height ?? target.height;

  return sharp(fitted)
    .extend({
      top: Math.max(0, Math.floor((CANVAS_HEIGHT - fittedHeight) / 2)),
      bottom: Math.max(0, Math.ceil((CANVAS_HEIGHT - fittedHeight) / 2)),
      left: Math.max(0, Math.floor((CANVAS_WIDTH - fittedWidth) / 2)),
      right: Math.max(0, Math.ceil((CANVAS_WIDTH - fittedWidth) / 2)),
      background: TRANSPARENT,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function toLegacyFastSource(src: string, view: string | null) {
  if (!src.startsWith("/api/legacy-shoe-image?") && !src.startsWith("/api/legacy-fast-image?")) return null;
  const query = src.slice(src.indexOf("?") + 1);
  const params = new URLSearchParams(query);
  params.set("view", view === "Top" || view === "Outsole" ? view : "Side");
  params.set("v", "7");
  return `/api/legacy-fast-image?${params.toString()}`;
}

function decoderSafeRemoteUrl(src: string) {
  if (/media\.(?:au|nz)\.hoka\.com/i.test(src)) return src.replace(/f=auto/gi, "f=webp");
  return src;
}

function remoteHeaders(src: string) {
  const headers: Record<string, string> = {
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
    accept: "image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5",
    "accept-language": "en-US,en;q=0.8",
  };
  if (/alpen-group\.jp/i.test(src)) headers.referer = "https://store.alpen-group.jp/";
  if (/sportsdirect\.com/i.test(src)) headers.referer = "https://www.sportsdirect.com/";
  if (/kicksonfire\.com/i.test(src)) headers.referer = "https://www.kicksonfire.com/";
  if (/ilcorridore\.com/i.test(src)) headers.referer = "https://www.ilcorridore.com/";
  return headers;
}

function unsupportedDecoderPayload(contentType: string, body: ArrayBuffer) {
  if (/avif|heif|heic/i.test(contentType)) return true;
  const marker = Buffer.from(body).subarray(4, 20).toString("ascii").toLowerCase();
  return /ftyp(?:avif|avis|heic|heix|mif1|msf1)/.test(marker);
}

async function fallbackImage(request: NextRequest, brand: string, model: string, view: string | null) {
  if (!brand || !model) return null;
  const url = new URL("/api/legacy-fast-image", request.nextUrl.origin);
  url.searchParams.set("brand", brand);
  url.searchParams.set("model", model);
  url.searchParams.set("view", view === "Top" || view === "Outsole" ? view : "Side");
  url.searchParams.set("v", "7");
  const response = await getLegacyFastImage(new NextRequest(url));
  if (!response.ok) return null;
  const body = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/") || unsupportedDecoderPayload(contentType, body)) return null;
  return Buffer.from(body);
}

async function loadSource(request: NextRequest, src: string, view: string | null, brand: string, model: string) {
  const legacy = toLegacyFastSource(src, view);
  if (legacy) {
    const response = await getLegacyFastImage(new NextRequest(new URL(legacy, request.nextUrl.origin)));
    if (!response.ok) throw new Error(`Historical image returned ${response.status}`);
    const body = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "";
    if (unsupportedDecoderPayload(contentType, body)) throw new Error("Historical image uses unsupported decoder format");
    return Buffer.from(body);
  }

  if (!/^https?:\/\//i.test(src) || !allowedRemoteUrls.has(src)) throw new Error("Unknown detail image");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(decoderSafeRemoteUrl(src), {
      signal: controller.signal,
      headers: remoteHeaders(src),
      cache: "force-cache",
    });
    if (!response.ok) throw new Error(`Image source returned ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error("Source is not an image");
    const body = await response.arrayBuffer();
    if (unsupportedDecoderPayload(contentType, body)) throw new Error("Source uses unsupported decoder format");
    return Buffer.from(body);
  } catch (error) {
    const fallback = await fallbackImage(request, brand, model, view);
    if (fallback) return fallback;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src") ?? "";
  const view = request.nextUrl.searchParams.get("view");
  const brand = request.nextUrl.searchParams.get("brand")?.trim() ?? "";
  const model = request.nextUrl.searchParams.get("model")?.trim() ?? "";
  if (!src) return new Response("Missing image source", { status: 400 });

  try {
    const input = await loadSource(request, src, view, brand, model);
    const aggressive = src.startsWith("/api/legacy-shoe-image?") || src.startsWith("/api/legacy-fast-image?");
    const output = await normalize(input, view, aggressive);
    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "x-runned-image-cleanup": "nested-canvas-v7",
      },
    });
  } catch (error) {
    console.error("Detail image cleanup failed", src, error);
    return new Response("Unable to clean detail image", {
      status: 502,
      headers: { "cache-control": "public, max-age=120, s-maxage=300" },
    });
  }
}
