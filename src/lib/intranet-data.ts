export type Broadcast = {
  id: number;
  title: string;
  summary: string;
  badge: string;
  date: string;
};

export type Suggestion = {
  id: number;
  title: string;
  body: string;
  category: string;
  anonymous: boolean;
  unit?: string;
  upvotes: number;
  createdAt: string;
};

export type Amenity = {
  id: string;
  name: string;
  location: string;
  description: string;
  hours: string;
  slots: string[];
  image: string;
  service?: string;
};

export type Booking = {
  id: number;
  amenityId: string;
  amenityName: string;
  date: string;
  slot: string;
  guests: number;
  unit: string;
  catering: string;
  notes?: string;
};

export type ResidentEvent = {
  id: number;
  title: string;
  detail: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  attending: number;
  image: string;
};

export type EventIdea = {
  id: number;
  title: string;
  body: string;
  unit?: string;
  anonymous: boolean;
  interest: number;
};


export type ConciergeRequest = {
  id: number;
  service: string;
  detail: string;
  unit: string;
  priority: "Standard" | "Priority";
  status: "Lodged" | "In progress" | "Completed";
  placedAt: string;
};

export type GovernanceMeasure = {
  id: number;
  reference: string;
  title: string;
  summary: string;
  status: "Open for ballot" | "In committee" | "Carried" | "Withdrawn";
  closes: string;
  inFavour: number;
  against: number;
};

export type GovernanceDocument = {
  id: number;
  title: string;
  kind: string;
  issued: string;
};

export const CATEGORIES = [
  "Amenities",
  "Concierge & Service",
  "Governance",
  "Wellness & Spa",
  "Building Operations",
] as const;

export const BROADCASTS: Broadcast[] = [
  {
    id: 1,
    title: "Long Bar Terrace Reopening",
    summary:
      "The terrace above Back Bay returns to residents on the 12th following completion of the stone restoration programme. Evening service resumes at 5:00 PM daily.",
    badge: "Amenity",
    date: "March 4",
  },
  {
    id: 2,
    title: "Annual Trustee Assembly — Notice of Quorum",
    summary:
      "Deed-holders are asked to register attendance with the Residences Office no later than the 20th. Proxy instruments may be lodged with the concierge desk.",
    badge: "Governance",
    date: "March 1",
  },
  {
    id: 3,
    title: "Guerlain Spa Residents' Allocation",
    summary:
      "Priority treatment windows for in-residence members have been extended to weekday mornings, bookable through the concierge for the coming season.",
    badge: "Wellness",
    date: "February 26",
  },
];

export const SEED_SUGGESTIONS: Suggestion[] = [
  {
    id: 1,
    title: "Extend private dining room hours to Sunday evenings",
    body: "Several households host family on Sundays; a later close would be welcomed by residents on the upper floors.",
    category: "Amenities",
    anonymous: true,
    upvotes: 42,
    createdAt: "February 28",
  },
  {
    id: 2,
    title: "Dedicated EV valet charging in the arrival court",
    body: "Charging requests currently queue behind general valet. A reserved bay would shorten wait times considerably.",
    category: "Building Operations",
    anonymous: false,
    unit: "Residence 34B",
    upvotes: 31,
    createdAt: "February 24",
  },
  {
    id: 3,
    title: "Quarterly wine salon curated with the hotel sommelier",
    body: "A members-only tasting in the residents' lounge would give neighbours an occasion to meet in a considered setting.",
    category: "Concierge & Service",
    anonymous: true,
    upvotes: 27,
    createdAt: "February 19",
  },
];

