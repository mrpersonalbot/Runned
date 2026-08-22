import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";
import { getDemoShoe } from "@/lib/data/catalog";
import { galleryFixes } from "@/lib/data/gallery-fixes";
import { ensureProductCanvas } from "@/lib/images/ensure-product-canvas";
import { normalizeProductImage } from "@/lib/images/normalize-product-image";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";
import type { ShoeImageView } from "@/lib/types";

export const runtime = "nodejs";

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

const getCachedResolvedGallery = unstable_cache(
  async (slug: string) => {
    const shoe = getDemoShoe(slug);
    if (!shoe) return [] as ShoeImageView[];
    return resolveShoeGallery(shoe);
  },
  ["runned-resolved-gallery-v6"],
  { revalidate: 86_400 },
);

const getCachedProcessedImage = unstable_cache(
  async (sourceUrl: string, label: ShoeImageView["label"]) => {
    const input = await fetchImage(sourceUrl);
    const normalized = await normalizeProductImage(input, label);
    const canvas = await ensureProductCanvas(normalized);
    return canvas.toString("base64");
  },
  ["runned-gallery-image-v6"],
  { revalidate: 31_536_000 },
);

function fastCardCandidates(slug: string) {
  const shoe = getDemoShoe(slug);
  if (!shoe) return [] as ShoeImageView[];
  const fixed = galleryFixes[slug] ?? [];
  const combined = [...fixed, ...shoe.images];
  const seen = new Set<string>();
  return combined.filter((image) => {
    if (!image?.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const requestedIndex = Number.parseInt(request.nextUrl.searchParams.get("index") ?? "0", 10);
  const shoe = getDemoShoe(slug);
  if (!shoe) return new Response("Unknown shoe", { status: 404 });

  const normalizedIndex = Number.isFinite(requestedIndex) ? Math.max(0, requestedIndex) : 0;

  let gallery: ShoeImageView[];
  if (normalizedIndex === 0) {
    gallery = fastCardCandidates(slug);
  } else {
    gallery = await getCachedResolvedGallery(slug);
  }

  if (gallery.length === 0) return new Response("No gallery images", { status: 404 });

  const index = Math.min(gallery.length - 1, normalizedIndex);
  const requested = gallery[index];
  const candidates = index === 0
    ? [requested, ...gallery.filter((_, itemIndex) => itemIndex !== index)]
    : [requested, ...gallery.filter((image, itemIndex) => itemIndex !== index && image.label === requested.label)];

  for (const image of candidates) {
    try {
      const encoded = await getCachedProcessedImage(image.url, image.label);
      const canvas = Buffer.from(encoded, "base64");
      return new Response(new Uint8Array(canvas), {
        status: 200,
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800, immutable",
          "cdn-cache-control": "public, max-age=31536000, stale-while-revalidate=604800",
          "vercel-cdn-cache-control": "public, max-age=31536000, stale-while-revalidate=604800",
        },
      });
    } catch (error) {
      console.error("Resolved gallery image failed", slug, image.url, error);
    }
  }

  return new Response("Unable to load requested gallery image", { status: 502 });
}
