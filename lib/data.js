import { GoldTitle, GrayTitle } from "@/components/reusables";

export const LOGOS = [
  { src: "/amazon.svg", alt: "Amazon" },
  { src: "/atlassian.svg", alt: "Atlassian" },
  { src: "/google.webp", alt: "Google" },
  { src: "/meta.svg", alt: "Meta" },
  { src: "/microsoft.webp", alt: "Microsoft" },
  { src: "/netflix.png", alt: "Netflix" },
  { src: "/uber.svg", alt: "Uber" },
];

export const AVATARS = [
  { src: "https://randomuser.me/api/portraits/men/32.jpg" },
  { src: "https://randomuser.me/api/portraits/women/44.jpg" },
  { src: "https://randomuser.me/api/portraits/men/76.jpg" },
  { src: "https://randomuser.me/api/portraits/women/68.jpg" },
  { src: "https://randomuser.me/api/portraits/men/12.jpg" },
];

export const AI_TAGS = [
  { label: "Frontend Engineer", active: true },
  { label: "L5 Level", active: true },
  { label: "React Performance", active: false },
  { label: "System Design", active: false },
  { label: "Behavioural", active: true },
  { label: "DSA", active: false },
];

export const SLOTS = [
  {
    label: "Mon 10:00 AM",
    cls: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
  { label: "Mon 2:00 PM", cls: "border-white/7 text-stone-500" },
  {
    label: "Tue 11:00 AM",
    cls: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
  {
    label: "Wed 9:00 AM ✓",
    cls: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  },
  {
    label: "Thu 3:00 PM",
    cls: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
];

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    credits: "1 credit / month",
    featured: false,
    planId: null,
    slug: "free",
    features: [
      "1 mock interview session",
      "HD video call via Stream",
      "Persistent chat thread",
    ],
  },
  {
    name: "Starter",
    price: "$29",
    credits: "5 credits / month",
    featured: true,
    planId: "cplan_3Az9LokzTcywp64E2clEolnnqhB",
    slug: "starter",
    features: [
      "5 mock interview sessions",
      "AI feedback report",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
    ],
  },
  {
    name: "Pro",
    price: "$69",
    credits: "15 credits / month",
    featured: false,
    planId: "cplan_3Az9PNOYND36xNf4JEkpT22w4X2",
    slug: "pro",
    features: [
      "15 mock interview sessions",
      "AI feedback report",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
      "Recording & playback link",
    ],
  },
];

export const ROLES = [
  {
    label: "Interviewee",
    title: <GrayTitle>Land the role you deserve</GrayTitle>,
    desc: "Stop guessing what interviewers want. Practice with people who've been on the other side and know exactly how top companies evaluate candidates.",
    perks: [
      "Browse by category: Frontend, Backend, System Design, PM",
      "Book sessions using monthly credits from your plan",
      "Receive AI-powered feedback after every session",
      "Access session recordings to review your performance",
      "Chat with your interviewer before and after the call",
    ],
  },
  {
    label: "Interviewer",
    title: <GoldTitle>Earn doing what you&apos;re great at</GoldTitle>,
    desc: "Share your knowledge, help engineers grow, and earn meaningful income on your own schedule. Set your slots, and we handle the rest.",
    perks: [
      "Set your own availability and session rates",
      "AI question generator tailored to each candidate's role",
      "Earn credits per session — withdraw any time",
      "Dashboard with credit balance and withdrawal requests",
    ],
  },
];

export const CATEGORIES = [
  { value: null, label: "All" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "FULLSTACK", label: "Full Stack" },
  { value: "DSA", label: "DSA" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "MOBILE", label: "Mobile" },
];

export const CATEGORY_LABEL = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  DSA: "DSA",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
  DEVOPS: "DevOps",
  MOBILE: "Mobile",
};

// onboarding
export const YEARS_OPTIONS = [
  { value: 1, label: "1 yr" },
  { value: 2, label: "2 yrs" },
  { value: 3, label: "3 yrs" },
  { value: 5, label: "5 yrs" },
  { value: 7, label: "7 yrs" },
  { value: 10, label: "10+ yrs" },
];

export const ONBOARDING_ROLES = [
  {
    value: "INTERVIEWEE",
    icon: "🎯",
    title: "I want to practice",
    desc: "Browse expert interviewers, book sessions, and get AI-powered feedback to land your dream role.",
  },
  {
    value: "INTERVIEWER",
    icon: "🧑‍💼",
    title: "I want to interview",
    desc: "Share your expertise, earn credits, and help engineers level up.",
  },
];

