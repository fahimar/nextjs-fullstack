# 📘 Prept — সম্পূর্ণ প্রোজেক্ট ডকুমেন্টেশন (বাংলায়)

> এই ফাইলটি পুরো `nextjs-fullstack` প্রোজেক্ট পড়ে তৈরি করা হয়েছে। এখানে Tech Stack, Design,
> Storage, Routes, API, Authentication, Pages, CLI Commands, Deployment, `.env` — সবকিছু
> বিস্তারিত বাংলায় দেওয়া আছে। কাস্টমাইজেশন বা আপডেট করার সময় এই ফাইলটাই রেফারেন্স।

---

## ১. প্রোজেক্টটা আসলে কী? (Idea / Concept)

প্রোজেক্টের নাম **"Prept"** — এটা একটা **AI-powered Interview Preparation Platform**
(ইন্টারভিউ প্রস্তুতির মার্কেটপ্লেস)। মূল আইডিয়া দুই ধরনের ইউজারকে এক জায়গায় আনা:

- **Interviewee (প্রার্থী):** যে FAANG/টপ কোম্পানিতে চাকরির ইন্টারভিউয়ের জন্য প্র্যাকটিস করতে চায়।
  সে সিনিয়র ইঞ্জিনিয়ারদের সাথে 1:1 mock interview বুক করবে, AI ফিডব্যাক পাবে, রেকর্ডিং দেখবে।
- **Interviewer (এক্সপার্ট):** যে নিজের অভিজ্ঞতা শেয়ার করে ইনকাম করবে — নিজের availability/স্লট সেট করবে,
  প্রতি সেশনে credit আয় করবে, পরে withdraw করবে।

কাজের ফ্লো (পরিকল্পিত): **Sign up → Onboarding (role বেছে নাও) → Explore (interviewer ব্রাউজ) →
Booking (credit দিয়ে স্লট বুক) → Video Call (Stream দিয়ে HD কল) → AI Feedback Report → Recording**।

পেমেন্ট মডেল: **credit-based** (১ credit = ১ সেশন)। প্ল্যান: Free / Starter ($29) / Pro ($69) —
Clerk Billing দিয়ে হ্যান্ডেল হবে।

### ⚠️ বর্তমান অবস্থা (খুব গুরুত্বপূর্ণ)
এখন পর্যন্ত প্রোজেক্টের **শুধু ল্যান্ডিং পেজ + অথেনটিকেশন স্ক্যাফোল্ডিং** তৈরি হয়েছে।
Hero, Logos, Features, Roles, Pricing, CTA সেকশনসহ হোমপেজ আছে; কিন্তু `/onboarding`, `/explore`,
`/booking`, dashboard ইত্যাদি **রুটগুলো এখনো বানানো হয়নি** (হোমপেজে শুধু লিংক করা আছে)।
Prisma schema-তে **এখনো কোনো model/টেবিল নেই** (খালি)। Arcjet আর Stream এর কী আছে কিন্তু কোড এখনো ওয়্যার করা হয়নি।
অর্থাৎ — এটা একটা চমৎকার ভিত্তি (foundation), পুরো অ্যাপ এখান থেকে বানাতে হবে।

---

## ২. Tech Stack (পুরো প্রযুক্তির তালিকা)

`package.json` থেকে নেওয়া:

### Core Framework
| প্যাকেজ | ভার্সন | কাজ |
|---|---|---|
| **next** | `16.2.4` | ফ্রেমওয়ার্ক (App Router) |
| **react / react-dom** | `19.2.4` | UI লাইব্রেরি |

> 🛑 **গুরুত্বপূর্ণ সতর্কতা (`AGENTS.md` থেকে):** এই Next.js (v16) তোমার চেনা Next.js নয় —
> অনেক breaking change আছে। কোড লেখার আগে `node_modules/next/dist/docs/` এর গাইড পড়তে হবে।
> **বড় পরিবর্তন:** আগের `middleware.ts` এখন **`proxy.js`** নামে রিনেম করা হয়েছে (নিচে দেখুন)।
> প্রোজেক্টটা **JavaScript (`.js`/`.jsx`)** এ লেখা, TypeScript নয় (`components.json`-এ `"tsx": false`)।

