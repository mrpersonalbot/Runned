export function Footer() {
  return (
    <footer className="border-t border-black/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm text-black/50 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} Runned. Built for Indonesian runners.</p>
        <p>Community data first. Commerce comes second.</p>
      </div>
    </footer>
  );
}
