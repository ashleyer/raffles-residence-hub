import { scorePassword } from "@/lib/password-strength";

/* Visual strength indicator with an accessible text summary. Colour alone never
   conveys the result — the label and hints are always readable. */
export function PasswordStrengthMeter({ value, id }: { value: string; id?: string }) {
  const { score, label, suggestions } = scorePassword(value);
  const tone = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-emerald-600", "bg-emerald-700"][
    score
  ];

  return (
    <div id={id} className="space-y-2">
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${value && i < score ? tone : "bg-border"}`}
          />
        ))}
      </div>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        <span className="text-foreground">Password strength: {value ? label : "not set"}.</span>
        {suggestions.length ? ` ${suggestions.join(" ")}` : " This password looks solid."}
      </p>
    </div>
  );
}
