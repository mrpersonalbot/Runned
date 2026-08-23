import type { DemoShoe, ShoeImageView } from "@/lib/types";
import { hasVerifiedCompleteGallery } from "@/lib/data/verified-complete-galleries";
import { gallerySourceFor } from "@/lib/data/shoe-gallery-source-overrides";

const required = ["Side", "Top", "Outsole"] as const;

function firstExternalImage(images: ShoeImageView[]) {
  return images.find((image) => /^https?:\/\//i.test(image.url))?.url ?? "";
}

function resolvedUrl(shoe: DemoShoe, view: (typeof required)[number], seed: string) {
  const params = new URLSearchParams({ brand: shoe.brand, model: shoe.model, view, v: "5" });
  const source = gallerySourceFor(shoe.slug) ?? shoe.sourceUrl;
  if (source && /^https?:\/\//i.test(source)) params.set("source", source);
  if (seed) params.set("seed", seed);
  return `/api/strict-shoe-image?${params.toString()}`;
}

export function completeThreeViewGallery(shoe: DemoShoe, images: ShoeImageView[]): ShoeImageView[] {
  // Only manually verified galleries bypass the strict resolver. Every other
  // gallery must prove Side + Top + Outsole from one image family at runtime.
  if (hasVerifiedCompleteGallery(shoe.slug)) return images;

  const seed = firstExternalImage(images);
  return required.map((label) => ({ label, url: resolvedUrl(shoe, label, seed) }));
}
