import type { DemoShoe, ShoeImageView } from "@/lib/types";
import { hasVerifiedCompleteGallery } from "@/lib/data/verified-complete-galleries";

const required = ["Side", "Top", "Outsole"] as const;

function firstExternalImage(images: ShoeImageView[]) {
  return images.find((image) => /^https?:\/\//i.test(image.url))?.url ?? "";
}

function resolvedUrl(shoe: DemoShoe, view: (typeof required)[number], seed: string) {
  const params = new URLSearchParams({ brand: shoe.brand, model: shoe.model, view, v: "4" });
  if (shoe.sourceUrl && /^https?:\/\//i.test(shoe.sourceUrl)) params.set("source", shoe.sourceUrl);
  if (seed) params.set("seed", seed);
  return `/api/legacy-shoe-image?${params.toString()}`;
}

export function completeThreeViewGallery(shoe: DemoShoe, images: ShoeImageView[]): ShoeImageView[] {
  // Only explicitly curated galleries bypass the resolver. Structural labels alone
  // are not enough: mixed colorways and wrong angles previously slipped through.
  if (hasVerifiedCompleteGallery(shoe.slug)) return images;

  const seed = firstExternalImage(images);
  return required.map((label) => ({ label, url: resolvedUrl(shoe, label, seed) }));
}
