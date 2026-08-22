import sharp from "sharp";
import { demoShoes } from "@/lib/data/catalog";
import { ensureProductCanvas } from "@/lib/images/ensure-product-canvas";
import { normalizeProductImage } from "@/lib/images/normalize-product-image";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";
import type { ShoeImageView } from "@/lib/types";

export const dynamic = "force-static";

type Task = {
  slug: string;
  model: string;
  brand: string;
  image: ShoeImageView;
};

type Result = Task & {
  ok: boolean;
  matteSuspected: boolean;
  opaqueRatio: number;
  borderOpaqueRatio: number;
  error?: string;
};

async function fetchImage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
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
  const { data, info } = await sharp(buffer, { failOn: "none" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  let minX = info.width;
  let maxX = -1;
  let minY = info.height;
  let maxY = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * channels + 3];
      if (alpha < 24) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) {
    return { matteSuspected: false, opaqueRatio: 0, borderOpaqueRatio: 0, empty: true };
  }

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
      const onBorder =
        x < minX + ring || x > maxX - ring ||
        y < minY + ring || y > maxY - ring;
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
      const index = cursor;
      cursor += 1;
      if (index >= tasks.length) return;
      results[index] = await runTask(tasks[index]);
    }
  }));

  return results;
}

export default async function GalleryAuditBuildPage() {
  const tasks: Task[] = [];
  for (const shoe of demoShoes) {
    const images = await resolveShoeGallery(shoe);
    for (const image of images.slice(0, 3)) {
      tasks.push({ slug: shoe.slug, model: shoe.model, brand: shoe.brand, image });
    }
  }

  const results = await runWithConcurrency(tasks, 6);
  const issues = results.filter((result) => !result.ok);
  const matteIssues = issues.filter((result) => result.matteSuspected);
  const sourceIssues = issues.filter((result) => Boolean(result.error) && !result.matteSuspected);

  console.log(`[GALLERY_AUDIT_SUMMARY] ${JSON.stringify({
    shoes: demoShoes.length,
    images: results.length,
    healthy: results.length - issues.length,
    issues: issues.length,
    matteIssues: matteIssues.length,
    sourceIssues: sourceIssues.length,
  })}`);

  for (const issue of issues) {
    console.log(`[GALLERY_AUDIT_ISSUE] ${JSON.stringify({
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

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl">Gallery quality audit</h1>
      <p className="mt-4 text-sm text-black/60">{demoShoes.length} shoes · {results.length} resolved images · {issues.length} issues</p>
      <pre className="mt-8 overflow-auto border border-black/10 bg-white p-4 text-xs">{JSON.stringify({ issues }, null, 2)}</pre>
    </main>
  );
}
