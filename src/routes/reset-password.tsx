import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { usePortal } from "@/lib/portal-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { newPasswordSchema, validate, type FieldErrors } from "@/lib/auth-validation";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Your Password — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Request a reset code and choose a new password for your Raffles Residences Boston resident portal account.",
      },
      { property: "og:title", content: "Reset Your Password — Raffles Boston Residences" },
      {
        property: "og:description",
        content: "Password recovery for the private residents' portal at 40 Trinity Place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { requestPasswordReset, resetPassword } = usePortal();
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const issueCode = (silent = false) => {
    const result = requestPasswordReset(email);
    if (!result.ok) {
      setError(result.error ?? "That request could not be completed.");
      return false;
    }
    setError(null);
    setIssuedCode(result.code ?? null);
    setCode("");
    setCooldown(30);
    toast.success(silent ? "New reset code issued." : "Reset code issued.");
    return true;
  };

  const request = (e: React.FormEvent) => {
    e.preventDefault();
    if (issueCode()) setStep("reset");
  };

  const complete = (e: React.FormEvent) => {
    e.preventDefault();
    const issues = validate(newPasswordSchema, { code, password, confirm });
    setFieldErrors(issues);
    if (Object.keys(issues).length > 0) {
      setError("Please correct the highlighted fields.");
      return;
    }
    const result = resetPassword({ email, code, password, confirm });
    if (!result.ok) {
      setError(result.error ?? "That password could not be changed.");
      return;
    }
    setError(null);

    toast.success("Password changed", {
      description: "Please sign in with your new password.",
    });
    void navigate({ to: "/login", search: { mode: "signin" } });
  };

  return (
    <PageShell
      eyebrow="Account Recovery"
      title="Reset your password"
      intro="Request a reset code for your registered address, then choose a new password. This demonstration keeps accounts in your browser only, so the code is shown on screen rather than emailed."
    >
      <div className="mt-12 max-w-xl border border-border bg-card p-8">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" aria-hidden="true" />
          <p className="eyebrow">{step === "request" ? "Step one of two" : "Step two of two"}</p>
        </div>

        {step === "request" ? (
          <form onSubmit={request} className="mt-6 space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email address</Label>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={error ? "reset-error" : undefined}
                aria-invalid={error ? true : undefined}
                className="min-h-11"
              />
            </div>
            <p
              id="reset-error"
              role="alert"
              aria-live="polite"
              className="min-h-5 text-sm text-destructive"
            >
              {error}
            </p>
            <Button type="submit" className="min-h-11 w-full tracking-[0.18em] uppercase">
              Send reset code
            </Button>
          </form>
        ) : (
          <form onSubmit={complete} className="mt-6 space-y-5" noValidate>
            {issuedCode ? (
              <p className="border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                Demonstration only — your reset code is{" "}
                <span className="text-foreground tracking-[0.2em]">{issuedCode}</span>. It lapses in
                fifteen minutes.
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="reset-code">Reset code</Label>
              <Input
                id="reset-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-invalid={fieldErrors['code'] ? true : undefined}
                aria-describedby={fieldErrors['code'] ? "reset-code-error" : undefined}
                className="min-h-11"
              />
              {fieldErrors['code'] ? (
                <p id="reset-code-error" role="alert" className="text-sm text-destructive">
                  {fieldErrors['code']}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-password">New password</Label>
              <Input
                id="reset-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={fieldErrors['password'] ? true : undefined}
                aria-describedby="reset-password-meter"
                className="min-h-11"
              />
              <PasswordStrengthMeter id="reset-password-meter" value={password} />
              {fieldErrors['password'] ? (
                <p role="alert" className="text-sm text-destructive">
                  {fieldErrors['password']}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-confirm">Confirm new password</Label>
              <Input
                id="reset-confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                aria-invalid={fieldErrors['confirm'] ? true : undefined}
                aria-describedby={fieldErrors['confirm'] ? "reset-confirm-error" : undefined}
                className="min-h-11"
              />
              {fieldErrors['confirm'] ? (
                <p id="reset-confirm-error" role="alert" className="text-sm text-destructive">
                  {fieldErrors['confirm']}
                </p>
              ) : null}
            </div>

            <p
              id="reset-error"
              role="alert"
              aria-live="polite"
              className="min-h-5 text-sm text-destructive"
            >
              {error}
            </p>
            <Button type="submit" className="min-h-11 w-full tracking-[0.18em] uppercase">
              Change my password
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={cooldown > 0}
              onClick={() => issueCode(true)}
              className="min-h-11 w-full tracking-[0.18em] uppercase"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-sm">
          <Link to="/login" search={{ mode: "signin" }} className="underline underline-offset-4">
            Return to sign in
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
