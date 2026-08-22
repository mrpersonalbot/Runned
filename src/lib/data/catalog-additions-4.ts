import type { DemoShoe, PriceSnapshot, ShoeCategory, Terrain } from "@/lib/types";

const observedAt = "2026-08-22";
const demoCommunity = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };

type Entry = {
  slug: string;
  brand: string;
  model: string;
  category: ShoeCategory;
  terrain?: Terrain;
  msrp: number;
  current?: number;
  sourceLabel: string;
  sourceUrl: string;
  sourceType?: PriceSnapshot["sourceType"];
  image: string;
  weightG?: number | null;
  dropMm?: number | null;
  heelStackMm?: number | null;
  forefootStackMm?: number | null;
  midsole?: string | null;
  plate?: string | null;
  useCases: string[];
};

const entries: Entry[] = [
  {
    slug: "nike-structure-26", brand: "Nike", model: "Structure 26", category: "stability", msrp: 2099000,
    sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/nike-structure-26-uCYEZ9s4/HJ1102-100", sourceType: "official-brand",
    image: "https://www.paceathletic.com/cdn/shop/files/Mens-Nike-Structure-26-White_PurePlatinum_BarelyVolt_Black-HJ1102-100.jpg?v=1753362154&width=1701",
    weightG: 321, dropMm: 10, midsole: "ReactX", plate: "None", useCases: ["Daily", "Easy", "Support"],
  },
  {
    slug: "nike-vomero-plus", brand: "Nike", model: "Vomero Plus", category: "max-cushion", msrp: 2629000,
    sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/vomero-plus-road-running-shoes-sBieAqOJ/HV8150-102", sourceType: "official-brand",
    image: "https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwa583bdad/nk/bd2/a/e/4/3/b/bd2ae43b_34bd_47ae_9379_d7b4f52fd0e1.jpg",
    weightG: 292, dropMm: 10, midsole: "ZoomX", plate: "None", useCases: ["Easy", "Long run"],
  },
  {
    slug: "nike-pegasus-premium", brand: "Nike", model: "Pegasus Premium", category: "daily", msrp: 3299000,
    sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/pegasus-premium-mens-road-running-shoes-xzQQKz/HQ2592-701", sourceType: "official-brand",
    image: "https://runflagstaff.com/cdn/shop/files/d2ee7bd3AURORA_HQ2592-701_PHSRH000-2000.jpg?v=1772304507&width=1946",
    weightG: 325, dropMm: 10, midsole: "ZoomX + sculpted Air Zoom + ReactX", plate: "None", useCases: ["Daily", "Long run"],
  },
  {
    slug: "nike-vaporfly-4", brand: "Nike", model: "Vaporfly 4", category: "race", msrp: 3789000,
    sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/w/vaporfly-running-shoes-6ealhz8kwewzy7ok", sourceType: "official-brand",
    image: "https://www.achillesheel.co.uk/cdn/shop/files/Men_sVaporfly4RunningShoesVelvetBrown_Black_DesertOchre_SoftPearl4.jpg?v=1756743014&width=1567",
    weightG: 190, dropMm: 6, midsole: "ZoomX", plate: "Full-length carbon-fibre Flyplate", useCases: ["Race"],
  },

  {
    slug: "adidas-supernova-rise-3", brand: "adidas", model: "Supernova Rise 3", category: "daily", msrp: 2100000, current: 1470000,
    sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-running-supernova-rise-3/JR2280.html", sourceType: "official-brand",
    image: "https://statics.whentocop.fr/drops/18216/picture/000000_adidas-Supernova-Rise-3_CORE-BLACK-CLOUD-WHITE_JQ8502_img0-1000x1000.webp",
    weightG: 272, dropMm: 8, heelStackMm: 37, forefootStackMm: 29, midsole: "Dreamstrike+", plate: "None", useCases: ["Daily", "Easy"],
  },
  {
    slug: "adidas-supernova-prima-2", brand: "adidas", model: "Supernova Prima 2", category: "max-cushion", msrp: 2600000, current: 1300000,
    sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-supernova-prima-2/JR3195.html", sourceType: "official-brand",
    image: "https://www.holabirdsports.com/cdn/shop/files/043301_1.jpg?v=1749157957&width=2048",
    weightG: 283, dropMm: 8, heelStackMm: 39, forefootStackMm: 31, midsole: "Dreamstrike+", plate: "Support Rods", useCases: ["Easy", "Long run"],
  },
  {
    slug: "adidas-ultraboost-5", brand: "adidas", model: "Ultraboost 5", category: "daily", msrp: 3000000, current: 2700000,
    sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-ultraboost-5/JH9072.html", sourceType: "official-brand",
    image: "https://shopasf.com/cdn/shop/files/ID8813_1_FOOTWEAR_Photography_Side_Lateral_Center_View_transparent.png?v=1745335620&width=1920",
    weightG: 292, dropMm: 10, heelStackMm: 31, forefootStackMm: 21, midsole: "Light BOOST V2", plate: "Torsion system", useCases: ["Daily", "Easy"],
  },
  {
    slug: "adidas-hyperboost-edge", brand: "adidas", model: "Hyperboost Edge", category: "max-cushion", msrp: 3500000,
    sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-lari-hyperboost-edge/KI1913.html", sourceType: "official-brand",
    image: "https://www.carnivalbkk.com/media/catalog/product/k/i/ki1913.1.jpg",
    weightG: 255, dropMm: 6, heelStackMm: 45, forefootStackMm: 39, midsole: "Hyperboost Pro", plate: "None", useCases: ["Easy", "Long run"],
  },

  {
    slug: "asics-megablast", brand: "ASICS", model: "MEGABLAST", category: "tempo", msrp: 3799000, current: 2659300,
    sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/1013A170.300/sepatu-lari-mens-asics-megablast", sourceType: "retailer",
    image: "https://media.rundna.com.au/5efc888e-8e84-452a-8907-e4178fd708d0__L.jpg",
    weightG: 224, dropMm: 8, heelStackMm: 45, forefootStackMm: 37, midsole: "FF TURBO SQUARED", plate: "None", useCases: ["Tempo", "Long run"],
  },
  {
    slug: "asics-sonicblast", brand: "ASICS", model: "SONICBLAST", category: "tempo", msrp: 2899000, current: 1739400,
    sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/1011C083.400/SONICBLAST-Winter-Sea---Stillwater", sourceType: "retailer",
    image: "https://www.365rider.com/100059-thickbox_default/asics-sonicblast-shoes-gray-blue-ss26.jpg",
    weightG: 255, dropMm: 8, heelStackMm: 46, forefootStackMm: 38, midsole: "FF TURBO SQUARED + FF BLAST MAX", plate: "ASTROPLATE TPU plate", useCases: ["Tempo", "Daily"],
  },
  {
    slug: "asics-magic-speed-5", brand: "ASICS", model: "MAGIC SPEED 5", category: "race", msrp: 2699000, current: 2429100,
    sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/1013A183.400/sepatu-lari-mens-asics-magic-speed-5", sourceType: "retailer",
    image: "https://thesweatshop.co.za/cdn/shop/files/1013A183_100_SR_LT_GLB.jpg?v=1770210572&width=1946",
    weightG: 196, dropMm: 7, heelStackMm: 37.5, forefootStackMm: 30.5, midsole: "FF LEAP + FF BLAST PLUS", plate: "Full-length carbon plate", useCases: ["Race", "Tempo"],
  },

  {
    slug: "puma-deviate-pure-nitro", brand: "Puma", model: "Deviate Pure NITRO", category: "tempo", msrp: 2499000,
    sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/313904-10/deviate-pure-nitro", sourceType: "retailer",
    image: "https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_2000%2Ch_2000/global/313904/10/sv01/fnd/PNA/fmt/png/Deviate-Pure-NITRO%E2%84%A2-Men%27s-Running-Shoes",
    weightG: null, dropMm: null, midsole: "NITROFOAM", plate: "None", useCases: ["Tempo", "Daily"],
  },
  {
    slug: "puma-foreverrun-nitro-3", brand: "Puma", model: "ForeverRun NITRO 3", category: "stability", msrp: 2299000,
    sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/en/men/shoes/running", sourceType: "official-brand",
    image: "https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_2000%2Ch_2000/global/312942/02/sv01/fnd/PNA/fmt/png/ForeverRun-NITRO%E2%84%A2-3-Men%27s-Road-Running-Shoes",
    weightG: null, dropMm: null, midsole: "Dual-density NITROFOAM", plate: "RUNGUIDE support system", useCases: ["Daily", "Easy", "Support"],
  },
  {
    slug: "puma-scend-pro-3", brand: "Puma", model: "Scend Pro 3", category: "daily", msrp: 999000,
    sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/in/pd/sepatu-lari-scend-pro-3-unisex/313498.html", sourceType: "official-brand",
    image: "https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_2000%2Ch_2000/global/313498/01/sv01/fnd/IDN/fmt/png/Scend-Pro-3-Running-Shoes-Unisex",
    weightG: null, dropMm: null, midsole: "PROFOAM", plate: "None", useCases: ["Daily", "Easy"],
  },

  {
    slug: "on-cloudflow-5", brand: "On", model: "Cloudflow 5", category: "tempo", msrp: 3000000,
    sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/products/cloudflow-5-m-3mf1011/mens", sourceType: "official-brand",
    image: "https://www.bfgcdn.com/1500_1500_90/023-2238-0711/on-cloudflow-5-runningschuhe.jpg",
    weightG: 278, dropMm: 6, midsole: "Helion HF + CloudTec", plate: "Glass-fibre nylon Speedboard", useCases: ["Tempo", "Daily"],
  },
  {
    slug: "on-cloudrunner-3", brand: "On", model: "Cloudrunner 3", category: "stability", msrp: 2600000,
    sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/products/cloudrunner-3-m-3mg1007/mens", sourceType: "official-brand",
    image: "https://img-sneaksupincommerce.mncdn.com/Content/Images/Thumbs/0249962_on-cloudrunner-3-3mg1007-0813.jpeg",
    weightG: 296, dropMm: null, midsole: "Helion superfoam", plate: "None", useCases: ["Daily", "Easy", "Support"],
  },
  {
    slug: "on-cloudmonster-3-hyper", brand: "On", model: "Cloudmonster 3 Hyper", category: "max-cushion", msrp: 3600000,
    sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/shop/mens/running", sourceType: "official-brand",
    image: "https://www.paceathletic.com/cdn/shop/files/Mens-On-Running-Cloudmonster-3-Hyper-Ivory_Linen-3MG10064852-1.jpg?v=1776990805&width=1701",
    weightG: null, dropMm: null, midsole: "Helion HF + CloudTec", plate: "None", useCases: ["Easy", "Long run"],
  },

  {
    slug: "saucony-kinvara-16", brand: "Saucony", model: "Kinvara 16", category: "tempo", msrp: 1900000, current: 1899000,
    sourceLabel: "Saucony Indonesia Flagship Store / Blibli", sourceUrl: "https://www.blibli.com/p/sepatu-lari-pria-saucony-shoes-kinvara-16-men-s/is--SAI-70201-00308-00012", sourceType: "official-marketplace",
    image: "https://www.holabirdsports.com/cdn/shop/files/043032_3.jpg?v=1750886072&width=2048",
    weightG: 206, dropMm: 4, heelStackMm: 28, forefootStackMm: 24, midsole: "PWRRUN", plate: "None", useCases: ["Tempo", "Daily"],
  },
  {
    slug: "saucony-hurricane-25", brand: "Saucony", model: "Hurricane 25", category: "stability", msrp: 2499000, current: 2249100,
    sourceLabel: "Indonesia running retailer", sourceUrl: "https://www.blibli.com/jual/saucony-hurricane-25", sourceType: "retailer",
    image: "https://scrantonrunning.com/cdn/shop/files/saucony-hurricane-25-mens-200.png?v=1758821485&width=2200",
    weightG: 298, dropMm: 6, heelStackMm: 38, forefootStackMm: 32, midsole: "PWRRUN PB + PWRRUN", plate: "CenterPath support geometry", useCases: ["Daily", "Easy", "Support"],
  },
  {
    slug: "saucony-endorphin-elite-2", brand: "Saucony", model: "Endorphin Elite 2", category: "race", msrp: 4300000, current: 2150000,
    sourceLabel: "NCR Sport Indonesia", sourceUrl: "https://www.ncrsport.com/product/S30994-130/SEPATU-LARI-SAUCONY-Endorphin-Elite-2-White-Peel-Original", sourceType: "retailer",
    image: "https://www.theathletesfoot.com.au/media/catalog/product/s/3/s30994-130_3.jpg?auto=webp&fit=cover&format=pjpg&height=1806&width=1600",
    weightG: 199, dropMm: 8, heelStackMm: 39.5, forefootStackMm: 31.5, midsole: "incrediRUN", plate: "Full-length carbon plate", useCases: ["Race"],
  },
];

