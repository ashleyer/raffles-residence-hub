import { createFileRoute, Link } from "@tanstack/react-router";
import heroTower from "@/assets/hero-tower.jpg";
import residentsLounge from "@/assets/residents-lounge.jpg";
import longBar from "@/assets/long-bar.jpg";
import privateDining from "@/assets/private-dining.jpg";
import laPadrona from "@/assets/la-padrona.jpg";
import guerlainSpa from "@/assets/guerlain-spa.jpg";
import { ANNOUNCEMENTS } from "@/lib/portal-data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PATHS = [
  {
    to: "/amenities",
    image: residentsLounge,
    alt: "The Residents' Lounge on floor twenty-one, set for morning coffee",
    eyebrow: "Reservations",
    title: "Amenities",
    cta: "Reserve",
  },
  {
    to: "/events",
    image: longBar,
    alt: "The Long Bar dressed for a resident gathering",
    eyebrow: "Resident Life",
    title: "Events",
    cta: "See the calendar",
  },
  {
    to: "/services",
    image: privateDining,
    alt: "A private dining table laid in a residence",
    eyebrow: "In Residence",
    title: "Concierge",
    cta: "Make a request",
  },
  {
    to: "/community",
    image: laPadrona,
    alt: "Residents in conversation at a warmly lit dining room",
    eyebrow: "Community",
    title: "Neighbours",
    cta: "Enter the community",
  },
  {
    to: "/management",
    image: guerlainSpa,
    alt: "A quiet corridor within the residences",
    eyebrow: "Governance",
    title: "The Board",
    cta: "Meet the board",
  },
] as const;


function Index() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <SiteHeader variant="overlay" />

      {/* Cinematic full-viewport opening */}
      <section className="chrome-dark relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden">
        <img
          src={heroTower}
          alt="The Raffles Residences Boston at 40 Trinity Place, illuminated above Back Bay at dusk"
          width={1600}
          height={912}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="panel-scrim absolute inset-0 -z-10" />

        <div />

        <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
          <Reveal>
            <h1 className="font-display text-[clamp(2rem,6.4vw,5rem)] leading-[1.06] font-light tracking-[0.06em] uppercase">
              At home in Boston
            </h1>
            <p className="mt-5 text-[0.7rem] tracking-[0.34em] uppercase sm:text-xs">Cultivated around the world</p>
            <p className="measure mx-auto mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
              The private residents' portal for forty Trinity Place.
            </p>

          </Reveal>
        </div>

        <div className="flex flex-col items-center gap-4 pb-10 sm:pb-14">
          <a
            href="#select-your-path"
            className="script inline-flex min-h-11 items-center text-xl sm:text-2xl"
          >
            Select your path
          </a>
          <span className="scroll-cue-line" aria-hidden="true" />
        </div>
      </section>

      <main id="main-content" className="flex-1">
        <h2 id="select-your-path" className="sr-only">
          Select your path
        </h2>

        {/* Full-bleed panels, one per portal territory */}
        {PATHS.map((p, i) => (
          <section
            key={p.to}
            aria-labelledby={`panel-${p.to.slice(1)}`}
            className="chrome-dark relative isolate flex min-h-[82svh] items-end overflow-hidden"
          >
            <img
              src={p.image}
              alt={p.alt}
              width={1600}
              height={1000}
              loading="lazy"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div className="panel-scrim absolute inset-0 -z-10" />

            <div className="mx-auto w-full max-w-7xl px-5 pt-24 pb-14 sm:px-8 sm:pb-20">
              <Reveal className={i % 2 === 1 ? "sm:ml-auto sm:max-w-xl sm:text-right" : "sm:max-w-xl"}>
                <p className="eyebrow">{p.eyebrow}</p>
                <h3 id={`panel-${p.to.slice(1)}`} className="display-section mt-4">
                  {p.title}
                </h3>
                <Link to={p.to} className="btn-outline mt-8">
                  {p.cta}
                </Link>
              </Reveal>
            </div>
          </section>
        ))}

        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