// Appointment Card Data
export const STATUS_STYLES = {
  SCHEDULED: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  COMPLETED: "border-green-500/20 bg-green-500/10 text-green-400",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-400",
};

export const RATING_STYLES = {
  POOR: "ml-auto border-red-500/20 bg-red-500/10 text-red-400",
  AVERAGE: "ml-auto border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  GOOD: "ml-auto border-blue-500/20 bg-blue-500/10 text-blue-400",
  EXCELLENT: "ml-auto border-green-500/20 bg-green-500/10 text-green-400",
};

export const RATING_LABEL = {
  POOR: "Poor",
  AVERAGE: "Average",
  GOOD: "Good",
  EXCELLENT: "Excellent",
};

// Feedback Modal
export const RATING_CONFIG = {
  POOR: {
    label: "Poor",
    emoji: "📉",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
    bg: "from-red-500/5",
  },
  AVERAGE: {
    label: "Average",
    emoji: "📊",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    bg: "from-yellow-500/5",
  },
  GOOD: {
    label: "Good",
    emoji: "👍",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    bg: "from-blue-500/5",
  },
  EXCELLENT: {
    label: "Excellent",
    emoji: "🏆",
    className: "border-green-500/20 bg-green-500/10 text-green-400",
    bg: "from-green-500/5",
  },
};

// ───────────────────────────────────────────────────────────
// MOCK DATA (frontend only — replace with DB/Prisma queries later)
// ───────────────────────────────────────────────────────────

export const INTERVIEWERS = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "Senior Frontend Engineer",
    company: "Google",
    category: "FRONTEND",
    rating: 4.9,
    reviews: 218,
    sessions: 540,
    price: 2,
    experience: 8,
    bio: "Ex-Meta, now leading the design systems team at Google. I've interviewed 500+ candidates and know exactly what FAANG panels look for in frontend rounds.",
    tags: ["React", "Performance", "System Design", "TypeScript"],
    slots: ["Mon 10:00 AM", "Mon 2:00 PM", "Tue 11:00 AM", "Wed 9:00 AM", "Thu 3:00 PM"],
  },
  {
    id: "2",
    name: "Marcus Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "Staff Backend Engineer",
    company: "Netflix",
    category: "BACKEND",
    rating: 4.8,
    reviews: 164,
    sessions: 410,
    price: 3,
    experience: 10,
    bio: "Distributed systems nerd. I run the backend mock interviews the way Netflix actually runs them — high bar, real depth on scalability and trade-offs.",
    tags: ["Node.js", "Go", "Databases", "Microservices"],
    slots: ["Mon 1:00 PM", "Tue 9:00 AM", "Tue 4:00 PM", "Fri 11:00 AM"],
  },
  {
    id: "3",
    name: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    title: "Engineering Manager",
    company: "Amazon",
    category: "SYSTEM_DESIGN",
    rating: 5.0,
    reviews: 302,
    sessions: 680,
    price: 4,
    experience: 12,
    bio: "I've sat on Amazon's bar-raiser panel for 5 years. System design and leadership-principle behavioral rounds are my bread and butter.",
    tags: ["System Design", "Scalability", "Leadership", "AWS"],
    slots: ["Wed 10:00 AM", "Wed 2:00 PM", "Thu 9:00 AM", "Thu 1:00 PM", "Fri 3:00 PM"],
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    title: "Senior Full Stack Engineer",
    company: "Uber",
    category: "FULLSTACK",
    rating: 4.7,
    reviews: 98,
    sessions: 240,
    price: 2,
    experience: 6,
    bio: "End-to-end product engineer. Great for full-stack take-home style interviews and React + Node deep dives.",
    tags: ["React", "Node.js", "GraphQL", "Postgres"],
    slots: ["Mon 9:00 AM", "Tue 2:00 PM", "Thu 11:00 AM"],
  },
  {
    id: "5",
    name: "Elena Rossi",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    title: "Principal Engineer",
    company: "Microsoft",
    category: "DSA",
    rating: 4.9,
    reviews: 187,
    sessions: 460,
    price: 3,
    experience: 11,
    bio: "Competitive programmer turned principal engineer. I'll push you on data structures, algorithms, and clean problem-solving under pressure.",
    tags: ["Algorithms", "Data Structures", "C++", "Problem Solving"],
    slots: ["Tue 10:00 AM", "Wed 1:00 PM", "Fri 9:00 AM", "Fri 2:00 PM"],
  },
  {
    id: "6",
    name: "James Wright",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    title: "DevOps Lead",
    company: "Atlassian",
    category: "DEVOPS",
    rating: 4.6,
    reviews: 73,
    sessions: 190,
    price: 2,
    experience: 9,
    bio: "Kubernetes, CI/CD, infra-as-code. I help SREs and platform engineers nail the systems and operational rounds.",
    tags: ["Kubernetes", "Terraform", "CI/CD", "Observability"],
    slots: ["Mon 11:00 AM", "Wed 3:00 PM", "Thu 10:00 AM"],
  },
  {
    id: "7",
    name: "Aisha Patel",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    title: "Senior Mobile Engineer",
    company: "Meta",
    category: "MOBILE",
    rating: 4.8,
    reviews: 121,
    sessions: 280,
    price: 3,
    experience: 7,
    bio: "iOS & React Native specialist. Mobile system design, performance, and platform-specific gotchas.",
    tags: ["iOS", "React Native", "Swift", "Mobile Architecture"],
    slots: ["Tue 1:00 PM", "Wed 11:00 AM", "Fri 10:00 AM", "Fri 1:00 PM"],
  },
  {
    id: "8",
    name: "Tom Becker",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    title: "Career Coach & Ex-Recruiter",
    company: "Stripe",
    category: "BEHAVIORAL",
    rating: 4.9,
    reviews: 256,
    sessions: 590,
    price: 2,
    experience: 13,
    bio: "Former tech recruiter at Stripe. I'll prep you for behavioral rounds, salary negotiation, and telling your story the way hiring managers want to hear it.",
    tags: ["Behavioral", "STAR Method", "Negotiation", "Storytelling"],
    slots: ["Mon 3:00 PM", "Tue 9:00 AM", "Thu 2:00 PM", "Fri 11:00 AM"],
  },
];

