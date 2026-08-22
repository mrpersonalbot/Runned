import { NextResponse } from "next/server";
import { demoShoes } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

const required = ["Side", "Top", "Outsole"] as const;

export function GET() {
  const rows = demoShoes.map((shoe) => {
    const labels = shoe.images.map((image) => image.label);
    const urls = shoe.images.map((image) => image.url);
    const missing = required.filter((label) => !labels.includes(label));
    const duplicateLabels = required.filter((label) => labels.filter((item) => item === label).length > 1);
    const unexpected = labels.filter((label) => !required.includes(label as (typeof required)[number]));
    const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index);
    const ok = shoe.images.length === 3 && missing.length === 0 && duplicateLabels.length === 0 && unexpected.length === 0 && duplicateUrls.length === 0;

    return {
      slug: shoe.slug,
      brand: shoe.brand,
      model: shoe.model,
      imageCount: shoe.images.length,
      labels,
      missing,
      duplicateLabels,
      unexpected,
      duplicateUrls: Array.from(new Set(duplicateUrls)),
      ok,
    };
  });

  return NextResponse.json({
    total: rows.length,
    passing: rows.filter((row) => row.ok).length,
    failing: rows.filter((row) => !row.ok).length,
    failures: rows.filter((row) => !row.ok),
  });
}
