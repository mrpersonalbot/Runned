import { NextRequest } from "next/server";
import sharp from "sharp";
import { demoShoes } from "@/lib/data/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

const allowedUrls = new Set(
  demoShoes.flatMap((shoe) => shoe.images.map((image) => image.url)),
);

type RGB = { r: number; g: number; b: number };
type ForegroundComponent = {
  pixels: number[];
  area: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
type ImageChannels = 1 | 2 | 3 | 4;
type RawImage = { data: Buffer; width: number; height: number; channels: ImageChannels };

function pixelOffset(x: number, y: number, width: number, channels: number) {
  return (y * width + x) * channels;
}

function sampleCornerBackground(data: Buffer, width: number, height: number, channels: number) {
  const patch = Math.max(2, Math.min(12, Math.floor(Math.min(width, height) * 0.025)));
  const points = [
    [0, 0],
    [Math.max(0, width - patch), 0],
    [0, Math.max(0, height - patch)],
    [Math.max(0, width - patch), Math.max(0, height - patch)],
  ] as const;

  let count = 0;
  let alphaCount = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  const samples: RGB[] = [];

  for (const [startX, startY] of points) {
    for (let y = startY; y < Math.min(height, startY + patch); y += 1) {
      for (let x = startX; x < Math.min(width, startX + patch); x += 1) {
        const offset = pixelOffset(x, y, width, channels);
        const alpha = channels >= 4 ? data[offset + 3] : 255;
        if (alpha < 32) {
          alphaCount += 1;
          continue;
        }
        const sample = { r: data[offset], g: data[offset + 1], b: data[offset + 2] };
        samples.push(sample);
        r += sample.r;
        g += sample.g;
        b += sample.b;
        count += 1;
      }
    }
  }

  if (count === 0) {
    return { transparent: true, color: { r: 255, g: 255, b: 255 }, threshold: 10, spread: 0 };
  }

  const color = { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
  let spread = 0;
  for (const sample of samples) {
    spread = Math.max(
      spread,
      Math.abs(sample.r - color.r),
      Math.abs(sample.g - color.g),
      Math.abs(sample.b - color.b),
    );
  }

  return {
    transparent: alphaCount > count * 0.75,
    color,
    threshold: Math.max(8, Math.min(22, spread + 8)),
    spread,
  };
}

function nearColor(data: Buffer, offset: number, background: RGB, threshold: number) {
  return (
    Math.abs(data[offset] - background.r) <= threshold &&
    Math.abs(data[offset + 1] - background.g) <= threshold &&
    Math.abs(data[offset + 2] - background.b) <= threshold
  );
}

function removeConnectedBackground(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
  background: RGB,
  threshold: number,
) {
  if (channels < 4) return;

  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const enqueueIfBackground = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    const offset = index * channels;
    const alpha = data[offset + 3];
    if (alpha < 16 || nearColor(data, offset, background, threshold)) {
      visited[index] = 1;
      queue[tail] = index;
      tail += 1;
    }
  };

  for (let x = 0; x < width; x += 1) {
    enqueueIfBackground(x, 0);
    enqueueIfBackground(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueueIfBackground(0, y);
    enqueueIfBackground(width - 1, y);
  }

  while (head < tail) {
    const index = queue[head];
    head += 1;
    const x = index % width;
    const y = Math.floor(index / width);
    data[index * channels + 3] = 0;

    enqueueIfBackground(x - 1, y);
    enqueueIfBackground(x + 1, y);
    enqueueIfBackground(x, y - 1);
    enqueueIfBackground(x, y + 1);
  }

  const haloThreshold = Math.min(28, threshold + 5);
  for (let pass = 0; pass < 2; pass += 1) {
    const toClear: number[] = [];
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        const offset = index * channels;
        if (data[offset + 3] === 0 || !nearColor(data, offset, background, haloThreshold)) continue;
        const neighbors = [index - 1, index + 1, index - width, index + width];
        if (neighbors.some((neighbor) => data[neighbor * channels + 3] === 0)) toClear.push(index);
      }
    }
    for (const index of toClear) data[index * channels + 3] = 0;
  }
}

function componentGap(a: ForegroundComponent, b: ForegroundComponent) {
  const x = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
  const y = Math.max(0, Math.max(a.minY, b.minY) - Math.min(a.maxY, b.maxY));
  return { x, y };
}

