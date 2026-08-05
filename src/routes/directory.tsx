import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell, SectionCard } from "@/components/PageShell";
import { RequireSession } from "@/components/RequireSession";
import { usePortal } from "@/lib/portal-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Residents' Directory — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Opt-in residents' directory and profile settings for The Raffles Residences Boston: share as much or as little as you wish.",
      },
      { property: "og:title", content: "Residents' Directory — Raffles Boston Residences" },
      { property: "og:description", content: "An opt-in register of neighbours at 40 Trinity Place." },
    ],
  }),
  component: DirectoryPage,
});

function DirectoryPage() {
  return (
    <PageShell
      eyebrow="Community"
      title="Residents' directory"
      intro="Listing is entirely optional. Nothing about your household appears here unless you switch it on, and contact details are shown only to neighbours you have opted in to hear from."
    >
      <RequireSession area="the residents' directory">
        <DirectoryBody />
      </RequireSession>
    </PageShell>
  );
}

function DirectoryBody() {
  const { residents, currentUser, updateProfile } = usePortal();
  const [query, setQuery] = useState("");

  const listed = residents.filter(
    (r) =>
      r.visibleInDirectory &&
      (query.trim() === "" ||
        `${r.name} ${r.unit} ${r.interests.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <section aria-labelledby="listed-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="listed-heading" className="text-2xl">
            Listed households
          </h2>
          <div className="w-full max-w-xs space-y-2">
            <Label htmlFor="directory-search">Search by name, residence or interest</Label>
            <Input
              id="directory-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-11"
            />
          </div>
        </div>

        <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
          {listed.length} {listed.length === 1 ? "household" : "households"} listed.
        </p>

        <ul className="mt-6 space-y-4">
          {listed.map((r) => (
            <li key={r.id} className="border border-border bg-card p-6">
              <h3 className="text-2xl">{r.name}</h3>
              <p className="text-sm text-muted-foreground">{r.unit}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{r.bio}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {r.interests.map((i) => (
                  <li key={i} className="border border-border px-3 py-1 text-xs tracking-[0.14em] uppercase">
                    {i}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                {r.contactOptIn ? (
                  <>
                    <span className="text-muted-foreground">Contactable · </span>
                    <a className="text-primary underline underline-offset-4" href={`mailto:${r.email}`}>
                      {r.email}
                    </a>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    Listed but not accepting direct contact — reach them through the concierge desk.
                  </span>
                )}
              </p>
              {r.id !== currentUser?.id && (
                <Link
                  to="/messages"
                  className="mt-4 inline-flex min-h-11 items-center border border-border px-5 text-xs tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
                >
                  Message {r.unit}
                </Link>
              )}
            </li>
          ))}
          {listed.length === 0 && (
            <li className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No listed household matches that search.
            </li>
          )}
        </ul>
      </section>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <SectionCard
          id="my-profile"
          title="My profile"
          description="What you share here is what neighbours see. Both switches are off by default for new residences."
        >
          {currentUser && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Profile updated.");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="profile-name">Display name</Label>
                <Input
                  id="profile-name"
                  value={currentUser.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-bio">About your household</Label>
                <Textarea
                  id="profile-bio"
                  rows={4}
                  value={currentUser.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-interests">Interests (comma separated)</Label>
                <Input
                  id="profile-interests"
                  value={currentUser.interests.join(", ")}
                  onChange={(e) =>
                    updateProfile({
                      interests: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="min-h-11"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <Label htmlFor="visible" className="text-sm font-normal">
                  List my household in the directory
                </Label>
                <Switch
                  id="visible"
                  checked={currentUser.visibleInDirectory}
                  onCheckedChange={(v) => updateProfile({ visibleInDirectory: v })}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label htmlFor="contact" className="text-sm font-normal">
                  Allow neighbours to contact me directly
                </Label>
                <Switch
                  id="contact"
                  checked={currentUser.contactOptIn}
                  onCheckedChange={(v) => updateProfile({ contactOptIn: v })}
                />
              </div>

              <Button type="submit" className="min-h-11 w-full tracking-[0.18em] uppercase">
                Save profile
              </Button>
            </form>
          )}
        </SectionCard>
      </aside>
    </div>
  );
}
