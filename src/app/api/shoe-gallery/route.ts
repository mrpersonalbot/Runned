import { NextRequest } from "next/server";
import { getDemoShoe } from "@/lib/data/catalog";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const shoe = getDemoShoe(slug);
  if (!shoe) return Response.json({ images: [] }, { status: 404 });

  const gallery = await resolveShoeGallery(shoe);
  return Response.json({
    images: gallery.map((image, index) => ({
      label: image.label,
      url: `/api/shoe-gallery-image?slug=${encodeURIComponent(slug)}&index=${index}&v=1`,
    })),
  }, {
    headers: { "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
