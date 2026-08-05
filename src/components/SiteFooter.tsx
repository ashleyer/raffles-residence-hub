import rafflesLogo from "@/assets/raffles-logo.png";

export function SiteFooter() {
  return (
    <footer className="chrome-dark mt-24">
      <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
        <img
          src={rafflesLogo}
          alt="The Raffles Residences Boston"
          loading="lazy"
          width={1200}
          height={896}
          className="mx-auto h-16 w-auto invert sm:h-20"
        />
        <div className="mx-auto mt-10 h-px w-16 bg-border" />
        <p className="mx-auto mt-8 max-w-xl text-[0.6875rem] leading-loose tracking-[0.22em] text-muted-foreground uppercase">
          40 Trinity Place · Back Bay · Boston, Massachusetts 02116
          <span className="mt-2 block">Private Residents' Portal</span>
        </p>
        <p className="measure mx-auto mt-8 text-xs leading-relaxed text-muted-foreground">
          Preview environment — resident data shown here is illustrative and resets when the page reloads.
        </p>
      </div>
    </footer>
  );
}
