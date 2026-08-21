import type { DemoShoe } from "@/lib/types";
import { brandDirectory, demoShoes as baseShoes, localBrands } from "@/lib/data/demo-shoes";
import { extraCatalog, extraPrices, extraProductSpecs, extraRetailPrices, extraShoeImages } from "@/lib/data/catalog-additions";
import { moreCatalog, morePrices, moreProductSpecs, moreRetailPrices, moreShoeImages } from "@/lib/data/catalog-additions-2";
import {
  localExpansionCatalog,
  localExpansionPrices,
  localExpansionProductSpecs,
  localExpansionRetailPrices,
  localExpansionShoeImages,
} from "@/lib/data/catalog-additions-3";
import { catalogExpansion4 } from "@/lib/data/catalog-additions-4";
import { catalogExpansion5 } from "@/lib/data/catalog-additions-5";
import { canonicalImagesFor } from "@/lib/data/canonical-shoe-images";
import { galleryFixes } from "@/lib/data/gallery-fixes";

const demoCommunity = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };

const useCasesFor = (category: DemoShoe["category"], terrain: DemoShoe["terrain"]) => {
  if (terrain === "trail") return category === "race" ? ["Trail race"] : ["Trail", "Long run"];
  if (category === "race") return ["Race"];
  if (category === "tempo" || category === "speed") return ["Tempo", "Daily"];
  if (category === "max-cushion") return ["Easy", "Long run"];
  if (category === "stability") return ["Daily", "Easy", "Support"];
  return ["Daily", "Easy"];
};

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
    useCases: useCasesFor(category, "road"),
    accent: ["from-stone-200 to-stone-100", "from-zinc-200 to-zinc-100"][index % 2],
    images: extraShoeImages[slug] ?? [],
    isLocalIndonesia: Boolean(local),
  };
});

const moreShoes: DemoShoe[] = moreCatalog.map(([slug, brand, model, category, terrain], index) => {
  const currentPrice = morePrices[slug] ?? null;
  const specs = moreProductSpecs[slug];
  const price = moreRetailPrices[slug] ?? null;
  return {
    slug,
    brand,
    model,
    category,
    terrain,
    msrpIdr: price,
    currentPrice,
    ...specs,
    sourceStatus: currentPrice ? "verified" : "catalog-only",
    sourceLabel: currentPrice?.sourceLabel ?? "Catalog entry",
    sourceUrl: currentPrice?.sourceUrl ?? null,
    description: `${model} is part of Runned's curated catalog of current running shoes, with Indonesian retail pricing and key product specifications.`,
    community: demoCommunity,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: useCasesFor(category, terrain),
    accent: ["from-stone-200 to-stone-100", "from-zinc-200 to-zinc-100"][index % 2],
    images: moreShoeImages[slug] ?? [],
    isLocalIndonesia: false,
  };
});

const localExpansionShoes: DemoShoe[] = localExpansionCatalog.map(([slug, brand, model, category, terrain, local], index) => {
  const currentPrice = localExpansionPrices[slug] ?? null;
  const specs = localExpansionProductSpecs[slug];
  const price = localExpansionRetailPrices[slug] ?? null;
  return {
    slug,
    brand,
    model,
    category,
    terrain,
    msrpIdr: price,
    currentPrice,
    ...specs,
    sourceStatus: currentPrice ? "verified" : "catalog-only",
    sourceLabel: currentPrice?.sourceLabel ?? "Catalog entry",
    sourceUrl: currentPrice?.sourceUrl ?? null,
    description: `${model} is part of Runned's Indonesia-focused catalog expansion, with current local pricing and only source-backed specifications.`,
    community: demoCommunity,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: useCasesFor(category, terrain),
    accent: ["from-stone-200 to-stone-100", "from-zinc-200 to-zinc-100"][index % 2],
    images: localExpansionShoeImages[slug] ?? [],
    isLocalIndonesia: Boolean(local),
  };
});

const allShoes = [
  ...baseShoes,
  ...extras,
  ...moreShoes,
  ...localExpansionShoes,
  ...catalogExpansion4,
  ...catalogExpansion5,
];

export const demoShoes: DemoShoe[] = allShoes.map((shoe) => ({
  ...shoe,
  images: galleryFixes[shoe.slug] ?? canonicalImagesFor(shoe.slug, shoe.images),
}));

export { brandDirectory, localBrands };
export function getDemoShoe(slug: string) { return demoShoes.find((shoe) => shoe.slug === slug); }
