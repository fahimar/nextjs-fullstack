/**
 * Eval harness for the AI design reviewer (project_brain.md §7 guardrails).
 *
 * Run:  npm run eval:reviewer
 * (wraps: node --conditions=react-server --env-file=.env scripts/eval-reviewer.mjs
 *  — the react-server condition makes the `server-only` import in
 *  lib/ai/design-reviewer.js resolve to its empty build outside Next.)
 *
 * Per fixture it asserts:
 *   1. schema   — response validates against DesignReviewSchema
 *   2. findings — ≥ 3 findings
 *   3. grounded — every finding.component references something present in the
 *                 input diagram (no hallucinated components)
 *   4. keywords — at least one expected-topic keyword appears in the review
 *   5. scale    — the 1K-DAU fixture must NOT flag single-instance Postgres
 *                 (critical/warning) — findings must be scale-relative
 *
 * NOTE: makes 5 real Sonnet calls (~$0.10–0.25 total, a few minutes).
 */

import { reviewDesign, DesignReviewSchema } from "../lib/ai/design-reviewer.js";

const FIXTURES = [
  {
    name: "url-shortener @ 10M DAU",
    context: { systemType: "URL Shortener", scaleTarget: "10M DAU", focusAreas: ["Scalability"] },
    mermaid: `flowchart LR
  Client --> LB[Load Balancer]
  LB --> App[App Server]
  App --> DB[(Postgres)]`,
    expectKeywords: ["replica", "cache", "read", "shard"],
  },
  {
    name: "chat app @ 100K concurrent",
    context: { systemType: "Chat App", scaleTarget: "100K concurrent users", focusAreas: ["Scalability", "Reliability"] },
    mermaid: `flowchart LR
  Client --> GW[WebSocket Gateway - holds connection map in memory]
  GW --> Chat[Chat Service]
  Chat --> DB[(MySQL)]`,
    expectKeywords: ["state", "presence", "sticky", "redis", "pub", "memory", "node"],
  },
  {
    name: "checkout @ 1M DAU",
    context: { systemType: "E-commerce", scaleTarget: "1M DAU", focusAreas: ["Reliability"] },
    mermaid: `flowchart TD
  Client --> API[Checkout API]
  API --> Orders[(Orders DB)]
  API --> Pay[Payment Service - synchronous call to Stripe]
  Pay --> Stripe[Stripe]`,
    expectKeywords: ["queue", "idempoten", "async", "outbox", "retry", "timeout"],
  },
  {
    name: "video streaming @ 5M DAU",
    context: { systemType: "Video Streaming", scaleTarget: "5M DAU", focusAreas: ["Scalability", "Cost"] },
    mermaid: `flowchart LR
  Viewer --> App[App Server - serves video files directly]
  App --> Store[(Object Storage)]
  App --> DB[(Postgres - metadata)]`,
    expectKeywords: ["cdn", "edge", "cache", "origin", "bandwidth"],
  },
  {
    // Scale-relativity probe: single Postgres is FINE at 1K DAU. The real,
    // scale-independent flaws are the public bucket, the admin panel hitting
    // the DB directly, and inline SMTP in the request path.
    name: "todo app @ 1K DAU (scale-relativity)",
    context: { systemType: "Custom / Other", scaleTarget: "1K DAU", focusAreas: ["Security"] },
    mermaid: `flowchart LR
  Client --> App[App Server]
  App --> DB[(Postgres)]
  Client --> S3[(Public S3 Bucket - user uploads, world-readable)]
  Admin[Admin Dashboard] --> DB
  App --> Mail[Inline SMTP send inside request path]`,
    expectKeywords: ["public", "bucket", "admin", "direct", "smtp", "s3"],
    scaleCheck: true,
  },
];

// ── assertion helpers ─────────────────────────────────────────

const STOPWORDS = new Set(["the", "and", "for", "with", "server", "service", "layer", "instance", "single"]);

