import { createFileRoute } from "@tanstack/react-router";
import heroTower from "@/assets/hero-tower.jpg";
import { BROADCASTS } from "@/lib/intranet-data";
import { SuggestionBoard } from "@/components/SuggestionBoard";

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
      <header className="border-b border-border/70 bg-emerald-deep">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-display text-2xl tracking-[0.42em] text-primary">RAFFLES</p>
            <p className="mt-1 text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
              Boston Residences · Intranet
            </p>
          </div>
          <nav className="hidden gap-9 text-xs tracking-[0.22em] uppercase md:flex">
            {[
              ["Broadcasts", "#broadcasts"],
              ["Suggestions", "#suggestions"],
              ["Amenities", "#amenities"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-muted-foreground transition-colors hover:text-primary">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative">
        <img
          src={heroTower}
          alt="Raffles Boston Residences tower illuminated at dusk"
          width={1600}
          height={912}
          className="h-[52vh] min-h-[380px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12">
            <p className="eyebrow">Private Residents' Portal</p>
            <h1 className="mt-4 max-w-3xl text-5xl leading-tight md:text-6xl">
              A considered forum for the residence
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Board communications, service notices and a community register where every deed-holder's proposal is
              heard, weighed and carried forward.
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
              ["Raffles Butler", "Round-the-clock personal service for every residence."],
              ["Guerlain Spa", "Priority treatment allocation for in-residence members."],
              ["Sky Lobby", "Seventeenth-floor lounge, terrace and private dining."],
              ["Arrival Court", "Valet, porterage and secure parcel handling."],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="text-xl text-primary">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-emerald-deep">
        <div className="mx-auto max-w-7xl px-6 py-10 text-xs tracking-[0.16em] text-muted-foreground uppercase">
          Raffles Boston Residences · 40 Trinity Place, Back Bay · Residents' Intranet
        </div>
      </footer>
    </div>
  );
}