export const AMENITIES: Amenity[] = [
  {
    id: "residents-lounge",
    name: "Residents' Lounge",
    location: "Floor 21 · Deed-holders and their guests",
    description:
      "The private heart of the residences on the twenty-first floor: a panelled salon with skyline outlook over Back Bay, a library corner, fireside seating and a self-serve pantry for morning coffee and afternoon refreshment.",
    hours: "6:00 AM – 11:00 PM daily",
    service:
      "Continental breakfast is laid daily until 9:00 AM. Outside that window the lounge is unattended — refreshments are self-serve, and anything further should be placed with the concierge or ordered as private dining.",
    slots: ["Morning · 07:30", "Afternoon · 15:00", "Evening · 18:30"],
    image: residentsLoungeImg,
  },
  {
    id: "private-dining",
    name: "Private Dining — In-Residence",
    location: "Served in your residence by the Raffles Butler",
    description:
      "A full in-room dining service: à la carte from the house kitchen, multi-course menus for seated dinners at home, and butler-served breakfast. Table dressing, glassware and clearing are included.",
    hours: "6:30 AM – 11:00 PM daily",
    service: "Kitchen closes at 11:00 PM; overnight requests are limited to a cold menu.",
    slots: ["Breakfast · 08:00", "Luncheon · 12:30", "Dinner · 19:00", "Late supper · 21:30"],
    image: privateDiningImg,
  },
  {
    id: "long-bar",
    name: "Long Bar & Terrace",
    location: "Perched above Back Bay",
    description:
      "Raffles heritage meets Boston energy: classic mixology in the spirit of the Singapore Sling, New England small plates, and sunset Champagne on the terrace.",
    hours: "11:00 AM – 10:00 PM daily",
    slots: ["Luncheon · 12:00", "Aperitif · 17:00", "Dinner · 19:30"],
    image: longBarImg,
  },
  {
    id: "guerlain-spa",
    name: "Guerlain Spa",
    location: "Wellness Level · Residents' allocation",
    description:
      "A full destination wellness experience — treatment suites, the twenty-metre indoor lap pool, hot tub and sauna, held apart from hotel inventory.",
    hours: "7:00 AM – 8:00 PM daily",
    slots: ["Morning · 08:00", "Midday · 12:30", "Evening · 18:00"],
    image: guerlainSpaImg,
  },
  {
    id: "la-padrona",
    name: "La Padrona — Private Table",
    location: "Michelin-recommended Italian",
    description:
      "The chef's table held for residences, with menus composed by the kitchen and service by the Raffles Butler.",
    hours: "10:00 AM – 11:00 PM daily",
    slots: ["Matinée · 14:00", "Evening · 19:00", "Late · 21:30"],
    image: laPadronaImg,
  },
  {
    id: "blind-duck",
    name: "Blind Duck Speakeasy",
    location: "By introduction only",
    description:
      "An intimate, design-forward cocktail room reserved for residents and their guests on request of the concierge.",
    hours: "8:00 AM – 7:00 PM weekdays",
    slots: ["Morning · 09:00", "Afternoon · 14:00", "Evening · 17:30"],
    image: blindDuckImg,
  },
];

export const CATERING_OPTIONS = [
  "No catering — room only",
  "Continental breakfast service",
  "Coffee, tea & pastries",
  "Canapés & Champagne reception",
  "Seated three-course dinner",
  "Chef's tasting menu with wine pairing",
  "Bar service only (host account)",
] as const;

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 1,
    amenityId: "long-bar",
    amenityName: "Long Bar & Terrace",
    date: "2026-08-08",
    slot: "Dinner · 19:30",
    guests: 8,
    unit: "Residence 34B",
    catering: "Canapés & Champagne reception",
  },
  {
    id: 2,
    amenityId: "la-padrona",
    amenityName: "La Padrona — Private Table",
    date: "2026-08-09",
    slot: "Evening · 19:00",
    guests: 12,
    unit: "Residence 21A",
    catering: "Chef's tasting menu with wine pairing",
  },
  {
    id: 3,
    amenityId: "residents-lounge",
    amenityName: "Residents' Lounge",
    date: "2026-08-11",
    slot: "Afternoon · 15:00",
    guests: 6,
    unit: "Residence 28D",
    catering: "Coffee, tea & pastries",
    notes: "Book club sitting by the fireplace.",
  },
];

