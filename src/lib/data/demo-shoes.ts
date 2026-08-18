import type { BrandDirectoryEntry, DemoShoe } from "@/lib/types";

const demoCommunity = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };
const observedAt = "2026-08-18";

// This seed demonstrates the scalable catalog shape. Community scores remain synthetic demo data.
// Price snapshots are only attached when a current source was verified; otherwise price stays unknown.
export const demoShoes: DemoShoe[] = [
  {
    slug: "adidas-adizero-evo-sl", brand: "adidas", model: "Adizero EVO SL", category: "tempo", terrain: "road",
    msrpIdr: 2500000, currentPrice: { priceIdr: 2500000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-adizero-evo-sl/JR3414.html", sourceType: "official-brand", observedAt },
    weightG: 224, dropMm: 6, heelStackMm: 38, forefootStackMm: 32, midsole: "LIGHTSTRIKE PRO", plate: "None",
    sourceStatus: "verified", sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-adizero-evo-sl/JR3414.html",
    description: "Lightweight performance trainer for daily speed and tempo work.", community: demoCommunity, reviewCount: 148, overallRating: 4.6, buyAgainPct: 91, useCases: ["Tempo", "Daily", "Intervals"], accent: "from-lime-300 to-yellow-100"
  },
  {
    slug: "nike-pegasus-41", brand: "Nike", model: "Pegasus 41", category: "daily", terrain: "road",
    msrpIdr: 2099000, currentPrice: { priceIdr: 2099000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/pegasus-41-road-running-shoes-RZm89S/FD2722-102", sourceType: "official-brand", observedAt },
    weightG: 297, dropMm: 10, heelStackMm: null, forefootStackMm: null, midsole: "ReactX + Air Zoom", plate: "None",
    sourceStatus: "verified", sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/pegasus-41-road-running-shoes-RZm89S/FD2722-102",
    description: "Durable everyday road trainer with responsive cushioning.", community: demoCommunity, reviewCount: 203, overallRating: 4.3, buyAgainPct: 83, useCases: ["Daily", "Easy", "Walking"], accent: "from-sky-300 to-cyan-100"
  },
  {
    slug: "asics-novablast-5", brand: "ASICS", model: "Novablast 5", category: "daily", terrain: "road", msrpIdr: null, currentPrice: null,
    weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: "None", sourceStatus: "catalog-only", sourceLabel: "Catalog entry", sourceUrl: null,
    description: "Bouncy daily trainer; price awaiting current Indonesia verification.", community: demoCommunity, reviewCount: 176, overallRating: 4.5, buyAgainPct: 89, useCases: ["Daily", "Long run", "Easy"], accent: "from-orange-300 to-amber-100"
  },
  {
    slug: "hoka-clifton-10", brand: "HOKA", model: "Clifton 10", category: "max-cushion", terrain: "road", msrpIdr: null, currentPrice: null,
    weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: "None", sourceStatus: "catalog-only", sourceLabel: "Catalog entry", sourceUrl: null,
    description: "Cushioned road-running option; price awaiting current Indonesia verification.", community: demoCommunity, reviewCount: 94, overallRating: 4.2, buyAgainPct: 80, useCases: ["Easy", "Long run", "Recovery"], accent: "from-violet-300 to-fuchsia-100"
  },
  {
    slug: "mills-hypercharge-r26", brand: "MILLS", model: "Hypercharge R26", category: "race", terrain: "road", msrpIdr: 2499000,
    currentPrice: { priceIdr: 2499000, sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear", sourceType: "official-brand", observedAt },
    weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: null, sourceStatus: "verified", sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear",
    description: "Indonesian performance running model from MILLS.", community: demoCommunity, reviewCount: 0, overallRating: 0, buyAgainPct: 0, useCases: ["Race", "Tempo"], accent: "from-rose-300 to-orange-100", isLocalIndonesia: true
  },
  {
    slug: "mills-enercharge-m2", brand: "MILLS", model: "Enercharge M2", category: "tempo", terrain: "road", msrpIdr: 1799000,
    currentPrice: { priceIdr: 1799000, sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear", sourceType: "official-brand", observedAt },
    weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: null, sourceStatus: "verified", sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear",
    description: "Performance-focused Indonesian road shoe.", community: demoCommunity, reviewCount: 0, overallRating: 0, buyAgainPct: 0, useCases: ["Tempo", "Daily"], accent: "from-red-300 to-amber-100", isLocalIndonesia: true
  },
  {
    slug: "mills-enerpro-zenith", brand: "MILLS", model: "Enerpro Zenith", category: "daily", terrain: "road", msrpIdr: 899000,
    currentPrice: { priceIdr: 899000, sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear", sourceType: "official-brand", observedAt },
    weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: null, sourceStatus: "verified", sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear",
    description: "Value-oriented Indonesian running shoe.", community: demoCommunity, reviewCount: 0, overallRating: 0, buyAgainPct: 0, useCases: ["Daily", "Easy"], accent: "from-cyan-300 to-blue-100", isLocalIndonesia: true
  },
  {
    slug: "mills-specter-2", brand: "MILLS", model: "Specter 2.0", category: "daily", terrain: "road", msrpIdr: 349000,
    currentPrice: { priceIdr: 349000, sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear", sourceType: "official-brand", observedAt },
    weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: null, sourceStatus: "verified", sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear",
    description: "Accessible Indonesian entry-level running shoe.", community: demoCommunity, reviewCount: 0, overallRating: 0, buyAgainPct: 0, useCases: ["Daily", "Walking"], accent: "from-neutral-300 to-stone-100", isLocalIndonesia: true
  },
  ...[
    ["910 Nineten", "Haze", "daily"], ["910 Nineten", "Geist Ekiden", "race"], ["Ortuseight", "Hyperglide", "daily"], ["Ortuseight", "Solar", "race"],
    ["Specs", "Hyperspeed", "speed"], ["Puma", "Deviate Nitro", "tempo"], ["New Balance", "Fresh Foam X 1080", "max-cushion"], ["Saucony", "Endorphin Speed", "tempo"],
    ["Brooks", "Ghost", "daily"], ["On", "Cloudmonster", "max-cushion"], ["Mizuno", "Wave Rider", "daily"], ["Skechers", "GO RUN", "daily"]
  ].map(([brand, model, category], i) => ({
    slug: `${brand}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), brand, model, category: category as DemoShoe["category"], terrain: "road" as const,
    msrpIdr: null, currentPrice: null, weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: null,
    sourceStatus: "catalog-only" as const, sourceLabel: "Catalog entry", sourceUrl: null, description: "Catalog entry ready for verified specifications, price sources and runner reviews.",
    community: demoCommunity, reviewCount: 0, overallRating: 0, buyAgainPct: 0, useCases: [category === "race" ? "Race" : "Daily"], accent: ["from-emerald-300 to-lime-100", "from-indigo-300 to-sky-100", "from-fuchsia-300 to-pink-100"][i % 3],
    isLocalIndonesia: ["910 Nineten", "Ortuseight", "Specs"].includes(brand)
  }))
];

export const brandDirectory: BrandDirectoryEntry[] = [
  ["adidas", "adidas"], ["nike", "Nike"], ["asics", "ASICS"], ["hoka", "HOKA"], ["new-balance", "New Balance"], ["puma", "Puma"], ["saucony", "Saucony"], ["brooks", "Brooks"], ["on", "On"], ["mizuno", "Mizuno"], ["skechers", "Skechers"],
  ["910-nineten", "910 Nineten", true], ["ortuseight", "Ortuseight", true], ["mills", "MILLS", true], ["specs", "Specs", true]
].map(([slug, name, local]) => ({ slug: String(slug), name: String(name), isLocalIndonesia: Boolean(local), countryCode: local ? "ID" : undefined }));

export const localBrands = brandDirectory.filter((brand) => brand.isLocalIndonesia).map((brand) => brand.name);
export function getDemoShoe(slug: string) { return demoShoes.find((shoe) => shoe.slug === slug); }
