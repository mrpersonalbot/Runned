import { NextRequest } from "next/server";
import { demoShoes } from "@/lib/data/catalog";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function imageResponds(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        referer: new URL(url).origin + "/",
        range: "bytes=0-65535",
      },
      cache: "force-cache",
    });
    const contentType = response.headers.get("content-type") ?? "";
    await response.body?.cancel();
    return response.ok && contentType.startsWith("image/");
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const offset = Math.max(0, Number.parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.max(1, Math.min(15, Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "10", 10) || 10));
  const slice = demoShoes.slice(offset, offset + limit);

  const results = await Promise.all(slice.map(async (shoe) => {
    const images = await resolveShoeGallery(shoe);
    const checks = await Promise.all(images.slice(0, 3).map(async (image) => ({
      label: image.label,
      url: image.url,
      available: await imageResponds(image.url),
    })));
    return {
      slug: shoe.slug,
      brand: shoe.brand,
      model: shoe.model,
      count: images.length,
      healthy: images.length >= 3 && checks.length >= 3 && checks.every((image) => image.available),
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
