import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { brandDirectory, demoShoes, localBrands } from "@/lib/data/demo-shoes";

export default function Home() {
  const pricedCount = demoShoes.filter((shoe) => shoe.currentPrice).length;

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:px-8 lg:pb-24 lg:pt-24">
        <div>
          <p className="eyebrow">The running shoe index</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.96] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
            A clearer way to choose your next pair.
          </h1>
        </div>
        <div className="max-w-md lg:pb-2">
          <p className="text-lg leading-8 text-black/65">
            Runned is a practical, Indonesia-first catalog of running shoes. Browse the models people actually run in, compare what is known, and see prices with a source and a date.
          </p>
          <Link href="#shoes" className="mt-7 inline-flex border-b border-black pb-1 text-sm font-semibold">
            Browse the catalog <span className="ml-2">↓</span>
          </Link>
        </div>
      </section>

      <section className="border-y border-black/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-black/10 px-5 sm:grid-cols-4 lg:px-8">
          <div className="py-6 pr-5"><p className="font-display text-3xl">{demoShoes.length}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/45">models listed</p></div>
          <div className="py-6 pl-5 sm:pl-6"><p className="font-display text-3xl">{brandDirectory.length}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/45">brand families</p></div>
          <div className="border-t border-black/10 py-6 pr-5 sm:border-t-0 sm:pl-6 sm:pr-0"><p className="font-display text-3xl">{pricedCount}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/45">price checks</p></div>
          <div className="border-t border-black/10 py-6 pl-5 sm:border-t-0 sm:pl-6"><p className="font-display text-3xl">ID</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/45">local brands included</p></div>
        </div>
      </section>

      <section id="shoes" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="mb-8 flex flex-col gap-3 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Current catalog</p><h2 className="mt-3 font-display text-4xl tracking-[-0.04em]">Find a shoe</h2></div>
          <Link href="/compare" className="text-sm font-semibold underline underline-offset-4">Compare two →</Link>
        </div>
        <CatalogBrowser shoes={demoShoes} />
        <p className="mt-7 max-w-2xl text-xs leading-5 text-black/45">
          Prices are snapshots, not promises. A model stays “unverified” until we can tie it to a current source. Community scores in this development catalog are not real reviews.
        </p>
      </section>

      <section className="border-t border-black/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-20">
          <div><p className="eyebrow">A note on the data</p><h2 className="mt-3 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em]">Useful beats impressive.</h2></div>
          <div className="max-w-2xl text-base leading-8 text-black/65">
            <p>Runned separates the shoe itself from the things that change around it: price, availability, and what runners think. That makes it easier to add new brands without turning every product page into a sales pitch.</p>
            <p className="mt-5">Indonesian brands are part of the main index, not a side category: {localBrands.join(", ")}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
