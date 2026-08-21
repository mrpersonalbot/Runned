import { NextRequest } from "next/server";
import { demoShoes } from "@/lib/data/catalog";
import { normalizeProductImage } from "@/lib/images/normalize-product-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedUrls = new Set(
  demoShoes.flatMap((shoe) => shoe.images.map((image) => image.url)),
);

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
  const sourceUrl = request.nextUrl.searchParams.get("url");
  if (!sourceUrl || !allowedUrls.has(sourceUrl)) {
    return new Response("Unknown product image", { status: 404 });
  }

  try {
    const input = await fetchImage(sourceUrl);
    const normalized = await normalizeProductImage(input);
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
