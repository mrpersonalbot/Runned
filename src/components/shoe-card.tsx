import Link from "next/link";
import type { DemoShoe } from "@/lib/types";
import { formatIDR } from "@/lib/shoes/scoring.mjs";

export function ShoeCard({ shoe }: { shoe: DemoShoe }) {
  return (
    <Link href={`/shoes/${shoe.slug}`} className="group overflow-hidden rounded-[28px] border border-black/8 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      <div className={`relative flex h-52 items-end bg-gradient-to-br ${shoe.accent} p-6`}>
        <div className="absolute right-5 top-5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold backdrop-blur">{shoe.category}</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">{shoe.brand}</p>
          <h3 className="mt-1 text-2xl font-black tracking-tight">{shoe.model}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div><span className="text-lg font-black">{shoe.overallRating.toFixed(1)}</span><span className="ml-1 text-sm text-black/45">/ 5 · demo</span></div>
          <span className="text-sm font-semibold">{formatIDR(shoe.msrpIdr)}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/55">{shoe.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {shoe.useCases.map((useCase) => <span key={useCase} className="rounded-full bg-black/[0.045] px-3 py-1 text-xs font-medium">{useCase}</span>)}
        </div>
      </div>
    </Link>
  );
}
