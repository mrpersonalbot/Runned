import Link from "next/link";
import { notFound } from "next/navigation";
import { PerceptionBars } from "@/components/perception-bars";
import { ProductImage } from "@/components/product-image";
import { demoShoes, getDemoShoe } from "@/lib/data/catalog";
import { confidenceScore, formatIDR } from "@/lib/shoes/scoring.mjs";

export function generateStaticParams() { return demoShoes.map((shoe) => ({ slug: shoe.slug })); }

export default async function ShoePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shoe = getDemoShoe(slug);
  if (!shoe) notFound();

  const specs = [
    ["Weight", shoe.weightG ? `${shoe.weightG} g` : "Not published"],
    ["Drop", shoe.dropMm != null ? `${shoe.dropMm} mm` : "Not published"],
    ["Stack", shoe.heelStackMm != null && shoe.forefootStackMm != null ? `${shoe.heelStackMm} / ${shoe.forefootStackMm} mm` : "Not published"],
    ["Midsole", shoe.midsole ?? "Pending"],
    ["Plate", shoe.plate ?? "Pending"],
    ["Terrain", shoe.terrain],
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="border-b border-black/10 pb-8">
        <p className="eyebrow">{shoe.brand} · {shoe.category}</p>
        <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <h1 className="max-w-4xl font-display text-5xl leading-[.94] tracking-[-0.055em] lg:text-7xl">{shoe.model}</h1>
          <p className="max-w-md text-sm leading-6 text-black/55">{shoe.description}</p>
        </div>
      </div>

      <section className="py-8">
        <div className="mb-4 flex items-end justify-between">
          <div><p className="eyebrow">Product views</p><h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">See the shoe</h2></div>
          <p className="text-xs text-black/45">Available product photography</p>
        </div>
        <div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
          {shoe.images.map((image) => (
            <figure key={`${image.label}-${image.url}`} className="bg-[#f8f8f6]">
              <div className="aspect-square p-6 sm:p-8">
                <ProductImage src={image.url} alt={`${shoe.brand} ${shoe.model}, ${image.label.toLowerCase()} view`} className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <figcaption className="border-t border-black/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/50">{image.label} view</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="grid gap-8 border-t border-black/10 py-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-6">
          <div className="border border-black/10 bg-white p-6">
            <p className="eyebrow">Community snapshot · demo</p>
            <div className="mt-5 flex items-end gap-2"><span className="font-display text-5xl">{shoe.overallRating.toFixed(1)}</span><span className="pb-1 text-black/40">/ 5</span></div>
            <p className="mt-2 text-sm text-black/55">{shoe.reviewCount} synthetic foundation reviews · {shoe.buyAgainPct}% would buy again</p>
            <p className="mt-4 text-xs text-black/40">Confidence prototype: {confidenceScore(shoe.reviewCount)}/100</p>
          </div>
          <div className="border border-black/10 bg-white p-6">
            <div className="flex items-center justify-between"><h2 className="font-display text-2xl">Product specifications</h2></div>
            <dl className="mt-5 divide-y divide-black/10">{specs.map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/45">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>)}</dl>
            <div className="mt-5 border-t border-black/10 pt-4"><p className="text-xs text-black/40">Retail price</p><p className="mt-1 text-lg font-bold">{formatIDR(shoe.msrpIdr)}</p></div>
          </div>
        </div>
        <div className="border border-black/10 bg-white p-6 lg:p-8">
          <p className="eyebrow">How runners perceive it</p>
          <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">Community perception</h2>
          <div className="mt-8"><PerceptionBars values={shoe.community} /></div>
          <div className="mt-10 border-t border-black/10 pt-5"><p className="font-semibold">Why structured ratings?</p><p className="mt-2 max-w-xl text-sm leading-6 text-black/55">A five-star score loses context. Runned records how a shoe feels across consistent dimensions so runners can compare perception, not just opinions.</p></div>
        </div>
      </div>
      <div className="flex justify-end"><Link href={`/compare?a=${shoe.slug}`} className="border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-transparent hover:text-black">Compare this shoe →</Link></div>
    </div>
  );
}