export const getInterviewerById = (id) =>
  INTERVIEWERS.find((i) => i.id === String(id));

// Dashboard — current user's appointments (mock)
export const APPOINTMENTS = [
  {
    id: "a1",
    interviewerId: "1",
    interviewerName: "Sarah Chen",
    interviewerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    category: "FRONTEND",
    date: "2026-06-24",
    time: "10:00 AM",
    status: "SCHEDULED",
    rating: null,
  },
  {
    id: "a2",
    interviewerId: "3",
    interviewerName: "Priya Sharma",
    interviewerAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    category: "SYSTEM_DESIGN",
    date: "2026-06-27",
    time: "2:00 PM",
    status: "SCHEDULED",
    rating: null,
  },
  {
    id: "a3",
    interviewerId: "5",
    interviewerName: "Elena Rossi",
    interviewerAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    category: "DSA",
    date: "2026-06-10",
    time: "10:00 AM",
    status: "COMPLETED",
    rating: "EXCELLENT",
  },
  {
    id: "a4",
    interviewerId: "2",
    interviewerName: "Marcus Johnson",
    interviewerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "BACKEND",
    date: "2026-06-04",
    time: "9:00 AM",
    status: "COMPLETED",
    rating: "GOOD",
  },
  {
    id: "a5",
    interviewerId: "8",
    interviewerName: "Tom Becker",
    interviewerAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
    category: "BEHAVIORAL",
    date: "2026-05-28",
    time: "3:00 PM",
    status: "CANCELLED",
    rating: null,
  },
];

// Current user's credit balance (mock)
export const CREDIT_BALANCE = {
  available: 7,
  plan: "Pro",
  renewsOn: "2026-07-01",
  used: 8,
};

// ───────────────────────────────────────────────────────────
// DESIGN REVIEW (AI System Design Reviewer) — frontend mock phase
// Each item merges the future Prisma `DesignReview` model shape
// (id, status, context, createdAt) with `result` = the AI's
// DesignReview JSON contract (see project_brain.md §3.3).
// ───────────────────────────────────────────────────────────

export const REVIEW_STATUS_STYLES = {
  PROCESSING: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  COMPLETED: "border-green-500/20 bg-green-500/10 text-green-400",
  FAILED: "border-red-500/20 bg-red-500/10 text-red-400",
};

