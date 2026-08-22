import sharp from "sharp";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
const TARGET_WIDTH = 1040;
const TARGET_HEIGHT = 700;
const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

type Bounds = { minX: number; maxX: number; minY: number; maxY: number };
type Component = Bounds & { pixels: number[]; area: number };
type RGB = { r: number; g: number; b: number };

function offset(x: number, y: number, width: number, channels: number) {
  return (y * width + x) * channels;
}

function alphaBounds(data: Buffer, width: number, height: number, channels: number): Bounds | null {
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[offset(x, y, width, channels) + 3];
      if (alpha < 24) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  return maxX >= minX && maxY >= minY ? { minX, maxX, minY, maxY } : null;
}

function brightness(r: number, g: number, b: number) {
  return (r + g + b) / 3;
}

function chroma(r: number, g: number, b: number) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function sampleBorderColor(data: Buffer, width: number, height: number, channels: number, bounds: Bounds) {
  const boundsWidth = bounds.maxX - bounds.minX + 1;
  const boundsHeight = bounds.maxY - bounds.minY + 1;
  const ring = Math.max(3, Math.min(18, Math.floor(Math.min(boundsWidth, boundsHeight) * 0.035)));

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
    for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
      const onRing =
        x < bounds.minX + ring || x > bounds.maxX - ring ||
        y < bounds.minY + ring || y > bounds.maxY - ring;
      if (!onRing) continue;

      const pixel = offset(x, y, width, channels);
      if (data[pixel + 3] < 32) continue;
      r += data[pixel];
      g += data[pixel + 1];
      b += data[pixel + 2];
      count += 1;
    }
  }

  if (!count) return null;
  return {
    color: { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) } as RGB,
    count,
  };
}

function localGradient(data: Buffer, x: number, y: number, width: number, height: number, channels: number) {
  const current = offset(x, y, width, channels);
  let gradient = 0;
  const neighbors = [
    [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
  ] as const;

  for (const [nx, ny] of neighbors) {
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    const other = offset(nx, ny, width, channels);
    gradient = Math.max(
      gradient,
      Math.abs(data[current] - data[other]),
      Math.abs(data[current + 1] - data[other + 1]),
      Math.abs(data[current + 2] - data[other + 2]),
    );
  }
  return gradient;
}

function removeResidualNeutralMatte(data: Buffer, width: number, height: number, channels: number) {
  if (channels < 4) return;
  const bounds = alphaBounds(data, width, height, channels);
  if (!bounds) return;

  const boundsWidth = bounds.maxX - bounds.minX + 1;
  const boundsHeight = bounds.maxY - bounds.minY + 1;
  if (boundsWidth < width * 0.12 || boundsHeight < height * 0.12) return;

  const sampled = sampleBorderColor(data, width, height, channels, bounds);
  if (!sampled) return;
  const background = sampled.color;
  const backgroundBrightness = brightness(background.r, background.g, background.b);
  const backgroundChroma = chroma(background.r, background.g, background.b);

  // Product-photo mattes are typically white, off-white or light grey. Avoid
  // treating saturated/dark shoe material as a background candidate.
  if (backgroundBrightness < 145 || backgroundChroma > 65) return;

  const minBrightness = Math.max(140, backgroundBrightness - 78);
  const nearThreshold = 52;
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isBackgroundLike = (x: number, y: number) => {
    const pixel = offset(x, y, width, channels);
    const alpha = data[pixel + 3];
    if (alpha < 18) return true;

    const r = data[pixel];
    const g = data[pixel + 1];
    const b = data[pixel + 2];
    const distance = Math.max(
      Math.abs(r - background.r),
      Math.abs(g - background.g),
      Math.abs(b - background.b),
    );
    const lightNeutral = brightness(r, g, b) >= minBrightness && chroma(r, g, b) <= 52;
    if (distance > nearThreshold && !lightNeutral) return false;

    // A smoothness barrier prevents the flood from walking across the sharp
    // edge of a white shoe into white/light-grey shoe panels.
    return localGradient(data, x, y, width, height, channels) <= 30;
  };

  const enqueue = (x: number, y: number) => {
    if (x < bounds.minX || y < bounds.minY || x > bounds.maxX || y > bounds.maxY) return;
    const index = y * width + x;
    if (visited[index] || !isBackgroundLike(x, y)) return;
    visited[index] = 1;
    queue[tail] = index;
    tail += 1;
  };

  for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
    enqueue(x, bounds.minY);
    enqueue(x, bounds.maxY);
  }
  for (let y = bounds.minY + 1; y < bounds.maxY; y += 1) {
    enqueue(bounds.minX, y);
    enqueue(bounds.maxX, y);
  }

  while (head < tail) {
    const index = queue[head];
    head += 1;
    const x = index % width;
    const y = Math.floor(index / width);
    data[index * channels + 3] = 0;

    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  // Remove a thin antialiased halo left at the edge of the matte.
  for (let pass = 0; pass < 3; pass += 1) {
    const clear: number[] = [];
    for (let y = Math.max(1, bounds.minY); y <= Math.min(height - 2, bounds.maxY); y += 1) {
      for (let x = Math.max(1, bounds.minX); x <= Math.min(width - 2, bounds.maxX); x += 1) {
        const index = y * width + x;
        const pixel = index * channels;
        if (data[pixel + 3] < 18 || !isBackgroundLike(x, y)) continue;
        const neighbors = [index - 1, index + 1, index - width, index + width];
        if (neighbors.some((neighbor) => data[neighbor * channels + 3] < 18)) clear.push(index);
      }
    }
    for (const index of clear) data[index * channels + 3] = 0;
  }
}

function componentGap(a: Component, b: Component) {
  const x = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
  const y = Math.max(0, Math.max(a.minY, b.minY) - Math.min(a.maxY, b.maxY));
  return { x, y };
}

function isolatePrimaryShoe(data: Buffer, width: number, height: number, channels: number) {
  if (channels < 4) return;
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  const components: Component[] = [];

  for (let start = 0; start < total; start += 1) {
    if (visited[start] || data[start * channels + 3] < 24) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    visited[start] = 1;
    const pixels: number[] = [];
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    while (head < tail) {
      const index = queue[head++];
      pixels.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const neighbor = ny * width + nx;
          if (visited[neighbor] || data[neighbor * channels + 3] < 24) continue;
          visited[neighbor] = 1;
          queue[tail++] = neighbor;
        }
      }
    }

    if (pixels.length >= 6) components.push({ pixels, area: pixels.length, minX, maxX, minY, maxY });
  }

  if (components.length <= 1) return;
  components.sort((a, b) => b.area - a.area);
  const primary = components[0];
  const near = Math.max(7, Math.round(Math.min(width, height) * 0.01));

  for (const component of components.slice(1)) {
    const gap = componentGap(component, primary);
    const overlapsX = component.maxX >= primary.minX && component.minX <= primary.maxX;
    const overlapsY = component.maxY >= primary.minY && component.minY <= primary.maxY;
    const close =
      (overlapsX && gap.y <= near) ||
      (overlapsY && gap.x <= near) ||
      (gap.x <= near && gap.y <= near);

    // Keep shadows/details that sit immediately next to the shoe. Remove a
    // second shoe from pair photography plus detached badges/watermarks.
    if (close) continue;
    for (const index of component.pixels) data[index * channels + 3] = 0;
  }
}

