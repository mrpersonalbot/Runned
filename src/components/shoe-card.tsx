import Link from "next/link";
import type { DemoShoe } from "@/lib/types";
import { formatIDR } from "@/lib/shoes/scoring.mjs";

export function ShoeCard({ shoe }: { shoe: DemoShoe }) {
  const price = shoe.currentPrice?.priceIdr ?? shoe.msrpIdr;
  const hasReviews = shoe.reviewCount > 0;

  return (
    <Link href={`/shoes/${shoe.slug}`} className="group overflow-hidden rounded-[28px] border border-black/8 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      <div className={`relative flex h-52 items-end bg-gradient-to-br ${shoe.accent} p-6`}>
        <div className="absolute left-5 top-5 flex gap-2">
          {shoe.isLocalIndonesia && <div className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">Indonesia</div>}
        </div>
        <div className="absolute right-5 top-5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold backdrop-blur">{shoe.category}</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">{shoe.brand}</p>
          <h3 className="mt-1 text-2xl font-black tracking-tight">{shoe.model}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {hasReviews ? <><span className="text-lg font-black">{shoe.overallRating.toFixed(1)}</span><span className="ml-1 text-sm text-black/45">/ 5 · demo</span></> : <span className="text-sm font-semibold text-black/40">No reviews yet</span>}
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">{formatIDR(price)}</div>
            {shoe.currentPrice && <div className="mt-1 text-[11px] text-black/40">checked {shoe.currentPrice.observedAt}</div>}
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/55">{shoe.description}</p>
        {shoe.currentPrice ? <p className="mt-3 text-xs text-black/45">Price source: {shoe.currentPrice.sourceLabel}</p> : <p className="mt-3 text-xs font-medium text-amber-700">Current Indonesia price not verified yet</p>}
        <div className="mt-5 flex flex-wrap gap-2">{shoe.useCases.map((useCase) => <span key={useCase} className="rounded-full bg-black/[0.045] px-3 py-1 text-xs font-medium">{useCase}</span>)}</div>
      </div>
    </Link>
  );
}
