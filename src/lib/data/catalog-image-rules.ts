import type { DemoShoe } from "@/lib/types";
import { hasVerifiedCompleteGallery } from "@/lib/data/verified-complete-galleries";

const required = ["Side", "Top", "Outsole"] as const;

export function assertCatalogImageRules(shoes: DemoShoe[]) {
  const failures: string[] = [];

  for (const shoe of shoes) {
    const labels = shoe.images.map((image) => image.label);
    const urls = shoe.images.map((image) => image.url);
    const validLabels = required.every((label) => labels.filter((value) => value === label).length === 1);
    const uniqueUrls = new Set(urls).size === urls.length;
    if (shoe.images.length !== 3 || !validLabels || !uniqueUrls) {
      failures.push(`${shoe.slug}[count=${shoe.images.length};labels=${labels.join(",")};unique=${uniqueUrls}]`);
      continue;
    }

    const dynamic = shoe.images.every((image) => image.url.startsWith("/api/legacy-shoe-image?"));
    if (!dynamic) {
      if (!hasVerifiedCompleteGallery(shoe.slug)) failures.push(`${shoe.slug}[unverified-static-gallery]`);
      continue;
    }

    const families = shoe.images.map((image) => {
      const params = new URLSearchParams(image.url.split("?")[1] ?? "");
      return [
        params.get("brand") ?? "",
        params.get("model") ?? "",
        params.get("source") ?? "",
        params.get("seed") ?? "",
        params.get("v") ?? "",
      ].join("|");
    });
    if (new Set(families).size !== 1) failures.push(`${shoe.slug}[dynamic-family-mismatch]`);

    for (const image of shoe.images) {
      const params = new URLSearchParams(image.url.split("?")[1] ?? "");
      if (params.get("v") !== "4") failures.push(`${shoe.slug}[stale-resolver-version]`);
      if (params.get("brand") !== shoe.brand || params.get("model") !== shoe.model) failures.push(`${shoe.slug}[resolver-model-mismatch]`);
      if (params.get("view") !== image.label) failures.push(`${shoe.slug}[resolver-view-mismatch:${image.label}]`);
    }
  }

  if (failures.length) {
    throw new Error(`Image rules failed for ${failures.length} checks: ${failures.join(" | ")}`);
  }
}