### Authentication & Billing
| প্যাকেজ | কাজ |
|---|---|
| **@clerk/nextjs** `^7.3.0` | পুরো অথেনটিকেশন (sign in/up, user, session) + **Billing/PricingTable** |
| **@clerk/themes** `^2.4.57` | Clerk UI-তে `dark` থিম প্রয়োগ |

### Database / ORM
| প্যাকেজ | কাজ |
|---|---|
| **prisma** `^7.8.0` (dev) | ORM CLI + migration |
| **pg** `^8.20.0` (dev) | PostgreSQL ড্রাইভার |
| Database | **PostgreSQL** হোস্ট করা **Supabase**-এ (connection pooling সহ) |

### UI / Styling / Design System
| প্যাকেজ | কাজ |
|---|---|
| **tailwindcss** `^4` + **@tailwindcss/postcss** | Tailwind CSS v4 (নতুন CSS-first কনফিগ) |
| **shadcn** `^4.6.0` | কম্পোনেন্ট রেজিস্ট্রি (style: `radix-nova`) |
| **radix-ui** `^1.4.3` | হেডলেস অ্যাক্সেসিবল primitives |
| **tw-animate-css** `^1.4.0` | Tailwind অ্যানিমেশন ইউটিলিটি |
| **motion** `^12.38.0` | অ্যানিমেশন (Framer Motion এর নতুন নাম `motion/react`) |
| **lucide-react** `^1.14.0` | আইকন সেট |
| **shiki** `^4.0.2` | কোড সিনট্যাক্স হাইলাইটিং (হোমপেজের কোড ডেমো) |
| **next-themes** `^0.4.6` | ডার্ক/লাইট থিম সুইচ (default: dark) |
| **sonner** `^2.0.7` | টোস্ট নোটিফিকেশন |
| **class-variance-authority**, **clsx**, **tailwind-merge** | className ভ্যারিয়েন্ট ও মার্জ ইউটিলিটি |
| **animate-ui** (registry) | অ্যানিমেটেড কম্পোনেন্ট (Code block, Stars background) |

### Security & Realtime (ইনস্টলড, এখনো ওয়্যার করা হয়নি)
| প্যাকেজ | কাজ |
|---|---|
| **@arcjet/next** `^1.4.0` | সিকিউরিটি — rate limiting, bot protection, WAF |
| **Stream** (`NEXT_PUBLIC_STREAM_KEY` আছে) | HD ভিডিও কল + persistent chat (getstream.io) — SDK এখনো ইনস্টল হয়নি |

### Linting
- **eslint** `^9` + **eslint-config-next** `16.2.4` (core-web-vitals)।

---

## ৩. ফোল্ডার স্ট্রাকচার (Project Structure)

