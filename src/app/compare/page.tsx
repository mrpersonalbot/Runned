import Link from "next/link";
import { demoShoes, getDemoShoe } from "@/lib/data/demo-shoes";
import { formatIDR } from "@/lib/shoes/scoring.mjs";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ a?: string; b?: string }> }) {
  const query = await searchParams;
  const a = getDemoShoe(query.a ?? "") ?? demoShoes[0];
  const b = getDemoShoe(query.b ?? "") ?? demoShoes.find((shoe) => shoe.slug !== a.slug) ?? demoShoes[1];
  const rows = [
    ["Community rating", `${a.overallRating.toFixed(1)} / 5`, `${b.overallRating.toFixed(1)} / 5`],
    ["Buy again", `${a.buyAgainPct}%`, `${b.buyAgainPct}%`],
    ["MSRP", formatIDR(a.msrpIdr), formatIDR(b.msrpIdr)],
    ["Weight", a.weightG ? `${a.weightG} g` : "Pending", b.weightG ? `${b.weightG} g` : "Pending"],
    ["Drop", a.dropMm != null ? `${a.dropMm} mm` : "Pending", b.dropMm != null ? `${b.dropMm} mm` : "Pending"],
    ["Softness", `${a.community.softness.toFixed(1)} / 5`, `${b.community.softness.toFixed(1)} / 5`],
    ["Energy return", `${a.community.energyReturn.toFixed(1)} / 5`, `${b.community.energyReturn.toFixed(1)} / 5`],
    ["Stability", `${a.community.stability.toFixed(1)} / 5`, `${b.community.stability.toFixed(1)} / 5`],
    ["Fit width", `${a.community.fitWidth.toFixed(1)} / 5`, `${b.community.fitWidth.toFixed(1)} / 5`],
  ];
  return <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-black/40">Runned Compare</p><h1 className="mt-2 text-5xl font-black tracking-[-.05em]">Side by side, signal by signal.</h1><p className="mt-4 max-w-2xl text-black/55">This foundation compares verified specs separately from synthetic community demo data. Real community aggregates will come from Supabase.</p>
    <div className="mt-10 overflow-hidden rounded-[28px] border border-black/10 bg-white"><div className="grid grid-cols-[.8fr_1fr_1fr] bg-black p-4 text-white"><span /><div><p className="text-xs text-white/45">{a.brand}</p><p className="font-black">{a.model}</p></div><div><p className="text-xs text-white/45">{b.brand}</p><p className="font-black">{b.model}</p></div></div>{rows.map(([label, av, bv]) => <div key={label} className="grid grid-cols-[.8fr_1fr_1fr] border-t border-black/7 p-4 text-sm"><span className="text-black/45">{label}</span><strong>{av}</strong><strong>{bv}</strong></div>)}</div>
    <div className="mt-8 flex flex-wrap gap-2">{demoShoes.map((shoe) => <Link key={shoe.slug} href={`/compare?a=${a.slug}&b=${shoe.slug}`} className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold hover:bg-black hover:text-white">Compare with {shoe.model}</Link>)}</div>
  </div>;
}
