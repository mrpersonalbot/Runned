import type { DemoShoe, ShoeCategory, Terrain } from "@/lib/types";

type HistoricalEntry = {
  slug: string;
  brand: string;
  model: string;
  category: ShoeCategory;
  terrain?: Terrain;
  local?: boolean;
  previousFor?: string[];
  sourceUrl?: string;
};

const community = { softness: 4, energyReturn: 4, stability: 4, fitWidth: 3, toeBox: 3, heelLockdown: 4, grip: 4, durability: 4, breathability: 4, value: 4 };

const entries: HistoricalEntry[] = [
  { slug: "adidas-adizero-boston-12", brand: "adidas", model: "Adizero Boston 12", category: "tempo", previousFor: ["adidas-adizero-boston-13"], sourceUrl: "https://www.adidas.co.id/id/sepatu-adizero-boston-12/HQ2171.html" },
  { slug: "adidas-adizero-adios-pro-3", brand: "adidas", model: "Adizero Adios Pro 3", category: "race", previousFor: ["adidas-adizero-adios-pro-4"] },
  { slug: "adidas-prime-x2-strung", brand: "adidas", model: "Adizero Prime X 2 Strung", category: "max-cushion", previousFor: ["adidas-prime-x3-strung"] },
  { slug: "adidas-supernova-rise-2", brand: "adidas", model: "Supernova Rise 2", category: "daily", previousFor: ["adidas-supernova-rise-3"] },
  { slug: "adidas-supernova-prima", brand: "adidas", model: "Supernova Prima", category: "max-cushion", previousFor: ["adidas-supernova-prima-2"] },
  { slug: "adidas-ultraboost-light", brand: "adidas", model: "Ultraboost Light", category: "daily", previousFor: ["adidas-ultraboost-5"] },

  { slug: "nike-pegasus-41", brand: "Nike", model: "Pegasus 41", category: "daily", previousFor: ["nike-pegasus-42"], sourceUrl: "https://www.nike.com/id/t/pegasus-41-road-running-shoes-RZm89S/FD2722-102" },
  { slug: "nike-vomero-17", brand: "Nike", model: "Vomero 17", category: "max-cushion", previousFor: ["nike-vomero-18"] },
  { slug: "nike-alphafly-2", brand: "Nike", model: "Alphafly 2", category: "race", previousFor: ["nike-alphafly-3"] },
  { slug: "nike-zoom-fly-5", brand: "Nike", model: "Zoom Fly 5", category: "tempo", previousFor: ["nike-zoom-fly-6"] },
  { slug: "nike-streakfly", brand: "Nike", model: "Streakfly", category: "race", previousFor: ["nike-streakfly-2"] },
  { slug: "nike-structure-25", brand: "Nike", model: "Structure 25", category: "stability", previousFor: ["nike-structure-26"] },
  { slug: "nike-vaporfly-3", brand: "Nike", model: "Vaporfly 3", category: "race", previousFor: ["nike-vaporfly-4"] },

  { slug: "asics-superblast-2", brand: "ASICS", model: "Superblast 2", category: "tempo", previousFor: ["asics-superblast-3"] },
  { slug: "asics-novablast-5", brand: "ASICS", model: "Novablast 5", category: "daily", previousFor: ["asics-novablast-6"] },
  { slug: "asics-metaspeed-sky-paris", brand: "ASICS", model: "METASPEED SKY PARIS", category: "race", previousFor: ["asics-metaspeed-sky-tokyo"] },
  { slug: "asics-gel-nimbus-26", brand: "ASICS", model: "GEL-NIMBUS 26", category: "max-cushion", previousFor: ["asics-gel-nimbus-27"] },
  { slug: "asics-trabuco-max-3", brand: "ASICS", model: "TRABUCO MAX 3", category: "trail", terrain: "trail", previousFor: ["asics-trabuco-max-4"] },
  { slug: "asics-magic-speed-4", brand: "ASICS", model: "MAGIC SPEED 4", category: "race", previousFor: ["asics-magic-speed-5"] },

  { slug: "hoka-clifton-9", brand: "HOKA", model: "Clifton 9", category: "daily", previousFor: ["hoka-clifton-10"] },
  { slug: "hoka-bondi-8", brand: "HOKA", model: "Bondi 8", category: "max-cushion", previousFor: ["hoka-bondi-9"] },
  { slug: "hoka-mach-x-2", brand: "HOKA", model: "Mach X 2", category: "tempo", previousFor: ["hoka-mach-x-3"] },
  { slug: "hoka-rocket-x-2", brand: "HOKA", model: "Rocket X 2", category: "race", previousFor: ["hoka-rocket-x-3"] },
  { slug: "hoka-speedgoat-5", brand: "HOKA", model: "Speedgoat 5", category: "trail", terrain: "trail", previousFor: ["hoka-speedgoat-6"] },

  { slug: "new-balance-rebel-v4", brand: "New Balance", model: "FuelCell Rebel v4", category: "tempo", previousFor: ["new-balance-rebel-v5"] },
  { slug: "new-balance-1080-v13", brand: "New Balance", model: "Fresh Foam X 1080 v13", category: "max-cushion", previousFor: ["new-balance-1080-v14"] },
  { slug: "new-balance-sc-elite-v4", brand: "New Balance", model: "FuelCell SuperComp Elite v4", category: "race", previousFor: ["new-balance-sc-elite-v5"] },
  { slug: "new-balance-sc-trainer-v2", brand: "New Balance", model: "FuelCell SuperComp Trainer v2", category: "tempo", previousFor: ["new-balance-sc-trainer-v3"] },
  { slug: "new-balance-hierro-v8", brand: "New Balance", model: "Fresh Foam X Hierro v8", category: "trail", terrain: "trail", previousFor: ["new-balance-hierro-v9"] },

  { slug: "puma-velocity-nitro-4", brand: "Puma", model: "Velocity NITRO 4", category: "daily", previousFor: ["puma-velocity-nitro-5"] },
  { slug: "puma-velocity-nitro-3", brand: "Puma", model: "Velocity NITRO 3", category: "daily", previousFor: ["puma-velocity-nitro-4"] },
  { slug: "puma-deviate-nitro-3", brand: "Puma", model: "Deviate NITRO 3", category: "tempo", previousFor: ["puma-deviate-nitro-4"] },
  { slug: "puma-fast-r-nitro-elite-2", brand: "Puma", model: "FAST-R NITRO Elite 2", category: "race", previousFor: ["puma-fast-r-nitro-elite-3"] },
  { slug: "puma-magmax-nitro", brand: "Puma", model: "MagMax NITRO", category: "max-cushion", previousFor: ["puma-magmax-nitro-2"] },
  { slug: "puma-foreverrun-nitro", brand: "Puma", model: "ForeverRun NITRO", category: "stability", previousFor: ["puma-foreverrun-nitro-2"] },
  { slug: "puma-scend-pro-2", brand: "Puma", model: "Scend Pro 2", category: "daily", previousFor: ["puma-scend-pro-3"] },

  { slug: "saucony-ride-18", brand: "Saucony", model: "Ride 18", category: "daily", previousFor: ["saucony-ride-19"] },
  { slug: "saucony-endorphin-speed-4", brand: "Saucony", model: "Endorphin Speed 4", category: "tempo", previousFor: ["saucony-endorphin-speed-5"] },
  { slug: "saucony-endorphin-pro-4", brand: "Saucony", model: "Endorphin Pro 4", category: "race", previousFor: ["saucony-endorphin-pro-5"] },
  { slug: "saucony-triumph-22", brand: "Saucony", model: "Triumph 22", category: "max-cushion", previousFor: ["saucony-triumph-23"] },
  { slug: "saucony-kinvara-15", brand: "Saucony", model: "Kinvara 15", category: "tempo", previousFor: ["saucony-kinvara-16"] },
  { slug: "saucony-hurricane-24", brand: "Saucony", model: "Hurricane 24", category: "stability", previousFor: ["saucony-hurricane-25"] },
  { slug: "saucony-endorphin-elite", brand: "Saucony", model: "Endorphin Elite", category: "race", previousFor: ["saucony-endorphin-elite-2"] },

  { slug: "brooks-ghost-17", brand: "Brooks", model: "Ghost 17", category: "daily", previousFor: ["brooks-ghost-18"] },
  { slug: "brooks-adrenaline-gts-24", brand: "Brooks", model: "Adrenaline GTS 24", category: "stability", previousFor: ["brooks-adrenaline-gts-25"] },
  { slug: "brooks-hyperion-elite-4", brand: "Brooks", model: "Hyperion Elite 4", category: "race", previousFor: ["brooks-hyperion-elite-5"] },
  { slug: "brooks-glycerin-21", brand: "Brooks", model: "Glycerin 21", category: "max-cushion", previousFor: ["brooks-glycerin-22"] },
  { slug: "brooks-cascadia-18", brand: "Brooks", model: "Cascadia 18", category: "trail", terrain: "trail", previousFor: ["brooks-cascadia-19"] },

  { slug: "on-cloudmonster-2", brand: "On", model: "Cloudmonster 2", category: "max-cushion", previousFor: ["on-cloudmonster-3"] },
  { slug: "on-cloudsurfer", brand: "On", model: "Cloudsurfer", category: "daily", previousFor: ["on-cloudsurfer-2"] },
  { slug: "on-cloudboom-strike", brand: "On", model: "Cloudboom Strike", category: "race", previousFor: ["on-cloudboom-strike-2"] },
  { slug: "on-cloudflow-4", brand: "On", model: "Cloudflow 4", category: "tempo", previousFor: ["on-cloudflow-5"] },
  { slug: "on-cloudrunner-2", brand: "On", model: "Cloudrunner 2", category: "stability", previousFor: ["on-cloudrunner-3"] },
  { slug: "on-cloudmonster-hyper", brand: "On", model: "Cloudmonster Hyper", category: "max-cushion", previousFor: ["on-cloudmonster-3-hyper"] },

  { slug: "mizuno-wave-rider-28", brand: "Mizuno", model: "Wave Rider 28", category: "daily", previousFor: ["mizuno-wave-rider-29"] },
  { slug: "mizuno-neo-vista", brand: "Mizuno", model: "Neo Vista", category: "max-cushion", previousFor: ["mizuno-neo-vista-2"] },
  { slug: "mizuno-wave-sky-8", brand: "Mizuno", model: "Wave Sky 8", category: "max-cushion", previousFor: ["mizuno-wave-sky-9"] },

  { slug: "skechers-go-run-razor-4", brand: "Skechers", model: "GO RUN Razor 4", category: "tempo", previousFor: ["skechers-aero-razor"] },
  { slug: "skechers-go-run-trail-altitude", brand: "Skechers", model: "GO RUN Trail Altitude", category: "trail", terrain: "trail", previousFor: ["skechers-go-run-trail-altitude-2"] },

  { slug: "910-haze-tempo", brand: "910 Nineten", model: "Haze Tempo", category: "tempo", local: true, previousFor: ["910-haze-tempo-2"] },
  { slug: "910-kishi-run", brand: "910 Nineten", model: "Kishi Run", category: "daily", local: true, previousFor: ["910-kishi-run-2"] },

  { slug: "ortuseight-hypersonic", brand: "Ortuseight", model: "Hypersonic", category: "race", local: true, previousFor: ["ortuseight-hypersonic-2"] },
  { slug: "ortuseight-hyperglide-3", brand: "Ortuseight", model: "Hyperglide 3.0", category: "tempo", local: true, previousFor: ["ortuseight-hyperglide-3-1"] },
  { slug: "ortuseight-hyperblast-2", brand: "Ortuseight", model: "Hyperblast 2.0", category: "daily", local: true, previousFor: ["ortuseight-hyperblast-2-1"] },

  { slug: "mills-enercharge-m1", brand: "MILLS", model: "Enercharge M1", category: "race", local: true, previousFor: ["mills-enercharge-m2"], sourceUrl: "https://mills.co.id/products/mills-sepatu-lari-running-shoes-enercharge-m1-white-ocean-blue-neon-lime-9105304" },
];

