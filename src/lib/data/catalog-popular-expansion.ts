import type { DemoShoe, ShoeImageView } from "@/lib/types";

const community = {
  softness: 4,
  energyReturn: 4,
  stability: 4,
  fitWidth: 3,
  toeBox: 3,
  heelLockdown: 4,
  grip: 4,
  durability: 4,
  breathability: 4,
  value: 4,
};

function runtimeGallery(brand: string, model: string): ShoeImageView[] {
  return (["Side", "Top", "Outsole"] as const).map((view) => ({
    label: view,
    url: `/api/legacy-fast-image?${new URLSearchParams({ brand, model, view, v: "8" }).toString()}`,
  }));
}

type PopularShoeInput = {
  slug: string;
  brand: string;
  model: string;
  category: DemoShoe["category"];
  terrain?: DemoShoe["terrain"];
  msrpIdr?: number | null;
  weightG?: number | null;
  dropMm?: number | null;
  heelStackMm?: number | null;
  forefootStackMm?: number | null;
  midsole?: string | null;
  plate?: string | null;
  sourceLabel: string;
  sourceUrl: string;
  useCases?: string[];
};

function makeShoe(input: PopularShoeInput, index: number): DemoShoe {
  const images = runtimeGallery(input.brand, input.model);
  return {
    slug: input.slug,
    brand: input.brand,
    model: input.model,
    category: input.category,
    terrain: input.terrain ?? "road",
    msrpIdr: input.msrpIdr ?? null,
    currentPrice: null,
    weightG: input.weightG ?? null,
    dropMm: input.dropMm ?? null,
    heelStackMm: input.heelStackMm ?? null,
    forefootStackMm: input.forefootStackMm ?? null,
    midsole: input.midsole ?? null,
    plate: input.plate ?? null,
    sourceStatus: "catalog-only",
    sourceLabel: input.sourceLabel,
    sourceUrl: input.sourceUrl,
    description: `${input.model} is included in Runned's expanded popular-shoe catalog based on current 2026 editor, retail, and runner-interest signals.`,
    community,
    reviewCount: 0,
    overallRating: 0,
    buyAgainPct: 0,
    useCases: input.useCases ?? (input.terrain === "trail" ? ["Trail", "Long run"] : ["Daily", "Easy"]),
    accent: index % 2 === 0 ? "from-stone-200 to-stone-100" : "from-zinc-200 to-zinc-100",
    images,
    isLocalIndonesia: false,
  };
}

