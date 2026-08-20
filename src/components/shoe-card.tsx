import Link from "next/link";
import type { DemoShoe } from "@/lib/types";
import { formatIDR } from "@/lib/shoes/scoring.mjs";

export function ShoeCard({ shoe }: { shoe: DemoShoe }) {
  const price = shoe.currentPrice?.priceIdr ?? shoe.msrpIdr;
  const tone = shoe.isLocalIndonesia ? "bg-[#e4d2c2]" : shoe.category === "race" ? "bg-[#d9dfdc]" : shoe.category === "tempo" ? "bg-[#e4e0ce]" : shoe.category === "max-cushion" ? "bg-[#d8dce4]" : "bg-[#e7e2db]";

  return (
    <Link href={`/shoes/${shoe.slug}`} className="group overflow-hidden bg-white transition hover:bg-[#fbfaf7]">
      <div className={`relative flex h-44 items-end ${tone} p-5`}>
        <div className="absolute left-5 top-5">
          {shoe.isLocalIndonesia && <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/60">Indonesia</div>}
        </div>
        <div className="absolute right-5 top-5 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">{shoe.category}</div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/50">{shoe.brand}</p>
          <h3 className="mt-1 font-display text-2xl leading-none tracking-[-0.03em]">{shoe.model}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>{shoe.reviewCount > 0 ? <><span className="text-lg font-bold">{shoe.overallRating.toFixed(1)}</span><span className="ml-1 text-xs text-black/45">/ 5 · demo</span></> : <span className="text-xs text-black/45">No reviews yet</span>}</div>
          <div className="text-right">{price ? <div className="text-sm font-bold">{formatIDR(price)}</div> : <div className="text-sm text-black/45">Price unverified</div>}{shoe.currentPrice && <div className="mt-1 text-[11px] text-black/40">checked {shoe.currentPrice.observedAt}</div>}</div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-black/60">{shoe.description}</p>
        <p className="mt-4 border-t border-black/10 pt-3 text-xs text-black/45">{shoe.currentPrice ? `Source: ${shoe.currentPrice.sourceLabel}` : "Current Indonesia price not verified"}</p>
        <p className="mt-3 text-xs text-black/45">{shoe.useCases.join(" · ")}</p>
      </div>
    </Link>
  );
}
