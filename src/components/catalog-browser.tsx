"use client";

import { useMemo, useState } from "react";
import { ShoeCard } from "@/components/shoe-card";
import type { DemoShoe } from "@/lib/types";

export function CatalogBrowser({ shoes }: { shoes: DemoShoe[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [pricedOnly, setPricedOnly] = useState(false);

  const brands = useMemo(() => [...new Set(shoes.map((shoe) => shoe.brand))].sort(), [shoes]);
  const categories = useMemo(() => [...new Set(shoes.map((shoe) => shoe.category))].sort(), [shoes]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shoes.filter((shoe) => {
      if (q && !`${shoe.brand} ${shoe.model}`.toLowerCase().includes(q)) return false;
      if (brand !== "all" && shoe.brand !== brand) return false;
      if (category !== "all" && shoe.category !== category) return false;
      if (pricedOnly && shoe.msrpIdr == null) return false;
      return true;
    });
  }, [shoes, query, brand, category, pricedOnly]);

  return (
    <div>
      <div className="grid gap-0 border-y border-black/10 md:grid-cols-[1.6fr_1fr_1fr_auto]">
        <input aria-label="Search by brand or model" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand or model…" className="min-w-0 border-b border-black/10 bg-transparent px-0 py-4 text-sm outline-none placeholder:text-black/40 md:border-b-0 md:pr-5" />
        <select aria-label="Filter by brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="border-b border-black/10 bg-transparent px-0 py-4 text-sm outline-none md:border-b-0 md:border-l md:pl-5">
          <option value="all">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="border-b border-black/10 bg-transparent px-0 py-4 text-sm outline-none md:border-b-0 md:border-l md:pl-5">
          <option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="flex items-center gap-2 py-4 text-sm md:border-l md:pl-5"><input type="checkbox" checked={pricedOnly} onChange={(e) => setPricedOnly(e.target.checked)} /> Priced</label>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-black/50"><span>{filtered.length} models shown</span><span>{shoes.filter((shoe) => shoe.msrpIdr != null).length} retail prices</span></div>
      <div className="mt-6 grid gap-px border-l border-t border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((shoe) => <ShoeCard key={shoe.slug} shoe={shoe} />)}</div>
      {filtered.length === 0 && <div className="mt-8 border border-dashed border-black/15 p-12 text-center text-black/50">No shoes match these filters yet.</div>}
    </div>
  );
}
