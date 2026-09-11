import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ReviewSection } from "@/components/review-section";
import { ShoeCard } from "@/components/shoe-card";
import { demoShoes, getDemoShoe, previousModelByCurrentSlug } from "@/lib/data/catalog";
import { formatIDR } from "@/lib/shoes/scoring.mjs";

export function generateStaticParams() { return demoShoes.map((shoe) => ({ slug: shoe.slug })); }

export default async function ShoePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shoe = getDemoShoe(slug);
  if (!shoe) notFound();

  const previousSlug = previousModelByCurrentSlug[shoe.slug];
  const previousShoe = previousSlug ? getDemoShoe(previousSlug) : null;
  const galleryImages = shoe.detailImages?.length
    ? shoe.detailImages
    : shoe.cardImageUrl
      ? [{ label: "Side" as const, url: shoe.cardImageUrl }]
      : [];

  const specs = [
    ["Weight", shoe.weightG ? `${shoe.weightG} g` : "Not published"],
    ["Drop", shoe.dropMm != null ? `${shoe.dropMm} mm` : "Not published"],
    ["Stack", shoe.heelStackMm != null && shoe.forefootStackMm != null ? `${shoe.heelStackMm} / ${shoe.forefootStackMm} mm` : "Not published"],
    ["Midsole", shoe.midsole ?? "Not published"],
    ["Plate", shoe.plate ?? "None"],
    ["Terrain", shoe.terrain],
  ];

  const similar = demoShoes
    .filter((candidate) => candidate.slug !== shoe.slug && candidate.slug !== previousSlug)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === shoe.category) score += 5;
      if (candidate.terrain === shoe.terrain) score += 3;
      if (candidate.brand === shoe.brand) score += 1;
      if (candidate.isLocalIndonesia === shoe.isLocalIndonesia) score += 1;
      if (shoe.msrpIdr && candidate.msrpIdr) {
        const gap = Math.abs(candidate.msrpIdr - shoe.msrpIdr) / shoe.msrpIdr;
        if (gap <= 0.15) score += 3;
        else if (gap <= 0.3) score += 2;
        else if (gap <= 0.5) score += 1;
      }
      if (shoe.weightG && candidate.weightG && Math.abs(candidate.weightG - shoe.weightG) <= 35) score += 1;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.candidate.brand.localeCompare(b.candidate.brand))
    .slice(0, 4)
    .map(({ candidate }) => candidate);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="border-b border-black/10 pb-8">
        <p className="eyebrow">{shoe.brand} · {shoe.category}</p>
        <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <h1 className="max-w-4xl font-display text-5xl leading-[.94] tracking-[-0.055em] lg:text-7xl">{shoe.model}</h1>
          <p className="max-w-md text-sm leading-6 text-black/55">{shoe.description}</p>
        </div>
      </div>

      <ProductGallery images={galleryImages} brand={shoe.brand} model={shoe.model} slug={shoe.slug} />

      <div className="grid gap-8 border-t border-black/10 py-10 lg:grid-cols-[.72fr_1.28fr]">
        <div>
          <div className="border border-black/10 bg-white p-6">
            <h2 className="font-display text-2xl">Product specifications</h2>
            <dl className="mt-5 divide-y divide-black/10">{specs.map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/45">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>)}</dl>
            <div className="mt-5 border-t border-black/10 pt-4"><p className="text-xs text-black/40">Retail price</p><p className="mt-1 text-lg font-bold">{formatIDR(shoe.msrpIdr)}</p></div>
          </div>
          <Link href={`/compare?a=${shoe.slug}`} className="mt-4 inline-flex border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-transparent hover:text-black">Compare this shoe →</Link>
        </div>
        <ReviewSection shoeSlug={shoe.slug} />
      </div>

      {previousShoe ? (
        <section className="border-t border-black/10 py-12">
          <div className="mb-6">
            <p className="eyebrow">Previous generation</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">See what came before</h2>
          </div>
          <div className="max-w-sm border-l border-t border-black/10 bg-black/10">
            <ShoeCard shoe={previousShoe} />
          </div>
        </section>
      ) : null}

      <section className="border-t border-black/10 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="eyebrow">Similar shoes</p><h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">Worth comparing next</h2></div>
          <Link href="/#shoes" className="text-sm font-semibold underline underline-offset-4">Browse all shoes</Link>
        </div>
        <div className="grid gap-px border-l border-t border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-4">
          {similar.map((candidate) => <ShoeCard key={candidate.slug} shoe={candidate} />)}
        </div>
      </section>
    </div>
  );
}