```
nextjs-fullstack/
├── app/                          # Next.js App Router
│   ├── layout.js                 # রুট লেআউট (ClerkProvider, ThemeProvider, Header, fonts)
│   ├── page.jsx                  # হোমপেজ (ল্যান্ডিং — Hero/Logos/Features/Roles/Pricing/CTA)
│   ├── globals.css               # গ্লোবাল স্টাইল + Tailwind/shadcn থিম ভেরিয়েবল
│   ├── favicon.ico
│   └── (auth)/                   # রুট গ্রুপ — অথেনটিকেশন
│       ├── layout.js             # সেন্টার-অ্যালাইনড অথ লেআউট
│       ├── sign-in/[[...sign-in]]/page.jsx
│       └── sign-up/[[...sign-up]]/page.jsx
├── components/
│   ├── Header.jsx                # ফিক্সড নেভবার (লোগো + Sign in/Sign up/UserButton)
│   ├── reusables.jsx             # GrayTitle, GoldTitle, SectionLabel, SectionHeading
│   ├── bentoCard.jsx             # ফিচার কার্ড
│   ├── theme-provider.jsx        # next-themes র‍্যাপার
│   ├── demo-components-animate-code.jsx     # হোমপেজের অ্যানিমেটেড কোড ডেমো
│   ├── demo-components-backgrounds-stars.jsx# তারা-ভরা ব্যাকগ্রাউন্ড
│   ├── ui/                       # shadcn কম্পোনেন্ট (button, badge, card, dialog,
│   │                             #   input, label, separator, tabs, textarea, avatar, sonner)
│   └── animate-ui/               # animate-ui রেজিস্ট্রি কম্পোনেন্ট (code, stars, copy button)
├── hooks/
│   ├── use-controlled-state.jsx  # controlled/uncontrolled state হেল্পার
│   └── use-is-in-view.jsx        # motion দিয়ে in-view ডিটেকশন
├── lib/
│   ├── data.js                   # সব স্ট্যাটিক ডেটা (PLANS, ROLES, CATEGORIES, ইত্যাদি)
│   ├── utils.js                  # cn() — className মার্জ হেল্পার
│   ├── get-strict-context.jsx    # টাইপ-সেফ React context হেল্পার
│   └── generated/prisma/         # Prisma জেনারেটেড ক্লায়েন্ট (gitignored)
├── prisma/
│   └── schema.prisma             # ডেটাবেস স্কিমা (এখন খালি — শুধু generator+datasource)
├── public/                       # স্ট্যাটিক অ্যাসেট (logo, hero, কোম্পানি লোগো svg/png)
├── proxy.js                      # ⭐ Clerk middleware (Next 16-এ middleware → proxy)
├── prisma.config.ts              # Prisma 7 কনফিগ (schema/migration path, DIRECT_URL)
├── next.config.mjs               # Next কনফিগ (image remotePatterns)
├── components.json               # shadcn কনফিগ (style, aliases, registries)
├── jsconfig.json                 # path alias: @/* → ./*
├── eslint.config.mjs
├── postcss.config.mjs
├── .env                          # সিক্রেট/কনফিগ (নিচে বিস্তারিত)
├── AGENTS.md / CLAUDE.md         # AI এজেন্টের জন্য নির্দেশনা
└── README.md                     # ডিফল্ট create-next-app readme (এখনো আপডেট করা হয়নি)
```

### Path Alias
`jsconfig.json` + `components.json` অনুযায়ী:
- `@/*` → প্রোজেক্ট রুট। যেমন `@/components/ui/button`, `@/lib/data`, `@/hooks/...`।

---

## ৪. Authentication (Clerk)

পুরো অথেনটিকেশন **Clerk** দিয়ে।

- **`app/layout.js`** — পুরো অ্যাপ `<ClerkProvider appearance={{ baseTheme: dark }}>` দিয়ে মোড়ানো।
- **`proxy.js`** — `clerkMiddleware()` চালু করা আছে। `matcher` সব রুটে চলে (স্ট্যাটিক ফাইল বাদে) এবং
  সব `/api`, `/trpc` রুটে।
- **`components/Header.jsx`** — `<Show when="signed-out">` হলে Sign In + Get Started বাটন,
  `<Show when="signed-in">` হলে `<UserButton />`। সাইন ইন/আপ **modal** মোডে খোলে।
- **`app/(auth)/sign-in` ও `sign-up`** — Clerk-এর বিল্ট-ইন `<SignIn />` / `<SignUp />` কম্পোনেন্ট
  (catch-all রুট `[[...sign-in]]`)।
- **Billing** — হোমপেজে Clerk-এর `<PricingTable />` কম্পোনেন্ট ব্যবহার হয়েছে (Clerk Billing ফিচার)।

> ⚠️ **Keyless mode নোট:** `.clerk/.tmp/keyless.json`-এ একটা আলাদা (keyless) Clerk ইনস্ট্যান্সের কী আছে।
> কিন্তু `.env`-এ আসল `pk_test_.../sk_test_...` কী থাকায় সেগুলোই ব্যবহার হবে। `.clerk/` ফোল্ডার
> **commit করবে না** (gitignored), কারণ এতে সিক্রেট থাকে।

---

## ৫. Database / Storage (Prisma + Supabase PostgreSQL)

