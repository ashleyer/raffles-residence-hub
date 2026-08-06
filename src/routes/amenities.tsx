import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, Info, MapPin, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { AMENITIES, CATERING_OPTIONS, SEED_BOOKINGS, type Booking } from "@/lib/intranet-data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePortal } from "@/lib/portal-store";
import { ForYou } from "@/components/ForYou";

export const Route = createFileRoute("/amenities")({
  head: () => ({
    meta: [
      { title: "Amenity Reservations — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Submit reservation requests with catering options for the Residents' Lounge on Floor 21, private in-residence dining, Long Bar & Terrace, Guerlain Spa and La Padrona.",
      },
      { property: "og:title", content: "Amenity Reservations — Raffles Boston Residences" },
      {
        property: "og:description",
        content:
          "Residents' booking desk: lounge, private dining, spa and restaurant requests with catering selections.",
      },
    ],
  }),
  component: AmenitiesPage,
});

function AmenitiesPage() {
  const { logActivity } = usePortal();
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [amenityId, setAmenityId] = useState(AMENITIES[0]!.id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(AMENITIES[0]!.slots[0]!);
  const [guests, setGuests] = useState("2");
  const [unit, setUnit] = useState("");
  const [catering, setCatering] = useState<string>(CATERING_OPTIONS[0]);
  const [notes, setNotes] = useState("");

  const amenity = useMemo(() => AMENITIES.find((a) => a.id === amenityId) ?? AMENITIES[0]!, [amenityId]);

  const selectAmenity = (id: string) => {
    const next = AMENITIES.find((a) => a.id === id) ?? AMENITIES[0]!;
    setAmenityId(next.id);
    setSlot(next.slots[0]!);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !unit.trim()) {
      toast.error("A date and residence number are required.");
      return;
    }
    if (bookings.some((b) => b.amenityId === amenity.id && b.date === date && b.slot === slot)) {
      toast.error("That sitting is already held. Please choose another window.");
      return;
    }
    setBookings((prev) => [
      {
        id: Date.now(),
        amenityId: amenity.id,
        amenityName: amenity.name,
        date,
        slot,
        guests: Math.max(1, Number(guests) || 1),
        unit: unit.trim(),
        catering,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      },
      ...prev,
    ]);
    setDate("");
    setUnit("");
    setNotes("");
    logActivity({ kind: "booking", refId: amenity.id, label: amenity.name });
    toast.success(`Request lodged for ${amenity.name}. The concierge will confirm shortly.`);
  };

  const release = (id: number) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success("Reservation released.");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-5 py-14 sm:px-8 md:py-20">
        <p className="eyebrow">Residents' Booking Desk</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Reservation requests</h1>
        <div className="gold-rule mt-5" />
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Requests are submitted to the Residences Office and confirmed by the Raffles Concierge. Catering may be
          attached to any sitting. Releases made before noon return the window to the house immediately.
        </p>

        <div className="mt-12 grid gap-10 md:gap-12 lg:grid-cols-[1.5fr_1fr]">
          <section aria-labelledby="rooms">
            <h2 id="rooms" className="text-2xl">
              In residence
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {AMENITIES.map((a) => (
                <li key={a.id}>
                  <article
                    className={`flex h-full flex-col border transition-colors ${
                      a.id === amenityId ? "border-primary bg-card" : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={a.image}
                      alt={`${a.name} at The Raffles Residences Boston`}
                      width={1200}
                      height={800}
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-2xl leading-snug">{a.name}</h3>
                      <p className="mt-2 flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
                        <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {a.location}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {a.hours}
                      </p>
                      {a.service && (
                        <p className="mt-3 flex gap-2 border-l-2 border-primary/50 pl-3 text-xs leading-relaxed text-muted-foreground">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                          {a.service}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => selectAmenity(a.id)}
                        className="mt-5 w-full tracking-[0.18em] uppercase"
                      >
                        {a.id === amenityId ? "Selected" : "Request this room"}
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl">Current bookings</h2>
            <div className="gold-rule mt-4" />
            <ul className="mt-6 space-y-3">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-start justify-between gap-4 border border-border bg-card p-5"
                >
                  <div>
                    <p className="flex items-center gap-2 text-lg">
                      <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                      {b.amenityName}
                    </p>
                    <p className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
                      {b.date} · {b.slot} · {b.guests} guests · {b.unit}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <UtensilsCrossed className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {b.catering}
                    </p>
                    {b.notes && <p className="mt-1 text-xs text-muted-foreground italic">{b.notes}</p>}
                  </div>
                  <Button variant="ghost" onClick={() => release(b.id)} className="tracking-[0.18em] uppercase">
                    Release
                  </Button>
                </li>
              ))}
              {bookings.length === 0 && (
                <li className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  No sittings currently held.
                </li>
              )}
            </ul>
          </section>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <form onSubmit={submit} className="border border-border bg-card p-7">
              <p className="eyebrow">Reservation request</p>
              <h2 className="mt-3 text-2xl">{amenity.name}</h2>
              <div className="gold-rule mt-4" />

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="amenity">Room or service</Label>
                  <select
                    id="amenity"
                    value={amenityId}
                    onChange={(e) => selectAmenity(e.target.value)}
                    className="h-11 w-full border border-input bg-transparent px-3 text-sm"
                  >
                    {AMENITIES.map((a) => (
                      <option key={a.id} value={a.id} className="bg-card">
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slot">Sitting</Label>
                  <select
                    id="slot"
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="h-11 w-full border border-input bg-transparent px-3 text-sm"
                  >
                    {amenity.slots.map((s) => (
                      <option key={s} value={s} className="bg-card">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="catering">Catering</Label>
                  <select
                    id="catering"
                    value={catering}
                    onChange={(e) => setCatering(e.target.value)}
                    className="h-11 w-full border border-input bg-transparent px-3 text-sm"
                  >
                    {CATERING_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-card">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    max={60}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Residence number</Label>
                  <Input
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Residence 34B"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for the concierge</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Dietary requirements, seating, floristry…"
                  />
                </div>

                <Button type="submit" className="min-h-12 w-full tracking-[0.18em] uppercase">
                  Submit request
                </Button>
              </div>
            </form>
          </aside>
        </div>

        <ForYou variant="inline" area="amenities" />
      </main>
      <SiteFooter />
    </div>
  );
}
