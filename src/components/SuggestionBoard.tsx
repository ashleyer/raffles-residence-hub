import { useMemo, useState } from "react";
import { ArrowUp, Lock } from "lucide-react";
import { CATEGORIES, SEED_SUGGESTIONS, type Suggestion } from "@/lib/intranet-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function SuggestionBoard() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(SEED_SUGGESTIONS);
  const [voted, setVoted] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>("All");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [unit, setUnit] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  const visible = useMemo(
    () =>
      [...suggestions]
        .filter((s) => filter === "All" || s.category === filter)
        .sort((a, b) => b.upvotes - a.upvotes),
    [suggestions, filter],
  );

  const toggleVote = (id: number) => {
    const has = voted.includes(id);
    setVoted(has ? voted.filter((v) => v !== id) : [...voted, id]);
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + (has ? -1 : 1) } : s)),
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("A title and a short description are required.");
      return;
    }
    if (!anonymous && !unit.trim()) {
      toast.error("Attributed submissions require a residence number.");
      return;
    }
    const entry: Suggestion = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      category,
      anonymous,
      ...(anonymous ? {} : { unit: unit.trim() }),
      upvotes: 1,
      createdAt: "Just now",
    };
    setSuggestions((prev) => [entry, ...prev]);
    setVoted((prev) => [...prev, entry.id]);
    setTitle("");
    setBody("");
    setUnit("");
    toast.success("Submission lodged with the Residences Office.");
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      <section id="suggestions">
        <p className="eyebrow">Community Suggestion Register</p>
        <h2 className="mt-3 text-4xl">Proposals before the residence</h2>
        <div className="gold-rule mt-5" />

        <div className="mt-8 flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`border px-4 py-1.5 text-xs tracking-[0.16em] uppercase transition-colors ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="mt-8 space-y-4">
          {visible.map((s) => (
            <li key={s.id} className="border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex gap-6">
                <button
                  onClick={() => toggleVote(s.id)}
                  aria-label={`Upvote ${s.title}`}
                  className={`flex h-16 w-14 shrink-0 flex-col items-center justify-center border transition-colors ${
                    voted.includes(s.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="font-display text-lg leading-none">{s.upvotes}</span>
                </button>
                <div>
                  <p className="eyebrow">{s.category}</p>
                  <h3 className="mt-2 text-2xl leading-snug">{s.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <p className="mt-3 text-xs tracking-wider text-muted-foreground/70 uppercase">
                    {s.anonymous ? "Anonymous deed-holder" : s.unit} · {s.createdAt}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No proposals filed under this category.
            </li>
          )}
        </ul>
      </section>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <form onSubmit={submit} className="border border-border bg-card p-7">
          <p className="eyebrow">Suggestion Box</p>
          <h3 className="mt-3 text-2xl">Submit a proposal</h3>
          <div className="gold-rule mt-4" />

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A concise summary" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 w-full border border-input bg-transparent px-3 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-card">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Details</Label>
              <Textarea
                id="body"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe the proposal for the Board of Trustees"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <Label htmlFor="anon" className="text-sm font-normal">
                Submit anonymously
              </Label>
              <Switch id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
            </div>

            {!anonymous && (
              <div className="space-y-2">
                <Label htmlFor="unit">Residence number</Label>
                <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Residence 34B" />
              </div>
            )}

            <Button type="submit" className="w-full tracking-[0.18em] uppercase">
              Lodge submission
            </Button>
          </div>
        </form>

        <div className="mt-6 border border-border bg-secondary/40 p-7">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <p className="eyebrow">Quorum Verification</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Only deed-holders and long-term leaseholders matching a registered residence may cast upvote tokens.
            Submitter identifiers are held separately from proposal records to preserve anonymity.
          </p>
        </div>
      </aside>
    </div>
  );
}
