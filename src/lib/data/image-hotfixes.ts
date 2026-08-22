import type { ShoeImageView } from "@/lib/types";

const sideViewOverrides: Record<string, string> = {
  "ortuseight-hyperglide-3-1": "https://sportaways.com/storage/products/6185/sepatu-running-ortuseight-hyperglide-31-whitecyan-skmz-1.webp",
};

export function applyImageHotfixes(slug: string, images: ShoeImageView[]) {
  const sideUrl = sideViewOverrides[slug];
  if (!sideUrl) return images;

  const withoutSide = images.filter((image) => image.label !== "Side");
  return [{ label: "Side" as const, url: sideUrl }, ...withoutSide];
}