function removeDetachedForegroundArtifacts(data: Buffer, width: number, height: number, channels: number) {
  if (channels < 4) return;

  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  const components: ForegroundComponent[] = [];
  const alphaThreshold = 24;

  for (let start = 0; start < total; start += 1) {
    if (visited[start] || data[start * channels + 3] < alphaThreshold) continue;

    let head = 0;
    let tail = 0;
    queue[tail] = start;
    tail += 1;
    visited[start] = 1;

    const pixels: number[] = [];
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    while (head < tail) {
      const index = queue[head];
      head += 1;
      pixels.push(index);

      const x = index % width;
      const y = Math.floor(index / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const neighbor = ny * width + nx;
          if (visited[neighbor] || data[neighbor * channels + 3] < alphaThreshold) continue;
          visited[neighbor] = 1;
          queue[tail] = neighbor;
          tail += 1;
        }
      }
    }

    if (pixels.length >= 4) components.push({ pixels, area: pixels.length, minX, maxX, minY, maxY });
  }

  if (components.length <= 1) return;
  components.sort((a, b) => b.area - a.area);
  const primary = components[0];
  const maxHorizontalGap = Math.max(10, Math.round(width * 0.03));
  const maxVerticalGap = Math.max(10, Math.round(height * 0.035));

  for (const component of components.slice(1)) {
    const gap = componentGap(component, primary);
    const overlapsX = component.maxX >= primary.minX && component.minX <= primary.maxX;
    const overlapsY = component.maxY >= primary.minY && component.minY <= primary.maxY;
    const closeToShoe =
      (overlapsX && gap.y <= maxVerticalGap) ||
      (overlapsY && gap.x <= maxHorizontalGap) ||
      (gap.x <= maxHorizontalGap && gap.y <= maxVerticalGap);

    if (closeToShoe) continue;
    for (const index of component.pixels) data[index * channels + 3] = 0;
  }
}

async function rawFromSharp(pipeline: sharp.Sharp): Promise<RawImage> {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels as ImageChannels };
}

function cleanRaw(raw: RawImage, allowBackdropRemoval = true) {
  const background = sampleCornerBackground(raw.data, raw.width, raw.height, raw.channels);
  if (!background.transparent && allowBackdropRemoval) {
    removeConnectedBackground(
      raw.data,
      raw.width,
      raw.height,
      raw.channels,
      background.color,
      background.threshold,
    );
  }
  removeDetachedForegroundArtifacts(raw.data, raw.width, raw.height, raw.channels);
  return raw;
}

async function trimToRaw(raw: RawImage): Promise<RawImage> {
  return rawFromSharp(
    sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: raw.channels } })
      .trim({ background: TRANSPARENT, threshold: 8 }),
  );
}

function targetBox(view: string | null, width: number, height: number) {
  const vertical = height > width * 1.12;
  if (view === "Top" || vertical) return { width: 720, height: 800 };
  if (view === "Outsole" && vertical) return { width: 720, height: 800 };
  return { width: 1000, height: 620 };
}

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get("url");
  const view = request.nextUrl.searchParams.get("view");
  if (!sourceUrl || !allowedUrls.has(sourceUrl)) {
    return new Response("Unknown product image", { status: 404 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Image source returned ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error("Source is not an image");

    const input = Buffer.from(await response.arrayBuffer());
    let raw = await rawFromSharp(
      sharp(input, { failOn: "none", animated: false })
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }),
    );

    // Pass 1 removes the source page/background. After trimming, a second pass
    // catches nested product-card rectangles that were previously surrounded by
    // the first background (the common "box inside box" marketplace artifact).
    raw = cleanRaw(raw);
    raw = await trimToRaw(raw);
    raw = cleanRaw(raw);
    raw = await trimToRaw(raw);

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
    const normalized = await sharp(fitted)
      .extend({
        top: Math.floor((CANVAS_HEIGHT - fittedHeight) / 2),
        bottom: Math.ceil((CANVAS_HEIGHT - fittedHeight) / 2),
        left: Math.floor((CANVAS_WIDTH - fittedWidth) / 2),
        right: Math.ceil((CANVAS_WIDTH - fittedWidth) / 2),
        background: TRANSPARENT,
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    return new Response(new Uint8Array(normalized), {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Product image normalization failed", sourceUrl, error);
    return new Response("Unable to normalize product image", { status: 502 });
  }
}