- **ORM:** Prisma 7, **provider:** `prisma-client` (নতুন জেনারেটর), আউটপুট → `lib/generated/prisma`।
- **DB:** PostgreSQL, হোস্ট **Supabase** (Seoul region: `ap-northeast-2`)।
- **`prisma.config.ts`** — schema path: `prisma/schema.prisma`, migrations: `prisma/migrations`,
  datasource url: `DIRECT_URL` (migration-এর জন্য direct connection)।
- দুটো connection string:
  - `DATABASE_URL` → **pooled** (pgBouncer, পোর্ট 6543) — অ্যাপ রানটাইমে কোয়েরির জন্য।
  - `DIRECT_URL` → **direct** (পোর্ট 5432) — migration-এর জন্য।

> 🔴 **`prisma/schema.prisma` এখন কার্যত খালি** — কোনো `model` নেই। অর্থাৎ ডেটাবেসে এখনো কোনো টেবিল নেই।
> পুরো অ্যাপ বানাতে গেলে এখানে model গুলো অ্যাড করতে হবে (নিচে "করণীয়" সেকশনে আইডিয়া দেওয়া আছে)।

---

## ৬. Routes / Pages (বর্তমান + পরিকল্পিত)

### ✅ এখন আছে
| রুট | ফাইল | বর্ণনা |
|---|---|---|
| `/` | `app/page.jsx` | ল্যান্ডিং পেজ (Hero, Logos, Features, Roles, Pricing, CTA) |
| `/sign-in` | `app/(auth)/sign-in/...` | Clerk সাইন ইন |
| `/sign-up` | `app/(auth)/sign-up/...` | Clerk সাইন আপ |

### 🔜 পরিকল্পিত (হোমপেজ/ডেটায় রেফার করা, এখনো বানানো হয়নি)
- `/onboarding` — role বেছে নেওয়া (Interviewee/Interviewer), অভিজ্ঞতা ইত্যাদি (`ONBOARDING_ROLES`, `YEARS_OPTIONS`)।
- `/explore` — interviewer ব্রাউজ, category ফিল্টার (`CATEGORIES`)।
- `/booking/[id]` — স্লট বুকিং (`SLOTS`, `EXPECT_ITEMS`)।
- Dashboard — appointment, credit balance, feedback (`STATUS_STYLES`, `RATING_*`, `RATING_CONFIG`)।

### API End-points
> এখন পর্যন্ত কোনো **কাস্টম API রুট (`app/api/...`) নেই**। অথ Clerk হ্যান্ডেল করছে।
> ভবিষ্যতে যা লাগবে: Clerk webhook (`/api/webhooks/clerk` — ইউজার DB-তে sync), Stream টোকেন
> (`/api/stream/token`), booking/credit API, AI feedback জেনারেশন endpoint।
> (Next 16-এ সার্ভার লজিকের জন্য **Server Actions** বা **Route Handlers** ব্যবহার করা যায়।)

---

## ৭. Design System / স্টাইল

থিম: **ডার্ক, প্রিমিয়াম, "gold + stone" অ্যাকসেন্ট** (amber/gold হাইলাইট, কালো/স্টোন ব্যাকগ্রাউন্ড)।

- **ফন্ট (`app/layout.js`):** `Lora` (serif, ভেরিয়েবল `--font-lora`) হেডিং-এ; `DM_Sans`
  (`--font-sans`) বডিতে। ডিফল্ট থিম **dark**।
- **`globals.css`:** Tailwind v4 + `tw-animate-css` + `shadcn/tailwind.css` ইমপোর্ট।
  `@theme inline`-এ সব কালার/radius টোকেন; `:root` (light) ও `.dark` এ OKLCH কালার ভেরিয়েবল।
- **রিইউজেবল টেক্সট কম্পোনেন্ট (`reusables.jsx`):**
  - `GrayTitle` — সাদা→স্টোন গ্রেডিয়েন্ট টেক্সট।
  - `GoldTitle` — amber/gold গ্রেডিয়েন্ট টেক্সট।
  - `SectionLabel`, `SectionHeading` — সেকশন হেডিং প্যাটার্ন।
