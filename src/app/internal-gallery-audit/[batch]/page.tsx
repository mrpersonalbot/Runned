import sharp from "sharp";
import { demoShoes } from "@/lib/data/catalog";
import { ensureProductCanvas } from "@/lib/images/ensure-product-canvas";
import { normalizeProductImage } from "@/lib/images/normalize-product-image";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";
import type { ShoeImageView } from "@/lib/types";

export const dynamic = "force-static";

const BATCH_SIZE = 6;

type Task = { slug: string; brand: string; model: string; image: ShoeImageView };
type Result = Task & {
  ok: boolean;
  matteSuspected: boolean;
  opaqueRatio: number;
  borderOpaqueRatio: number;
  error?: string;
};

export function generateStaticParams() {
  return Array.from({ length: Math.ceil(demoShoes.length / BATCH_SIZE) }, (_, index) => ({ batch: String(index) }));
}

async function fetchImage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5",
        referer: new URL(url).origin + "/",
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error(`Not an image: ${contentType || "unknown"}`);
    return Buffer.from(await response.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeCanvas(buffer: Buffer) {
  const { data, info } = await sharp(buffer, { failOn: "none" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  let minX = info.width;
  let maxX = -1;
  let minY = info.height;
  let maxY = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * channels + 3] < 24) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return { empty: true, opaqueRatio: 0, borderOpaqueRatio: 0, matteSuspected: false };

  const boxWidth = maxX - minX + 1;
  const boxHeight = maxY - minY + 1;
  const boxArea = boxWidth * boxHeight;
  const ring = Math.max(2, Math.min(12, Math.floor(Math.min(boxWidth, boxHeight) * 0.025)));
  let opaque = 0;
  let borderOpaque = 0;
  let borderTotal = 0;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const alpha = data[(y * info.width + x) * channels + 3];
      if (alpha >= 24) opaque += 1;
      const onBorder = x < minX + ring || x > maxX - ring || y < minY + ring || y > maxY - ring;
      if (!onBorder) continue;
      borderTotal += 1;
      if (alpha >= 24) borderOpaque += 1;
    }
  }

  const opaqueRatio = opaque / boxArea;
  const borderOpaqueRatio = borderTotal ? borderOpaque / borderTotal : 0;
  return {
    empty: false,
    opaqueRatio: Number(opaqueRatio.toFixed(3)),
    borderOpaqueRatio: Number(borderOpaqueRatio.toFixed(3)),
    matteSuspected: opaqueRatio > 0.72 && borderOpaqueRatio > 0.58,
  };
}

async function runTask(task: Task): Promise<Result> {
  try {
    const input = await fetchImage(task.image.url);
    const normalized = await normalizeProductImage(input, task.image.label);
    const canvas = await ensureProductCanvas(normalized);
    const quality = await analyzeCanvas(canvas);
    return {
      ...task,
      ok: !quality.empty && !quality.matteSuspected,
      matteSuspected: quality.matteSuspected,
      opaqueRatio: quality.opaqueRatio,
      borderOpaqueRatio: quality.borderOpaqueRatio,
      ...(quality.empty ? { error: "Processed image is empty" } : {}),
    };
  } catch (error) {
    return {
      ...task,
      ok: false,
      matteSuspected: false,
      opaqueRatio: 0,
      borderOpaqueRatio: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runWithConcurrency(tasks: Task[], concurrency = 6) {
  const results: Result[] = new Array(tasks.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= tasks.length) return;
      results[index] = await runTask(tasks[index]);
    }
  }));
  return results;
}

export default async function GalleryAuditBatchPage({ params }: { params: Promise<{ batch: string }> }) {
  const { batch } = await params;
  const batchIndex = Math.max(0, Number.parseInt(batch, 10) || 0);
  const shoes = demoShoes.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE);
  const tasks: Task[] = [];

  for (const shoe of shoes) {
    const images = await resolveShoeGallery(shoe);
    for (const image of images.slice(0, 3)) tasks.push({ slug: shoe.slug, brand: shoe.brand, model: shoe.model, image });
  }

  const results = await runWithConcurrency(tasks, 6);
  const issues = results.filter((result) => !result.ok);
  console.log(`[GALLERY_AUDIT_BATCH] ${JSON.stringify({ batch: batchIndex, shoes: shoes.length, images: results.length, issues: issues.length })}`);

  for (const issue of issues) {
    console.log(`[GALLERY_AUDIT_ISSUE] ${JSON.stringify({
      batch: batchIndex,
      slug: issue.slug,
      brand: issue.brand,
      model: issue.model,
      label: issue.image.label,
      url: issue.image.url,
      matteSuspected: issue.matteSuspected,
      opaqueRatio: issue.opaqueRatio,
      borderOpaqueRatio: issue.borderOpaqueRatio,
      error: issue.error ?? null,
    })}`);
  }

  return <main className="p-8"><p>Gallery audit batch {batchIndex}: {results.length - issues.length}/{results.length} images healthy.</p></main>;
}
