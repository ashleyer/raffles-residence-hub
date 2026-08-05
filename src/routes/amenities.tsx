import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AMENITIES, SEED_BOOKINGS, type Booking } from "@/lib/intranet-data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/amenities")({
  head: () => ({
    meta: [
      { title: "Amenity Reservations — Raffles Boston Residences" },
      {
        name: "description",
        content:
          "Reserve the private dining room, Guerlain spa suite, screening room and trustees' board room at Raffles Boston Residences.",
      },
      { property: "og:title", content: "Amenity Reservations — Raffles Boston Residences" },
      {
        property: "og:description",
        content: "Residents' booking desk for private dining, spa, screening room and board room.",
      },
    ],
  }),
  component: AmenitiesPage,
});

function AmenitiesPage() {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [amenityId, setAmenityId] = useState(AMENITIES[0]!.id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(AMENITIES[0]!.slots[0]!);
  const [guests, setGuests] = useState("2");
  const [unit, setUnit] = useState("");

  const amenity = useMemo(
    () => AMENITIES.find((a) => a.id === amenityId) ?? AMENITIES[0]!,
    [amenityId],
  );

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
      },
      ...prev,
    ]);
    setDate("");
    setUnit("");
    toast.success(`${amenity.name} reserved. The concierge will confirm shortly.`);
  };

  const release = (id: number) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success("Reservation released.");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="eyebrow">Residents' Booking Desk</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Amenity reservations</h1>
        <div className="gold-rule mt-5" />
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Sittings are held for deed-holders and confirmed by the residence butler. Releases made before noon
          return the window to the house immediately.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <section aria-labelledby="rooms">
            <h2 id="rooms" className="text-2xl">
              In residence
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {AMENITIES.map((a) => (
                <li key={a.id}>
                  <article
                    className={`h-full border p-6 transition-colors ${
                      a.id === amenityId ? "border-primary bg-card" : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
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
                    <Button
                      variant="outline"
                      onClick={() => selectAmenity(a.id)}
                      className="mt-5 w-full tracking-[0.18em] uppercase"
                    >
                      {a.id === amenityId ? "Selected" : "Reserve this room"}
                    </Button>
                  </article>
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl">Held sittings</h2>
            <div className="gold-rule mt-4" />
            <ul className="mt-6 space-y-3">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-5"
                >
                  <div>
                    <p className="flex items-center gap-2 text-lg">
                      <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                      {b.amenityName}
                    </p>
                    <p className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
                      {b.date} · {b.slot} · {b.guests} guests · {b.unit}
                    </p>
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
              <p className="eyebrow">Reservation</p>
              <h2 className="mt-3 text-2xl">{amenity.name}</h2>
              <div className="gold-rule mt-4" />

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="amenity">Room</Label>
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
                  <Label htmlFor="guests">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    max={20}
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

                <Button type="submit" className="min-h-12 w-full tracking-[0.18em] uppercase">
                  Hold this sitting
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
