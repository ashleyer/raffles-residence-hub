import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_PASSCODE,
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
import {
  SEED_REQUESTS,
  type ConciergeRequest,
} from "./intranet-data";
import type { ActivityEvent } from "./recommendations";

type Vote = "up" | "down";

type PortalValue = {
  /* session */
  currentUser: Resident | null;
  signIn: (
    email: string,
    passcode: string,
    remember?: boolean,
    unit?: string,
  ) => { ok: boolean; error?: string };
  signUp: (input: {
    name: string;
    email: string;
    unit: string;
    phone: string;
    password: string;
    confirm: string;
    remember?: boolean;
  }) => { ok: boolean; error?: string };
  signOut: () => void;
  rememberedEmail: string | null;
  rememberedUnit: string | null;

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

  /* activity signals for personalisation */
  activity: ActivityEvent[];
  logActivity: (e: Omit<ActivityEvent, "id" | "at">) => void;

  /* concierge desk — shared between residents and staff */
  conciergeRequests: ConciergeRequest[];
  addConciergeRequest: (r: Omit<ConciergeRequest, "id" | "status" | "placedAt" | "replies">) => void;
  setConciergeStatus: (id: number, status: ConciergeRequest["status"]) => void;
  assignConciergeRequest: (id: number, staff: string) => void;
  replyToConciergeRequest: (id: number, body: string, author: string) => void;

  /* surveys */
  surveyResponses: SurveyResponse[];
  submitSurvey: (r: Omit<SurveyResponse, "id">) => void;
  hasAnsweredSurvey: boolean;
};

/** "22h" / "unit 22H" -> "Residence 22H" */
export function formatUnit(raw: string): string {
  const value = raw.trim().replace(/^(residence|unit|apt\.?|apartment)\s+/i, "");
  if (!value) return "";
  return `Residence ${value.toUpperCase()}`;
}

const unitKey = (u: string) => u.replace(/^(residence|unit|apt\.?|apartment)\s+/i, "").replace(/\s+/g, "").toUpperCase();

/** A real residence number, as opposed to a placeholder. */
function isKnownUnit(u: string): boolean {
  return /\d/.test(u);
}

function sameUnit(a: string, b: string): boolean {
  return unitKey(a) === unitKey(b);
}

const PortalContext = createContext<PortalValue | null>(null);

const nextId = () => Date.now() + Math.floor(Math.random() * 1000);

/* --------------------------------------------------------------- storage */
/* Demo persistence only: accounts live in this browser, never on a server. */

const ACCOUNTS_KEY = "raffles.accounts.v1";
const RESIDENTS_KEY = "raffles.residents.v1";
const SESSION_KEY = "raffles.session.v1";
/* Last signed-in identity: kept after sign out so residents never re-register. */
const LAST_USER_KEY = "raffles.lastUser.v1";
const REQUESTS_KEY = "raffles.conciergeRequests.v1";

type Account = { email: string; password: string; residentId: string };

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the session simply will not be remembered */
  }
}

