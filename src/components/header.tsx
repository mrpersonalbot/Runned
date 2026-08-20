import Link from "next/link";

const links = [
  ["Shoes", "/#shoes"],
  ["Compare", "/compare"],
  ["Brands", "/brands"],
  ["About", "/about"],
] as const;

export function Header() {
  return (
    <header className="border-b border-black/10 bg-[#f4f1eb]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="font-display text-2xl tracking-[-0.06em]">RUNNED</Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map(([label, href]) => <Link key={label} href={href} className="text-black/60 transition hover:text-black">{label}</Link>)}
        </nav>
        <Link href="/sign-in" className="border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-transparent hover:text-black">Join Runned</Link>
      </div>
    </header>
  );
}