const popularInputs: PopularShoeInput[] = [
  {
    slug: "new-balance-1080-v15",
    brand: "New Balance",
    model: "1080v15",
    category: "max-cushion",
    msrpIdr: 2999000,
    midsole: "Infinion",
    plate: "None",
    sourceLabel: "New Balance Indonesia",
    sourceUrl: "https://www.newbalance.co.id/1080v15",
    useCases: ["Daily", "Long run", "Easy"],
  },
  {
    slug: "brooks-glycerin-23",
    brand: "Brooks",
    model: "Glycerin 23",
    category: "max-cushion",
    weightG: 301,
    dropMm: 8,
    midsole: "DNA TUNED",
    plate: "None",
    sourceLabel: "Brooks Running",
    sourceUrl: "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/glycerin-23/110476.html",
    useCases: ["Daily", "Long run", "Easy"],
  },
  {
    slug: "nike-structure-plus",
    brand: "Nike",
    model: "Structure Plus",
    category: "stability",
    msrpIdr: 2489000,
    weightG: 309,
    dropMm: 10,
    midsole: "ZoomX + ReactX",
    plate: "Midfoot support system",
    sourceLabel: "Nike Indonesia",
    sourceUrl: "https://www.nike.com/id/t/structure-plus-mens-road-running-shoes-bU4cV52D/HQ3048-001",
    useCases: ["Daily", "Long run", "Support"],
  },
  {
    slug: "saucony-paramount-max",
    brand: "Saucony",
    model: "Paramount Max",
    category: "max-cushion",
    sourceLabel: "Running Warehouse Best Running Shoes 2026",
    sourceUrl: "https://www.runningwarehouse.com/learningcenter/gear_guides/footwear/best_running_shoes.html",
    useCases: ["Easy", "Long run", "Recovery"],
  },
  {
    slug: "hoka-speedgoat-7",
    brand: "HOKA",
    model: "Speedgoat 7",
    category: "trail",
    terrain: "trail",
    sourceLabel: "Running Warehouse Best Running Shoes 2026",
    sourceUrl: "https://www.runningwarehouse.com/learningcenter/gear_guides/footwear/best_running_shoes.html",
    useCases: ["Trail", "Long run"],
  },
  {
    slug: "brooks-cascadia-elite",
    brand: "Brooks",
    model: "Cascadia Elite",
    category: "race",
    terrain: "trail",
    sourceLabel: "Runner's World 2026 Trail Shoe Awards",
    sourceUrl: "https://www.runnersworld.com/gear/a71306940/runners-world-shoe-awards-2026-trail-running-shoes/",
    useCases: ["Trail race", "Trail"],
  },
  {
    slug: "adidas-terrex-agravic-sl",
    brand: "adidas",
    model: "Terrex Agravic SL",
    category: "trail",
    terrain: "trail",
    sourceLabel: "Running Warehouse Best Running Shoes 2026",
    sourceUrl: "https://www.runningwarehouse.com/learningcenter/gear_guides/footwear/best_running_shoes.html",
    useCases: ["Trail", "Daily"],
  },
  {
    slug: "nike-acg-ultrafly-trail",
    brand: "Nike",
    model: "ACG Ultrafly Trail",
    category: "race",
    terrain: "trail",
    weightG: 287,
    dropMm: 8.5,
    midsole: "ZoomX",
    plate: "Carbon-fibre Flyplate",
    sourceLabel: "Nike Indonesia",
    sourceUrl: "https://www.nike.com/id/t/acg-ultrafly-trail-racing-shoes-lnyZAtQW/HF5668-400",
    useCases: ["Trail race", "Trail"],
  },
  {
    slug: "adidas-adizero-evo-sl-atr",
    brand: "adidas",
    model: "Adizero EVO SL ATR",
    category: "tempo",
    terrain: "mixed",
    msrpIdr: 2600000,
    midsole: "Lightstrike Pro",
    plate: "None",
    sourceLabel: "adidas Indonesia",
    sourceUrl: "https://www.adidas.co.id/id/sepatu-adizero-evo-sl-atr/KK2683.html",
    useCases: ["Tempo", "Daily", "Mixed terrain"],
  },
  {
    slug: "puma-fast-fwd-nitro-elite-2",
    brand: "Puma",
    model: "Fast-FWD NITRO Elite 2",
    category: "race",
    sourceLabel: "Running Warehouse Best Running Shoes 2026",
    sourceUrl: "https://www.runningwarehouse.com/learningcenter/gear_guides/footwear/best_running_shoes.html",
    useCases: ["Race", "Speed"],
  },
  {
    slug: "mizuno-wave-rider-30",
    brand: "Mizuno",
    model: "Wave Rider 30",
    category: "daily",
    sourceLabel: "Mizuno 2026 launch",
    sourceUrl: "https://corp.mizuno.com/jp/news-release/2026/20260610",
    useCases: ["Daily", "Easy", "Long run"],
  },
  {
    slug: "saucony-endorphin-azura",
    brand: "Saucony",
    model: "Endorphin Azura",
    category: "tempo",
    sourceLabel: "Runner's World 2026 Shoe Awards",
    sourceUrl: "https://www.runnersworld.com/gear/a71282549/runners-world-shoe-awards-2026-training-shoes/",
    useCases: ["Tempo", "Daily", "Long run"],
  },
  {
    slug: "brooks-glycerin-flex",
    brand: "Brooks",
    model: "Glycerin Flex",
    category: "daily",
    weightG: 258,
    dropMm: 6,
    plate: "None",
    sourceLabel: "Brooks Running",
    sourceUrl: "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/glycerin-flex/110478.html",
    useCases: ["Daily", "Long run", "Gym"],
  },
  {
    slug: "new-balance-ellipse-v1",
    brand: "New Balance",
    model: "Ellipse v1",
    category: "daily",
    msrpIdr: 2599000,
    midsole: "Infinion + Fresh Foam X",
    plate: "None",
    sourceLabel: "New Balance Indonesia",
    sourceUrl: "https://www.newbalance.co.id/ellipse",
    useCases: ["Daily", "Easy"],
  },
  {
    slug: "asics-gel-kayano-32",
    brand: "ASICS",
    model: "GEL-KAYANO 32",
    category: "stability",
    sourceLabel: "2026 popular-shoe expansion",
    sourceUrl: "https://www.runnersworld.com/gear/a19663621/best-running-shoes/",
    useCases: ["Daily", "Long run", "Support"],
  },
  {
    slug: "nike-vomero-premium",
    brand: "Nike",
    model: "Vomero Premium",
    category: "max-cushion",
    msrpIdr: 3399000,
    weightG: 351,
    dropMm: 10,
    heelStackMm: 55,
    midsole: "ZoomX + dual Air Zoom",
    plate: "None",
    sourceLabel: "Nike Indonesia",
    sourceUrl: "https://www.nike.com/id/t/vomero-road-running-shoes-hXyNZRLM/HQ2050-701",
    useCases: ["Daily", "Long run", "Recovery"],
  },
  {
    slug: "hoka-cielo-x1-3",
    brand: "HOKA",
    model: "Cielo X1 3.0",
    category: "race",
    weightG: 193,
    midsole: "PEBA superfoam",
    plate: "Carbon-fibre plate",
    sourceLabel: "Runner's World 2026 review",
    sourceUrl: "https://www.runnersworld.com/gear/a70185814/hoka-cielo-x1-3-review/",
    useCases: ["Race", "Marathon"],
  },
  {
    slug: "brooks-hyperion-max-3",
    brand: "Brooks",
    model: "Hyperion Max 3",
    category: "tempo",
    sourceLabel: "2026 popular-shoe expansion",
    sourceUrl: "https://www.runnersworld.com/gear/a19663621/best-running-shoes/",
    useCases: ["Tempo", "Speed", "Long run"],
  },
  {
    slug: "asics-gel-cumulus-27",
    brand: "ASICS",
    model: "GEL-CUMULUS 27",
    category: "daily",
    sourceLabel: "2026 popular-shoe expansion",
    sourceUrl: "https://www.runnersworld.com/gear/a19663621/best-running-shoes/",
    useCases: ["Daily", "Easy"],
  },
  {
    slug: "hoka-arahi-8",
    brand: "HOKA",
    model: "Arahi 8",
    category: "stability",
    sourceLabel: "2026 popular-shoe expansion",
    sourceUrl: "https://www.runnersworld.com/gear/a19663621/best-running-shoes/",
    useCases: ["Daily", "Support", "Easy"],
  },
];

export const popularExpansionShoes: DemoShoe[] = popularInputs.map(makeShoe);