- **Button ভ্যারিয়েন্ট (`ui/button.jsx`):** `default, outline, secondary, ghost, destructive,
  link, gold`; সাইজ `default, xs, sm, lg, icon*, hero`। নতুন `gold` ও `hero` কাস্টম যোগ করা হয়েছে।
- **Badge ভ্যারিয়েন্ট (`ui/badge.jsx`):** `default, secondary, destructive, outline, ghost, link, gold`।
- **অ্যানিমেশন:** `animate-ui` থেকে StarsBackground (হিরো ব্যাকগ্রাউন্ড) ও অ্যানিমেটেড Code block
  (Python `group_anagrams` ডেমো, shiki দিয়ে হাইলাইট)।

---

## ৮. গুরুত্বপূর্ণ ডেটা ফাইল — `lib/data.js`

পুরো অ্যাপের স্ট্যাটিক/কনফিগ ডেটা এখানে কেন্দ্রীভূত:
- `LOGOS` — কোম্পানি লোগো (Amazon, Google, Meta…)।
- `AVATARS` — randomuser.me থেকে স্যাম্পল ছবি (তাই `next.config.mjs`-এ ঐ হোস্ট allowlisted)।
- `AI_TAGS` — ফিচার ট্যাগ।
- `SLOTS` — বুকিং স্লট ডেমো।
- `PLANS` — Free/Starter/Pro; প্রতিটিতে `planId` (Clerk plan id), credits, features।
- `ROLES` / `ONBOARDING_ROLES` — Interviewee vs Interviewer।
- `CATEGORIES` / `CATEGORY_LABEL` — FRONTEND/BACKEND/FULLSTACK/DSA/SYSTEM_DESIGN/BEHAVIORAL/DEVOPS/MOBILE।
- `YEARS_OPTIONS` — অভিজ্ঞতা।
- `STATUS_STYLES`, `RATING_STYLES`, `RATING_LABEL`, `RATING_CONFIG` — appointment/feedback UI।
- `EXPECT_ITEMS` — বুকিং পেজে "কী আশা করবে" আইটেম।

> 👉 কাস্টমাইজ করতে চাইলে (নতুন ক্যাটেগরি, প্ল্যান, পার্ক) — বেশিরভাগ ক্ষেত্রে শুধু এই ফাইলটাই এডিট করলেই হবে।

---

## ৯. `.env` ফাইল — আছে কি না ও কী অ্যাড করতে হবে

### ✅ হ্যাঁ, `.env` ফাইল আছে। এখন এতে যা আছে:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...      # Clerk পাবলিক কী
CLERK_SECRET_KEY=sk_test_...                        # Clerk সিক্রেট কী
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"  # Supabase pooled
DIRECT_URL="postgresql://...:5432/postgres"         # Supabase direct (migration)
ARCJET_KEY=ajkey_...                                # Arcjet সিকিউরিটি কী
NEXT_PUBLIC_STREAM_KEY=...                          # Stream পাবলিক কী
STREAM_SECRET_KEY=...                               # Stream সিক্রেট কী
```

### 🔴 এখনই ঠিক করা দরকার (সম্ভাব্য সমস্যা)
1. **DATABASE_URL / DIRECT_URL এর পাসওয়ার্ডে `[ ]` ব্র্যাকেট আছে:**
   `...postgres.iix...:[4ZGE_g_jH6JES$r]@aws-...`
   Supabase সাধারণত `[YOUR-PASSWORD]` প্লেসহোল্ডার দেয় — আসল পাসওয়ার্ড বসানোর সময় **`[` আর `]`
   মুছে ফেলতে হয়**। ব্র্যাকেট থাকলে কানেকশন ফেল করবে। যদি পাসওয়ার্ডে `$`, `[`, `]` এর মতো
   special character থাকে, সেগুলো **URL-encode** করতে হবে (`$` → `%24`)।
2. **`.env.example` নেই** — টিমে শেয়ার করার জন্য সিক্রেট ছাড়া একটা টেমপ্লেট (`.env.example`) বানানো ভালো
   (`.gitignore` ইতিমধ্যে `.env.example` allow করে রেখেছে)।
3. **সিক্রেট রোটেট করা:** যেহেতু এই কী-গুলো এখন এই ফাইলে দৃশ্যমান, প্রোডাকশনে যাওয়ার আগে Clerk/Supabase/
   Arcjet/Stream — সবগুলো কী রিজেনারেট/রোটেট করা উচিত।

### ➕ অ্যাপ পুরো বানাতে গেলে `.env`-এ যা যা অ্যাড করতে হবে
```env
# --- Clerk: রিডাইরেক্ট URL (sign in/up এর পর কোথায় যাবে) ---
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/onboarding
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# --- Clerk Webhook (ইউজার DB-তে sync করতে; Clerk Dashboard → Webhooks থেকে) ---
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# --- AI Provider (AI question generator + feedback report এর জন্য — এখন কোনোটাই নেই) ---
# Claude সবচেয়ে উপযুক্ত (latest model: claude-opus-4-8 / claude-sonnet-4-6)
ANTHROPIC_API_KEY=sk-ant-...
# অথবা/পাশাপাশি:
# OPENAI_API_KEY=sk-...

