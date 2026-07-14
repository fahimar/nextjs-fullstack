import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

// ── Model config ──────────────────────────────────────────────
// Sonnet 4.6 is explicitly chosen in project_brain.md §3.3. It supports vision
// and sampling params (temperature) but NOT structured outputs — so we prompt
// for raw JSON and validate with zod ourselves. Thinking is omitted (off) to
// keep the output a single clean JSON object and honour the low-temp determinism.
const MODEL = "claude-sonnet-4-6";
const TEMPERATURE = 0.2;
const MAX_TOKENS = 16000;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MEDIA = ["image/png", "image/jpeg", "image/webp"];

// ── zod schema (exactly matches the DesignReview interface, brain §3.3) ──
const Severity = z.enum(["critical", "warning", "suggestion"]);
const Category = z.enum([
  "scalability",
  "reliability",
  "bottleneck",
  "security",
  "tradeoff",
]);

const FindingSchema = z.object({
  id: z.string(),
  severity: Severity,
  category: Category,
  component: z.string(),
  issue: z.string(),
  impact: z.string(),
  fix: z.string(),
});

const ScoresSchema = z.object({
  scalability: z.number(),
  reliability: z.number(),
  security: z.number(),
  cost_efficiency: z.number(),
});

export const DesignReviewSchema = z.object({
  extracted_mermaid: z.string(),
  summary: z.string(),
  scores: ScoresSchema,
  findings: z.array(FindingSchema),
  missing_components: z.array(z.string()),
  interview_questions: z.array(z.string()),
});

// ── System prompt (implements every strategy note from brain §3.3) ──
const SYSTEM_PROMPT = `You are a principal engineer conducting a system-design interview review. You are given a candidate's architecture diagram (as an image, or as Mermaid source) plus context about what they are building and the scale they are targeting.

Follow this process:
1. FIRST, silently enumerate EVERY component (boxes/nodes) and EVERY edge (connections) you can actually see in the diagram or read in the Mermaid source. Do not judge anything yet. This grounding step is mandatory — it prevents you from inventing components that are not present.
2. Reconstruct the architecture as clean Mermaid flowchart syntax in "extracted_mermaid" so the candidate can see that you understood their design.
3. THEN evaluate the design and produce findings.

Hard rules for findings:
- Every finding's "component" MUST name a component that is actually visible in the diagram / present in the Mermaid. Never reference a component that is not there — if something important is absent, that belongs in "missing_components", not "findings".
- Findings MUST be relative to the user's stated scale target. A weakness at 10M DAU is often a non-issue at 10K DAU. For example: a single Postgres instance with no read replica is NOT a finding at 10K DAU, but IS a critical finding at 10M DAU. Calibrate severity to the scale.
- "impact" must state concretely what breaks (or degrades) AT THE STATED SCALE.
- "fix" must be a concrete, actionable recommendation.
- severity is one of: critical | warning | suggestion. category is one of: scalability | reliability | bottleneck | security | tradeoff.
- scores are 0-10 integers.
- "interview_questions" are 3-5 follow-up questions a real interviewer would ask to probe deeper.

Output contract:
- Respond with ONLY a single valid JSON object matching this exact shape. No prose, no explanation, no markdown code fences.

{
  "extracted_mermaid": string,
  "summary": string,
  "scores": { "scalability": number, "reliability": number, "security": number, "cost_efficiency": number },
  "findings": [ { "id": string, "severity": "critical"|"warning"|"suggestion", "category": "scalability"|"reliability"|"bottleneck"|"security"|"tradeoff", "component": string, "issue": string, "impact": string, "fix": string } ],
  "missing_components": string[],
  "interview_questions": string[]
}`;

// Strip markdown fences the model may wrap around the JSON despite instructions.
function stripFences(text) {
  let t = (text || "").trim();
  // ```json ... ```  or  ``` ... ```
  const fenced = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) t = fenced[1].trim();
  // If there's leading/trailing prose, grab the outermost JSON object.
  if (!t.startsWith("{")) {
    const first = t.indexOf("{");
    const last = t.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) t = t.slice(first, last + 1);
  }
  return t.trim();
}

