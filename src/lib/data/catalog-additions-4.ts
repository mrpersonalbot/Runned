import type { DemoShoe, PriceSourceType, ShoeCategory, Terrain } from "@/lib/types";

const observedAt = "2026-08-21";
const community = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };

type Seed = {
  slug: string;
  brand: string;
  model: string;
  category: ShoeCategory;
  terrain?: Terrain;
  retail: number;
  current?: number;
  sourceLabel: string;
  sourceUrl: string;
  sourceType: PriceSourceType;
  image: string;
  weightG?: number | null;
  dropMm?: number | null;
  heelStackMm?: number | null;
  forefootStackMm?: number | null;
  midsole?: string | null;
  plate?: string | null;
};

function useCases(category: ShoeCategory, terrain: Terrain) {
  if (terrain === "trail") return category === "race" ? ["Trail race"] : ["Trail", "Long run"];
  if (category === "race") return ["Race"];
  if (category === "tempo" || category === "speed") return ["Tempo", "Daily"];
  if (category === "max-cushion") return ["Easy", "Long run"];
  if (category === "stability") return ["Daily", "Easy", "Support"];
  return ["Daily", "Easy"];
}

const seeds: Seed[] = [
  {
    slug: "nike-structure-26", brand: "Nike", model: "Structure 26", category: "stability",
    retail: 2099000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/structure-26-road-running-shoes-uCYEZ9s4/HJ1102-100", sourceType: "official-brand",
    image: "https://www.paceathletic.com/cdn/shop/files/Mens-Nike-Structure-26-White_PurePlatinum_BarelyVolt_Black-HJ1102-100.jpg?v=1753362154&width=1600",
    weightG: 321, dropMm: 10, midsole: "ReactX", plate: "None",
  },
  {
    slug: "nike-vomero-plus", brand: "Nike", model: "Vomero Plus", category: "max-cushion",
    retail: 2629000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/vomero-plus-mens-road-running-shoes-sBieAqOJ", sourceType: "official-brand",
    image: "https://d3nt9em9l1urz8.cloudfront.net/media/catalog/product/cache/3/image/9df78eab33525d08d6e5fb8d27136e95/i/m/im6011-060-1.jpg",
    weightG: 292, dropMm: 10, midsole: "ZoomX", plate: "None",
  },
  {
    slug: "nike-pegasus-premium", brand: "Nike", model: "Pegasus Premium", category: "tempo",
    retail: 3299000, current: 2639200, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/pegasus-premium-mens-road-running-shoes-xzQQKz/HQ2592-009", sourceType: "official-brand",
    image: "https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw0b10ed6c/nk/994/1/f/7/6/4/9941f764_f6a9_4f7b_af5d_67f267216ce8.jpg",
    midsole: "ZoomX + Air Zoom + ReactX", plate: "None",
  },
  {
    slug: "nike-vaporfly-4", brand: "Nike", model: "Vaporfly 4", category: "race",
    retail: 3789000, current: 3031200, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/vaporfly-4-road-racing-shoes-PTwDtp/HF6414-112", sourceType: "official-brand",
    image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/6411ff00-694d-4084-8ec9-7fc493333591/ZOOMX%2BVAPORFLY%2BNEXT%25%2B4.png",
    weightG: 190, dropMm: 6, midsole: "ZoomX", plate: "Full-length carbon-fibre Flyplate",
  },
  {
    slug: "adidas-supernova-rise-3", brand: "adidas", model: "Supernova Rise 3", category: "daily",
    retail: 2100000, current: 1470000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-running-supernova-rise-3/JR2280.html", sourceType: "official-brand",
    image: "https://assets.adidas.com/images/w_1880%2Cf_auto%2Cq_auto/ea11debc4fc44e758328011816fb4c55_9366/JR2280_01_00_standard.jpg",
    dropMm: 8, heelStackMm: 37, forefootStackMm: 29, midsole: "Dreamstrike+", plate: "None",
  },
  {
    slug: "adidas-supernova-prima-2", brand: "adidas", model: "Supernova Prima 2", category: "max-cushion",
    retail: 2600000, current: 1300000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-supernova-prima-2/JR3195.html", sourceType: "official-brand",
    image: "https://images.stockx.com/images/adidas-Supernova-Prima-2-White-Lucid-Lemon.jpg?auto=compress&bg=FFFFFF&dpr=2&fit=fill&fm=webp&h=500&q=90&trim=color&updated_at=1765911306&w=700",
    weightG: 283, dropMm: 8, heelStackMm: 39, forefootStackMm: 31, midsole: "Dreamstrike+", plate: "Support Rods",
  },
  {
    slug: "adidas-ultraboost-5", brand: "adidas", model: "Ultraboost 5", category: "daily",
    retail: 3000000, current: 2700000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-ultraboost-5/JH9072.html", sourceType: "official-brand",
    image: "https://cdn.awsli.com.br/2500x2500/1167/1167039/produto/368024059/fundo-branco---sportlinestore-f9wqlyqzpe.jpg",
    weightG: 292, dropMm: 10, heelStackMm: 39, forefootStackMm: 29, midsole: "Light BOOST V2", plate: "Torsion System",
  },
  {
    slug: "adidas-hyperboost-edge", brand: "adidas", model: "HYPERBOOST EDGE", category: "max-cushion",
    retail: 3500000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-lari-hyperboost-edge/KK0290.html", sourceType: "official-brand",
    image: "https://media.rundna.com.au/344c33bf-851b-483a-be93-ec8057ff105b__L.jpg",
    dropMm: 6, heelStackMm: 45, forefootStackMm: 39, midsole: "Hyperboost Pro", plate: "None",
  },
  {
    slug: "asics-megablast", brand: "ASICS", model: "MEGABLAST", category: "tempo",
    retail: 3799000, current: 2659300, sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/1013A170.300/sepatu-lari-mens-asics-megablast", sourceType: "retailer",
    image: "https://media.rundna.com.au/5efc888e-8e84-452a-8907-e4178fd708d0__L.jpg",
    weightG: 230, dropMm: 8, heelStackMm: 46, forefootStackMm: 38, midsole: "FF TURBO SQUARED", plate: "None",
  },
  {
    slug: "asics-sonicblast", brand: "ASICS", model: "SONICBLAST", category: "tempo",
    retail: 2899000, current: 1739400, sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/1011C083.400", sourceType: "retailer",
    image: "https://themarathonshop.com.my/cdn/shop/files/Asics-Men-Sonicblast-Running-Shoe-Winter-Sea-The-Marathon-Shop-43928021631258.png?v=1778827935",
    weightG: 255, dropMm: 8, heelStackMm: 46, forefootStackMm: 38, midsole: "FF BLAST MAX + FF TURBO SQUARED", plate: "ASTROPLATE",
  },
  {
    slug: "asics-magic-speed-5", brand: "ASICS", model: "MAGIC SPEED 5", category: "race",
    retail: 2699000, current: 1889300, sourceLabel: "NCR Sport Indonesia", sourceUrl: "https://ncrsport.com/product/1013A183.001/MAGIC-SPEED-5-Black-White", sourceType: "retailer",
    image: "https://store.runtrip.jp/cdn/shop/files/1013A183_001_SR_LT_GTM.png?v=1768545368&width=1280",
    weightG: 196, dropMm: 7, heelStackMm: 37.5, midsole: "FF LEAP + FF BLAST PLUS", plate: "Carbon plate",
  },
  {
    slug: "puma-deviate-pure-nitro", brand: "Puma", model: "Deviate Pure NITRO", category: "tempo",
    retail: 2499000, sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/en/sport-running-deviate-pure", sourceType: "official-brand",
    image: "https://www.paceathletic.com/cdn/shop/files/Mens-PUMA-Deviate-Pure-NITRO-PUMA-White_Ultra-Red_PUMA-Silver-313904-06.jpg?v=1779076191&width=1200",
    weightG: 220, dropMm: 8, heelStackMm: 38, forefootStackMm: 30, midsole: "NITROFOAM", plate: "None",
  },
  {
    slug: "puma-foreverrun-nitro-3", brand: "Puma", model: "ForeverRun NITRO 3", category: "stability",
    retail: 2299000, sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/en/sport/running/everyday-running", sourceType: "official-brand",
    image: "https://redsport.vtexassets.com/arquivos/ids/1212686/ZAPATILLAS-PUMA-FOREVERRUN-NITRO-3.jpg?v=638887961101730000",
    weightG: 290, dropMm: 8, heelStackMm: 38, forefootStackMm: 30, midsole: "Dual-density NITROFOAM", plate: "RUNGUIDE support system",
  },
  {
    slug: "puma-scend-pro-3", brand: "Puma", model: "Scend Pro 3", category: "daily",
    retail: 999000, sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/en/pd/scend-pro-3-running-shoes-unisex/313498.html", sourceType: "official-brand",
    image: "https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_2000%2Ch_2000/global/313498/01/sv01/fnd/PNA/fmt/png/Scend-Pro-3-Running-Shoes-Unisex",
    dropMm: 10, midsole: "PROFOAM", plate: "None",
  },
  {
    slug: "on-cloudflow-5", brand: "On", model: "Cloudflow 5", category: "tempo",
    retail: 3000000, sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/products/cloudflow-5-m-3mf1011/mens", sourceType: "official-brand",
    image: "https://www.holabirdsports.com/cdn/shop/files/042529_6.jpg?v=1752264527&width=2048",
    weightG: 278, dropMm: 8, midsole: "Helion HF", plate: "Glass-fiber nylon-blend Speedboard",
  },
  {
    slug: "on-cloudrunner-3", brand: "On", model: "Cloudrunner 3", category: "stability",
    retail: 2600000, sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/products/cloudrunner-3-m-3mg1007/mens", sourceType: "official-brand",
    image: "https://cdn.runfree.run/images/products/41/1575/41_393972_1783968756748.png",
    weightG: 311, dropMm: 8, midsole: "Helion", plate: "None",
  },
  {
    slug: "on-cloudmonster-3-hyper", brand: "On", model: "Cloudmonster 3 Hyper", category: "max-cushion",
    retail: 3600000, sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/products/cloudmonster-3-hyper-3mg1006/mens/ivory-flurry-shoes-3MG10065262", sourceType: "official-brand",
    image: "https://www.paceathletic.com/cdn/shop/files/Mens-On-Running-Cloudmonster-3-Hyper-Ivory_Linen-3MG10064852-1.jpg?v=1776990805&width=1701",
    weightG: 253, dropMm: 6, midsole: "Helion HF + Helion", plate: "None",
  },
  {
    slug: "saucony-kinvara-16", brand: "Saucony", model: "Kinvara 16", category: "speed",
    retail: 1899000, current: 1558000, sourceLabel: "Saucony Indonesia Flagship Store", sourceUrl: "https://www.blibli.com/p/sepatu-lari-pria-saucony-shoes-kinvara-16-men-s/is--SAI-70201-00308-00012", sourceType: "official-marketplace",
    image: "https://images.bike24.com/i/mb/20/b9/07/saucony-kinvara-16-running-shoes-men-black-white-1-1883398.jpg",
    weightG: 206, dropMm: 4, heelStackMm: 28, forefootStackMm: 24, midsole: "PWRRUN", plate: "None",
  },
  {
    slug: "saucony-hurricane-25", brand: "Saucony", model: "Hurricane 25", category: "stability",
    retail: 2499000, current: 2049180, sourceLabel: "Saucony Indonesia Flagship Store", sourceUrl: "https://www.blibli.com/p/sepatu-lari-pria-saucony-shoes-hurricane-25-men-s/ps--SAI-70201-00169", sourceType: "official-marketplace",
    image: "https://cdn.shoplightspeed.com/shops/653507/files/71421637/saucony-hurricane-25-mens.jpg",
    weightG: 285, dropMm: 6, heelStackMm: 38, forefootStackMm: 32, midsole: "PWRRUN PB + PWRRUN", plate: "CenterPath support geometry",
  },
  {
    slug: "saucony-endorphin-elite-2", brand: "Saucony", model: "Endorphin Elite 2", category: "race",
    retail: 4300000, current: 2881000, sourceLabel: "Saucony Indonesia Flagship Store", sourceUrl: "https://www.blibli.com/p/sepatu-lari-pria-dan-wanita-saucony-shoes-endorphin-elite-2/is--SAI-70201-00195-00001", sourceType: "official-marketplace",
    image: "https://www.stokelab.run/cdn/shop/files/saucony-endorphin-elite-2-white-peel-unisex.jpg?v=1741001117&width=1946",
    weightG: 199, dropMm: 8, heelStackMm: 39.5, forefootStackMm: 31.5, midsole: "IncrediRUN", plate: "Full-length slotted carbon plate",
  },
];

