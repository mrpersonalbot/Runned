import type { DemoShoe, ShoeImageView } from "@/lib/types";

const required = ["Side", "Top", "Outsole"] as const;

function isCompliant(images: ShoeImageView[]) {
  if (images.length !== 3 || new Set(images.map((image) => image.url)).size !== 3) return false;
  return required.every((label) => images.filter((image) => image.label === label).length === 1);
}

function resolvedUrl(shoe: DemoShoe, view: (typeof required)[number]) {
  const params = new URLSearchParams({ brand: shoe.brand, model: shoe.model, view, v: "2" });
  if (shoe.sourceUrl && /^https?:\/\//i.test(shoe.sourceUrl)) params.set("source", shoe.sourceUrl);
  return `/api/legacy-shoe-image?${params.toString()}`;
}

export function completeThreeViewGallery(shoe: DemoShoe, images: ShoeImageView[]): ShoeImageView[] {
  if (isCompliant(images)) return images;
  return required.map((label) => ({ label, url: resolvedUrl(shoe, label) }));
}