// Every finding.component must reference something visible in the diagram:
// at least one significant token of the component name appears in the source.
function componentGrounded(component, diagram) {
  const haystack = diagram.toLowerCase();
  const tokens = (component || "")
    .toLowerCase()
    .match(/[a-z0-9]{3,}/g) || [];
  const significant = tokens.filter((t) => !STOPWORDS.has(t));
  if (significant.length === 0) return false;
  return significant.some((t) => haystack.includes(t));
}

function keywordsHit(review, expectKeywords) {
  const haystack = [
    review.summary,
    ...review.findings.flatMap((f) => [f.component, f.issue, f.impact, f.fix]),
    ...review.missing_components,
  ]
    .join(" ")
    .toLowerCase();
  return expectKeywords.some((k) => haystack.includes(k.toLowerCase()));
}

// FAIL if any critical/warning finding flags the single-instance Postgres for
// replication/scaling at small scale.
function flagsSinglePostgres(findings) {
  return findings.some((f) => {
    if (f.severity === "suggestion") return false;
    const target = `${f.component}`.toLowerCase();
    const text = `${f.issue} ${f.fix} ${f.impact}`.toLowerCase();
    const aboutDb = /postgres|database|\bdb\b/.test(target);
    const aboutScaling = /single instance|read replica|replicat|shard|scale|scaling/.test(text);
    return aboutDb && aboutScaling;
  });
}

// ── runner ────────────────────────────────────────────────────

async function evalFixture(fixture) {
  const startedAt = Date.now();
  const row = {
    fixture: fixture.name,
    schema: "—",
    "≥3 findings": "—",
    grounded: "—",
    keywords: "—",
    "scale-relative": fixture.scaleCheck ? "—" : "n/a",
    ms: 0,
    pass: false,
  };

  try {
    const { review } = await reviewDesign({
      mermaidCode: fixture.mermaid,
      context: fixture.context,
    });
    row.ms = Date.now() - startedAt;

    const schemaOk = DesignReviewSchema.safeParse(review).success;
    row.schema = schemaOk ? "✅" : "❌";

    const enoughFindings = review.findings.length >= 3;
    row["≥3 findings"] = enoughFindings ? `✅ (${review.findings.length})` : `❌ (${review.findings.length})`;

    const ungrounded = review.findings.filter(
      (f) => !componentGrounded(f.component, fixture.mermaid)
    );
    row.grounded =
      ungrounded.length === 0
        ? "✅"
        : `❌ (${ungrounded.map((f) => f.component).join(", ")})`;

    const kw = keywordsHit(review, fixture.expectKeywords);
    row.keywords = kw ? "✅" : "❌";

    let scaleOk = true;
    if (fixture.scaleCheck) {
      scaleOk = !flagsSinglePostgres(review.findings);
      row["scale-relative"] = scaleOk ? "✅" : "❌ (flagged single Postgres at 1K DAU)";
    }

    row.pass = schemaOk && enoughFindings && ungrounded.length === 0 && kw && scaleOk;
  } catch (err) {
    row.ms = Date.now() - startedAt;
    row.schema = `❌ ${err?.message?.slice(0, 60)}`;
  }

  return row;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("✖ ANTHROPIC_API_KEY is not set — add it to .env first.");
    process.exitCode = 1;
    return;
  }

  console.log(`Running ${FIXTURES.length} fixtures against the design reviewer…\n`);

  const rows = [];
  for (const fixture of FIXTURES) {
    process.stdout.write(`→ ${fixture.name} … `);
    const row = await evalFixture(fixture);
    console.log(row.pass ? `PASS (${row.ms}ms)` : `FAIL (${row.ms}ms)`);
    rows.push(row);
  }

  console.log("");
  console.table(rows.map(({ pass, ...rest }) => ({ ...rest, result: pass ? "PASS" : "FAIL" })));

  const failed = rows.filter((r) => !r.pass).length;
  console.log(`\n${rows.length - failed}/${rows.length} fixtures passed.`);
  if (failed > 0) process.exitCode = 1;
}

main();
