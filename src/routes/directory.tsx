import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Info, PawPrint, Plus, Trash2, Users } from "lucide-react";
import { PageShell, SectionCard } from "@/components/PageShell";
import { RequireSession } from "@/components/RequireSession";
import { usePortal } from "@/lib/portal-store";
import type { HouseholdMember, HouseholdPet } from "@/lib/portal-data";
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
          "Opt-in residents' directory and household profiles for The Raffles Residences Boston: share as much or as little as you wish.",
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
      intro="Every household creates a profile with contact details when registering. Listing and contactability remain entirely optional — nothing about your household appears here unless you switch it on, and contact details are shown only to neighbours you have opted in to hear from."
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
        `${r.name} ${r.unit} ${r.interests.join(" ")} ${(r.members ?? []).map((m) => m.name).join(" ")} ${(r.pets ?? [])
          .map((p) => p.name)
          .join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())),
  );

  return (
    <>
      <p
        role="note"
        className="mt-8 flex items-start gap-3 border border-primary/40 bg-primary/5 px-5 py-4 text-sm leading-relaxed text-muted-foreground"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <span className="text-foreground">These are not real residents.</span> Every household, contact detail and pet
          shown here is fictional and provided for demonstration purposes only.
        </span>
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="listed-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="listed-heading" className="text-2xl">
              Listed households
            </h2>
            <div className="w-full max-w-xs space-y-2">
              <Label htmlFor="directory-search">Search by name, residence, interest or pet</Label>
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
                <p className="eyebrow">{r.unit}</p>
                <h3 className="mt-2 text-2xl">{r.name}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{r.bio}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {r.interests.map((i) => (
                    <li key={i} className="border border-border px-3 py-1 text-xs tracking-[0.14em] uppercase">
                      {i}
                    </li>
                  ))}
                </ul>

                {(r.members ?? []).length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="flex items-center gap-2 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                      <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      In residence
                    </p>
                    <ul className="mt-3 space-y-2">
                      {(r.members ?? []).map((m) => (
                        <li key={m.id} className="text-sm text-muted-foreground">
                          <span className="text-foreground">{m.name}</span> · {m.relation}
                          {r.contactOptIn && (m.email || m.phone) && (
                            <span className="mt-0.5 block text-xs">
                              {m.email && (
                                <a className="text-primary underline underline-offset-4" href={`mailto:${m.email}`}>
                                  {m.email}
                                </a>
                              )}
                              {m.email && m.phone && " · "}
                              {m.phone && (
                                <a
                                  className="text-primary underline underline-offset-4"
                                  href={`tel:${m.phone.replace(/[^\d+]/g, "")}`}
                                >
                                  {m.phone}
                                </a>
                              )}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(r.pets ?? []).length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="flex items-center gap-2 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                      <PawPrint className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      Pets in residence
                    </p>
                    <ul className="mt-3 space-y-2">
                      {(r.pets ?? []).map((p) => (
                        <li key={p.id} className="text-sm text-muted-foreground">
                          <span className="text-foreground">{p.name}</span> · {p.kind}
                          {p.note && <span className="mt-0.5 block text-xs">{p.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-5 border-t border-border pt-4 text-sm">
                  {r.contactOptIn ? (
                    <>
                      <span className="text-muted-foreground">Household contact · </span>
                      <a className="text-primary underline underline-offset-4" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                      {r.phone && (
                        <>
                          <span className="text-muted-foreground"> · </span>
                          <a
                            className="text-primary underline underline-offset-4"
                            href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}
                          >
                            {r.phone}
                          </a>
                        </>
                      )}
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

        <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
          <SectionCard
            id="visibility"
            title="Directory visibility"
            description="Both switches are off by default for new residences. You can opt out again at any time."
          >
            {currentUser && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Label htmlFor="visible" className="text-sm font-normal">
                    List {currentUser.unit} in the viewable directory
                  </Label>
                  <Switch
                    id="visible"
                    checked={currentUser.visibleInDirectory}
                    onCheckedChange={(v) => {
                      updateProfile({ visibleInDirectory: v });
                      toast.success(v ? "Your household is now listed." : "Your household has been removed from the directory.");
                    }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Label htmlFor="contact" className="text-sm font-normal">
                    Allow neighbours to contact this household directly
                  </Label>
                  <Switch
                    id="contact"
                    checked={currentUser.contactOptIn}
                    onCheckedChange={(v) => {
                      updateProfile({ contactOptIn: v });
                      toast.success(v ? "Contact details are now shown to listed neighbours." : "Contact details are now hidden.");
                    }}
                  />
                </div>
                <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                  {currentUser.visibleInDirectory
                    ? currentUser.contactOptIn
                      ? "Neighbours can see your household profile and reach you directly."
                      : "Neighbours can see your household profile; contact requests route through the concierge."
                    : "Your household is hidden from the directory entirely."}
                </p>
              </div>
            )}
          </SectionCard>

          <HouseholdProfile />
        </aside>
      </div>
    </>
  );
}

function HouseholdProfile() {
  const { currentUser, updateProfile } = usePortal();
  const [member, setMember] = useState({ name: "", relation: "", email: "", phone: "" });
  const [pet, setPet] = useState({ name: "", kind: "", note: "" });

  if (!currentUser) return null;
  const members = currentUser.members ?? [];
  const pets = currentUser.pets ?? [];

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member.name.trim() || !member.relation.trim()) {
      toast.error("A name and relation are required.");
      return;
    }
    const next: HouseholdMember = {
      id: `m-${Date.now()}`,
      name: member.name.trim(),
      relation: member.relation.trim(),
      ...(member.email.trim() ? { email: member.email.trim() } : {}),
      ...(member.phone.trim() ? { phone: member.phone.trim() } : {}),
    };
    updateProfile({ members: [...members, next] });
    setMember({ name: "", relation: "", email: "", phone: "" });
    toast.success(`${next.name} added to ${currentUser.unit}.`);
  };

  const addPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet.name.trim() || !pet.kind.trim()) {
      toast.error("A pet name and type are required.");
      return;
    }
    const next: HouseholdPet = {
      id: `p-${Date.now()}`,
      name: pet.name.trim(),
      kind: pet.kind.trim(),
      ...(pet.note.trim() ? { note: pet.note.trim() } : {}),
    };
    updateProfile({ pets: [...pets, next] });
    setPet({ name: "", kind: "", note: "" });
    toast.success(`${next.name} registered to ${currentUser.unit}.`);
  };

  return (
    <SectionCard
      id="household"
      title={`Household profile — ${currentUser.unit}`}
      description="One profile per residence, with individual resident and pet entries you may add or remove at will."
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Household profile updated.");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="profile-name">Household name</Label>
          <Input
            id="profile-name"
            value={currentUser.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className="min-h-11"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-email">Household email</Label>
            <Input
              id="profile-email"
              type="email"
              value={currentUser.email}
              onChange={(e) => updateProfile({ email: e.target.value })}
              className="min-h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-phone">Household telephone</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={currentUser.phone}
              onChange={(e) => updateProfile({ phone: e.target.value })}
              className="min-h-11"
            />
          </div>
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
        <Button type="submit" className="min-h-11 w-full tracking-[0.18em] uppercase">
          Save household profile
        </Button>
      </form>

      {/* --- residents ----------------------------------------------------- */}
      <div className="mt-8 border-t border-border pt-6">
        <h3 className="flex items-center gap-2 text-lg">
          <Users className="h-4 w-4 text-primary" aria-hidden="true" />
          Residents of {currentUser.unit}
        </h3>
        <ul className="mt-4 space-y-3" aria-live="polite">
          {members.map((m) => (
            <li key={m.id} className="flex items-start justify-between gap-3 border border-border p-3">
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground">{m.name}</span> · {m.relation}
                {(m.email || m.phone) && (
                  <span className="mt-0.5 block text-xs">{[m.email, m.phone].filter(Boolean).join(" · ")}</span>
                )}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0"
                aria-label={`Remove ${m.name}`}
                onClick={() => updateProfile({ members: members.filter((x) => x.id !== m.id) })}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
          {members.length === 0 && (
            <li className="border border-dashed border-border p-4 text-xs text-muted-foreground">
              No individual residents added yet.
            </li>
          )}
        </ul>

        <form onSubmit={addMember} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                value={member.name}
                onChange={(e) => setMember({ ...member, name: e.target.value })}
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-relation">Relation</Label>
              <Input
                id="member-relation"
                value={member.relation}
                onChange={(e) => setMember({ ...member, relation: e.target.value })}
                placeholder="Owner, spouse, child…"
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Email (optional)</Label>
              <Input
                id="member-email"
                type="email"
                value={member.email}
                onChange={(e) => setMember({ ...member, email: e.target.value })}
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-phone">Telephone (optional)</Label>
              <Input
                id="member-phone"
                type="tel"
                value={member.phone}
                onChange={(e) => setMember({ ...member, phone: e.target.value })}
                className="min-h-11"
              />
            </div>
          </div>
          <Button type="submit" variant="outline" className="min-h-11 w-full tracking-[0.16em] uppercase">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add resident
          </Button>
        </form>
      </div>

      {/* --- pets ---------------------------------------------------------- */}
      <div className="mt-8 border-t border-border pt-6">
        <h3 className="flex items-center gap-2 text-lg">
          <PawPrint className="h-4 w-4 text-primary" aria-hidden="true" />
          Pets in residence
        </h3>
        <ul className="mt-4 space-y-3" aria-live="polite">
          {pets.map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-3 border border-border p-3">
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground">{p.name}</span> · {p.kind}
                {p.note && <span className="mt-0.5 block text-xs">{p.note}</span>}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0"
                aria-label={`Remove ${p.name}`}
                onClick={() => updateProfile({ pets: pets.filter((x) => x.id !== p.id) })}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
          {pets.length === 0 && (
            <li className="border border-dashed border-border p-4 text-xs text-muted-foreground">
              No pets registered to this residence.
            </li>
          )}
        </ul>

        <form onSubmit={addPet} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pet-name">Name</Label>
              <Input
                id="pet-name"
                value={pet.name}
                onChange={(e) => setPet({ ...pet, name: e.target.value })}
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet-kind">Type or breed</Label>
              <Input
                id="pet-kind"
                value={pet.kind}
                onChange={(e) => setPet({ ...pet, kind: e.target.value })}
                placeholder="Dog · Labrador"
                className="min-h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-note">Note for neighbours and the concierge (optional)</Label>
            <Textarea
              id="pet-note"
              rows={2}
              maxLength={240}
              value={pet.note}
              onChange={(e) => setPet({ ...pet, note: e.target.value })}
            />
          </div>
          <Button type="submit" variant="outline" className="min-h-11 w-full tracking-[0.16em] uppercase">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add pet
          </Button>
        </form>
      </div>
    </SectionCard>
  );
}
