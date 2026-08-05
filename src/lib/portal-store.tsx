import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  RESIDENTS,
  SEED_LISTINGS,
  SEED_LOST_FOUND,
  SEED_MAINTENANCE,
  SEED_PARCELS,
  SEED_PROPOSALS,
  SEED_SURVEY_RESPONSES,
  SEED_THREADS,
  SEED_TOPICS,
  SEED_VALET,
  STATEMENTS,
  type Listing,
  type LostFoundItem,
  type MaintenanceTicket,
  type Parcel,
  type PaymentRecord,
  type Proposal,
  type Resident,
  type Statement,
  type SurveyResponse,
  type Thread,
  type ForumTopic,
  type ValetRequest,
} from "./portal-data";

type Vote = "up" | "down";

type PortalValue = {
  /* session */
  currentUser: Resident | null;
  signIn: (email: string, passcode: string) => { ok: boolean; error?: string };
  signOut: () => void;

  /* directory & profile */
  residents: Resident[];
  updateProfile: (patch: Partial<Resident>) => void;

  /* messaging */
  threads: Thread[];
  sendMessage: (threadId: number, body: string) => void;
  createThread: (kind: Thread["kind"], name: string, participants: string[]) => number;

  /* billing */
  statements: Statement[];
  payments: PaymentRecord[];
  payStatement: (statementId: number, method: string) => void;

  /* services */
  valet: ValetRequest[];
  addValet: (r: Omit<ValetRequest, "id" | "status">) => void;
  cancelValet: (id: number) => void;
  maintenance: MaintenanceTicket[];
  addMaintenance: (t: Omit<MaintenanceTicket, "id" | "status" | "reportedAt">) => void;
  parcels: Parcel[];
  requestParcelDelivery: (id: number) => void;
  lostFound: LostFoundItem[];
  addLostFound: (i: Omit<LostFoundItem, "id" | "status">) => void;
  resolveLostFound: (id: number) => void;

  /* community */
  topics: ForumTopic[];
  addTopic: (t: Omit<ForumTopic, "id" | "at" | "replies">) => void;
  addReply: (topicId: number, body: string, author: string) => void;
  joined: string[];
  toggleJoin: (communityId: string) => void;

  /* marketplace */
  listings: Listing[];
  addListing: (l: Omit<Listing, "id" | "at" | "replies">) => void;
  addListingReply: (listingId: number, body: string, author: string) => void;

  /* proposals */
  proposals: Proposal[];
  votes: Record<number, Vote>;
  castVote: (id: number, vote: Vote) => void;
  addProposal: (p: Omit<Proposal, "id" | "at" | "up" | "down">) => void;

  /* surveys */
  surveyResponses: SurveyResponse[];
  submitSurvey: (r: Omit<SurveyResponse, "id">) => void;
  hasAnsweredSurvey: boolean;
};

const PortalContext = createContext<PortalValue | null>(null);

