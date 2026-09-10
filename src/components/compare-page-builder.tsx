"use client";

import { useSearchParams } from "next/navigation";
import { CompareBuilder } from "@/components/compare-builder";
import type { DemoShoe } from "@/lib/types";

export function ComparePageBuilder({ shoes }: { shoes: DemoShoe[] }) {
  const params = useSearchParams();
  const first = params.get("a") ?? shoes[0]?.slug ?? "";
  const second = params.get("b") ?? shoes.find((shoe) => shoe.slug !== first)?.slug ?? "";
  return <CompareBuilder shoes={shoes} initial={[first, second, params.get("c") ?? ""]} />;
}
