import { createFileRoute, Link } from "@tanstack/react-router";
import heroTower from "@/assets/hero-tower.jpg";
import { BROADCASTS } from "@/lib/intranet-data";
import { SuggestionBoard } from "@/components/SuggestionBoard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raffles Boston Residences — Residents' Intranet" },
      {
        name: "description",
        content:
          "Private portal for Raffles Boston Residences: board broadcasts, the community suggestion register and resident upvoting.",
      },
      { property: "og:title", content: "Raffles Boston Residences — Residents' Intranet" },
      {
        property: "og:description",
        content:
          "Board broadcasts, the community suggestion register and resident upvoting for Raffles Boston Residences.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
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
              <span className="block text-primary/90 italic">cultivated around the world</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Board communications, the Raffles Butler desk and a community register where every deed-holder's
              proposal is heard, weighed and carried forward — forty Trinity Place, Back Bay.
            </p>
          </div>
        </div>
      </section>


      <main className="mx-auto max-w-7xl space-y-24 px-6 py-20">
        <section id="broadcasts">
          <p className="eyebrow">Board of Trustees</p>
          <h2 className="mt-3 text-4xl">Executive communications</h2>
          <div className="gold-rule mt-5" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BROADCASTS.map((b) => (
              <article key={b.id} className="border border-border bg-card p-7 transition-colors hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <span className="border border-primary/50 px-2.5 py-1 text-[0.6rem] tracking-[0.2em] text-primary uppercase">
                    {b.badge}
                  </span>
                  <span className="text-xs text-muted-foreground">{b.date}</span>
                </div>
                <h3 className="mt-5 text-2xl leading-snug">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <SuggestionBoard />

        <section id="amenities" className="border-t border-border pt-16">
          <p className="eyebrow">In Residence</p>
          <h2 className="mt-3 text-4xl">Services & amenities</h2>
          <div className="gold-rule mt-5" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Raffles Butler", "Legendary, discreet service attending every residence around the clock."],
              ["Guerlain Spa", "Twenty-metre lap pool, hot tub, sauna and treatment suites on the wellness level."],
              ["Long Bar & Terrace", "All-day dining, heritage mixology and sunset Champagne above Back Bay."],
              ["La Padrona & Blind Duck", "Michelin-recommended Italian, and an intimate speakeasy by introduction."],
            ].map(([t, d]) => (

              <div key={t}>
                <h3 className="text-xl text-primary">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4 text-xs tracking-[0.18em] uppercase">
            <Link to="/amenities" className="border border-primary px-6 py-3 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              Reserve an amenity
            </Link>
            <Link to="/concierge" className="border border-border px-6 py-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              Concierge desk
            </Link>
            <Link to="/governance" className="border border-border px-6 py-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              Governance & ballots
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

    </div>
  );
}
