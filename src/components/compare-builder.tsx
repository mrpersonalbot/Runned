"use client";

import { useMemo, useState } from "react";
import type { DemoShoe } from "@/lib/types";
import { formatIDR } from "@/lib/shoes/scoring.mjs";
import { ProductImage } from "@/components/product-image";

export function CompareBuilder({ shoes, initial }: { shoes: DemoShoe[]; initial: [string, string, string?] }) {
  const fallbackA = shoes[0]?.slug ?? "";
  const fallbackB = shoes.find((shoe) => shoe.slug !== fallbackA)?.slug ?? fallbackA;
  const [slots, setSlots] = useState<[string, string, string]>([
    initial[0] || fallbackA,
    initial[1] || fallbackB,
    initial[2] || "",
  ]);

  const selected = useMemo(() => slots.map((slug) => shoes.find((shoe) => shoe.slug === slug) ?? null), [slots, shoes]);
  const visible = selected.filter((shoe): shoe is DemoShoe => Boolean(shoe));
  const gridTemplateColumns = `minmax(130px,.75fr) repeat(${Math.max(visible.length, 1)}, minmax(190px,1fr))`;

  const rows = [
    ["Retail price", (shoe: DemoShoe) => formatIDR(shoe.msrpIdr)],
    ["Weight", (shoe: DemoShoe) => shoe.weightG ? `${shoe.weightG} g` : "Not published"],
    ["Drop", (shoe: DemoShoe) => shoe.dropMm != null ? `${shoe.dropMm} mm` : "Not published"],
    ["Stack", (shoe: DemoShoe) => shoe.heelStackMm != null && shoe.forefootStackMm != null ? `${shoe.heelStackMm} / ${shoe.forefootStackMm} mm` : "Not published"],
    ["Midsole", (shoe: DemoShoe) => shoe.midsole ?? "Not published"],
    ["Plate", (shoe: DemoShoe) => shoe.plate ?? "None"],
    ["Category", (shoe: DemoShoe) => shoe.category],
    ["Terrain", (shoe: DemoShoe) => shoe.terrain],
  ] as const;

  function updateSlot(index: number, value: string) {
    setSlots((current) => {
      const next = [...current] as [string, string, string];
      next[index] = value;
      return next;
    });
  }

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <label key={index} className="border border-black/10 bg-white p-4 text-xs font-bold uppercase tracking-[0.12em] text-black/45">
            Shoe {index + 1}{index === 2 ? " · optional" : ""}
            <select
              value={slots[index]}
              onChange={(event) => updateSlot(index, event.target.value)}
              className="mt-3 w-full border-t border-black/10 bg-white pt-3 text-sm font-semibold normal-case tracking-normal text-black outline-none"
            >
              {index === 2 && <option value="">No third shoe</option>}
              {shoes.map((shoe) => <option key={shoe.slug} value={shoe.slug}>{shoe.brand} — {shoe.model}</option>)}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto border border-black/10 bg-white">
        <div className="min-w-[760px]">
          <div className="grid bg-black text-white" style={{ gridTemplateColumns }}>
            <div className="p-4" />
            {visible.map((shoe) => (
              <div key={shoe.slug} className="border-l border-white/15 p-4">
                <div className="aspect-[4/3] bg-white p-3">
                  {shoe.images[0] && <ProductImage src={shoe.images[0].url} alt={`${shoe.brand} ${shoe.model}`} className="transition" />}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/45">{shoe.brand}</p>
                <p className="mt-1 font-display text-2xl leading-none">{shoe.model}</p>
              </div>
            ))}
          </div>

          {rows.map(([label, value]) => (
            <div key={label} className="grid border-t border-black/10 text-sm" style={{ gridTemplateColumns }}>
              <div className="p-4 text-black/45">{label}</div>
              {visible.map((shoe) => <div key={`${label}-${shoe.slug}`} className="border-l border-black/10 p-4 font-semibold">{value(shoe)}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
