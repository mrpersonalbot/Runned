import sharp from "sharp";
import type { ShoeImageView } from "@/lib/types";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

type RGB = { r: number; g: number; b: number };
type Bounds = { minX: number; maxX: number; minY: number; maxY: number };
type ForegroundComponent = Bounds & { pixels: number[]; area: number };

function pixelOffset(x: number, y: number, width: number, channels: number) {
  return (y * width + x) * channels;
}

function nearColor(data: Buffer, offset: number, background: RGB, threshold: number) {
  return (
    Math.abs(data[offset] - background.r) <= threshold &&
    Math.abs(data[offset + 1] - background.g) <= threshold &&
    Math.abs(data[offset + 2] - background.b) <= threshold
  );
}

function samplePatches(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
  starts: Array<[number, number]>,
  patch: number,
) {
  let count = 0;
  let transparentCount = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  const samples: RGB[] = [];

  for (const [startX, startY] of starts) {
    for (let y = Math.max(0, startY); y < Math.min(height, startY + patch); y += 1) {
      for (let x = Math.max(0, startX); x < Math.min(width, startX + patch); x += 1) {
        const offset = pixelOffset(x, y, width, channels);
        const alpha = channels >= 4 ? data[offset + 3] : 255;
        if (alpha < 32) {
          transparentCount += 1;
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
    return { transparent: true, color: { r: 255, g: 255, b: 255 }, threshold: 10, count: 0 };
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
    transparent: transparentCount > count * 0.75,
    color,
    threshold: Math.max(8, Math.min(20, spread + 7)),
    count,
  };
}

function sampleCornerBackground(data: Buffer, width: number, height: number, channels: number) {
  const patch = Math.max(2, Math.min(12, Math.floor(Math.min(width, height) * 0.025)));
  return samplePatches(
    data,
    width,
    height,
    channels,
    [
      [0, 0],
      [Math.max(0, width - patch), 0],
      [0, Math.max(0, height - patch)],
      [Math.max(0, width - patch), Math.max(0, height - patch)],
    ],
    patch,
  );
}

function alphaBounds(data: Buffer, width: number, height: number, channels: number): Bounds | null {
  if (channels < 4) return { minX: 0, maxX: width - 1, minY: 0, maxY: height - 1 };
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[pixelOffset(x, y, width, channels) + 3];
      if (alpha < 24) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  return maxX >= minX && maxY >= minY ? { minX, maxX, minY, maxY } : null;
}

function removeConnectedBackground(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
  background: RGB,
  threshold: number,
  seedBounds?: Bounds,
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

  if (seedBounds) {
    for (let x = seedBounds.minX; x <= seedBounds.maxX; x += 1) {
      enqueueIfBackground(x, seedBounds.minY);
      enqueueIfBackground(x, seedBounds.maxY);
    }
    for (let y = seedBounds.minY + 1; y < seedBounds.maxY; y += 1) {
      enqueueIfBackground(seedBounds.minX, y);
      enqueueIfBackground(seedBounds.maxX, y);
    }
  } else {
    for (let x = 0; x < width; x += 1) {
      enqueueIfBackground(x, 0);
      enqueueIfBackground(x, height - 1);
    }
    for (let y = 1; y < height - 1; y += 1) {
      enqueueIfBackground(0, y);
      enqueueIfBackground(width - 1, y);
    }
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

  const haloThreshold = Math.min(22, threshold + 4);
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

function removeInternalMatte(data: Buffer, width: number, height: number, channels: number) {
  const bounds = alphaBounds(data, width, height, channels);
  if (!bounds) return;

  const boundsWidth = bounds.maxX - bounds.minX + 1;
  const boundsHeight = bounds.maxY - bounds.minY + 1;
  if (boundsWidth < width * 0.2 || boundsHeight < height * 0.2) return;

  const patch = Math.max(3, Math.min(14, Math.floor(Math.min(boundsWidth, boundsHeight) * 0.025)));
  const sample = samplePatches(
    data,
    width,
    height,
    channels,
    [
      [bounds.minX, bounds.minY],
      [Math.max(bounds.minX, bounds.maxX - patch + 1), bounds.minY],
      [bounds.minX, Math.max(bounds.minY, bounds.maxY - patch + 1)],
      [Math.max(bounds.minX, bounds.maxX - patch + 1), Math.max(bounds.minY, bounds.maxY - patch + 1)],
    ],
    patch,
  );

  const brightness = (sample.color.r + sample.color.g + sample.color.b) / 3;
  const neutralSpread = Math.max(sample.color.r, sample.color.g, sample.color.b) - Math.min(sample.color.r, sample.color.g, sample.color.b);
  if (sample.transparent || sample.count === 0 || brightness < 170 || neutralSpread > 38) return;

  removeConnectedBackground(data, width, height, channels, sample.color, Math.max(sample.threshold, 12), bounds);
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
  const maxVerticalGap = Math.max(10, Math.round(height * 0.04));

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

function targetBox(label: ShoeImageView["label"] = "Side") {
  if (label === "Top") return { width: 700, height: 830 };
  if (label === "Outsole") return { width: 1040, height: 700 };
  if (label === "Rear") return { width: 700, height: 800 };
  return { width: 1040, height: 700 };
}

export async function normalizeProductImage(input: Buffer, label: ShoeImageView["label"] = "Side") {
  const prepared = sharp(input, { failOn: "none", animated: false })
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .ensureAlpha();

  const { data, info } = await prepared.raw().toBuffer({ resolveWithObject: true });
  const background = sampleCornerBackground(data, info.width, info.height, info.channels);

  if (!background.transparent) {
    removeConnectedBackground(data, info.width, info.height, info.channels, background.color, background.threshold);
  } else {
    removeInternalMatte(data, info.width, info.height, info.channels);
  }

  removeInternalMatte(data, info.width, info.height, info.channels);
  removeDetachedForegroundArtifacts(data, info.width, info.height, info.channels);

  const trimmed = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .trim({ background: TRANSPARENT, threshold: 8 })
    .png()
    .toBuffer();

  const target = targetBox(label);
  const fitted = await sharp(trimmed, { failOn: "none" })
    .resize({ width: target.width, height: target.height, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const metadata = await sharp(fitted).metadata();
  const width = metadata.width ?? target.width;
  const height = metadata.height ?? target.height;

  const left = Math.max(0, Math.floor((CANVAS_WIDTH - width) / 2));
  const right = Math.max(0, CANVAS_WIDTH - width - left);
  const top = Math.max(0, Math.floor((CANVAS_HEIGHT - height) / 2));
  const bottom = Math.max(0, CANVAS_HEIGHT - height - top);

  return sharp(fitted)
    .extend({ top, bottom, left, right, background: TRANSPARENT })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