function clearStore(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [residents, setResidents] = useState<Resident[]>(RESIDENTS);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [rememberedEmail, setRememberedEmail] = useState<string | null>(null);
  const [rememberedUnit, setRememberedUnit] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
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
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [conciergeRequests, setConciergeRequests] = useState<ConciergeRequest[]>(SEED_REQUESTS);

  /* Restore any remembered residences and session after hydration. */
  useEffect(() => {
    try {
      const month = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (localStorage.getItem(`raffles-happiness-survey-${month}`)) setAnsweredSurvey(true);
    } catch {
      /* ignore */
    }
    const savedResidents = readStore<Resident[]>(RESIDENTS_KEY, []);
    if (savedResidents.length > 0) {
      setResidents((seed) => {
        const merged = [...seed];
        for (const r of savedResidents) {
          const i = merged.findIndex((x) => x.id === r.id);
          if (i >= 0) merged[i] = r;
          else merged.push(r);
        }
        return merged;
      });
    }
    setAccounts(readStore<Account[]>(ACCOUNTS_KEY, []));
    const session = readStore<{ residentId: string; email: string } | null>(SESSION_KEY, null);
    const last = readStore<{ email: string; unit?: string } | null>(LAST_USER_KEY, null);
    if (last) {
      setRememberedEmail(last.email);
      setRememberedUnit(last.unit ?? null);
    }
    if (session) {
      setCurrentUserId(session.residentId);
      setRememberedEmail(session.email);
    }
    const savedRequests = readStore<ConciergeRequest[] | null>(REQUESTS_KEY, null);
    if (savedRequests && savedRequests.length > 0) setConciergeRequests(savedRequests);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStore(ACCOUNTS_KEY, accounts);
  }, [accounts, hydrated]);

  /* The desk queue is shared: resident submissions and staff replies persist. */
  useEffect(() => {
    if (hydrated) writeStore(REQUESTS_KEY, conciergeRequests);
  }, [conciergeRequests, hydrated]);

  /* Profile edits (directory listing, household members, pets) survive reloads. */
  useEffect(() => {
    if (hydrated) writeStore(RESIDENTS_KEY, residents);
  }, [residents, hydrated]);

  const currentUser = residents.find((r) => r.id === currentUserId) ?? null;

  const rememberSession = useCallback((resident: Resident, remember: boolean) => {
    setCurrentUserId(resident.id);
    setRememberedEmail(resident.email);
    setRememberedUnit(resident.unit ?? null);
    writeStore(LAST_USER_KEY, { email: resident.email, unit: resident.unit });
    if (remember) writeStore(SESSION_KEY, { residentId: resident.id, email: resident.email });
    else clearStore(SESSION_KEY);
  }, []);

  const signIn = useCallback(
    (email: string, passcode: string, remember = true, unit?: string) => {
      const address = email.trim().toLowerCase();
      const residence = formatUnit(unit ?? "");
      if (!address.includes("@")) return { ok: false, error: "Enter a valid email address." };
      if (!residence) return { ok: false, error: "Enter your residence number." };
      if (!passcode.trim()) return { ok: false, error: "Enter your password or the residence passcode." };

      const unitMatches = (resident: Resident) =>
        !isKnownUnit(resident.unit) || sameUnit(resident.unit, residence);

      // 1. An account created through sign up.
      const account = accounts.find((a) => a.email === address);
      if (account) {
        if (account.password !== passcode) return { ok: false, error: "That password is not correct." };
        const resident = residents.find((r) => r.id === account.residentId);
        if (!resident) return { ok: false, error: "That account could not be found. Please register again." };
        if (!unitMatches(resident)) {
          return { ok: false, error: "That residence number does not match the address on file." };
        }
        if (!isKnownUnit(resident.unit)) {
          setResidents((prev) => prev.map((r) => (r.id === resident.id ? { ...r, unit: residence } : r)));
        }
        rememberSession(resident, remember);
        return { ok: true };
      }

      // 2. A seeded residence, admitted with the shared preview passcode.
      if (passcode.trim() !== DEMO_PASSCODE) {
        return { ok: false, error: "No account found for that address. Create one, or use the preview passcode." };
      }
      const match = residents.find((r) => r.email.toLowerCase() === address);
      if (match) {
        if (!unitMatches(match)) {
          return { ok: false, error: "That residence number does not match the address on file." };
        }
        rememberSession(match, remember);
        return { ok: true };
      }

      // 3. Guest access: the preview passcode admits any address.
      const id = `guest-${Date.now()}`;
      const fallbackName = (address.split("@")[0] ?? "")
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const guest: Resident = {
        id,
        name: fallbackName || "Guest Resident",
        unit: residence,
        email: address,
        phone: "",
        bio: "Exploring the residents' portal with guest access.",
        interests: [],
        visibleInDirectory: false,
        contactOptIn: false,
        members: [],
        pets: [],
      };
      setResidents((prev) => [...prev, guest]);
      rememberSession(guest, remember);
      return { ok: true };
    },

    [accounts, residents, rememberSession],
  );

  const signUp = useCallback<PortalValue["signUp"]>(
    ({ name, email, unit, phone, password, confirm, remember = true }) => {
      const address = email.trim().toLowerCase();
      const residence = formatUnit(unit ?? "");
      if (!name.trim()) return { ok: false, error: "Enter the name for your household." };
      if (!address.includes("@")) return { ok: false, error: "Enter a valid email address." };
      if (!residence) return { ok: false, error: "Enter your residence number." };
      if (!phone || phone.replace(/\D/g, "").length < 7)
        return { ok: false, error: "Enter a contact number for your household profile." };
      if (password.length < 8) return { ok: false, error: "Choose a password of at least eight characters." };
      if (password !== confirm) return { ok: false, error: "The two passwords do not match." };
      if (accounts.some((a) => a.email === address)) {
        return { ok: false, error: "An account already exists for that address. Please sign in." };
      }

      const existing = residents.find((r) => r.email.toLowerCase() === address);
      const resident: Resident =
        existing ?? {
          id: `res-${Date.now()}`,
          name: name.trim(),
          unit: residence,
          email: address,
          phone: phone.trim(),
          bio: "",
          interests: [],
          visibleInDirectory: false,
          contactOptIn: false,
          members: [],
          pets: [],
        };

      if (existing) {
        setResidents((prev) =>
          prev.map((r) =>
            r.id === existing.id ? { ...r, name: name.trim(), unit: residence, phone: phone.trim() } : r,
          ),
        );
      } else {
        setResidents((prev) => [...prev, resident]);
      }

      setAccounts((prev) => [...prev, { email: address, password, residentId: resident.id }]);
      rememberSession(resident, remember);
      return { ok: true };
    },
    [accounts, residents, rememberSession],
  );

  const value = useMemo<PortalValue>(
    () => ({
      currentUser,
      signIn,
      signUp,
      rememberedEmail,
      rememberedUnit,
      /* Sign out only ends the session: the account, profile and remembered
         email stay in this browser so the resident signs back in, never up. */
      signOut: () => {
        setCurrentUserId(null);
        clearStore(SESSION_KEY);
      },

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
          prev.map((p) => (p.id === id ? { ...p, status: "Concierge delivery requested" } : p)),
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

      activity,
      logActivity: (e) =>
        setActivity((prev) => [{ ...e, id: nextId(), at: "Just now" }, ...prev]),
      /* Concierge desk queue: residents lodge, staff triage and reply. */
      conciergeRequests,
      addConciergeRequest: (r) =>
        setConciergeRequests((prev) => [
          { ...r, id: nextId(), status: "Lodged", placedAt: "Just now", replies: [] },
          ...prev,
        ]),
      setConciergeStatus: (id, status) =>
        setConciergeRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r))),
      assignConciergeRequest: (id, staff) =>
        setConciergeRequests((prev) => prev.map((r) => (r.id === id ? { ...r, assignedTo: staff } : r))),
      replyToConciergeRequest: (id, body, author) =>
        setConciergeRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: r.status === "Lodged" ? "In progress" : r.status,
                  replies: [...(r.replies ?? []), { id: nextId(), body, author, at: "Just now" }],
                }
              : r,
          ),
        ),

      surveyResponses,

      submitSurvey: (r) => {
        setSurveyResponses((prev) => [{ ...r, id: nextId() }, ...prev]);
        setAnsweredSurvey(true);
        try {
          localStorage.setItem(`raffles-happiness-survey-${r.month}`, "done");
        } catch {
          /* ignore */
        }
      },
      hasAnsweredSurvey: answeredSurvey,
    }),
    [
      currentUser,
      currentUserId,
      signIn,
      signUp,
      rememberedEmail,
      rememberedUnit,
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
      activity,
    ],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}
