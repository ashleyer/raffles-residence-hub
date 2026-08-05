import rafflesLogo from "@/assets/raffles-logo.png";

export function SiteFooter() {
  return (
    <footer className="chrome-dark border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <img
          src={rafflesLogo}
          alt="The Raffles Residences Boston"
          loading="lazy"
          width={1152}
          height={576}
          className="h-12 w-auto invert"
        />
        <p className="mt-6 text-xs leading-relaxed tracking-[0.16em] text-muted-foreground uppercase">
          The Raffles Residences Boston · 40 Trinity Place, Back Bay, Boston MA 02116 · Private Residents' Portal
          <span className="mt-3 block normal-case tracking-normal">
            Preview environment — resident data shown here is illustrative and resets when the page reloads.
          </span>
        </p>
      </div>
    </footer>
  );
}
