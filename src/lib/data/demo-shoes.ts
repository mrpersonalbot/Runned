import type { BrandDirectoryEntry, DemoShoe, PriceSnapshot, ShoeCategory } from "@/lib/types";
import { shoeImages } from "@/lib/data/shoe-images";

const demoCommunity = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };
const observedAt = "2026-08-18";

const prices: Record<string, PriceSnapshot> = {
  "adidas-adizero-evo-sl": { priceIdr: 2500000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-adizero-lari", sourceType: "official-brand", observedAt },
  "adidas-adizero-boston-13": { priceIdr: 2500000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-adizero-lari", sourceType: "official-brand", observedAt },
  "nike-pegasus-42": { priceIdr: 2199000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/w/best-running-shoes-2eqihz37v7jz76m50zy7ok", sourceType: "official-brand", observedAt },
  "nike-vomero-18": { priceIdr: 2249000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/w/best-road-running-shoes-37v7jz76m50z8kwewzy7ok", sourceType: "official-brand", observedAt },
  "new-balance-rebel-v5": { priceIdr: 2499000, sourceLabel: "New Balance Indonesia", sourceUrl: "https://www.newbalance.co.id/rebel-v5.html", sourceType: "official-brand", observedAt },
  "new-balance-1080-v14": { priceIdr: 2999000, sourceLabel: "New Balance Indonesia", sourceUrl: "https://www.newbalance.co.id/catalog/category/view/id/1063/", sourceType: "official-brand", observedAt },
  "puma-velocity-nitro-5": { priceIdr: 2099000, sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/en/men/sports/running", sourceType: "official-brand", observedAt },
  "puma-deviate-nitro-4": { priceIdr: 2699000, sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/en/sport/running/deviate-nitro%E2%84%A2", sourceType: "official-brand", observedAt },
  "on-cloudmonster-3": { priceIdr: 3200000, sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/shop/shoes/road-running", sourceType: "official-brand", observedAt },
  "on-cloudsurfer-2": { priceIdr: 2700000, sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/shop/shoes/running", sourceType: "official-brand", observedAt },
  "910-haze-tempo-2": { priceIdr: 799900, sourceLabel: "910 Indonesia", sourceUrl: "https://910.id/", sourceType: "official-brand", observedAt },
  "ortuseight-hypersonic-2": { priceIdr: 1599000, sourceLabel: "Ortuseight official-market signal", sourceUrl: "https://shopee.co.id/list/Ortuseight/Official%20Store?page=1", sourceType: "official-marketplace", observedAt },
  "ortuseight-hyperglide-3-1": { priceIdr: 749000, sourceLabel: "Ortuseight official-market signal", sourceUrl: "https://shopee.co.id/list/Ortuseight/Official%20Store?page=1", sourceType: "official-marketplace", observedAt },
  "mills-enerpro-zenith": { priceIdr: 899000, sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear", sourceType: "official-brand", observedAt },
  "mills-enermax-dynaplate": { priceIdr: 549000, sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear", sourceType: "official-brand", observedAt },
  "specs-novaspeed-subsx": { priceIdr: 899800, sourceLabel: "Blibli Indonesia", sourceUrl: "https://www.blibli.com/jual/running-shoes-indonesia", sourceType: "retailer", observedAt },
  "specs-airglide": { priceIdr: 399800, sourceLabel: "Blibli Indonesia", sourceUrl: "https://www.blibli.com/jual/running-shoes-indonesia", sourceType: "retailer", observedAt },
};

const catalog: Array<[string, string, string, ShoeCategory, boolean?]> = [
  ["adidas-adizero-evo-sl", "adidas", "Adizero EVO SL", "tempo"],
  ["adidas-adizero-boston-13", "adidas", "Adizero Boston 13", "tempo"],
  ["nike-pegasus-42", "Nike", "Pegasus 42", "daily"],
  ["nike-vomero-18", "Nike", "Vomero 18", "max-cushion"],
  ["asics-superblast-3", "ASICS", "Superblast 3", "tempo"],
  ["asics-novablast-6", "ASICS", "Novablast 6", "daily"],
  ["hoka-clifton-10", "HOKA", "Clifton 10", "daily"],
  ["hoka-bondi-9", "HOKA", "Bondi 9", "max-cushion"],
  ["new-balance-rebel-v5", "New Balance", "FuelCell Rebel v5", "tempo"],
  ["new-balance-1080-v14", "New Balance", "Fresh Foam X 1080 v14", "max-cushion"],
  ["puma-velocity-nitro-5", "Puma", "Velocity NITRO 5", "daily"],
  ["puma-deviate-nitro-4", "Puma", "Deviate NITRO 4", "tempo"],
  ["saucony-ride-19", "Saucony", "Ride 19", "daily"],
  ["saucony-endorphin-speed-5", "Saucony", "Endorphin Speed 5", "tempo"],
  ["brooks-ghost-18", "Brooks", "Ghost 18", "daily"],
  ["brooks-adrenaline-gts-25", "Brooks", "Adrenaline GTS 25", "daily"],
  ["on-cloudmonster-3", "On", "Cloudmonster 3", "max-cushion"],
  ["on-cloudsurfer-2", "On", "Cloudsurfer 2", "daily"],
  ["mizuno-wave-rider-29", "Mizuno", "Wave Rider 29", "daily"],
  ["mizuno-hyperwarp-elite", "Mizuno", "Hyperwarp Elite", "race"],
  ["skechers-aero-razor", "Skechers", "AERO Razor", "tempo"],
  ["skechers-aero-burst", "Skechers", "AERO Burst", "max-cushion"],
  ["910-haze-tempo-2", "910 Nineten", "Haze Tempo 2.0", "tempo", true],
  ["910-geist-ekiden-hyperpulse", "910 Nineten", "Geist Ekiden Hyperpulse", "race", true],
  ["ortuseight-hypersonic-2", "Ortuseight", "Hypersonic 2.0", "race", true],
  ["ortuseight-hyperglide-3-1", "Ortuseight", "Hyperglide 3.1", "daily", true],
  ["mills-enerpro-zenith", "MILLS", "Enerpro Zenith", "tempo", true],
  ["mills-enermax-dynaplate", "MILLS", "Enermax Dynaplate", "daily", true],
  ["specs-novaspeed-subsx", "Specs", "Novaspeed SUBSX", "tempo", true],
  ["specs-airglide", "Specs", "Airglide", "daily", true],
];

const accents = [
  "from-lime-300 to-yellow-100", "from-sky-300 to-cyan-100", "from-orange-300 to-amber-100", "from-violet-300 to-fuchsia-100",
  "from-emerald-300 to-lime-100", "from-indigo-300 to-sky-100", "from-fuchsia-300 to-pink-100", "from-rose-300 to-orange-100"
];

export const demoShoes: DemoShoe[] = catalog.map(([slug, brand, model, category, local], index) => {
  const currentPrice = prices[slug] ?? null;
  return {
    slug, brand, model, category, terrain: "road",
    msrpIdr: currentPrice?.priceIdr ?? null,
    currentPrice,
    weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: null,
    sourceStatus: currentPrice ? "verified" : "catalog-only",
    sourceLabel: currentPrice?.sourceLabel ?? "Catalog entry",
    sourceUrl: currentPrice?.sourceUrl ?? null,
    description: `${model} is included in Runned's curated popular-shoe catalog. Specifications and community data are added only when verified.`,
    community: demoCommunity,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: category === "race" ? ["Race"] : category === "tempo" ? ["Tempo", "Daily"] : category === "max-cushion" ? ["Easy", "Long run"] : ["Daily", "Easy"],
    accent: accents[index % accents.length],
    images: shoeImages[slug],
    isLocalIndonesia: Boolean(local),
  };
});

export const brandDirectory: BrandDirectoryEntry[] = [
  ["adidas", "adidas"], ["nike", "Nike"], ["asics", "ASICS"], ["hoka", "HOKA"], ["new-balance", "New Balance"], ["puma", "Puma"], ["saucony", "Saucony"], ["brooks", "Brooks"], ["on", "On"], ["mizuno", "Mizuno"], ["skechers", "Skechers"],
  ["910-nineten", "910 Nineten", true], ["ortuseight", "Ortuseight", true], ["mills", "MILLS", true], ["specs", "Specs", true]
].map(([slug, name, local]) => ({ slug: String(slug), name: String(name), isLocalIndonesia: Boolean(local), countryCode: local ? "ID" : undefined }));

export const localBrands = brandDirectory.filter((brand) => brand.isLocalIndonesia).map((brand) => brand.name);
export function getDemoShoe(slug: string) { return demoShoes.find((shoe) => shoe.slug === slug); }
