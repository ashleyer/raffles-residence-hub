import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell, TabBar, TabPanel } from "@/components/PageShell";
import { usePortal } from "@/lib/portal-store";
import { RequireSession } from "@/components/RequireSession";
import {
  ANNOUNCEMENTS,
  BOARD,
  CURRENT_SURVEY_MONTH,
  STAFF,
  SURVEY_QUESTIONS,
  type Person,
} from "@/lib/portal-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Management, Board & Announcements — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Meet the Board of Trustees and the residences team, read announcements from management, and complete the monthly resident satisfaction survey.",
      },
      { property: "og:title", content: "Management & Board — Raffles Boston Residences" },
      {
        property: "og:description",
        content: "Board of Trustees, residences staff, announcements and the monthly satisfaction survey.",
      },
    ],
  }),
  component: ManagementPage,
});

const TABS = [
  { id: "announcements", label: "Announcements" },
  { id: "board", label: "Meet the board" },
  { id: "staff", label: "Meet the staff" },
  { id: "survey", label: "Monthly survey" },
];

function ManagementPage() {
  const [tab, setTab] = useState("announcements");

  return (
    <PageShell
      eyebrow="Residences Office"
      title="Management & the Board"
      intro="Notices from the Residences Office, the people who look after the building, and the monthly measure of how we are doing."
    >
      <TabBar tabs={TABS} active={tab} onChange={setTab} label="Management sections" />

      <TabPanel id="announcements" active={tab}>
        <section aria-labelledby="ann-heading">
          <h2 id="ann-heading" className="text-2xl">
            Announcements from management
          </h2>
          <ul className="mt-6 space-y-4">
            {ANNOUNCEMENTS.map((a) => (
              <li key={a.id} className="border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="eyebrow">{a.author}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <h3 className="mt-3 text-2xl leading-snug">
                  {a.title}
                  {a.pinned && (
                    <span className="ml-3 border border-primary px-2 py-1 align-middle text-[0.6rem] tracking-[0.2em] text-primary uppercase">
                      Pinned
                    </span>
                  )}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </TabPanel>

      <TabPanel id="board" active={tab}>
        <PeopleGrid
          headingId="board-heading"
          heading="Board of Trustees"
          description="Elected by the deed-holders and responsible for the budget, the reserve and the house rules."
          people={BOARD}
        />
      </TabPanel>

      <TabPanel id="staff" active={tab}>
        <PeopleGrid
          headingId="staff-heading"
          heading="The residences team"
          description="The Raffles team on site every day, from the butler desk to building engineering."
          people={STAFF}
        />
      </TabPanel>

      <TabPanel id="survey" active={tab}>
        <RequireSession area="the resident satisfaction survey">
          <SurveySection />
        </RequireSession>
      </TabPanel>
    </PageShell>
  );
}

function PeopleGrid({
  heading,
  headingId,
  description,
  people,
}: {
  heading: string;
  headingId: string;
  description: string;
  people: Person[];
}) {
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl">
        {heading}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <li key={p.id} className="border border-border bg-card">
            <img
              src={p.photo}
              alt={`Portrait of ${p.name}, ${p.role}`}
              width={640}
              height={800}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl leading-snug">{p.name}</h3>
              <p className="mt-1 text-xs tracking-[0.16em] text-primary uppercase">{p.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SurveySection() {
  const { surveyResponses, submitSurvey, hasAnsweredSurvey } = usePortal();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const monthly = surveyResponses.filter((r) => r.month === CURRENT_SURVEY_MONTH);
  const average = (id: string) =>
    monthly.length ? monthly.reduce((sum, r) => sum + (r.ratings[id] ?? 0), 0) / monthly.length : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <section aria-labelledby="survey-heading">
        <h2 id="survey-heading" className="text-2xl">
          {CURRENT_SURVEY_MONTH} satisfaction survey
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Five questions, rated one (poor) to five (excellent). Responses reach management without your name attached.
        </p>

        {hasAnsweredSurvey ? (
          <p className="mt-8 border border-primary/50 bg-secondary/40 p-8 text-sm">
            Thank you — your response for {CURRENT_SURVEY_MONTH} has been recorded.
          </p>
        ) : (
          <form
            className="mt-8 space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (Object.keys(ratings).length < SURVEY_QUESTIONS.length) {
                toast.error("Please rate every question.");
                return;
              }
              submitSurvey({
                month: CURRENT_SURVEY_MONTH,
                ratings,
                ...(comment.trim() ? { comment: comment.trim() } : {}),
                submittedBy: "Anonymous",
              });
              toast.success("Survey submitted anonymously.");
            }}
          >
            {SURVEY_QUESTIONS.map((q) => (
              <fieldset key={q.id}>
                <legend className="text-sm">{q.prompt}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label
                      key={n}
                      className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center border px-4 text-sm transition-colors ${
                        ratings[q.id] === n
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={n}
                        checked={ratings[q.id] === n}
                        onChange={() => setRatings((prev) => ({ ...prev, [q.id]: n }))}
                        className="sr-only"
                      />
                      {n}
                      <span className="sr-only"> out of 5 for {q.prompt}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <div className="space-y-2">
              <Label htmlFor="survey-comment">Anything else for management? (optional)</Label>
              <Textarea id="survey-comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <Button type="submit" className="min-h-11 tracking-[0.18em] uppercase">
              Submit survey
            </Button>
          </form>
        )}
      </section>

      <aside className="border border-border bg-card p-7 lg:sticky lg:top-8 lg:self-start">
        <h2 className="text-2xl">Results so far</h2>
        <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
          {monthly.length} responses for {CURRENT_SURVEY_MONTH}.
        </p>
        <ul className="mt-6 space-y-5">
          {SURVEY_QUESTIONS.map((q) => {
            const avg = average(q.id);
            return (
              <li key={q.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm">{q.prompt}</p>
                  <p className="font-display text-xl">{avg.toFixed(1)}</p>
                </div>
                <div
                  role="img"
                  aria-label={`${avg.toFixed(1)} out of 5 average`}
                  className="mt-2 h-1.5 w-full bg-secondary"
                >
                  <div className="h-full bg-primary" style={{ width: `${(avg / 5) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
