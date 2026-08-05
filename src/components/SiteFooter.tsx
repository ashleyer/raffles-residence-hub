import { useState } from "react";
import rafflesLogo from "@/assets/raffles-logo.png";
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
        <p className="measure mx-auto mt-8 text-xs leading-relaxed text-muted-foreground">
          Preview environment — resident data shown here is illustrative and resets when the page reloads.
        </p>
        <p style={{ fontFamily: "'Courier New', Courier, monospace" }}
          className="mt-10 text-[0.6875rem] text-[oklch(1_0_0)]">
          built with 🤍 in Raffles Residence Boston, Unit 22H by{" "}
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
                  try {
                    await navigator.clipboard.writeText(number);
                    toast.success("Phone number copied");
                  } catch {
                    toast.error(`Copy failed — the number is ${number}`);
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
