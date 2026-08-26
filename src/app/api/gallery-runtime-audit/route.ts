import { NextRequest, NextResponse } from "next/server";
import { GET as resolveVerifiedImage } from "@/app/api/verified-shoe-image/route";
import { demoShoes } from "@/lib/data/catalog";
import { hasVerifiedCompleteGallery } from "@/lib/data/verified-complete-galleries";
import type { DemoShoe } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type AuditRow = {
  slug: string;
  brand: string;
  model: string;
  ok: boolean;
  status: number;
  mode: string;
  contentType?: string;
  verifiedView?: string | null;
  family?: string | null;
  source?: string | null;
};

async function auditShoe(shoe: DemoShoe, origin: string): Promise<AuditRow> {
  if (hasVerifiedCompleteGallery(shoe.slug)) {
    return { slug: shoe.slug, brand: shoe.brand, model: shoe.model, ok: true, status: 200, mode: "curated" };
  }

  const side = shoe.images.find((image) => image.label === "Side");
  if (!side?.url.startsWith("/api/verified-shoe-image?")) {
    return { slug: shoe.slug, brand: shoe.brand, model: shoe.model, ok: false, status: 0, mode: "invalid-route" };
  }

  try {
    const target = new URL(side.url, origin);
    const response = await resolveVerifiedImage(new NextRequest(target, {
      headers: { "x-runned-runtime-audit": "1" },
    }));
    const contentType = response.headers.get("content-type") ?? "";
    const verifiedView = response.headers.get("x-runned-image-view");
    const family = response.headers.get("x-runned-image-family");
    const galleryVerified = response.headers.get("x-runned-gallery-verified") === "true";
    const verification = response.headers.get("x-runned-gallery-verification");
    const ok =
      response.ok &&
      contentType.startsWith("image/png") &&
      verifiedView === "Side" &&
      Boolean(family) &&
      galleryVerified &&
      verification === "metadata-all-three";

    return {
      slug: shoe.slug,
      brand: shoe.brand,
      model: shoe.model,
      ok,
      status: response.status,
      mode: ok ? "verified-three-view" : "verification-rejected",
      contentType,
      verifiedView,
      family,
      source: response.headers.get("x-runned-gallery-page"),
    };
  } catch {
    return { slug: shoe.slug, brand: shoe.brand, model: shoe.model, ok: false, status: 0, mode: "verification-error" };
  }
}

async function auditWithConcurrency(batch: DemoShoe[], origin: string, concurrency = 3) {
  const rows: AuditRow[] = new Array(batch.length);
  let next = 0;
  async function worker() {
    while (true) {
      const index = next++;
      if (index >= batch.length) return;
      rows[index] = await auditShoe(batch[index], origin);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, batch.length) }, () => worker()));
  return rows;
}

export async function GET(request: NextRequest) {
  const hasPagination = request.nextUrl.searchParams.has("offset") || request.nextUrl.searchParams.has("limit");
  const offset = hasPagination ? Math.max(0, Number.parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10) || 0) : 0;
  const requestedLimit = hasPagination ? Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "5", 10) || 5 : demoShoes.length;
  const limit = hasPagination ? Math.max(1, Math.min(5, requestedLimit)) : demoShoes.length;
  const batch = demoShoes.slice(offset, offset + limit);
  const rows = await auditWithConcurrency(batch, request.nextUrl.origin, hasPagination ? 2 : 3);

  return NextResponse.json({
    total: demoShoes.length,
    offset,
    limit,
    nextOffset: offset + rows.length < demoShoes.length ? offset + rows.length : null,
    passing: rows.filter((row) => row.ok).length,
    failing: rows.filter((row) => !row.ok).length,
    failures: rows.filter((row) => !row.ok),
    rows,
  });
}
