import Link from "next/link";
import type { DemoShoe } from "@/lib/types";
import { formatIDR } from "@/lib/shoes/scoring.mjs";
import { FastCardImage } from "@/components/fast-card-image";

export function ShoeCard({ shoe }: { shoe: DemoShoe }) {
  const price = shoe.msrpIdr ?? shoe.currentPrice?.priceIdr ?? null;
  const detailImage = shoe.images.find((item) => item.label === "Side") ?? shoe.images[0];
  const cardImage = shoe.cardImageUrl ?? detailImage?.url ?? null;

  return (
    <Link href={`/shoes/${shoe.slug}`} className="group overflow-hidden bg-white transition hover:bg-[#fbfaf7]">
      <div className="relative aspect-[4/3] border-b border-black/10 bg-white p-5">
        <div className="absolute right-5 top-5 z-10 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">{shoe.category}</div>
        {cardImage && (
          <FastCardImage
            src={cardImage}
            brand={shoe.brand}
            model={shoe.model}
            slug={shoe.slug}
            alt={`${shoe.brand} ${shoe.model} product photo`}
            className="transition duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/50">{shoe.brand}</p>
        <h3 className="mt-1 font-display text-2xl leading-none tracking-[-0.03em]">{shoe.model}</h3>
        <div className="mt-5 flex items-end justify-between gap-3">
          <p className="text-xs text-black/45">{shoe.useCases.join(" · ")}</p>
          <div className="text-right">{price ? <><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/40">Retail price</p><div className="mt-1 text-sm font-bold">{formatIDR(price)}</div></> : <div className="text-sm text-black/45">Retail price unavailable</div>}</div>
        </div>
      </div>
    </Link>
  );
}
