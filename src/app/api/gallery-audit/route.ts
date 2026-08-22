import sharp from "sharp";
import { NextRequest } from "next/server";
import { demoShoes } from "@/lib/data/catalog";
import { ensureProductCanvas } from "@/lib/images/ensure-product-canvas";
import { normalizeProductImage } from "@/lib/images/normalize-product-image";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";
import type { ShoeImageView } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fetchImage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        referer: new URL(url).origin + "/",
      },
      cache: "force-cache",
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
    return { empty: true, opaqueRatio: 0, borderOpaqueRatio: 0, matteSuspected: false };
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
  // A retained rectangular studio matte fills most of its bounding box and
  // leaves the entire bounding-box border opaque. Normal shoe silhouettes do not.
  const matteSuspected = opaqueRatio > 0.72 && borderOpaqueRatio > 0.58;

  return {
    empty: false,
    opaqueRatio: Number(opaqueRatio.toFixed(3)),
    borderOpaqueRatio: Number(borderOpaqueRatio.toFixed(3)),
    matteSuspected,
  };
}

async function checkImage(image: ShoeImageView) {
  try {
    const input = await fetchImage(image.url);
    const normalized = await normalizeProductImage(input, image.label);
    const canvas = await ensureProductCanvas(normalized);
    const quality = await analyzeCanvas(canvas);
    return {
      label: image.label,
      url: image.url,
      available: true,
      processed: !quality.empty,
      ...quality,
      healthy: !quality.empty && !quality.matteSuspected,
    };
  } catch (error) {
    return {
      label: image.label,
      url: image.url,
      available: false,
      processed: false,
      empty: true,
      opaqueRatio: 0,
      borderOpaqueRatio: 0,
      matteSuspected: false,
      healthy: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET(request: NextRequest) {
  const offset = Math.max(0, Number.parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.max(1, Math.min(8, Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "5", 10) || 5));
  const slice = demoShoes.slice(offset, offset + limit);

  const results = await Promise.all(slice.map(async (shoe) => {
    const images = await resolveShoeGallery(shoe);
    const checks = await Promise.all(images.slice(0, 3).map(checkImage));
    const healthy = checks.length > 0 && checks.every((image) => image.healthy);
    return {
      slug: shoe.slug,
      brand: shoe.brand,
      model: shoe.model,
      count: images.length,
      healthy,
      images: checks,
    };
  }));

  return Response.json({
    total: demoShoes.length,
    offset,
    limit,
    checked: results.length,
    healthy: results.filter((item) => item.healthy).length,
    unhealthy: results.filter((item) => !item.healthy),
    results,
  }, { headers: { "cache-control": "no-store" } });
}
