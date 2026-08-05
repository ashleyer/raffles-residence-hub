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
