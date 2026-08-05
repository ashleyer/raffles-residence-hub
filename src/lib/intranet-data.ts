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
};

export type Booking = {
  id: number;
  amenityId: string;
  amenityName: string;
  date: string;
  slot: string;
  guests: number;
  unit: string;
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
    title: "Sky Lobby Terrace Reopening",
    summary:
      "The 17th-floor terrace returns to residents on the 12th following completion of the stone restoration programme. Evening service resumes at 5:00 PM daily.",
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
    id: "private-dining",
    name: "Private Dining Room",
    location: "Seventeenth Floor · Sky Lobby",
    description:
      "Seats fourteen beneath the Back Bay skyline, with menus composed by the hotel kitchen and service by the residence butler.",
    hours: "11:00 AM – 10:00 PM daily",
    slots: ["Luncheon · 12:00", "Aperitif · 17:00", "Dinner · 19:30"],
  },
  {
    id: "guerlain-spa",
    name: "Guerlain Spa Suite",
    location: "Fourth Floor · Wellness Level",
    description:
      "Residents' allocation for the treatment suite, thermal circuit and relaxation gallery, held apart from hotel inventory.",
    hours: "7:00 AM – 8:00 PM daily",
    slots: ["Morning · 08:00", "Midday · 12:30", "Evening · 18:00"],
  },
  {
    id: "screening-room",
    name: "Screening Room",
    location: "Third Floor · Residents' Club",
    description:
      "Twenty velvet seats, Dolby Atmos and a projection booth attended by the club steward for private engagements.",
    hours: "10:00 AM – 11:00 PM daily",
    slots: ["Matinée · 14:00", "Evening · 19:00", "Late · 21:30"],
  },
  {
    id: "board-room",
    name: "Trustees' Board Room",
    location: "Seventeenth Floor · East Wing",
    description:
      "A panelled room for committee sittings, private meetings and the reading of the residence accounts.",
    hours: "8:00 AM – 7:00 PM weekdays",
    slots: ["Morning · 09:00", "Afternoon · 14:00", "Evening · 17:30"],
  },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 1,
    amenityId: "private-dining",
    amenityName: "Private Dining Room",
    date: "2026-08-08",
    slot: "Dinner · 19:30",
    guests: 8,
    unit: "Residence 34B",
  },
  {
    id: 2,
    amenityId: "screening-room",
    amenityName: "Screening Room",
    date: "2026-08-09",
    slot: "Evening · 19:00",
    guests: 12,
    unit: "Residence 21A",
  },
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
