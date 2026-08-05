import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { usePortal } from "@/lib/portal-store";
import rafflesLogo from "@/assets/raffles-logo.png";

const NAV = [
  { label: "Residence", to: "/" },
  { label: "Amenities", to: "/amenities" },
  { label: "Events", to: "/events" },
  { label: "Services", to: "/services" },
  { label: "Concierge", to: "/concierge" },
  { label: "House account", to: "/account" },
  { label: "Directory", to: "/directory" },
  { label: "Messages", to: "/messages" },
  { label: "Community", to: "/community" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Proposals", to: "/proposals" },
  { label: "Governance", to: "/governance" },
  { label: "Management", to: "/management" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { currentUser, signOut } = usePortal();

  return (
    <header className="chrome-dark border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link to="/" className="block">
          <img
            src={rafflesLogo}
            alt="The Raffles Residences Boston"
            width={1200}
            height={896}
            className="h-14 w-auto invert md:h-16"
          />
        </Link>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Link
                to="/directory"
                hash="my-profile"
                className="hidden min-h-11 items-center text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-primary sm:inline-flex"
              >
                {currentUser.unit}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="min-h-11 border border-border px-4 text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center border border-primary bg-primary px-4 text-xs tracking-[0.18em] text-emerald-deep uppercase transition-colors hover:bg-transparent hover:text-primary"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="primary-navigation"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            <span className="sr-only">{open ? "Close navigation menu" : "Open navigation menu"}</span>
          </button>
        </div>
      </div>

      <nav
        id="primary-navigation"
        aria-label="Primary"
        className={`${open ? "block" : "hidden"} border-t border-border lg:block`}
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-3 text-xs tracking-[0.22em] uppercase lg:flex-row lg:flex-wrap lg:gap-6">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary", "aria-current": "page" }}
                className="flex min-h-11 items-center py-2 text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
