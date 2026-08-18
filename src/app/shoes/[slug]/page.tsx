import Link from "next/link";
import { notFound } from "next/navigation";
import { PerceptionBars } from "@/components/perception-bars";
import { demoShoes, getDemoShoe } from "@/lib/data/demo-shoes";
import { confidenceScore, formatIDR } from "@/lib/shoes/scoring.mjs";

export function generateStaticParams() { return demoShoes.map((shoe) => ({ slug: shoe.slug })); }

export default async function ShoePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shoe = getDemoShoe(slug);
  if (!shoe) notFound();
  const specs = [
    ["Weight", shoe.weightG ? `${shoe.weightG} g` : "Pending"],
    ["Drop", shoe.dropMm != null ? `${shoe.dropMm} mm` : "Pending"],
    ["Stack", shoe.heelStackMm != null && shoe.forefootStackMm != null ? `${shoe.heelStackMm} / ${shoe.forefootStackMm} mm` : "Pending"],
    ["Midsole", shoe.midsole ?? "Pending"],
    ["Plate", shoe.plate ?? "Pending"],
    ["Terrain", shoe.terrain],
  ];
  return <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
    <div className={`rounded-[40px] bg-gradient-to-br ${shoe.accent} p-8 lg:p-12`}>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-black/45">{shoe.brand}</p><h1 className="mt-2 text-5xl font-black tracking-[-0.055em] lg:text-7xl">{shoe.model}</h1>
      <div className="mt-8 flex flex-wrap gap-3">{shoe.useCases.map((item) => <span key={item} className="rounded-full bg-white/65 px-4 py-2 text-sm font-semibold backdrop-blur">{item}</span>)}</div>
    </div>
    <div className="grid gap-8 py-10 lg:grid-cols-[.8fr_1.2fr]">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-black/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-black/40">Community snapshot · demo</p><div className="mt-5 flex items-end gap-2"><span className="text-5xl font-black">{shoe.overallRating.toFixed(1)}</span><span className="pb-1 text-black/40">/ 5</span></div><p className="mt-2 text-sm text-black/55">{shoe.reviewCount} synthetic foundation reviews · {shoe.buyAgainPct}% would buy again</p><p className="mt-4 text-xs text-black/40">Confidence prototype: {confidenceScore(shoe.reviewCount)}/100</p></div>
        <div className="rounded-[28px] border border-black/10 bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-black">Manufacturer specs</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${shoe.sourceStatus === "verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{shoe.sourceStatus}</span></div><dl className="mt-5 divide-y divide-black/7">{specs.map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/45">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>)}</dl><div className="mt-5 border-t border-black/7 pt-4"><p className="text-xs text-black/40">MSRP Indonesia</p><p className="mt-1 text-lg font-black">{formatIDR(shoe.msrpIdr)}</p>{shoe.sourceUrl && <a className="mt-2 inline-block text-xs font-semibold underline underline-offset-4" href={shoe.sourceUrl} target="_blank" rel="noreferrer">Source: {shoe.sourceLabel}</a>}</div></div>
      </div>
      <div className="rounded-[28px] border border-black/10 bg-white p-6 lg:p-8"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-black/40">How runners perceive it</p><h2 className="mt-2 text-2xl font-black">Community perception</h2></div><span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">Demo data</span></div><div className="mt-8"><PerceptionBars values={shoe.community} /></div><div className="mt-10 rounded-2xl bg-[#f7f5ef] p-5"><p className="font-bold">Why structured ratings?</p><p className="mt-2 text-sm leading-6 text-black/55">A five-star score loses context. Runned records how a shoe feels across consistent dimensions so runners can compare perception, not just opinions.</p></div></div>
    </div>
    <div className="flex justify-end"><Link href={`/compare?a=${shoe.slug}`} className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white">Compare this shoe →</Link></div>
  </div>;
}
