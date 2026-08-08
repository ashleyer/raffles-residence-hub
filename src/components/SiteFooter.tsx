import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import rafflesLogo from "@/assets/raffles-logo.png";
import { NotifySecurity } from "@/components/NotifySecurity";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SiteFooter() {
  const [devOpen, setDevOpen] = useState(false);
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

        <div className="mx-auto mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
          <a
            href="tel:+16175891480"
            aria-label="Call the Concierge at 617-589-1480"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            Concierge · 617-589-1480
          </a>
          <a
            href="mailto:ResidencesConcierge.Boston@raffles.com"
            aria-label="Email the Concierge at Residences Concierge dot Boston at raffles dot com"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            ResidencesConcierge.Boston@raffles.com
          </a>
        </div>

        <NotifySecurity className="btn-outline mx-auto mt-8 w-full max-w-xs sm:w-auto" />


        <nav
          aria-label="Official Raffles websites"
          className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8"
        >
          <a
            href="https://rafflesresidencesboston.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            Raffles Residences Boston Public Site
            <ExternalLink className="ml-2 h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href="https://www.raffles.com/boston/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            Raffles Boston Hotel
            <ExternalLink className="ml-2 h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href="https://all.accor.com/loyalty-program/index.en.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            ALL — Accor loyalty
            <ExternalLink className="ml-2 h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>

          <Link
            to="/press"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            In the press
          </Link>
          <Link
            to="/about-raffles"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            About Raffles
          </Link>
          <Link
            to="/sales-and-leasing"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            Sales & leasing
          </Link>
          <Link
            to="/gallery"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            Residence gallery
          </Link>
          <Link
            to="/gratitude"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            Thank you notes
          </Link>
          <a
            href="https://www.instagram.com/rafflesresidencesboston/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
          >
            Instagram
            <ExternalLink className="ml-2 h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>

        </nav>


        <p className="measure mx-auto mt-8 text-xs leading-relaxed text-muted-foreground">
          Preview environment — resident data shown here is illustrative and resets when the page reloads.
        </p>

        <nav
          aria-label="Legal"
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-border pt-5 text-[0.6875rem] tracking-[0.16em] uppercase"
        >
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <span aria-hidden="true" className="text-muted-foreground">
            ·
          </span>
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </nav>



        <p style={{ fontFamily: "'Courier New', Courier, monospace" }}
          className="mt-10 text-[0.6875rem] text-[oklch(1_0_0)]">
          built with 🤍 in Raffles Residences Boston, Unit 22H by{" "}
          <button
            type="button"
            onClick={() => setDevOpen(true)}
            className="underline underline-offset-4 hover:no-underline"
          >
            Ashley Romano
          </button>
        </p>
      </div>

      <Dialog open={devOpen} onOpenChange={setDevOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-light">
              GitHub Repo/Comments/Questions for Dev?
            </DialogTitle>
          </DialogHeader>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                className="text-primary underline underline-offset-4"
                href="mailto:ashleye.romano@gmail.com"
              >
                ashleye.romano@gmail.com
              </a>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a className="text-primary underline underline-offset-4" href="tel:+19788575775">
                Call or text: 978-857-5775
              </a>
              <button
                type="button"
                onClick={async () => {
                  const number = "978-857-5775";
                  const legacyCopy = () => {
                    const el = document.createElement("textarea");
                    el.value = number;
                    el.setAttribute("readonly", "");
                    el.style.position = "fixed";
                    el.style.opacity = "0";
                    document.body.appendChild(el);
                    el.select();
                    const ok = document.execCommand("copy");
                    document.body.removeChild(el);
                    return ok;
                  };
                  try {
                    await navigator.clipboard.writeText(number);
                    toast.success(`Copied ${number}`);
                  } catch {
                    if (legacyCopy()) {
                      toast.success(`Copied ${number}`);
                    } else {
                      toast.info(`Copy unavailable — the number is ${number}`);
                    }
                  }
                }}

                className="inline-flex min-h-11 items-center gap-1.5 text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                Copy phone number
              </button>
            </li>
          </ul>

        </DialogContent>
      </Dialog>
    </footer>
  );
}
