# PROJECT BRAIN — AI System Design Reviewer

> Feature module inside the existing Interview Platform (Next.js 16, dark + gold, shadcn).
> This file is the single source of truth for Claude Code / Cursor when working on this module.
> Route namespace: `/design-review`

---

## 1. What This Is

**One-liner:** Upload a system architecture diagram (image or Mermaid code) → AI analyzes it → structured feedback on scalability, reliability, bottlenecks, and design trade-offs.

**Why it exists (product logic):**
- The platform already serves interview prep (booking + mock interviews). System design is the highest-stakes interview round for mid/senior roles.
- Interviewees practice diagrams alone with zero feedback loop. This closes that loop instantly, 24/7, without booking an interviewer.
- Monetization: consumes credits (same credit system as bookings) → drives credit purchases.
- Funnel: free 1 review → paywall → also upsells "book a human interviewer to go deeper."

**Who uses it:** Interviewee role (primary). Interviewer role can optionally use it to prep question material (V2).

---

## 2. Core User Flow (V1)

```
/design-review (landing + history)
  → "New Review" 
    → Step 1: Upload PNG/JPG/WebP diagram  OR  paste Mermaid code
    → Step 2: Context form (system type, scale target, focus areas)
    → Submit (deducts 1 credit, confirm dialog — same pattern as booking)
  → /design-review/[id] (report page)
    → Overall score + category scores (Scalability / Reliability / Bottlenecks / Trade-offs)
    → Annotated findings list (severity-tagged: critical / warning / suggestion)
    → Extracted Mermaid re-render of their architecture (AI reconstructs the diagram)
    → "Fix suggestions" per finding
    → CTA: "Discuss with a real interviewer" → /explore?category=system-design
```

**Key UX decision:** AI reconstructs the uploaded image into Mermaid and renders it back. This proves the AI actually "understood" the diagram and gives the user an editable text version of their own design. This is the wow moment — do not cut it.

---

## 3. Architecture

### 3.1 High Level

```
Client (Next.js App Router)
  /design-review           → history list (server component)
  /design-review/new       → upload wizard (client component)
  /design-review/[id]      → report viewer (server component + client Mermaid renderer)

API layer (Next.js Route Handlers — NOT a separate service for V1)
  POST /api/design-review          → create review job
  GET  /api/design-review/[id]     → poll status + result

AI layer
  Anthropic Messages API, claude-sonnet-4-6, vision input
  Single call, structured JSON output (schema below)
  No agent framework needed for V1 — one well-prompted vision call

Storage
  V1 mock-first: uploads → base64 in memory/localStorage-free client state, results → mock data in lib/data.js style
  V1.5 real: Vercel Blob (or UploadThing) for images, Prisma model for reviews
```

### 3.2 Why NOT a separate FastAPI service

Existing project is Next.js-only frontend so far. One vision API call does not justify a second deployable. Route handler + `@anthropic-ai/sdk` keeps deploy surface = 1. Extract to a service only if/when you add: batch analysis, fine-tuned local model, or long-running multi-agent review.

### 3.3 The AI Call (heart of the feature)

**Input:** image (base64) or Mermaid text + user context (system type, expected scale, focus areas).

**System prompt contract — model MUST return only JSON matching:**

```typescript
interface DesignReview {
  extracted_mermaid: string;        // AI's reconstruction of the diagram
  summary: string;                   // 2-3 sentence overall assessment
  scores: {
    scalability: number;             // 0-10
    reliability: number;
    security: number;
    cost_efficiency: number;
  };
  findings: Array<{
    id: string;
    severity: "critical" | "warning" | "suggestion";
    category: "scalability" | "reliability" | "bottleneck" | "security" | "tradeoff";
    component: string;               // which box/edge in the diagram
    issue: string;
    impact: string;                  // what breaks at scale
    fix: string;                     // concrete recommendation
  }>;
  missing_components: string[];      // e.g. "no cache layer", "no DLQ"
  interview_questions: string[];     // 3-5 follow-up questions an interviewer would ask
}
```

**Prompt strategy notes:**
- Ask the model to first describe every visible component/edge before judging (improves vision grounding, reduces hallucinated findings).
- Pass user's stated scale target ("10K DAU" vs "10M DAU") — findings must be scale-relative. A single Postgres is NOT a finding at 10K DAU.
- `interview_questions` field feeds the cross-sell CTA and the existing AI Questions panel in `/interview/[id]`.
- Temperature low (0.2). Strip markdown fences before `JSON.parse` (model sometimes wraps anyway).
- Validation: zod-parse the response server-side; on parse failure retry once with "return only valid JSON" appended.

### 3.4 Mermaid Rendering

