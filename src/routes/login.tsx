import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { usePortal } from "@/lib/portal-store";
import { DEMO_PASSCODE, RESIDENTS } from "@/lib/portal-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Resident Sign In — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Sign in or register for the private residents' portal of The Raffles Residences Boston at 40 Trinity Place.",
      },
      { property: "og:title", content: "Resident Sign In — Raffles Boston Residences" },
      { property: "og:description", content: "Private portal access for registered residences at 40 Trinity Place." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { mode?: "signin" | "signup" } => ({
    mode: search['mode'] === "signup" ? "signup" : search['mode'] === "signin" ? "signin" : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { currentUser } = usePortal();
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");

  return (
    <PageShell
      eyebrow="Private Access"
      title={currentUser ? "Your account" : mode === "signin" ? "Resident sign in" : "Create your account"}
      intro="Registered deed-holders and leaseholders sign in with their residence address. New visitors may register an account or explore with the shared preview passcode. Accounts are kept in this browser only."
    >
      {currentUser ? (
        <SignedIn />
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <div role="tablist" aria-label="Account" className="flex gap-2">
              {(
                [
                  { id: "signin", label: "Sign in" },
                  { id: "signup", label: "Create account" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === t.id}
                  onClick={() => setMode(t.id)}
                  className={`min-h-11 border px-5 text-xs tracking-[0.16em] uppercase transition-colors ${
                    mode === t.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mt-4">{mode === "signin" ? <SignInForm /> : <SignUpForm />}</div>
          </div>

          <aside className="border border-border bg-secondary/40 p-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="eyebrow">Demonstration accounts</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              This preview keeps everything in your browser. Any residence below may be used with the preview passcode,
              or register your own account — it will be remembered on this device until you sign out.
            </p>
            <ul className="mt-6 space-y-4">
              {RESIDENTS.slice(0, 4).map((r) => (
                <li key={r.id} className="border-t border-border pt-4 text-sm">
                  <p>{r.name}</p>
                  <p className="text-muted-foreground">{r.unit}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.email} · passcode {DEMO_PASSCODE}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </PageShell>
  );
}

function SignedIn() {
  const { currentUser, signOut } = usePortal();
  if (!currentUser) return null;
  return (
    <div className="mt-12 max-w-xl border border-border bg-card p-8">
      <p className="text-sm text-muted-foreground">You are signed in as</p>
      <p className="mt-2 text-2xl">{currentUser.name}</p>
      <p className="text-sm text-muted-foreground">{currentUser.unit}</p>
      <p className="mt-1 text-sm text-muted-foreground">{currentUser.email}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        This device will remember you until you sign out.
      </p>
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
  );
}

function SignInForm() {
  const { signIn, rememberedEmail, rememberedUnit } = usePortal();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rememberedEmail) setEmail(rememberedEmail);
    if (rememberedUnit) setUnit(rememberedUnit);
  }, [rememberedEmail, rememberedUnit]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signIn(email, password, remember, unit);
    if (!result.ok) {
      setError(result.error ?? "Sign in failed.");
      return;
    }
    setError(null);
    toast.success("Welcome to the residences.");
    navigate({ to: "/directory" });
  };

  return (
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
            Use your registered address, or any email of your own to explore as a guest.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="signin-unit">Residence number</Label>
          <Input
            id="signin-unit"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Residence 22H"
            aria-describedby={error ? "signin-error" : "signin-unit-hint"}
            aria-invalid={error ? true : undefined}
            className="min-h-11"
          />
          <p id="signin-unit-hint" className="text-xs text-muted-foreground">
            The residence on file for your address — for example 22H.
          </p>
        </div>
        <div className="space-y-2">

          <Label htmlFor="password">Password or residence passcode</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={error ? "signin-error" : "passcode-hint"}
            aria-invalid={error ? true : undefined}
            className="min-h-11"
          />
          <p id="passcode-hint" className="text-xs text-muted-foreground">
            Preview passcode for the demonstration residences: {DEMO_PASSCODE}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="min-w-0 flex-1">
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me on this device
            </Label>
            <p id="remember-hint" className="mt-1 text-pretty text-xs text-muted-foreground">
              On: your residence and contact details stay on this device after sign out. Off: they are
              cleared the moment you sign out.
            </p>
          </div>
          <Switch
            id="remember"
            checked={remember}
            onCheckedChange={setRemember}
            aria-describedby="remember-hint"
          />
        </div>


        <p id="signin-error" role="alert" aria-live="polite" className="min-h-5 text-sm text-destructive">
          {error}
        </p>

        <Button type="submit" className="min-h-11 w-full tracking-[0.18em] uppercase">
          Enter the portal
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const { signUp } = usePortal();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", unit: "", phone: "", password: "", confirm: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUp({ ...form, remember });
    if (!result.ok) {
      setError(result.error ?? "Registration failed.");
      return;
    }
    setError(null);
    toast.success("Your account has been created.");
    navigate({ to: "/directory" });
  };

  return (
    <form onSubmit={submit} className="max-w-xl border border-border bg-card p-8" noValidate>
      <h2 className="text-2xl">Create an account</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Registering creates your household profile with contact details, and keeps your directory profile, reservations and preferences on this device.
      </p>
      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="su-name">Household or resident name</Label>
          <Input id="su-name" autoComplete="name" required value={form.name} onChange={set("name")} className="min-h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-email">Email address</Label>
          <Input
            id="su-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={set("email")}
            className="min-h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-unit">Residence number</Label>
          <Input id="su-unit" required value={form.unit} onChange={set("unit")} placeholder="Residence 22H" className="min-h-11" />
          <p className="text-xs text-muted-foreground">
            Residences are verified by the Residences Office before the directory listing is confirmed.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-phone">Contact number</Label>
          <Input
            id="su-phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={set("phone")}
            placeholder="617-555-0123"
            aria-describedby="su-phone-hint"
            className="min-h-11"
          />
          <p id="su-phone-hint" className="text-xs text-muted-foreground">
            Every household keeps a profile with contact details on file. Listing in the directory and letting
            neighbours contact you both stay optional — you choose in your profile settings.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-password">Password</Label>
          <Input
            id="su-password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={set("password")}
            aria-describedby="su-password-hint"
            className="min-h-11"
          />
          <p id="su-password-hint" className="text-xs text-muted-foreground">
            At least eight characters. Never use a real password — this demo stores it in your browser.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-confirm">Confirm password</Label>
          <Input
            id="su-confirm"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirm}
            onChange={set("confirm")}
            className="min-h-11"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="min-w-0 flex-1">
            <Label htmlFor="su-remember" className="text-sm font-normal">
              Remember me on this device
            </Label>
            <p id="su-remember-hint" className="mt-1 text-pretty text-xs text-muted-foreground">
              On: your residence and contact details stay on this device after sign out. Off: they are
              cleared the moment you sign out.
            </p>
          </div>
          <Switch
            id="su-remember"
            checked={remember}
            onCheckedChange={setRemember}
            aria-describedby="su-remember-hint"
          />
        </div>


        <p role="alert" aria-live="polite" className="min-h-5 text-sm text-destructive">
          {error}
        </p>

        <Button type="submit" className="min-h-11 w-full tracking-[0.18em] uppercase">
          Create account
        </Button>
      </div>
    </form>
  );
}
