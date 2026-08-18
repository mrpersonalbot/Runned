export type ShoeCategory = "daily" | "tempo" | "race" | "max-cushion" | "trail";
export type Terrain = "road" | "trail" | "mixed";
export type SpecStatus = "verified" | "catalog-only";

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

export type DemoShoe = {
  slug: string;
  brand: string;
  model: string;
  category: ShoeCategory;
  terrain: Terrain;
  msrpIdr: number | null;
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
};
