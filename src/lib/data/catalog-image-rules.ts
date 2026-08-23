import type { DemoShoe } from "@/lib/types";

const required = ["Side", "Top", "Outsole"] as const;

export function assertCatalogImageRules(shoes: DemoShoe[]) {
  for (const shoe of shoes) {
    const labels = shoe.images.map((image) => image.label);
    const urls = shoe.images.map((image) => image.url);
    const validLabels = required.every((label) => labels.filter((value) => value === label).length === 1);
    const uniqueUrls = new Set(urls).size === urls.length;
    if (shoe.images.length !== 3 || !validLabels || !uniqueUrls) {
      throw new Error(`Image rules failed for ${shoe.slug}: expected exactly Side, Top, Outsole with unique URLs`);
    }

    const historical = shoe.images.every((image) => image.url.startsWith("/api/legacy-shoe-image?"));
    if (!historical) continue;

    const families = shoe.images.map((image) => {
      const params = new URLSearchParams(image.url.split("?")[1] ?? "");
      return `${params.get("brand") ?? ""}|${params.get("model") ?? ""}|${params.get("source") ?? ""}`;
    });
    if (new Set(families).size !== 1) {
      throw new Error(`Historical image family mismatch for ${shoe.slug}`);
    }
  }
}
