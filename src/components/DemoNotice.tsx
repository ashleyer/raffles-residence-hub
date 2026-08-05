import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SEEN_KEY = "raffles-demo-notice-seen";

export function DemoBanner() {
  return (
    <div className="border-b border-border bg-muted/60 px-5 py-2 text-center sm:px-8">
      <p className="text-[0.625rem] leading-relaxed tracking-[0.18em] text-muted-foreground uppercase">
        Demo Site Only: All information is simulated and not real
      </p>
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
