import { Link } from "@tanstack/react-router";

const NAV = [
  { label: "Residence", to: "/" },
  { label: "Amenities", to: "/amenities" },
  { label: "Concierge", to: "/concierge" },
  { label: "Governance", to: "/governance" },
] as const;

export function SiteHeader() {
  return (
    <header className="chrome-dark border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link to="/" className="block">
          <p className="font-display text-2xl tracking-[0.42em] text-primary">RAFFLES</p>
          <p className="mt-1 text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
            Boston Residences · Intranet
          </p>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-6 text-xs tracking-[0.22em] uppercase md:gap-9">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="min-h-11 py-3 text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
