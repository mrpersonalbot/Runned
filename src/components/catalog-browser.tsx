"use client";

import { useMemo, useState } from "react";
import { ShoeCard } from "@/components/shoe-card";
import type { DemoShoe } from "@/lib/types";

export function CatalogBrowser({ shoes }: { shoes: DemoShoe[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [localOnly, setLocalOnly] = useState(false);
  const [pricedOnly, setPricedOnly] = useState(false);

  const brands = useMemo(() => [...new Set(shoes.map((shoe) => shoe.brand))].sort(), [shoes]);
  const categories = useMemo(() => [...new Set(shoes.map((shoe) => shoe.category))].sort(), [shoes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shoes.filter((shoe) => {
      if (q && !`${shoe.brand} ${shoe.model}`.toLowerCase().includes(q)) return false;
      if (brand !== "all" && shoe.brand !== brand) return false;
      if (category !== "all" && shoe.category !== category) return false;
      if (localOnly && !shoe.isLocalIndonesia) return false;
      if (pricedOnly && !shoe.currentPrice) return false;
      return true;
    });
  }, [shoes, query, brand, category, localOnly, pricedOnly]);

  return (
    <div>
      <div className="grid gap-3 rounded-[28px] border border-black/10 bg-white p-4 md:grid-cols-[1.5fr_1fr_1fr_auto_auto]">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand or model…" className="rounded-2xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm outline-none" />
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-2xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm">
          <option value="all">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm">
          <option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="flex items-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm"><input type="checkbox" checked={localOnly} onChange={(e) => setLocalOnly(e.target.checked)} /> Indonesia</label>
        <label className="flex items-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm"><input type="checkbox" checked={pricedOnly} onChange={(e) => setPricedOnly(e.target.checked)} /> Priced</label>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-black/50"><span>{filtered.length} models shown</span><span>{shoes.filter((shoe) => shoe.currentPrice).length} with verified current prices</span></div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((shoe) => <ShoeCard key={shoe.slug} shoe={shoe} />)}</div>
      {filtered.length === 0 && <div className="mt-8 rounded-[28px] border border-dashed border-black/15 p-12 text-center text-black/50">No shoes match these filters yet.</div>}
    </div>
  );
}
