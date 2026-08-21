import type { DemoShoe, PriceSnapshot, ShoeCategory, ShoeImageView, Terrain } from "@/lib/types";

const observedAt = "2026-08-21";
const community = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };

type Seed = {
  slug: string;
  brand: string;
  model: string;
  category: ShoeCategory;
  terrain: Terrain;
  retail: number | null;
  current: number | null;
  sourceLabel: string;
  sourceUrl: string;
  sourceType: PriceSnapshot["sourceType"];
  image: string;
  weightG: number | null;
  dropMm: number | null;
  heelStackMm: number | null;
  forefootStackMm: number | null;
  midsole: string | null;
  plate: string | null;
};

const seeds: Seed[] = [
  {
    slug: "nike-acg-zegama-trail", brand: "Nike", model: "ACG Zegama Trail", category: "trail", terrain: "trail",
    retail: 2699000, current: 2699000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/acg-zegama-trail-trail-running-shoes-45IgRhjL/HV8113-103", sourceType: "official-brand",
    image: "https://cdn.media.amplience.net/i/sportinglife/25926448_SUMMIT-WHITE-BLACK-PHANTOM-SAFETY-ORANGE_0/Mens-ACG-Zegama-Trail-Running-Shoe-SUMMIT-WHITE-BLACK-PHANTOM-SAFETY-ORANGE?$default$=&fmt=auto&h=1080&w=1080",
    weightG: 338, dropMm: 4, heelStackMm: null, forefootStackMm: null, midsole: "ZoomX + Cushlon 3.0", plate: "None",
  },
  {
    slug: "nike-acg-ultrafly-trail", brand: "Nike", model: "ACG Ultrafly Trail", category: "race", terrain: "trail",
    retail: 3889000, current: 3889000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/acg-ultrafly-trail-racing-shoes-lnyZAtQW/HF5668-101", sourceType: "official-brand",
    image: "https://image.sneakerwars.jp/images/29614/larges/nike-acg-ultrafly-trail-sail-white-safety-orange-black-hf5668-101_05.webp",
    weightG: 287, dropMm: 8.5, heelStackMm: null, forefootStackMm: null, midsole: "ZoomX", plate: "Full-length carbon-fibre Flyplate",
  },
  {
    slug: "hoka-cielo-x1-2", brand: "HOKA", model: "Cielo X1 2.0", category: "race", terrain: "road",
    retail: 4799000, current: 2399000, sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/HKE1162053FLCK/sepatu-lari-mens-hoka-one-one-cielo-x1-20", sourceType: "retailer",
    image: "https://cdn.sportshop.com/catalog/product/1500/1500/2/1/212562_1.jpg?v=a58613faa4000789",
    weightG: 210, dropMm: 7, heelStackMm: 46, forefootStackMm: 39, midsole: "Dual-density PEBA", plate: "Carbon-fibre plate",
  },
  {
    slug: "hoka-skyward-x", brand: "HOKA", model: "Skyward X", category: "max-cushion", terrain: "road",
    retail: 3999000, current: 2399400, sourceLabel: "Indonesia marketplace", sourceUrl: "https://shopee.co.id/HOKA-SKYWARD-X-ART-1147912-LCC-SEPATU-LARI-RUNNING-CUSHION-ORIGINAL-CARBON-PLATE-i.123801545.44014211004", sourceType: "retailer",
    image: "https://runpacers.com/cdn/shop/files/Mens-HOKA-ONE-ONE-Skyward-X-Blanc-De-Blanc-Virtual-Blue_1b3d163f-6851-4a57-96c4-c5ded1a104d1.jpg?v=1738019699",
    weightG: 320, dropMm: 5, heelStackMm: 48, forefootStackMm: 43, midsole: "PEBA foam + supercritical EVA frame", plate: "Convex carbon-fibre plate",
  },
  {
    slug: "hoka-mafate-x", brand: "HOKA", model: "Mafate X", category: "trail", terrain: "trail",
    retail: 4299000, current: 4299000, sourceLabel: "Planet Sports Indonesia", sourceUrl: "https://www.planetsports.asia/mafate-x-women-s-running-shoes-feldspar-mountain-fog-9.html", sourceType: "retailer",
    image: "https://cdn.fleetfeet.com/a%3A1.5-f%3Acover-w%3A1200/products/1161990-ZTM_1-copy.jpg?s=b3504407",
    weightG: 343, dropMm: 8, heelStackMm: 49, forefootStackMm: 41, midsole: "PEBA core + supercritical EVA carrier", plate: "Forked carbon-fibre plate",
  },
  {
    slug: "hoka-challenger-8", brand: "HOKA", model: "Challenger 8", category: "trail", terrain: "mixed",
    retail: 2899000, current: 2899000, sourceLabel: "Indonesia retail", sourceUrl: "https://www.blibli.com/p/sepatu-pria-hoka-challenger-8-men-s-jade-truffle-salt-1168716jd-original/ps--48S-70000-04742", sourceType: "retailer",
    image: "https://cdn.sportsshoes.com/product/H/HOK3313/HOK3313_400_1.jpg",
    weightG: 287, dropMm: 8, heelStackMm: null, forefootStackMm: null, midsole: "Compression-moulded EVA", plate: "None",
  },
  {
    slug: "asics-gel-kayano-33", brand: "ASICS", model: "GEL-KAYANO 33", category: "stability", terrain: "road",
    retail: 2699000, current: 2699000, sourceLabel: "ASICS Indonesia", sourceUrl: "https://www.asics.com/us/en-us/gel-kayano-33/p/ANA_1011C167-002.html", sourceType: "official-brand",
    image: "https://www.holabirdsports.com/cdn/shop/files/044975_3_800x.jpg?v=1779995456",
    weightG: 298, dropMm: 8, heelStackMm: 39, forefootStackMm: 31, midsole: "FF BLAST PLUS + FF BLAST MAX + PureGEL", plate: "FLUIDSUPPORT stability system",
  },
  {
    slug: "asics-gt-2000-14", brand: "ASICS", model: "GT-2000 14", category: "stability", terrain: "road",
    retail: 2099000, current: 2099000, sourceLabel: "ASICS Indonesia", sourceUrl: "https://asics.co.id/running/sepatu-stability/gt-2000-14", sourceType: "official-brand",
    image: "https://store.runtrip.jp/cdn/shop/files/1011C056_400_07_800x.jpg?v=1754360907",
    weightG: 270, dropMm: 8, heelStackMm: null, forefootStackMm: null, midsole: "FF BLAST MAX", plate: "3D GUIDANCE SYSTEM",
  },
  {
    slug: "asics-gel-cumulus-27", brand: "ASICS", model: "GEL-CUMULUS 27", category: "daily", terrain: "road",
    retail: 1999000, current: 1999000, sourceLabel: "ASICS Indonesia", sourceUrl: "https://asics.co.id/running/cushion-shoes/gel-cumulus-27", sourceType: "official-brand",
    image: "https://www.bfgcdn.com/1500_1500_90/023-2225-0111/asics-gel-cumulus-27-hardloopschoenen.jpg",
    weightG: 265, dropMm: 8, heelStackMm: null, forefootStackMm: null, midsole: "FF BLAST PLUS + PureGEL", plate: "None",
  },
  {
    slug: "puma-magnify-nitro-3", brand: "Puma", model: "Magnify NITRO 3", category: "max-cushion", terrain: "road",
    retail: 2299000, current: 2069100, sourceLabel: "Indonesia retail", sourceUrl: "https://www.blibli.com/p/puma-magnify-nitro-3-running-shoes-men-31104607-254/ps--ARO-60057-07550", sourceType: "retailer",
    image: "https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_1000%2Ch_1000/global/311046/01/sv01/fnd/AUS/fmt/png/Magnify-NITRO%E2%84%A2-3-Men%27s-Running-Shoes",
    weightG: 299, dropMm: 10, heelStackMm: null, forefootStackMm: null, midsole: "NITROFOAM", plate: "None",
  },
  {
    slug: "saucony-xodus-ultra-4", brand: "Saucony", model: "Xodus Ultra 4", category: "trail", terrain: "trail",
    retail: null, current: null, sourceLabel: "Saucony", sourceUrl: "https://www.saucony.com/en/xodus-ultra-4/60330M.html?dwvar_60330M_color=S21032-140", sourceType: "official-brand",
    image: "https://therunnersshop.com.au/cdn/shop/files/S21032-140_1_1024x1024%402x.jpg?v=1772683988",
    weightG: 309, dropMm: 6, heelStackMm: null, forefootStackMm: null, midsole: "PWRRUN PB + PWRRUN", plate: "None",
  },
];

