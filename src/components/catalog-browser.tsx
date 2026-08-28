"use client";

import { useMemo, useState } from "react";
import { ShoeCard } from "@/components/shoe-card";
import type { DemoShoe } from "@/lib/types";

type SortOption = "featured" | "price-asc" | "price-desc" | "brand-asc" | "model-asc" | "weight-asc";

const PAGE_SIZE = 15;

export function CatalogBrowser({ shoes }: { shoes: DemoShoe[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [pricedOnly, setPricedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const brands = useMemo(() => [...new Set(shoes.map((shoe) => shoe.brand))].sort(), [shoes]);
  const categories = useMemo(() => [...new Set(shoes.map((shoe) => shoe.category))].sort(), [shoes]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = shoes.filter((shoe) => {
      if (q && !`${shoe.brand} ${shoe.model}`.toLowerCase().includes(q)) return false;
      if (brand !== "all" && shoe.brand !== brand) return false;
      if (category !== "all" && shoe.category !== category) return false;
      if (pricedOnly && shoe.msrpIdr == null) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      const priceA = a.msrpIdr ?? a.currentPrice?.priceIdr ?? Number.POSITIVE_INFINITY;
      const priceB = b.msrpIdr ?? b.currentPrice?.priceIdr ?? Number.POSITIVE_INFINITY;

      if (sort === "price-asc") return priceA - priceB;
      if (sort === "price-desc") return (Number.isFinite(priceB) ? priceB : -1) - (Number.isFinite(priceA) ? priceA : -1);
      if (sort === "brand-asc") return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
      if (sort === "model-asc") return a.model.localeCompare(b.model);
      if (sort === "weight-asc") {
        const weightA = a.weightG ?? Number.POSITIVE_INFINITY;
        const weightB = b.weightG ?? Number.POSITIVE_INFINITY;
        return weightA - weightB;
      }
      return 0;
    });
  }, [shoes, query, brand, category, pricedOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleShoes = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  function resetPage() {
    setPage(1);
  }

  function goToPage(nextPage: number) {
    setPage(Math.min(totalPages, Math.max(1, nextPage)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="grid gap-0 border-y border-black/10 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <input
          aria-label="Search by brand or model"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            resetPage();
          }}
          placeholder="Search brand or model…"
          className="min-w-0 border-b border-black/10 bg-transparent px-0 py-4 text-sm outline-none placeholder:text-black/40 md:border-b-0 md:pr-5"
        />
        <select
          aria-label="Filter by brand"
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            resetPage();
          }}
          className="border-b border-black/10 bg-transparent px-0 py-4 text-sm outline-none md:border-b-0 md:border-l md:pl-5"
        >
          <option value="all">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            resetPage();
          }}
          className="border-b border-black/10 bg-transparent px-0 py-4 text-sm outline-none md:border-b-0 md:border-l md:pl-5"
        >
          <option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select
          aria-label="Sort shoes"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortOption);
            resetPage();
          }}
          className="border-b border-black/10 bg-transparent px-0 py-4 text-sm outline-none md:border-b-0 md:border-l md:pl-5"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="brand-asc">Brand: A to Z</option>
          <option value="model-asc">Model: A to Z</option>
          <option value="weight-asc">Weight: Lightest first</option>
        </select>
        <label className="flex items-center gap-2 py-4 text-sm md:border-l md:pl-5">
          <input
            type="checkbox"
            checked={pricedOnly}
            onChange={(e) => {
              setPricedOnly(e.target.checked);
              resetPage();
            }}
          /> Priced
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-black/50">
        <span>
          {filtered.length === 0 ? "0 models" : `${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} of ${filtered.length} models`}
        </span>
        <span>{shoes.filter((shoe) => shoe.msrpIdr != null).length} retail prices</span>
      </div>

      <div className="mt-6 grid gap-px border-l border-t border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleShoes.map((shoe) => <ShoeCard key={shoe.slug} shoe={shoe} />)}
      </div>

      {filtered.length > PAGE_SIZE && (
        <nav aria-label="Catalog pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-black/10 pt-6">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="min-w-20 border border-black/15 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            Previous
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-current={pageNumber === currentPage ? "page" : undefined}
              onClick={() => goToPage(pageNumber)}
              className={`h-9 min-w-9 border px-3 text-sm ${pageNumber === currentPage ? "border-black bg-black text-white" : "border-black/15 bg-transparent text-black"}`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="min-w-20 border border-black/15 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </nav>
      )}

      {filtered.length === 0 && <div className="mt-8 border border-dashed border-black/15 p-12 text-center text-black/50">No shoes match these filters yet.</div>}
    </div>
  );
}
