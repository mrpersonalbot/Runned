import type { DemoShoe, ShoeImageView } from "@/lib/types";
import { hasVerifiedCompleteGallery } from "@/lib/data/verified-complete-galleries";
import { gallerySourceFor } from "@/lib/data/shoe-gallery-source-overrides";

const required = ["Side", "Top", "Outsole"] as const;

function firstExternalImage(images: ShoeImageView[]) {
  return images.find((image) => /^https?:\/\//i.test(image.url))?.url ?? "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fleetFeetSource(shoe: DemoShoe) {
  const brand = shoe.brand.toLowerCase();
  const supported = new Set([
    "adidas",
    "nike",
    "asics",
    "hoka",
    "new balance",
    "puma",
    "saucony",
    "brooks",
    "on",
    "mizuno",
    "skechers",
  ]);
  if (!supported.has(brand)) return null;

  const brandSlug = slugify(shoe.brand);
  const modelSlug = slugify(shoe.model);

  // Fleet Feet retained the old HOKA ONE ONE naming on a few archived pages.
  if (brand === "hoka" && /^clifton 9$/i.test(shoe.model)) {
    return "https://www.fleetfeet.com/products/mens-hoka-one-one-clifton-9";
  }

  return `https://www.fleetfeet.com/products/mens-${brandSlug}-${modelSlug}`;
}

function resolvedUrl(shoe: DemoShoe, view: (typeof required)[number], seed: string) {
  const params = new URLSearchParams({ brand: shoe.brand, model: shoe.model, view, v: "6" });
  const source = gallerySourceFor(shoe.slug) ?? shoe.sourceUrl ?? fleetFeetSource(shoe);
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
