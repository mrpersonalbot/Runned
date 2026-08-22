import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";
import { getDemoShoe } from "@/lib/data/catalog";
import { resolveShoeGallery } from "@/lib/images/resolve-shoe-gallery";

export const runtime = "nodejs";

const getCachedGallery = unstable_cache(
  async (slug: string) => {
    const shoe = getDemoShoe(slug);
    if (!shoe) return [];
    return resolveShoeGallery(shoe);
  },
  ["runned-gallery-json-v5"],
  { revalidate: 86_400 },
);

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const shoe = getDemoShoe(slug);
  if (!shoe) return Response.json({ images: [] }, { status: 404 });

  const gallery = await getCachedGallery(slug);
  return Response.json({
    images: gallery.map((image, index) => ({
      label: image.label,
      url: `/api/shoe-gallery-image?slug=${encodeURIComponent(slug)}&index=${index}&v=5`,
    })),
  }, {
    headers: {
      "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "cdn-cache-control": "public, max-age=86400, stale-while-revalidate=604800",
      "vercel-cdn-cache-control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