export const REVIEW_STATUS_LABEL = {
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

export const SEVERITY_STYLES = {
  critical: "border-red-500/20 bg-red-500/10 text-red-400",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  suggestion: "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

export const MOCK_REVIEWS = [
  {
    id: "dr_1",
    status: "COMPLETED",
    systemType: "URL Shortener",
    scaleTarget: "1M DAU",
    focusAreas: ["Scalability", "Reliability"],
    creditsCost: 1,
    createdAt: "2026-06-20",
    result: {
      extracted_mermaid: `flowchart LR
  Client --> LB[Load Balancer]
  LB --> App[App Server]
  App --> DB[(Postgres)]
  App --> Cache[(Redis)]`,
      summary:
        "A clean, readable shortener design that will comfortably serve reads but concentrates all durability and write load on a single Postgres. At the stated 1M DAU target the read path and key-generation path both become bottlenecks before the app tier does.",
      scores: {
        scalability: 6,
        reliability: 5,
        security: 7,
        cost_efficiency: 8,
      },
      findings: [
        {
          id: "f1",
          severity: "critical",
          category: "scalability",
          component: "Postgres (Primary DB)",
          issue:
            "Single Postgres instance with no read replica at the 1M DAU target.",
          impact:
            "Redirect lookups dominate traffic (~50M reads/day). A single primary saturates on reads, so redirect p99 latency spikes and writes queue behind them.",
          fix: "Add read replicas and route redirect lookups to them; put a Redis cache in front so the DB only serves cache misses and writes.",
        },
        {
          id: "f2",
          severity: "warning",
          category: "bottleneck",
          component: "App Server",
          issue:
            "Short-code generation checks uniqueness against the DB synchronously inside the request path.",
          impact:
            "Under write bursts the per-request round-trip collision check becomes a hotspot and inflates p99 on the create endpoint.",
          fix: "Pre-allocate key ranges (counter/Snowflake) or use base62 of an auto-increment id so codes are collision-free without a per-request lookup.",
        },
        {
          id: "f3",
          severity: "suggestion",
          category: "reliability",
          component: "Redis (Cache)",
          issue:
            "Cache is present but no eviction policy or TTL strategy is shown.",
          impact:
            "Without bounded eviction the cache grows unbounded and cold links evict hot ones unpredictably.",
          fix: "Use allkeys-LRU with a TTL aligned to link expiry, and warm the cache on write-through.",
        },
      ],
      missing_components: [
        "No CDN in front of redirects",
        "No rate limiter on the create endpoint",
        "No analytics pipeline / DLQ for click events",
      ],
      interview_questions: [
        "How would you keep short codes unique without a per-request DB check?",
        "Walk me through the read path for a redirect at 50M requests/day.",
        "How do you handle link expiry and cache invalidation together?",
        "What happens to writes if the primary Postgres fails over?",
      ],
    },
  },
  {
    id: "dr_2",
    status: "COMPLETED",
    systemType: "E-commerce Checkout",
    scaleTarget: "500K DAU",
    focusAreas: ["Reliability", "Trade-offs"],
    creditsCost: 1,
    createdAt: "2026-06-14",
    result: {
      extracted_mermaid: `flowchart TD
  Client --> API[Checkout API]
  API --> Orders[(Orders DB)]
  API --> Payment[Payment Service]
  Payment --> Stripe[Stripe]`,
      summary:
        "The happy path is solid, but payment and order creation are coupled in one synchronous transaction with no queue, so a slow or failed payment provider directly fails checkouts and leaves no retry surface.",
      scores: {
        scalability: 7,
        reliability: 4,
        security: 6,
        cost_efficiency: 7,
      },
      findings: [
        {
          id: "f1",
          severity: "critical",
          category: "reliability",
          component: "Payment Service",
          issue:
            "Payment call and order write happen in the same synchronous request with no message queue or outbox.",
          impact:
            "A Stripe timeout at 500K DAU cascades into failed checkouts and can double-charge or lose orders on partial failure.",
          fix: "Introduce an order queue with an outbox pattern; write the order as PENDING, publish a payment event, and reconcile asynchronously with idempotency keys.",
        },
        {
          id: "f2",
          severity: "warning",
          category: "tradeoff",
          component: "Orders DB",
          issue:
            "Orders and inventory appear to share one relational store with strong consistency everywhere.",
          impact:
            "Locking inventory rows on every checkout serializes hot SKUs and caps checkout throughput during flash sales.",
          fix: "Separate inventory reservations (short-lived, cache/Redis-backed) from durable order records; accept eventual consistency on stock counts.",
        },
        {
          id: "f3",
          severity: "suggestion",
          category: "security",
          component: "Checkout API",
          issue: "No idempotency key shown on the checkout endpoint.",
          impact:
            "Client retries or double-clicks create duplicate orders and duplicate charges.",
          fix: "Require a client-supplied idempotency key and dedupe at the API layer before touching Payment.",
        },
      ],
      missing_components: [
        "No dead-letter queue for failed payments",
        "No webhook handler for async Stripe events",
        "No fraud / rate-limit check before payment",
      ],
      interview_questions: [
        "How do you guarantee exactly-once order creation across a payment retry?",
        "Where does inventory get decremented, and is it before or after payment?",
        "How would you handle a Stripe webhook arriving before your own DB commit?",
        "What is your idempotency strategy for the checkout endpoint?",
      ],
    },
  },
  {
    id: "dr_3",
    status: "COMPLETED",
    systemType: "Real-time Chat",
    scaleTarget: "100K concurrent",
    focusAreas: ["Scalability", "Bottlenecks"],
    creditsCost: 1,
    createdAt: "2026-06-03",
    result: {
      extracted_mermaid: `flowchart LR
  Client --> WS[WebSocket Gateway]
  WS --> App[Chat Service]
  App --> Kafka[(Kafka)]
  App --> DB[(Cassandra)]`,
      summary:
        "Good instincts using Kafka for fan-out and Cassandra for message history, but the WebSocket gateway holds connection state locally, which blocks horizontal scaling and cross-node delivery at 100K concurrent connections.",
      scores: {
        scalability: 5,
        reliability: 6,
        security: 6,
        cost_efficiency: 6,
      },
      findings: [
        {
          id: "f1",
          severity: "critical",
          category: "scalability",
          component: "WebSocket Gateway",
          issue:
            "Connection-to-user mapping is held in-process on each gateway node with no shared presence store.",
          impact:
            "At 100K concurrent connections a message for a user on another node can't be routed; scaling out multiplies the problem instead of solving it.",
          fix: "Move presence/routing to a shared store (Redis pub/sub or a routing table) and use Kafka consumer groups keyed by user shard for cross-node delivery.",
        },
        {
          id: "f2",
          severity: "warning",
          category: "bottleneck",
          component: "Cassandra (Message Store)",
          issue:
            "No partition key strategy is shown for the messages table.",
          impact:
            "A per-channel partition on a hot channel creates wide rows and hotspots, throttling reads for that channel's history.",
          fix: "Partition by (channel_id, time-bucket) so hot channels spread across partitions and history reads stay bounded.",
        },
        {
          id: "f3",
          severity: "suggestion",
          category: "reliability",
          component: "Kafka",
          issue: "No dead-letter topic for messages that fail to persist.",
          impact:
            "A Cassandra write failure silently drops the message from history while the sender saw it delivered.",
          fix: "Add a DLQ topic and a reconciliation consumer; surface delivery-vs-persistence status to the client.",
        },
      ],
      missing_components: [
        "No presence / online-status service",
        "No shared session store across gateways",
        "No backpressure handling for slow consumers",
      ],
      interview_questions: [
        "How do you deliver a message to a user connected to a different gateway node?",
        "What is your Cassandra partition key for messages and why?",
        "How do you handle a client that is slower than the message rate?",
        "How do you guarantee ordering within a single channel?",
      ],
    },
  },
];

export const getReviewById = (id) =>
  MOCK_REVIEWS.find((r) => r.id === String(id));

// Average of the four category scores, rounded to one decimal (out of 10).
export const getOverallScore = (review) => {
  const s = review?.result?.scores;
  if (!s) return 0;
  const vals = Object.values(s);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
};

// Booking Page
export const EXPECT_ITEMS = [
  ["🎥", "HD Video Call", "45-minute session with screen sharing built in."],
  [
    "🤖",
    "AI Question Generator",
    "Role-specific questions generated live during the interview.",
  ],
  [
    "💬",
    "Persistent Chat",
    "Message before and after — share notes, resources, follow-ups.",
  ],
  [
    "📊",
    "AI Feedback Report",
    "Post-interview analysis covering technical depth, communication, and more.",
  ],
  [
    "📹",
    "Recording & Playback",
    "A shareable recording link is generated automatically after the call.",
  ],
];