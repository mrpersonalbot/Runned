import { brandDirectory, demoShoes } from "@/lib/data/demo-shoes";

export default function BrandsPage() {
  const local = brandDirectory.filter((brand) => brand.isLocalIndonesia);
  const global = brandDirectory.filter((brand) => !brand.isLocalIndonesia);
  const counts = new Map(demoShoes.map((shoe) => [shoe.brand, demoShoes.filter((item) => item.brand === shoe.brand).length]));

  const BrandGrid = ({ brands }: { brands: typeof brandDirectory }) => (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => <div key={brand.slug} className="rounded-2xl border border-black/10 bg-white p-4"><div className="flex items-center justify-between gap-3"><span className="font-bold">{brand.name}</span><span className="text-xs text-black/40">{counts.get(brand.name) ?? 0} models</span></div></div>)}
    </div>
  );

  return <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-black/40">Brand directory</p><h1 className="mt-2 text-5xl font-black tracking-[-.05em]">Local and global. Same database.</h1><p className="mt-5 max-w-2xl leading-7 text-black/55">This directory is designed to grow without changing the UI architecture. Brand entries and shoe models are catalog records, not hand-built landing pages.</p><section className="mt-12"><div className="flex items-end justify-between"><div><p className="text-sm font-bold text-black/45">Indonesia</p><h2 className="mt-1 text-2xl font-black">Local brands</h2></div><span className="text-sm text-black/40">{local.length} seeded</span></div><BrandGrid brands={local} /></section><section className="mt-12"><div className="flex items-end justify-between"><div><p className="text-sm font-bold text-black/45">Global</p><h2 className="mt-1 text-2xl font-black">International brands</h2></div><span className="text-sm text-black/40">{global.length} seeded</span></div><BrandGrid brands={global} /></section></div>;
}
