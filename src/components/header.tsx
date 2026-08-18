import Link from "next/link";

const links = [
  ["Shoes", "/#shoes"],
  ["Compare", "/compare"],
  ["Brands", "/brands"],
  ["About", "/about"],
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[#f7f5ef]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="text-xl font-black tracking-[-0.05em]">RUNNED</Link>
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map(([label, href]) => <Link key={label} href={href} className="text-black/65 transition hover:text-black">{label}</Link>)}
        </nav>
        <Link href="/sign-in" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]">Join Runned</Link>
      </div>
    </header>
  );
}