function extractText(message) {
  return (message.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

function parseAndValidate(rawText) {
  const cleaned = stripFences(rawText);
  const json = JSON.parse(cleaned); // throws on malformed JSON
  return DesignReviewSchema.parse(json); // throws on schema mismatch
}

// Validate the image server-side. `imageBase64` may be a data URL or raw base64.
// Note: brain §7 recommends capping the image to 1568px on the longest edge
// before sending (Sonnet 4.6 vision max) to control cost. We do not resize here
// (that would require an image lib such as `sharp`); resizing should happen
// client-side before upload, or be added here later. We DO enforce the 5MB cap.
function normalizeImage(imageBase64) {
  let mediaType = "image/png";
  let data = imageBase64;

  const dataUrl = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/s);
  if (dataUrl) {
    mediaType = dataUrl[1];
    data = dataUrl[2];
  }

  if (!ACCEPTED_MEDIA.includes(mediaType)) {
    const err = new Error("Unsupported image type. Use PNG, JPG, or WebP.");
    err.status = 400;
    throw err;
  }

  // Approximate decoded byte size from base64 length.
  const padding = (data.match(/=+$/) || [""])[0].length;
  const bytes = Math.floor((data.length * 3) / 4) - padding;
  if (bytes > MAX_IMAGE_BYTES) {
    const err = new Error("Image is too large. Max size is 5MB.");
    err.status = 400;
    throw err;
  }

  return { mediaType, data };
}

function buildUserContent({ image, mermaidCode, context }) {
  const contextLine = `Context:
- System type: ${context?.systemType || "unspecified"}
- Scale target: ${context?.scaleTarget || "unspecified"}
- Focus areas: ${
    context?.focusAreas?.length ? context.focusAreas.join(", ") : "none specified"
  }

Review the architecture below. Remember: findings must be relative to the scale target above, and every finding must reference a component that is actually present.`;

  if (image) {
    return [
      {
        type: "image",
        source: { type: "base64", media_type: image.mediaType, data: image.data },
      },
      { type: "text", text: `${contextLine}\n\nThe architecture is the diagram above.` },
    ];
  }

  return [
    {
      type: "text",
      text: `${contextLine}\n\nThe architecture as Mermaid source:\n\n${mermaidCode}`,
    },
  ];
}

/**
 * Run an AI design review.
 * @param {{ imageBase64?: string, mermaidCode?: string, context?: object }} input
 * @returns {Promise<object>} validated DesignReview JSON
 */
export async function reviewDesign({ imageBase64, mermaidCode, context }) {
  if (!imageBase64 && !mermaidCode?.trim()) {
    const err = new Error("Provide either an image or Mermaid code.");
    err.status = 400;
    throw err;
  }

  const image = imageBase64 ? normalizeImage(imageBase64) : null;

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const messages = [
    {
      role: "user",
      content: buildUserContent({ image, mermaidCode, context }),
    },
  ];

  const first = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    system: SYSTEM_PROMPT,
    messages,
  });

  const firstText = extractText(first);

  try {
    return parseAndValidate(firstText);
  } catch {
    // Retry once. We append the model's (bad) output as an assistant turn and a
    // user correction — this is NOT a last-assistant-turn prefill (which 400s on
    // Sonnet 4.6), because a user message follows it.
    const retry = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: SYSTEM_PROMPT,
      messages: [
        ...messages,
        { role: "assistant", content: firstText || "(no output)" },
        {
          role: "user",
          content:
            "Your previous response was not valid JSON matching the schema. Return ONLY valid JSON matching the schema — no prose, no markdown fences.",
        },
      ],
    });

    // Throws if the retry is still invalid — the caller surfaces this as a failure.
    return parseAndValidate(extractText(retry));
  }
}
