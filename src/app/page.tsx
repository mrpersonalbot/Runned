import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { brandDirectory, demoShoes, localBrands } from "@/lib/data/demo-shoes";

export default function Home() {
  const pricedCount = demoShoes.filter((shoe) => shoe.currentPrice).length;
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-black/45">Indonesia · Community-powered</p>
          <h1 className="text-balance text-5xl font-black leading-[0.93] tracking-[-0.065em] sm:text-7xl lg:text-[92px]">Every running shoe. One comparable database.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-black/58">Browse global and Indonesian running shoes, compare structured specs and runner perception, and see Indonesian prices with source and freshness—not anonymous numbers.</p>
        </div>
        <div className="mt-10 grid max-w-4xl grid-cols-2 gap-4 border-t border-black/10 pt-7 md:grid-cols-4">
          <div><p className="text-2xl font-black">{brandDirectory.length}</p><p className="mt-1 text-xs text-black/45">brand families seeded</p></div>
          <div><p className="text-2xl font-black">{demoShoes.length}</p><p className="mt-1 text-xs text-black/45">models in current catalog</p></div>
          <div><p className="text-2xl font-black">{pricedCount}</p><p className="mt-1 text-xs text-black/45">verified price snapshots</p></div>
          <div><p className="text-2xl font-black">ID-first</p><p className="mt-1 text-xs text-black/45">local brands & prices</p></div>
        </div>
      </section>

      <section id="shoes" className="border-y border-black/8 bg-white/45 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">Running-shoe catalog</p><h2 className="mt-2 text-3xl font-black tracking-tight">Find a shoe</h2></div>
            <Link href="/compare" className="text-sm font-bold underline underline-offset-4">Compare two →</Link>
          </div>
          <CatalogBrowser shoes={demoShoes} />
          <p className="mt-6 text-xs leading-5 text-black/40">Catalog coverage grows continuously. A missing price remains missing until a source is verified. Community ratings in this development build are synthetic demo values only.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">Price intelligence</p><h2 className="mt-3 max-w-xl text-4xl font-black tracking-[-0.04em]">Price is a time series, not a static field.</h2><p className="mt-5 max-w-xl leading-7 text-black/55">Every offer can retain retailer, product URL, stock status and observation time. That lets Runned show current price, historical price, official MSRP and eventually price alerts without corrupting the canonical shoe record.</p></div>
        <div className="rounded-[32px] bg-black p-7 text-white"><p className="text-sm font-bold text-white/45">Catalog rule</p><p className="mt-6 text-2xl font-bold leading-snug">No source = no “current price.”</p><p className="mt-4 text-sm leading-6 text-white/55">Runned should prefer an honest unknown over an old marketplace price presented as current.</p></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"><div className="rounded-[36px] border border-black/10 p-8 lg:p-12"><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">Indonesia is first-class</p><div className="mt-5 flex flex-wrap gap-3">{localBrands.map((brand) => <span key={brand} className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white">{brand}</span>)}</div><p className="mt-6 max-w-2xl text-sm leading-6 text-black/55">910 Nineten, Ortuseight, MILLS and Specs use the same catalog, review and price model as Nike, adidas, ASICS, HOKA and other global brands.</p></div></section>
    </>
  );
}