export const SEED_EVENTS: ResidentEvent[] = [
  {
    id: 1,
    title: "Sommelier's Wine Salon",
    detail:
      "A guided tasting of six Piedmontese bottles with the hotel sommelier, poured alongside a cheese and charcuterie table.",
    location: "Residents' Lounge · Floor 21",
    date: "August 14, 2026",
    time: "6:30 PM",
    capacity: 40,
    attending: 26,
    image: residentsLoungeImg,
  },
  {
    id: 2,
    title: "Chef's Table — Late Summer Menu",
    detail: "Five courses composed by the La Padrona kitchen, served at the private table for residences.",
    location: "La Padrona",
    date: "August 22, 2026",
    time: "7:00 PM",
    capacity: 14,
    attending: 11,
    image: laPadronaImg,
  },
  {
    id: 3,
    title: "Wellness Morning & Lap Swim",
    detail: "Reserved pool hour followed by breathwork in the spa suite and a light breakfast in the lounge.",
    location: "Guerlain Spa",
    date: "September 5, 2026",
    time: "8:00 AM",
    capacity: 20,
    attending: 7,
    image: guerlainSpaImg,
  },
];

export const SEED_EVENT_IDEAS: EventIdea[] = [
  {
    id: 1,
    title: "Autumn rooftop jazz trio",
    body: "A short set on the terrace before the season turns, with a cocktail from the Long Bar list.",
    anonymous: true,
    interest: 18,
  },
  {
    id: 2,
    title: "Children's holiday afternoon in the lounge",
    body: "A supervised afternoon on Floor 21 for households with young families in December.",
    unit: "Residence 41C",
    anonymous: false,
    interest: 12,
  },
];

];

export const CONCIERGE_SERVICES = [
  "Housekeeping",
  "Valet & Transport",
  "In-Residence Dining",
  "Floristry",
  "Package & Courier",
  "Engineering",
] as const;

export const SEED_REQUESTS: ConciergeRequest[] = [
  {
    id: 1,
    service: "Valet & Transport",
    detail: "Car to Logan Airport, Terminal E, departing the arrival court at 6:15 AM.",
    unit: "Residence 41C",
    priority: "Priority",
    status: "In progress",
    placedAt: "This morning",
  },
  {
    id: 2,
    service: "Floristry",
    detail: "Weekly arrangement for the entry console — white peony and eucalyptus.",
    unit: "Residence 28D",
    priority: "Standard",
    status: "Lodged",
    placedAt: "Yesterday",
  },
  {
    id: 3,
    service: "Engineering",
    detail: "Adjust the terrace door closer; the seal is catching in humid weather.",
    unit: "Residence 34B",
    priority: "Standard",
    status: "Completed",
    placedAt: "March 2",
  },
];

export const MEASURES: GovernanceMeasure[] = [
  {
    id: 1,
    reference: "M-2026-04",
    title: "Adoption of the restored terrace maintenance schedule",
    summary:
      "The Board proposes a biannual stone and planter programme funded from the amenity reserve, effective the coming season.",
    status: "Open for ballot",
    closes: "August 21",
    inFavour: 63,
    against: 11,
  },
  {
    id: 2,
    reference: "M-2026-03",
    title: "Reserved electric-vehicle bays in the arrival court",
    summary:
      "Four bays would be re-designated for resident charging, with valet retaining priority for arrivals between 5:00 and 8:00 PM.",
    status: "In committee",
    closes: "September 4",
    inFavour: 48,
    against: 19,
  },
  {
    id: 3,
    reference: "M-2026-02",
    title: "Extension of private dining service to Sunday evenings",
    summary:
      "Carried at the February sitting following the community register submission from the upper floors.",
    status: "Carried",
    closes: "Closed February 27",
    inFavour: 71,
    against: 6,
  },
];

export const GOVERNANCE_DOCUMENTS: GovernanceDocument[] = [
  { id: 1, title: "Declaration of Trust & House Rules", kind: "Governing instrument", issued: "Revised January 2026" },
  { id: 2, title: "Operating Budget & Reserve Study", kind: "Financial", issued: "February 2026" },
  { id: 3, title: "Minutes — February Trustee Sitting", kind: "Minutes", issued: "March 1, 2026" },
  { id: 4, title: "Proxy Instrument for the Annual Assembly", kind: "Form", issued: "March 1, 2026" },
];