# --- App base URL (webhook, redirect, link জেনারেশনে কাজে লাগে) ---
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> Stream ভিডিও/চ্যাট SDK যোগ করলে `NEXT_PUBLIC_STREAM_KEY` + `STREAM_SECRET_KEY` ইতিমধ্যেই আছে —
> শুধু `@stream-io/video-react-sdk` ইনস্টল করে টোকেন endpoint বানাতে হবে।

---

## ১০. CLI Commands (কমান্ড রেফারেন্স)

### npm scripts (`package.json`)
```bash
npm run dev      # ডেভ সার্ভার (http://localhost:3000)
npm run build    # প্রোডাকশন বিল্ড
npm run start    # বিল্ড করা অ্যাপ চালানো
npm run lint     # ESLint
```

### Prisma (Prisma 7)
```bash
npx prisma generate           # ক্লায়েন্ট জেনারেট → lib/generated/prisma
npx prisma migrate dev        # নতুন migration বানানো + DB তে অ্যাপ্লাই (DIRECT_URL ব্যবহার করে)
npx prisma migrate deploy     # প্রোডাকশনে migration অ্যাপ্লাই
npx prisma studio             # ব্রাউজারে DB GUI
npx prisma db push            # schema সরাসরি DB-তে push (migration ছাড়া, প্রোটোটাইপিং)
```

### shadcn / animate-ui (নতুন কম্পোনেন্ট যোগ)
```bash
npx shadcn@latest add <component>          # যেমন: dropdown-menu, sheet, select
npx shadcn@latest add @animate-ui/<name>   # animate-ui রেজিস্ট্রি থেকে (components.json-এ কনফিগড)
```

---

## ১১. Deployment

- README অনুযায়ী টার্গেট প্ল্যাটফর্ম **Vercel** (Next.js নির্মাতাদের প্ল্যাটফর্ম)।
- **ডিপ্লয় চেকলিস্ট:**
  1. সব `.env` ভেরিয়েবল Vercel project settings → Environment Variables-এ অ্যাড করতে হবে।
  2. Build command: `next build` (ডিফল্ট)। Prisma ক্লায়েন্ট জেনারেশন build-এ চালু রাখতে হলে
     `postinstall` বা build স্ক্রিপ্টে `prisma generate` যোগ করা ভালো।
  3. Supabase pooled URL (`DATABASE_URL`, পোর্ট 6543, `pgbouncer=true`) runtime-এ; `DIRECT_URL`
     migration-এ।
  4. প্রোডাকশন Clerk ইনস্ট্যান্স ক্লেইম করতে হবে (keyless নয়, আসল `pk_live_/sk_live_` কী)।
  5. প্রোডাকশনের জন্য Clerk webhook, AI কী, Stream কী সব সেট করতে হবে।
- README এখনো ডিফল্ট create-next-app টেমপ্লেট — পরে আপডেট করা উচিত।

---

## ১২. কাস্টমাইজেশন গাইড (কোথায় কী এডিট করবে)