const existingLineage: Record<string, string> = {
  "puma-foreverrun-nitro-3": "puma-foreverrun-nitro-2",
  "ortuseight-hyperblast-3": "ortuseight-hyperblast-2-1",
  "ortuseight-hyperglide-4": "ortuseight-hyperglide-3-1",
};

function imageUrl(entry: HistoricalEntry, view: "Side" | "Top" | "Outsole") {
  const params = new URLSearchParams({ brand: entry.brand, model: entry.model, view, v: "1" });
  if (entry.sourceUrl) params.set("source", entry.sourceUrl);
  return `/api/legacy-shoe-image?${params.toString()}`;
}

function useCases(category: ShoeCategory, terrain: Terrain) {
  if (terrain === "trail") return category === "race" ? ["Trail race"] : ["Trail", "Long run"];
  if (category === "race") return ["Race"];
  if (category === "tempo" || category === "speed") return ["Tempo", "Daily"];
  if (category === "max-cushion") return ["Easy", "Long run"];
  if (category === "stability") return ["Daily", "Easy", "Support"];
  return ["Daily", "Easy"];
}

export const predecessorShoes: DemoShoe[] = entries.map((entry, index) => {
  const terrain = entry.terrain ?? "road";
  return {
    slug: entry.slug,
    brand: entry.brand,
    model: entry.model,
    category: entry.category,
    terrain,
    msrpIdr: null,
    currentPrice: null,
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: null,
    plate: null,
    sourceStatus: "catalog-only",
    sourceLabel: entry.sourceUrl ? "Historical product page" : "Historical model catalog",
    sourceUrl: entry.sourceUrl ?? null,
    description: `${entry.model} is the previous-generation reference for a current Runned catalog model.`,
    community,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: useCases(entry.category, terrain),
    accent: ["from-stone-200 to-stone-100", "from-zinc-200 to-zinc-100"][index % 2],
    images: [
      { label: "Side", url: imageUrl(entry, "Side") },
      { label: "Top", url: imageUrl(entry, "Top") },
      { label: "Outsole", url: imageUrl(entry, "Outsole") },
    ],
    isLocalIndonesia: Boolean(entry.local),
  };
});

export const previousModelByCurrentSlug: Record<string, string> = {
  ...existingLineage,
  ...Object.fromEntries(entries.flatMap((entry) => (entry.previousFor ?? []).map((currentSlug) => [currentSlug, entry.slug]))),
};
