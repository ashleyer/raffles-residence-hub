import { createFileRoute, Link } from "@tanstack/react-router";
import heroTower from "@/assets/hero-tower.jpg";
import { BROADCASTS } from "@/lib/intranet-data";
import { ANNOUNCEMENTS } from "@/lib/portal-data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raffles Boston Residences — Residents' Intranet" },
      {
        name: "description",
        content:
          "Private portal for Raffles Boston Residences: board broadcasts, amenity reservations, house account, concierge services, directory and the member forum.",
      },
      { property: "og:title", content: "Raffles Boston Residences — Residents' Intranet" },
      {
        property: "og:description",
        content:
          "Board broadcasts, reservations, house account, concierge services and the resident community register for 40 Trinity Place.",
      },
    ],
  }),
  component: Index,
});

const QUICK_LINKS = [
  { to: "/amenities", label: "Reservations", detail: "Lounge, private dining, spa and restaurants." },
  { to: "/services", label: "Valet & maintenance", detail: "Request the car, report an issue, track parcels." },
  { to: "/account", label: "House account", detail: "Statements, condominium fees and payments." },
  { to: "/directory", label: "Directory", detail: "Opt-in register of neighbouring households." },
  { to: "/messages", label: "Messages", detail: "Group and private conversations." },
  { to: "/community", label: "Member forum", detail: "Topics and interest circles." },
  { to: "/marketplace", label: "Marketplace", detail: "Recommendations, sales and give-aways." },
  { to: "/proposals", label: "Proposals", detail: "Vote for or against resident requests." },
  { to: "/management", label: "Management", detail: "Board, staff, notices and the monthly survey." },
  { to: "/governance", label: "Governance", detail: "Ballots, minutes and governing instruments." },
] as const;

function Index() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <section className="relative">
        <img
          src={heroTower}
          alt="The Raffles Residences Boston at 40 Trinity Place, illuminated above Back Bay at dusk"
          width={1600}
          height={912}
          className="h-[62vh] min-h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/5" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-14">
            <p className="eyebrow">Private Residents' Portal</p>
            <h1 className="mt-4 max-w-4xl text-5xl leading-[1.05] font-light tracking-tight md:text-7xl">
              At home in Boston,
              <span className="block text-primary italic">cultivated around the world</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Board communications, the Raffles Butler desk and a community register where every deed-holder's
              proposal is heard, weighed and carried forward — forty Trinity Place, Back Bay.
            </p>
          </div>
        </div>
      </section>

      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 space-y-24 px-6 py-20">
        <section aria-labelledby="broadcasts-heading">
          <p className="eyebrow">Board of Trustees</p>
          <h2 id="broadcasts-heading" className="mt-3 text-4xl">
            Executive communications
          </h2>
          <div className="gold-rule mt-5" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {BROADCASTS.map((b) => (
              <li key={b.id} className="border border-border bg-card p-7 transition-colors hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <span className="border border-primary px-2.5 py-1 text-[0.6rem] tracking-[0.2em] text-primary uppercase">
                    {b.badge}
                  </span>
                  <span className="text-xs text-muted-foreground">{b.date}</span>
                </div>
                <h3 className="mt-5 text-2xl leading-snug">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="notices-heading" className="border-t border-border pt-16">
          <p className="eyebrow">Residences Office</p>
          <h2 id="notices-heading" className="mt-3 text-4xl">
            Latest announcements
          </h2>
          <div className="gold-rule mt-5" />
          <ul className="mt-10 space-y-4">
            {ANNOUNCEMENTS.slice(0, 2).map((a) => (
              <li key={a.id} className="border border-border bg-card p-6">
                <p className="eyebrow">
                  {a.author} · {a.date}
                </p>
                <h3 className="mt-2 text-2xl leading-snug">{a.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/management"
            className="mt-8 inline-flex min-h-11 items-center border border-primary px-6 text-xs tracking-[0.18em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            All announcements
          </Link>
        </section>

        <section aria-labelledby="portal-heading" className="border-t border-border pt-16">
          <p className="eyebrow">In Residence</p>
          <h2 id="portal-heading" className="mt-3 text-4xl">
            Your portal
          </h2>
          <div className="gold-rule mt-5" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="flex h-full flex-col border border-border bg-card p-6 transition-colors hover:border-primary"
                >
                  <span className="text-xl text-primary">{l.label}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
