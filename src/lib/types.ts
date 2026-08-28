export type ShoeCategory = "daily" | "tempo" | "race" | "max-cushion" | "trail" | "stability" | "speed";
export type Terrain = "road" | "trail" | "mixed";
export type SpecStatus = "verified" | "catalog-only";
export type PriceSourceType = "official-brand" | "official-marketplace" | "retailer";

export type CommunityPerception = {
  softness: number;
  energyReturn: number;
  stability: number;
  fitWidth: number;
  toeBox: number;
  heelLockdown: number;
  grip: number;
  durability: number;
  breathability: number;
  value: number;
};

export type PriceSnapshot = {
  priceIdr: number;
  listPriceIdr?: number | null;
  sourceLabel: string;
  sourceUrl: string;
  sourceType: PriceSourceType;
  observedAt: string;
  inStock?: boolean | null;
};

export type ShoeImageView = {
  label: "Side" | "Top" | "Outsole" | "Alternate" | "Rear";
  url: string;
};

export type DemoShoe = {
  slug: string;
  brand: string;
  model: string;
  category: ShoeCategory;
  terrain: Terrain;
  msrpIdr: number | null;
  currentPrice?: PriceSnapshot | null;
  weightG: number | null;
  dropMm: number | null;
  heelStackMm: number | null;
  forefootStackMm: number | null;
  midsole: string | null;
  plate: string | null;
  sourceStatus: SpecStatus;
  sourceLabel: string;
  sourceUrl: string | null;
  description: string;
  community: CommunityPerception;
  reviewCount: number;
  overallRating: number;
  buyAgainPct: number;
  useCases: string[];
  accent: string;
  images: ShoeImageView[];
  cardImageUrl?: string | null;
  isLocalIndonesia?: boolean;
};

export type BrandDirectoryEntry = {
  slug: string;
  name: string;
  countryCode?: string;
  isLocalIndonesia?: boolean;
};