export const catalogExpansion4: DemoShoe[] = seeds.map((seed, index) => {
  const terrain = seed.terrain ?? "road";
  const current = seed.current ?? seed.retail;
  return {
    slug: seed.slug,
    brand: seed.brand,
    model: seed.model,
    category: seed.category,
    terrain,
    msrpIdr: seed.retail,
    currentPrice: {
      priceIdr: current,
      ...(current !== seed.retail ? { listPriceIdr: seed.retail } : {}),
      sourceLabel: seed.sourceLabel,
      sourceUrl: seed.sourceUrl,
      sourceType: seed.sourceType,
      observedAt,
      inStock: true,
    },
    weightG: seed.weightG ?? null,
    dropMm: seed.dropMm ?? null,
    heelStackMm: seed.heelStackMm ?? null,
    forefootStackMm: seed.forefootStackMm ?? null,
    midsole: seed.midsole ?? null,
    plate: seed.plate ?? null,
    sourceStatus: "verified",
    sourceLabel: seed.sourceLabel,
    sourceUrl: seed.sourceUrl,
    description: `${seed.model} joins Runned's curated catalog with an Indonesian retail reference and source-backed product details.`,
    community,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: useCases(seed.category, terrain),
    accent: index % 2 ? "from-zinc-200 to-zinc-100" : "from-stone-200 to-stone-100",
    images: [{ label: "Side", url: seed.image }],
    isLocalIndonesia: false,
  };
});
