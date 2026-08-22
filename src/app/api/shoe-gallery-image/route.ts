import { NextRequest } from "next/server";
import { getDemoShoe } from "@/lib/data/catalog";
import { ensureProductCanvas } from "@/lib/images/ensure-product-canvas";
import { normalizeProductImage } from "@/lib/images/normalize-product-image";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fetchImage(sourceUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        referer: new URL(sourceUrl).origin + "/",
      },
      cache: "force-cache",
    });
    if (!response.ok) throw new Error(`Image source returned ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error("Source is not an image");
    return Buffer.from(await response.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const requestedIndex = Number.parseInt(request.nextUrl.searchParams.get("index") ?? "0", 10);
  const shoe = getDemoShoe(slug);
  if (!shoe) return new Response("Unknown shoe", { status: 404 });

  const gallery = await resolveShoeGallery(shoe);
  if (gallery.length === 0) return new Response("No gallery images", { status: 404 });

  const index = Number.isFinite(requestedIndex) ? Math.max(0, Math.min(gallery.length - 1, requestedIndex)) : 0;
  const requested = gallery[index];

  // Product cards always request index 0. If the preferred side image dies at
  // the upstream CDN, try the shoe's other already-filtered clean images rather
  // than leaving the card blank. Detail-page angles stay angle-specific so a
  // failed top/outsole image disappears instead of being mislabeled.
  const candidates = index === 0
    ? [requested, ...gallery.filter((_, itemIndex) => itemIndex !== index)]
    : [requested, ...gallery.filter((image, itemIndex) => itemIndex !== index && image.label === requested.label)];

  for (const image of candidates) {
    try {
      const input = await fetchImage(image.url);
      const normalized = await normalizeProductImage(input, image.label);
      const canvas = await ensureProductCanvas(normalized);
      return new Response(new Uint8Array(canvas), {
        status: 200,
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("Resolved gallery image failed", slug, image.url, error);
    }
  }

  return new Response("Unable to load requested gallery image", { status: 502 });
}
