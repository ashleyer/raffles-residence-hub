import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SEEN_KEY = "raffles-demo-notice-seen";
const BANNER_KEY = "raffles-demo-banner-dismissed";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(BANNER_KEY)) setDismissed(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative border-b border-border bg-muted/60 px-10 py-2 text-center sm:px-12">
      <p className="text-[0.625rem] leading-relaxed tracking-[0.18em] text-muted-foreground uppercase">
        Demo Site Only: All information is simulated and not real
      </p>
      <button
        type="button"
        aria-label="Dismiss demo notice"
        onClick={() => {
          setDismissed(true);
          try {
            localStorage.setItem(BANNER_KEY, "1");
          } catch {
            /* ignore */
          }
        }}
        className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground sm:right-3"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}


export function DemoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SEEN_KEY)) {
        setOpen(true);
        sessionStorage.setItem(SEEN_KEY, "1");
      }
    } catch {
      setOpen(true);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm border-border bg-background text-center">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light">Demo Mode</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Content is not real. Everything shown in this residents' portal is illustrative.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