function useCases(category: ShoeCategory, terrain: Terrain) {
  if (terrain === "trail") return category === "race" ? ["Trail race"] : ["Trail", "Long run"];
  if (terrain === "mixed") return ["Road", "Trail"];
  if (category === "race") return ["Race"];
  if (category === "max-cushion") return ["Easy", "Long run"];
  if (category === "stability") return ["Daily", "Easy", "Support"];
  return ["Daily", "Easy"];
}

export const catalogExpansion5: DemoShoe[] = seeds.map((seed, index) => {
  const currentPrice: PriceSnapshot | null = seed.current == null ? null : {
    priceIdr: seed.current,
    listPriceIdr: seed.retail,
    sourceLabel: seed.sourceLabel,
    sourceUrl: seed.sourceUrl,
    sourceType: seed.sourceType,
    observedAt,
    inStock: true,
  };
  const images: ShoeImageView[] = [{ label: "Side", url: seed.image }];
  return {
    slug: seed.slug,
    brand: seed.brand,
    model: seed.model,
    category: seed.category,
    terrain: seed.terrain,
    msrpIdr: seed.retail,
    currentPrice,
    weightG: seed.weightG,
    dropMm: seed.dropMm,
    heelStackMm: seed.heelStackMm,
    forefootStackMm: seed.forefootStackMm,
    midsole: seed.midsole,
    plate: seed.plate,
    sourceStatus: currentPrice ? "verified" : "catalog-only",
    sourceLabel: seed.sourceLabel,
    sourceUrl: seed.sourceUrl,
    description: `${seed.model} is part of Runned's expanded current running-shoe catalog.`,
    community,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: useCases(seed.category, seed.terrain),
    accent: index % 2 ? "from-stone-200 to-stone-100" : "from-zinc-200 to-zinc-100",
    images,
    isLocalIndonesia: false,
  };
});