async function refitToCanvas(data: Buffer, width: number, height: number, channels: number) {
  const subject = await sharp(data, { raw: { width, height, channels } })
    .trim({ background: TRANSPARENT, threshold: 8 })
    .png()
    .toBuffer();

  const fitted = await sharp(subject, { failOn: "none" })
    .resize({ width: TARGET_WIDTH, height: TARGET_HEIGHT, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  const metadata = await sharp(fitted).metadata();
  const fittedWidth = metadata.width ?? TARGET_WIDTH;
  const fittedHeight = metadata.height ?? TARGET_HEIGHT;
  const left = Math.max(0, Math.floor((CANVAS_WIDTH - fittedWidth) / 2));
  const right = Math.max(0, CANVAS_WIDTH - fittedWidth - left);
  const top = Math.max(0, Math.floor((CANVAS_HEIGHT - fittedHeight) / 2));
  const bottom = Math.max(0, CANVAS_HEIGHT - fittedHeight - top);

  return sharp(fitted)
    .extend({ top, bottom, left, right, background: TRANSPARENT })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function ensureProductCanvas(input: Buffer) {
  const prepared = sharp(input, { failOn: "none" })
    .resize({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, fit: "contain", position: "centre", background: TRANSPARENT, withoutEnlargement: false })
    .ensureAlpha();

  const { data, info } = await prepared.raw().toBuffer({ resolveWithObject: true });

  // Two matte passes handle nested retailer canvases and mild studio gradients.
  removeResidualNeutralMatte(data, info.width, info.height, info.channels);
  removeResidualNeutralMatte(data, info.width, info.height, info.channels);
  isolatePrimaryShoe(data, info.width, info.height, info.channels);
  removeResidualNeutralMatte(data, info.width, info.height, info.channels);
  isolatePrimaryShoe(data, info.width, info.height, info.channels);

  return refitToCanvas(data, info.width, info.height, info.channels);
}
