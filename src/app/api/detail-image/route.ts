import { NextRequest } from "next/server";
import { demoShoes } from "@/lib/data/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedUrls = new Set(
  demoShoes.flatMap((shoe) => (shoe.detailImages ?? []).map((image) => image.url)),
);

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get("url");
  if (!sourceUrl || !allowedUrls.has(sourceUrl)) {
    return new Response("Unknown detail image", { status: 404 });
  }

  if (!/^https?:\/\//i.test(sourceUrl)) {
    return Response.redirect(new URL(sourceUrl, request.nextUrl.origin));
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });
    clearTimeout(timeout);

    if (!response.ok) return new Response("Detail image source unavailable", { status: 502 });
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return new Response("Source is not an image", { status: 502 });

    const body = await response.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Detail image proxy failed", sourceUrl, error);
    return new Response("Unable to load detail image", { status: 502 });
  }
}
