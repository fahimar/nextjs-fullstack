"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import ReviewReport from "@/components/design-review/ReviewReport";
import FindingCard from "@/components/design-review/FindingCard";
import MermaidRenderer from "@/components/design-review/MermaidRenderer";
import {
  getReviewById,
  getOverallScore,
  MOCK_REVIEWS,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GaugeIcon,
  CalendarIcon,
  Loader2Icon,
  SparklesIcon,
  MessageCircleQuestionIcon,
  TriangleAlertIcon,
  RotateCcwIcon,
  Share2Icon,
} from "lucide-react";

const STAGES = [
  "Reading your diagram…",
  "Analyzing scalability…",
  "Checking reliability & security…",
  "Compiling findings…",
];
const STAGE_MS = 1200;

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const scoreColor = (score) => {
  if (score >= 7.5) return "text-green-400";
  if (score >= 5) return "text-amber-400";
  return "text-red-400";
};

export default function DesignReviewReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const found = getReviewById(id);
  const looksFailed = typeof id === "string" && id.toLowerCase().includes("fail");
  const initialPhase = found
    ? found.status.toLowerCase()
    : looksFailed
      ? "failed"
      : "processing";

  const [phase, setPhase] = useState(initialPhase); // processing | completed | failed
  const [review, setReview] = useState(found ?? null);
  const [stageIdx, setStageIdx] = useState(0);

  // Staged loading — advance messages, then resolve to a completed report.
  // (Frontend mock: a freshly-submitted id has no persisted result, so we
  // surface a representative report once "processing" finishes.)
  useEffect(() => {
    if (phase !== "processing") return;

    const timers = STAGES.map((_, i) =>
      setTimeout(() => setStageIdx(i), i * STAGE_MS)
    );
    const done = setTimeout(() => {
      setReview((prev) => (prev?.result ? prev : MOCK_REVIEWS[0]));
      setPhase("completed");
    }, STAGES.length * STAGE_MS);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [phase]);

  // ── PROCESSING ────────────────────────────────────────────
  if (phase === "processing") {
    return (
      <section className="min-h-screen pt-40 pb-24 px-5 sm:px-8 bg-black">
        <div className="max-w-md mx-auto text-center">
          <span className="size-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 mx-auto flex items-center justify-center mb-8">
            <SparklesIcon className="size-7 text-amber-400 animate-pulse" />
          </span>
          <h1 className="font-serif text-3xl tracking-tight">
            <GrayTitle>Reviewing your</GrayTitle> <GoldTitle>architecture</GoldTitle>
          </h1>
          <p className="text-stone-400 mt-3 text-sm">
            This usually takes under a minute.
          </p>

          <div className="mt-10 space-y-3 text-left">
            {STAGES.map((stage, i) => {
              const state =
                i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
              return (
                <div
                  key={stage}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 transition",
                    state === "active"
                      ? "border-amber-400/30 bg-amber-400/5"
                      : "border-white/10 bg-[#0f0f11]"
                  )}
                >
                  {state === "done" ? (
                    <span className="size-4 rounded-full bg-green-500/20 border border-green-500/40" />
                  ) : state === "active" ? (
                    <Loader2Icon className="size-4 text-amber-400 animate-spin" />
                  ) : (
                    <span className="size-4 rounded-full border border-white/15" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      state === "pending" ? "text-stone-600" : "text-stone-300"
                    )}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ── FAILED ────────────────────────────────────────────────
  if (phase === "failed" || !review) {
    return (
      <section className="min-h-screen pt-40 pb-24 px-5 sm:px-8 bg-black">
        <div className="max-w-md mx-auto text-center">
          <span className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto flex items-center justify-center mb-8">
            <TriangleAlertIcon className="size-7 text-red-400" />
          </span>
          <h1 className="font-serif text-3xl tracking-tight text-stone-100">
            Review failed
          </h1>
          <p className="text-stone-400 mt-3 text-sm">
            We couldn&apos;t analyze this diagram. Your credit has not been used —
            please try again with a clearer image or Mermaid source.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <Button variant="gold" onClick={() => router.push("/design-review/new")}>
              <RotateCcwIcon className="size-4" /> Try again
            </Button>
            <Link href="/design-review">
              <Button variant="outline">Back to reviews</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── COMPLETED ─────────────────────────────────────────────
  const { result } = review;
  const overall = getOverallScore(review);

  return (
    <section className="min-h-screen pt-28 pb-24 px-5 sm:px-8 bg-black">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/design-review"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-400 transition mb-8"
        >
          <ArrowLeftIcon className="size-4" /> Back to reviews
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-stone-100">
              {review.systemType}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <GaugeIcon className="size-3" /> {review.scaleTarget}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="size-3" /> {formatDate(review.createdAt)}
              </span>
              <span className="text-stone-500">{result.findings.length} findings</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={cn("font-serif text-4xl leading-none", scoreColor(overall))}>
                {overall.toFixed(1)}
                <span className="text-base text-stone-500"> / 10</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-stone-600 mt-1">
                Overall score
              </p>
            </div>
          </div>
        </div>

        {/* Reconstructed diagram — the "wow moment" */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xs font-semibold tracking-[0.14em] uppercase text-amber-400">
              Reconstructed architecture
            </h2>
            <Share2Icon className="size-3.5 text-stone-600" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f11] p-4">
            <MermaidRenderer code={result.extracted_mermaid} />
          </div>
          <p className="text-xs text-stone-600 mt-2">
            The AI&apos;s reconstruction of your diagram — spot-check it to confirm it
            read your design correctly.
          </p>
        </div>

        {/* Scores + summary + missing components */}
        <div className="mt-12">
          <ReviewReport result={result} />
        </div>

        {/* Findings */}
        <div className="mt-12">
          <h2 className="text-xs font-semibold tracking-[0.14em] uppercase text-amber-400 mb-5">
            Findings ({result.findings.length})
          </h2>
          <div className="space-y-3">
            {result.findings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))}
          </div>
        </div>

        {/* Interview questions */}
        {result.interview_questions?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-semibold tracking-[0.14em] uppercase text-amber-400 mb-5">
              Questions an interviewer would ask
            </h2>
            <div className="space-y-3">
              {result.interview_questions.map((q, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-white/10 bg-[#0f0f11] p-5"
                >
                  <span className="shrink-0 size-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <MessageCircleQuestionIcon className="size-4" />
                  </span>
                  <p className="text-sm text-stone-200 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-sell CTA */}
        <div className="mt-12 relative overflow-hidden rounded-2xl border border-amber-400/20 bg-linear-to-br from-amber-400/10 to-transparent p-8 text-center">
          <h2 className="font-serif text-2xl tracking-tight">
            <GrayTitle>Want to go</GrayTitle> <GoldTitle>deeper?</GoldTitle>
          </h2>
          <p className="text-stone-400 text-sm mt-3 max-w-md mx-auto">
            Book a real system-design interviewer to pressure-test these findings live
            and practice defending your trade-offs.
          </p>
          <Link href="/explore?category=system-design">
            <Button variant="gold" size="hero" className="mt-6">
              Discuss with a real interviewer <ArrowRightIcon className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
