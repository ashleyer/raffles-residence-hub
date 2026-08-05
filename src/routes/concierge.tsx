import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CONCIERGE_SERVICES, SEED_REQUESTS, type ConciergeRequest } from "@/lib/intranet-data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/concierge")({
  head: () => ({
    meta: [
      { title: "Concierge Requests — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Lodge housekeeping, valet, dining, floristry and engineering requests with the Raffles Boston Residences concierge desk.",
      },
      { property: "og:title", content: "Concierge Requests — Raffles Boston Residences" },
      {
        property: "og:description",
        content: "Round-the-clock butler service requests for residents of Raffles Boston.",
      },
    ],
  }),
  component: ConciergePage,
});

const STATUS_ICON = {
  Lodged: BellRing,
  "In progress": Loader2,
  Completed: CheckCircle2,
} as const;

function ConciergePage() {
  const [requests, setRequests] = useState<ConciergeRequest[]>(SEED_REQUESTS);
  const [service, setService] = useState<string>(CONCIERGE_SERVICES[0]);
  const [detail, setDetail] = useState("");
  const [unit, setUnit] = useState("");
  const [priority, setPriority] = useState(false);
  const [filter, setFilter] = useState<"All" | ConciergeRequest["status"]>("All");

  const visible = requests.filter((r) => filter === "All" || r.status === filter);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail.trim() || !unit.trim()) {
      toast.error("Please describe the request and give a residence number.");
      return;
    }
    setRequests((prev) => [
      {
        id: Date.now(),
        service,
        detail: detail.trim(),
        unit: unit.trim(),
        priority: priority ? "Priority" : "Standard",
        status: "Lodged",
        placedAt: "Just now",
      },
      ...prev,
    ]);
    setDetail("");
    toast.success("Request lodged with the butler's desk.");
  };

  const advance = (id: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Lodged" ? "In progress" : "Completed" }
          : r,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="eyebrow">Raffles Butler</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Concierge requests</h1>
        <div className="gold-rule mt-5" />
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every residence is attended around the clock. Requests lodged here reach the butler's desk immediately and
          are acknowledged within fifteen minutes.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <section aria-labelledby="register">
            <h2 id="register" className="text-2xl">
              Request register
            </h2>

            <div className="mt-6 flex flex-wrap gap-2">
              {(["All", "Lodged", "In progress", "Completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`min-h-11 border px-4 text-xs tracking-[0.16em] uppercase transition-colors ${
                    filter === f
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <ul className="mt-8 space-y-4">
              {visible.map((r) => {
                const Icon = STATUS_ICON[r.status];
                return (
                  <li key={r.id} className="border border-border bg-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="eyebrow">{r.service}</p>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{r.detail}</p>
                        <p className="mt-3 text-xs tracking-wider text-muted-foreground/70 uppercase">
                          {r.unit} · {r.priority} · {r.placedAt}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="flex items-center gap-2 border border-primary/50 px-3 py-1 text-[0.6rem] tracking-[0.2em] text-primary uppercase">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {r.status}
                        </span>
                        {r.status !== "Completed" && (
                          <Button
                            variant="ghost"
                            onClick={() => advance(r.id)}
                            className="tracking-[0.18em] uppercase"
                          >
                            {r.status === "Lodged" ? "Acknowledge" : "Mark complete"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
              {visible.length === 0 && (
                <li className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  No requests in this state.
                </li>
              )}
            </ul>
          </section>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <form onSubmit={submit} className="border border-border bg-card p-7">
              <p className="eyebrow">Butler's Desk</p>
              <h2 className="mt-3 text-2xl">Lodge a request</h2>
              <div className="gold-rule mt-4" />

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <select
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="h-11 w-full border border-input bg-transparent px-3 text-sm"
                  >
                    {CONCIERGE_SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-card">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detail">Details</Label>
                  <Textarea
                    id="detail"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="Describe the request for the butler"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cunit">Residence number</Label>
                  <Input
                    id="cunit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Residence 34B"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <Label htmlFor="priority" className="text-sm font-normal">
                    Priority attendance
                  </Label>
                  <Switch id="priority" checked={priority} onCheckedChange={setPriority} />
                </div>

                <Button type="submit" className="min-h-12 w-full tracking-[0.18em] uppercase">
                  Send to the desk
                </Button>
              </div>
            </form>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
