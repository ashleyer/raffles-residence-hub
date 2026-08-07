import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { usePortal } from "@/lib/portal-store";
import { DEMO_PASSCODE, RESIDENTS } from "@/lib/portal-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Resident Sign In — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Secure sign in for deed-holders and leaseholders of The Raffles Residences Boston to reach the private residents' portal.",
      },
      { property: "og:title", content: "Resident Sign In — Raffles Boston Residences" },
      { property: "og:description", content: "Private portal access for registered residences at 40 Trinity Place." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { currentUser, signIn, signOut } = usePortal();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signIn(email, passcode, name);
    if (!result.ok) {
      setError(result.error ?? "Sign in failed.");
      return;
    }
    setError(null);
    toast.success("Welcome to the residences.");
    navigate({ to: "/directory" });
  };

  return (
    <PageShell
      eyebrow="Private Access"
      title="Resident sign in"
      intro="Registered deed-holders and leaseholders sign in with their residence address. New visitors may explore the demo with their own email and the shared preview passcode."
    >
      {currentUser ? (
        <div className="mt-12 max-w-xl border border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">You are signed in as</p>
          <p className="mt-2 text-2xl">{currentUser.name}</p>
          <p className="text-sm text-muted-foreground">{currentUser.unit}</p>
          <Button
            className="mt-6 min-h-11 tracking-[0.18em] uppercase"
            variant="outline"
            onClick={() => {
              signOut();
              toast.success("Signed out.");
            }}
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={submit} className="max-w-xl border border-border bg-card p-8" noValidate>
            <h2 className="text-2xl">Sign in</h2>
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby={error ? "signin-error" : "email-hint"}
                  aria-invalid={error ? true : undefined}
                  className="min-h-11"
                />
                <p id="email-hint" className="text-xs text-muted-foreground">
                  Use a registered residence address, or any email of your own to explore as a guest.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your name (optional, for new guests)</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passcode">Residence passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  aria-describedby={error ? "signin-error" : "passcode-hint"}
                  aria-invalid={error ? true : undefined}
                  className="min-h-11"
                />
                <p id="passcode-hint" className="text-xs text-muted-foreground">
                  Preview passcode for every account, including new guests: {DEMO_PASSCODE}
                </p>
              </div>

              <p id="signin-error" role="alert" aria-live="polite" className="min-h-5 text-sm text-destructive">
                {error}
              </p>

              <Button type="submit" className="min-h-11 w-full tracking-[0.18em] uppercase">
                Enter the portal
              </Button>
            </div>
          </form>

          <aside className="border border-border bg-secondary/40 p-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="eyebrow">Demonstration accounts</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              This preview keeps everything in your browser, so any of the residences below may be used to explore the
              portal. Nothing is stored beyond the session.
            </p>
            <ul className="mt-6 space-y-4">
              {RESIDENTS.slice(0, 4).map((r) => (
                <li key={r.id} className="border-t border-border pt-4 text-sm">
                  <p>{r.name}</p>
                  <p className="text-muted-foreground">{r.unit}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(r.email);
                      setPasscode(DEMO_PASSCODE);
                    }}
                    className="mt-2 inline-flex min-h-11 items-center text-xs tracking-[0.16em] text-primary uppercase underline underline-offset-4"
                  >
                    Use {r.unit}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