function makePrice(entry: Entry): PriceSnapshot {
  return {
    priceIdr: entry.current ?? entry.msrp,
    listPriceIdr: entry.current && entry.current !== entry.msrp ? entry.msrp : undefined,
    sourceLabel: entry.sourceLabel,
    sourceUrl: entry.sourceUrl,
    sourceType: entry.sourceType ?? "retailer",
    observedAt,
    inStock: true,
  };
}

export const catalogExpansion4: DemoShoe[] = entries.map((entry, index) => ({
  slug: entry.slug,
  brand: entry.brand,
  model: entry.model,
  category: entry.category,
  terrain: entry.terrain ?? "road",
  msrpIdr: entry.msrp,
  currentPrice: makePrice(entry),
  weightG: entry.weightG ?? null,
  dropMm: entry.dropMm ?? null,
  heelStackMm: entry.heelStackMm ?? null,
  forefootStackMm: entry.forefootStackMm ?? null,
  midsole: entry.midsole ?? null,
  plate: entry.plate ?? null,
  sourceStatus: "verified",
  sourceLabel: entry.sourceLabel,
  sourceUrl: entry.sourceUrl,
  description: `${entry.model} is part of Runned's expanded current running-shoe catalog for Indonesian runners.`,
  community: demoCommunity,
  reviewCount: 0,
  overallRating: 0,
  buyAgainPct: 0,
  useCases: entry.useCases,
  accent: ["from-stone-200 to-stone-100", "from-zinc-200 to-zinc-100"][index % 2],
  images: [{ label: "Side", url: entry.image }],
  isLocalIndonesia: false,
}));
