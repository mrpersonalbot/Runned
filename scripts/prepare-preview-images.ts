import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { demoShoes } from "../src/lib/data/catalog";

const outputDir = path.join(process.cwd(), "public", "preview-shoes");
const width = 1000;
const height = 750;

function near(data: Buffer, offset: number, color: [number, number, number], threshold: number) {
  return Math.abs(data[offset] - color[0]) <= threshold && Math.abs(data[offset + 1] - color[1]) <= threshold && Math.abs(data[offset + 2] - color[2]) <= threshold;
}

async function removeBackdrop(input: Buffer) {
  const { data, info } = await sharp(input, { failOn: "none", animated: false })
    .rotate()
    .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const points = [0, (info.width - 1) * channels, (info.height - 1) * info.width * channels, (info.height * info.width - 1) * channels];
  const color: [number, number, number] = [
    Math.round(points.reduce((sum, p) => sum + data[p], 0) / points.length),
    Math.round(points.reduce((sum, p) => sum + data[p + 1], 0) / points.length),
    Math.round(points.reduce((sum, p) => sum + data[p + 2], 0) / points.length),
  ];
  const threshold = 32;
  const total = info.width * info.height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;
  const enqueue = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= info.width || y >= info.height) return;
    const index = y * info.width + x;
    if (visited[index] || !near(data, index * channels, color, threshold)) return;
    visited[index] = 1;
    queue[tail++] = index;
  };
  for (let x = 0; x < info.width; x += 1) { enqueue(x, 0); enqueue(x, info.height - 1); }
  for (let y = 1; y < info.height - 1; y += 1) { enqueue(0, y); enqueue(info.width - 1, y); }
  while (head < tail) {
    const index = queue[head++];
    data[index * channels + 3] = 0;
    const x = index % info.width;
    const y = Math.floor(index / info.width);
    enqueue(x - 1, y); enqueue(x + 1, y); enqueue(x, y - 1); enqueue(x, y + 1);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .resize({ width: 900, height: 620, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .extend({ top: 65, bottom: 65, left: 50, right: 50, background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function fetchImage(url: string) {
  if (!/^https?:\/\//i.test(url)) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  const response = await fetch(url, { signal: controller.signal, headers: { "user-agent": "Mozilla/5.0 (compatible; Runned preview builder)" } }).finally(() => clearTimeout(timer));
  if (!response.ok) return null;
  return Buffer.from(await response.arrayBuffer());
}

async function searchImage(brand: string, model: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  const response = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(`${brand} ${model} running shoe product photo`)}&form=HDRSC3`, { signal: controller.signal, headers: { "user-agent": "Mozilla/5.0" } }).finally(() => clearTimeout(timer));
  if (!response.ok) return [];
  const html = await response.text();
  return [...html.matchAll(/murl&quot;:&quot;(https?:[^&]+?)&quot;/g)].slice(0, 8).map((match) => match[1].replace(/\\u0026/g, "&"));
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  let generated = 0;
  let missing = 0;
  const processShoe = async (shoe: (typeof demoShoes)[number]) => {
  const candidates = [shoe.cardImageUrl, ...shoe.images.map((image) => image.url)].filter((url): url is string => Boolean(url));
  let output: Buffer | null = null;
  for (const candidate of [...new Set([...candidates, ...(candidates.length ? [] : await searchImage(shoe.brand, shoe.model))])]) {
    try {
      const input = await fetchImage(candidate);
      if (input) { output = await removeBackdrop(input); break; }
    } catch { /* try the next model-matched source */ }
  };
  if (!output) {
    for (const candidate of await searchImage(shoe.brand, shoe.model)) {
      try {
        const input = await fetchImage(candidate);
        if (input) { output = await removeBackdrop(input); break; }
      } catch { /* continue through search results */ }
    }
  }
  if (!output) {
    const safeName = `${shoe.brand} ${shoe.model}`.replace(/[<&>]/g, "");
    output = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="750"><rect width="1000" height="750" fill="none"/><text x="500" y="360" text-anchor="middle" font-family="Arial" font-size="28" fill="#777">${safeName}</text><text x="500" y="405" text-anchor="middle" font-family="Arial" font-size="16" fill="#aaa">Image source pending</text></svg>`)).png().toBuffer();
    missing += 1;
    console.warn(`Using labeled fallback for ${shoe.brand} ${shoe.model}`);
  }
  await fs.writeFile(path.join(outputDir, `${shoe.slug}.png`), output);
  generated += 1;
  };
  for (let index = 0; index < demoShoes.length; index += 8) {
    await Promise.all(demoShoes.slice(index, index + 8).map(processShoe));
  }
  console.log(`Prepared ${generated}/${demoShoes.length} transparent shoe images (${missing} missing).`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