const nextId = () => Date.now() + Math.floor(Math.random() * 1000);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [residents, setResidents] = useState<Resident[]>(RESIDENTS);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS);
  const [statements, setStatements] = useState<Statement[]>(STATEMENTS);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [valet, setValet] = useState<ValetRequest[]>(SEED_VALET);
  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(SEED_MAINTENANCE);
  const [parcels, setParcels] = useState<Parcel[]>(SEED_PARCELS);
  const [lostFound, setLostFound] = useState<LostFoundItem[]>(SEED_LOST_FOUND);
  const [topics, setTopics] = useState<ForumTopic[]>(SEED_TOPICS);
  const [joined, setJoined] = useState<string[]>(["wine", "books"]);
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [proposals, setProposals] = useState<Proposal[]>(SEED_PROPOSALS);
  const [votes, setVotes] = useState<Record<number, Vote>>({});
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>(SEED_SURVEY_RESPONSES);
  const [answeredSurvey, setAnsweredSurvey] = useState(false);

  const currentUser = residents.find((r) => r.id === currentUserId) ?? null;

  const signIn = useCallback(
    (email: string, passcode: string) => {
      const match = residents.find((r) => r.email.toLowerCase() === email.trim().toLowerCase());
      if (!match) return { ok: false, error: "No residence is registered to that address." };
      if (passcode !== "raffles2026") return { ok: false, error: "That passcode is not recognised." };
      setCurrentUserId(match.id);
      return { ok: true };
    },
    [residents],
  );

  const value = useMemo<PortalValue>(
    () => ({
      currentUser,
      signIn,
      signOut: () => setCurrentUserId(null),

      residents,
      updateProfile: (patch) =>
        setResidents((prev) => prev.map((r) => (r.id === currentUserId ? { ...r, ...patch } : r))),

      threads,
      sendMessage: (threadId, body) =>
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  messages: [
                    ...t.messages,
                    { id: nextId(), author: currentUser?.name ?? "You", body, at: "Just now" },
                  ],
                }
              : t,
          ),
        ),
      createThread: (kind, name, participants) => {
        const id = nextId();
        setThreads((prev) => [{ id, kind, name, participants, messages: [] }, ...prev]);
        return id;
      },

      statements,
      payments,
      payStatement: (statementId, method) => {
        const statement = statements.find((s) => s.id === statementId);
        if (!statement) return;
        setStatements((prev) =>
          prev.map((s) => (s.id === statementId ? { ...s, status: "Paid" } : s)),
        );
        setPayments((prev) => [
          { id: nextId(), statementPeriod: statement.period, amount: statement.amount, method, at: "Just now" },
          ...prev,
        ]);
      },

      valet,
      addValet: (r) => setValet((prev) => [{ ...r, id: nextId(), status: "Requested" }, ...prev]),
      cancelValet: (id) => setValet((prev) => prev.filter((r) => r.id !== id)),
      maintenance,
      addMaintenance: (t) =>
        setMaintenance((prev) => [
          { ...t, id: nextId(), status: "Reported", reportedAt: "Just now" },
          ...prev,
        ]),
      parcels,
      requestParcelDelivery: (id) =>
        setParcels((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "Butler delivery requested" } : p)),
        ),
      lostFound,
      addLostFound: (i) => setLostFound((prev) => [{ ...i, id: nextId(), status: "Open" }, ...prev]),
      resolveLostFound: (id) =>
        setLostFound((prev) => prev.map((i) => (i.id === id ? { ...i, status: "Reunited" } : i))),

      topics,
      addTopic: (t) => setTopics((prev) => [{ ...t, id: nextId(), at: "Just now", replies: [] }, ...prev]),
      addReply: (topicId, body, author) =>
        setTopics((prev) =>
          prev.map((t) =>
            t.id === topicId
              ? { ...t, replies: [...t.replies, { id: nextId(), author, body, at: "Just now" }] }
              : t,
          ),
        ),
      joined,
      toggleJoin: (communityId) =>
        setJoined((prev) =>
          prev.includes(communityId) ? prev.filter((c) => c !== communityId) : [...prev, communityId],
        ),

      listings,
      addListing: (l) => setListings((prev) => [{ ...l, id: nextId(), at: "Just now", replies: [] }, ...prev]),
      addListingReply: (listingId, body, author) =>
        setListings((prev) =>
          prev.map((l) =>
            l.id === listingId
              ? { ...l, replies: [...l.replies, { id: nextId(), author, body, at: "Just now" }] }
              : l,
          ),
        ),

      proposals,
      votes,
      castVote: (id, vote) => {
        const existing = votes[id];
        setVotes((prev) => {
          const next = { ...prev };
          if (existing === vote) delete next[id];
          else next[id] = vote;
          return next;
        });
        setProposals((prev) =>
          prev.map((p) => {
            if (p.id !== id) return p;
            let { up, down } = p;
            if (existing === "up") up -= 1;
            if (existing === "down") down -= 1;
            if (existing !== vote) {
              if (vote === "up") up += 1;
              else down += 1;
            }
            return { ...p, up, down };
          }),
        );
      },
      addProposal: (p) =>
        setProposals((prev) => [{ ...p, id: nextId(), at: "Just now", up: 1, down: 0 }, ...prev]),

      surveyResponses,
      submitSurvey: (r) => {
        setSurveyResponses((prev) => [{ ...r, id: nextId() }, ...prev]);
        setAnsweredSurvey(true);
      },
      hasAnsweredSurvey: answeredSurvey,
    }),
    [
      currentUser,
      currentUserId,
      signIn,
      residents,
      threads,
      statements,
      payments,
      valet,
      maintenance,
      parcels,
      lostFound,
      topics,
      joined,
      listings,
      proposals,
      votes,
      surveyResponses,
      answeredSurvey,
    ],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}
