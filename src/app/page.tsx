import Link from "next/link";
import { ShoeCard } from "@/components/shoe-card";
import { demoShoes, localBrands } from "@/lib/data/demo-shoes";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-black/45">Indonesia · Community-powered</p>
          <h1 className="text-balance text-5xl font-black leading-[0.93] tracking-[-0.065em] sm:text-7xl lg:text-[92px]">The running shoe database built by runners.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-black/58">Specs tell you what a shoe is. Runners tell you what it feels like. Runned combines both so you can find the right shoe for your run.</p>
        </div>
        <form action="/#shoes" className="mt-10 flex max-w-2xl gap-2 rounded-full border border-black/10 bg-white p-2 shadow-sm">
          <input aria-label="Search shoes" placeholder="Search Superblast, EVO SL, Pegasus…" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" />
          <button className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white">Search shoes</button>
        </form>
        <div className="mt-10 grid max-w-3xl grid-cols-3 gap-4 border-t border-black/10 pt-7">
          <div><p className="text-2xl font-black">1 page</p><p className="mt-1 text-xs text-black/45">per canonical shoe</p></div>
          <div><p className="text-2xl font-black">10 signals</p><p className="mt-1 text-xs text-black/45">per structured review</p></div>
          <div><p className="text-2xl font-black">ID-first</p><p className="mt-1 text-xs text-black/45">prices & local brands</p></div>
        </div>
      </section>

      <section id="shoes" className="border-y border-black/8 bg-white/45 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">Foundation catalog</p><h2 className="mt-2 text-3xl font-black tracking-tight">Explore shoes</h2></div><Link href="/compare" className="text-sm font-bold underline underline-offset-4">Compare two →</Link></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{demoShoes.map((shoe) => <ShoeCard key={shoe.slug} shoe={shoe} />)}</div>
          <p className="mt-5 text-xs text-black/40">Community ratings shown in this development foundation are synthetic demo data and are labeled as such. Verified manufacturer specs retain source metadata.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">The moat</p><h2 className="mt-3 max-w-xl text-4xl font-black tracking-[-0.04em]">Not another review blog. A runner × shoe preference graph.</h2><p className="mt-5 max-w-xl leading-7 text-black/55">Every structured review connects shoe perception to the runner behind it: pace, mileage, body profile, foot characteristics, and use case. Over time, Runned can answer who a shoe is actually for.</p></div>
        <div className="rounded-[32px] bg-black p-7 text-white"><p className="text-sm font-bold text-white/45">Example future insight</p><p className="mt-6 text-2xl font-bold leading-snug">“84% of runners with a similar profile prefer this shoe for long runs.”</p><div className="mt-8 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[84%] rounded-full bg-white" /></div><p className="mt-3 text-xs text-white/45">Powered by real Runned reviews, not editorial guessing.</p></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"><div className="rounded-[36px] border border-black/10 p-8 lg:p-12"><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">Indonesia is first-class</p><div className="mt-5 flex flex-wrap gap-3">{localBrands.map((brand) => <span key={brand} className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white">{brand}</span>)}</div><p className="mt-6 max-w-2xl text-sm leading-6 text-black/55">Local brands will live in the same standardized catalog as Nike, adidas, ASICS, HOKA and others—without being treated as an afterthought.</p></div></section>
    </>
  );
}
