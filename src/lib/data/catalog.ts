import type { DemoShoe } from "@/lib/types";
import { brandDirectory, demoShoes as baseShoes, localBrands } from "@/lib/data/demo-shoes";
import { extraCatalog, extraPrices, extraProductSpecs, extraRetailPrices, extraShoeImages } from "@/lib/data/catalog-additions";

const demoCommunity = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };

const extras: DemoShoe[] = extraCatalog.map(([slug, brand, model, category, local], index) => {
  const currentPrice = extraPrices[slug] ?? null;
  const specs = extraProductSpecs[slug];
  const price = extraRetailPrices[slug] ?? null;
  return {
    slug,
    brand,
    model,
    category,
    terrain: "road",
    msrpIdr: price,
    currentPrice,
    ...specs,
    sourceStatus: currentPrice ? "verified" : "catalog-only",
    sourceLabel: currentPrice?.sourceLabel ?? "Catalog entry",
    sourceUrl: currentPrice?.sourceUrl ?? null,
    description: `${model} is part of Runned's curated catalog of current high-signal running shoes.`,
    community: demoCommunity,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: category === "race" ? ["Race"] : category === "tempo" ? ["Tempo", "Daily"] : category === "max-cushion" ? ["Easy", "Long run"] : ["Daily", "Easy"],
    accent: ["from-stone-200 to-stone-100", "from-zinc-200 to-zinc-100"][index % 2],
    images: extraShoeImages[slug] ?? [],
    isLocalIndonesia: Boolean(local),
  };
});

export const demoShoes: DemoShoe[] = [...baseShoes, ...extras];
export { brandDirectory, localBrands };
export function getDemoShoe(slug: string) { return demoShoes.find((shoe) => shoe.slug === slug); }