| কী বদলাতে চাও | কোথায় যাবে |
|---|---|
| টেক্সট/কপি, কোম্পানি লোগো, প্ল্যান, ক্যাটেগরি, role | `lib/data.js` |
| হোমপেজ সেকশনের লেআউট | `app/page.jsx` |
| রঙ/থিম টোকেন (gold, background ইত্যাদি) | `app/globals.css` (`@theme` + `.dark`) |
| বাটন/ব্যাজ স্টাইল ভ্যারিয়েন্ট | `components/ui/button.jsx`, `ui/badge.jsx` |
| নেভবার | `components/Header.jsx` |
| ফন্ট | `app/layout.js` |
| অথ আচরণ / প্রোটেক্টেড রুট | `proxy.js` (Clerk middleware) |
| DB মডেল | `prisma/schema.prisma` → তারপর `npx prisma migrate dev` |
| Image হোস্ট allowlist | `next.config.mjs` (`images.remotePatterns`) |

---

## ১৩. পরবর্তী ধাপ / করণীয় (Roadmap suggestion)

পুরো অ্যাপ দাঁড় করাতে যা যা করতে হবে (অগ্রাধিকার অনুসারে):

1. **Prisma schema বানানো** — `User` (clerkId, role, credits…), `InterviewerProfile`,
   `Availability/Slot`, `Booking/Appointment` (status: SCHEDULED/COMPLETED/CANCELLED),
   `Feedback` (rating: POOR/AVERAGE/GOOD/EXCELLENT), `Transaction/Credit` — তারপর migrate।
2. **Clerk → DB sync** — `/api/webhooks/clerk` route handler বানিয়ে user create/update sync করা।
3. **Onboarding পেজ** — role + অভিজ্ঞতা সিলেক্ট, DB-তে সেভ।
4. **Explore পেজ** — interviewer লিস্ট + category ফিল্টার (Server Component + Prisma)।
5. **Booking ফ্লো** — slot সিলেক্ট, credit ডিডাক্ট, appointment তৈরি।
6. **Stream ইন্টিগ্রেশন** — `@stream-io/video-react-sdk` ইনস্টল, টোকেন endpoint, ভিডিও কল রুম + chat।
7. **AI feature** — Claude API দিয়ে role-অনুযায়ী প্রশ্ন জেনারেশন ও পোস্ট-ইন্টারভিউ ফিডব্যাক রিপোর্ট।
8. **Arcjet ওয়্যার করা** — sensitive endpoint-এ rate limit/bot protection।
9. **Dashboard** — appointment, credit balance, withdrawal (interviewer), feedback।
10. **README আপডেট + `.env.example` যোগ + সিক্রেট রোটেট।**

---

## ১৪. দ্রুত রেফারেন্স — মনে রাখার মতো মূল পয়েন্ট

- প্রোজেক্ট = **Prept**, AI ইন্টারভিউ-প্রস্তুতি মার্কেটপ্লেস। এখন শুধু **landing + auth** তৈরি।
- **Next.js 16 (App Router, JavaScript)** — `middleware` এখন **`proxy.js`**; কোড লেখার আগে
  `node_modules/next/dist/docs/` পড়তে হবে (`AGENTS.md` নির্দেশ)।
- Auth = **Clerk** (modal sign in/up, PricingTable billing, dark theme)।
- DB = **Supabase PostgreSQL + Prisma 7** — **schema এখনো খালি**, model বানাতে হবে।
- Styling = **Tailwind v4 + shadcn (radix-nova) + animate-ui**, gold/dark থিম।
- `.env` **আছে** — Clerk/DB/Arcjet/Stream কী আছে; **AI কী, Clerk webhook secret, redirect URL
  নেই — অ্যাড করতে হবে**; DB পাসওয়ার্ডের `[ ]` ব্র্যাকেট ঠিক করতে হবে।
- Arcjet ও Stream **ইনস্টলড/কী আছে কিন্তু কোডে ওয়্যার করা হয়নি**।
```
```

---

*এই ডকুমেন্ট প্রোজেক্টের `2026-06-18` তারিখের অবস্থা অনুযায়ী তৈরি। কোড আপডেট হলে এই ফাইলও আপডেট করে নিও।*
