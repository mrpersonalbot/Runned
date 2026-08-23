import { NextRequest, NextResponse } from "next/server";
import { demoShoes } from "@/lib/data/catalog";
import { hasVerifiedCompleteGallery } from "@/lib/data/verified-complete-galleries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const offset = Math.max(0, Number.parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10) || 0);
  const requestedLimit = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "8", 10) || 8;
  const limit = Math.max(1, Math.min(10, requestedLimit));
  const batch = demoShoes.slice(offset, offset + limit);

  const rows = await Promise.all(batch.map(async (shoe) => {
    if (hasVerifiedCompleteGallery(shoe.slug)) {
      return { slug: shoe.slug, brand: shoe.brand, model: shoe.model, ok: true, status: 200, mode: "curated" };
    }

    const side = shoe.images.find((image) => image.label === "Side");
    if (!side?.url.startsWith("/api/strict-shoe-image?")) {
      return { slug: shoe.slug, brand: shoe.brand, model: shoe.model, ok: false, status: 0, mode: "invalid-route" };
    }

    try {
      const target = new URL(side.url, request.nextUrl.origin);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);
      try {
        const response = await fetch(target, {
          signal: controller.signal,
          cache: "no-store",
          headers: { "x-runned-runtime-audit": "1" },
        });
        return {
          slug: shoe.slug,
          brand: shoe.brand,
          model: shoe.model,
          ok: response.ok,
          status: response.status,
          mode: response.ok ? "strict-resolved" : "strict-rejected",
          family: response.headers.get("x-runned-image-family"),
          source: response.headers.get("x-runned-gallery-page"),
        };
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      return { slug: shoe.slug, brand: shoe.brand, model: shoe.model, ok: false, status: 0, mode: "strict-error" };
    }
  }));

  return NextResponse.json({
    total: demoShoes.length,
    offset,
    limit,
    nextOffset: offset + rows.length < demoShoes.length ? offset + rows.length : null,
    passing: rows.filter((row) => row.ok).length,
    failing: rows.filter((row) => !row.ok).length,
    rows,
  });
}
