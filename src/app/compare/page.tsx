import { ComparePageBuilder } from "@/components/compare-page-builder";
import { demoShoes } from "@/lib/data/catalog";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Runned compare</p>
      <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[.96] tracking-[-0.05em] lg:text-7xl">Compare up to three shoes.</h1>
      <p className="mt-4 max-w-2xl text-black/55">Choose each column yourself and compare the product specifications that matter without extra recommendation links below the table.</p>
      <div className="mt-10"><Suspense fallback={null}><ComparePageBuilder shoes={demoShoes} /></Suspense></div>
    </div>
  );
}
import { Suspense } from "react";
