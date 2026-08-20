import { NextRequest } from "next/server";
import sharp from "sharp";
import { demoShoes } from "@/lib/data/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
const INNER_WIDTH = 1000;
const INNER_HEIGHT = 600;
const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

const allowedUrls = new Set(
  demoShoes.flatMap((shoe) => shoe.images.map((image) => image.url)),
);

type RGB = { r: number; g: number; b: number };

function pixelOffset(x: number, y: number, width: number, channels: number) {
  return (y * width + x) * channels;
}

function sampleCornerBackground(data: Buffer, width: number, height: number, channels: number) {
  const patch = Math.max(2, Math.min(10, Math.floor(Math.min(width, height) * 0.025)));
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
    return { transparent: true, color: { r: 255, g: 255, b: 255 }, threshold: 10 };
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
    threshold: Math.max(8, Math.min(16, spread + 6)),
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
    const offset = index * channels;
    data[offset + 3] = 0;

    enqueueIfBackground(x - 1, y);
    enqueueIfBackground(x + 1, y);
    enqueueIfBackground(x, y - 1);
    enqueueIfBackground(x, y + 1);
  }

  // Remove a narrow JPEG/anti-aliasing halo without eating into light-colored uppers.
  const haloThreshold = Math.min(18, threshold + 3);
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

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get("url");
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
    const prepared = sharp(input, { failOn: "none", animated: false })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .ensureAlpha();

    const { data, info } = await prepared.raw().toBuffer({ resolveWithObject: true });
    const background = sampleCornerBackground(data, info.width, info.height, info.channels);

    if (!background.transparent) {
      removeConnectedBackground(
        data,
        info.width,
        info.height,
        info.channels,
        background.color,
        background.threshold,
      );
    }

    const normalized = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .trim({ background: TRANSPARENT, threshold: 8 })
      .resize({ width: INNER_WIDTH, height: INNER_HEIGHT, fit: "contain", background: TRANSPARENT })
      .extend({
        top: Math.floor((CANVAS_HEIGHT - INNER_HEIGHT) / 2),
        bottom: Math.ceil((CANVAS_HEIGHT - INNER_HEIGHT) / 2),
        left: Math.floor((CANVAS_WIDTH - INNER_WIDTH) / 2),
        right: Math.ceil((CANVAS_WIDTH - INNER_WIDTH) / 2),
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