- `mermaid` npm package, client component only (`"use client"`, dynamic import, `ssr: false`) — mermaid touches `document`.
- Render `extracted_mermaid` in the report. Wrap in error boundary: if AI's mermaid fails to parse, show raw code block with a copy button instead of crashing.
- Dark theme: `mermaid.initialize({ theme: "dark", themeVariables: { primaryColor: <gold accent token> } })` to match design language.

---

## 4. Data Model (Prisma — when backend lands)

```prisma
model DesignReview {
  id          String   @id @default(cuid())
  userId      String                     // Clerk user id
  status      ReviewStatus @default(PROCESSING)
  imageUrl    String?                    // Blob URL; null if mermaid-input
  inputMermaid String?                   // if user pasted code instead of image
  context     Json                       // { systemType, scaleTarget, focusAreas[] }
  result      Json?                      // full DesignReview JSON from AI
  creditsCost Int      @default(1)
  createdAt   DateTime @default(now())
}

enum ReviewStatus { PROCESSING COMPLETED FAILED }
```

Credit deduction reuses whatever transaction pattern bookings will use — do NOT build a parallel credit system.

---

## 5. File Map (follows existing conventions)

```
app/
  design-review/
    page.jsx                 // history list + hero + "New Review" CTA
    new/page.jsx             // 2-step wizard (mirror onboarding's step pattern + progress bar)
    [id]/page.jsx            // report page (useParams() — params is a Promise in Next 16)
  api/
    design-review/
      route.js               // POST create
      [id]/route.js          // GET result
components/
  design-review/
    UploadDropzone.jsx       // drag-drop + paste-mermaid tab
    ReviewReport.jsx         // scores + findings
    FindingCard.jsx          // severity-colored card (critical=red, warning=amber, suggestion=gold)
    MermaidRenderer.jsx      // "use client", dynamic import, error boundary
    ScoreRadar.jsx           // optional: recharts radar of 4 scores
lib/
  data.js                    // + MOCK_REVIEWS, getReviewById() (V1 mock phase)
  ai/design-reviewer.js      // prompt + Anthropic call + zod schema (server-only)
```

Design language: dark + gold accent, `GrayTitle`/`GoldTitle`, shadcn components, sonner toasts — identical to existing pages. Header: add "Design Review" nav link for signed-in users (same place Explore/Dashboard were added).

---

## 6. Build Plan

### Phase 1 — Frontend mock (matches current project stage) — ~2 days
- [ ] Routes + components above, mock data in `lib/data.js` (2-3 pre-baked review reports with realistic findings)
- [ ] Upload wizard fully working client-side (image preview, mermaid paste tab, context form, credit confirm dialog reusing booking pattern)
- [ ] Report page renders mock JSON: scores, findings, Mermaid render, interview-questions CTA
- [ ] `npm run build` clean, no new lint errors

### Phase 2 — Real AI, no DB — ~1 day
- [ ] `lib/ai/design-reviewer.js`: prompt + zod schema + retry-once logic
- [ ] `POST /api/design-review` calls Anthropic directly (sync, 30-60s is fine on Vercel Pro; use streaming or waitUntil if on hobby)
- [ ] Client polls or awaits; loading state with staged messages ("Reading diagram… Analyzing scalability…")
- [ ] Rate limit: 3 reviews/day per user without credits check (in-memory or upstash) until credit system is real

### Phase 3 — Persistence + credits — ~1 day (after Prisma/Clerk sync lands platform-wide)
- [ ] Prisma model + Blob storage for images
- [ ] Credit deduction in same transaction as review creation
- [ ] History page reads real data

---

## 7. Risks & Guardrails

| Risk | Mitigation |
|---|---|
| Vision misreads messy hand-drawn diagrams | "Describe first, then judge" prompting; show extracted_mermaid so user can spot misreads; add "Was this reconstruction accurate?" thumbs feedback |
| AI mermaid output fails to render | Error boundary → raw code fallback. Never blank-screen the report |
| Findings feel generic ("add caching!") | Scale-relative prompting + require `component` + `impact` per finding; reject findings not tied to a visible component |
| Long response time (vision + big JSON) | Staged loading UI; consider streaming text summary first, JSON after (V2) |
| Cost per review | Sonnet not Opus; cap image to 1568px longest edge before sending; ~$0.02-0.05/review — fine at 1 credit pricing |
| Prompt injection via diagram text | Findings are display-only, never executed; sanitize before render |

---

## 8. Non-Goals (V1)

- No multi-turn "chat with reviewer" (V2 — reuse report as context)
- No PDF export (V2)
- No interviewer-side usage
- No local/fine-tuned model — one hosted vision call is the whole AI stack
- No separate microservice

---

## 9. Definition of Done (V1 ship)

User uploads a real Excalidraw/draw.io screenshot → gets a scored report with ≥5 specific findings tied to visible components, a rendered Mermaid reconstruction, and 3+ interviewer-style follow-up questions → total time under 60s → 1 credit deducted → report persists in history.
