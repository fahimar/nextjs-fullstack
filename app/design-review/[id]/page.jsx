import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import ReviewReport from "@/components/design-review/ReviewReport";
import FindingCard from "@/components/design-review/FindingCard";
import MermaidRenderer from "@/components/design-review/MermaidRenderer";
import ProcessingView from "@/components/design-review/ProcessingView";
import ReconstructionFeedback from "@/components/design-review/ReconstructionFeedback";
import { getReviewForUser } from "@/lib/reviews";
import { getReviewById, getOverallScore } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GaugeIcon,
  CalendarIcon,
  MessageCircleQuestionIcon,
  TriangleAlertIcon,
  RotateCcwIcon,
  Share2Icon,
  SearchXIcon,
} from "lucide-react";

const IS_DEV = process.env.NODE_ENV === "development";

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

async function loadReview(id) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    const review = await getReviewForUser(id, userId);
    if (review) return review;
  } catch (err) {
    // DB unreachable — in dev we can still serve the mock ids below.
    if (!IS_DEV) throw err;
    console.warn("design-review: DB unreachable, trying mock data", err?.message);
  }

  // Dev-only fallback so the mock reports stay browsable without a DB.
  if (IS_DEV) return getReviewById(id) ?? null;
  return null;
}

export default async function DesignReviewReportPage({ params }) {
  const { id } = await params;
  const review = await loadReview(id);

  // ── NOT FOUND ─────────────────────────────────────────────
  if (!review) {
    return (
      <StatusShell
        icon={<SearchXIcon className="size-7 text-stone-400" />}
        iconClass="bg-white/5 border-white/10"
        title="Review not found"
        body="This review doesn't exist or belongs to another account."
      >
        <Link href="/design-review">
          <Button variant="gold">Back to reviews</Button>
        </Link>
      </StatusShell>
    );
  }

  // ── PROCESSING ────────────────────────────────────────────
  if (review.status === "PROCESSING") {
    return <ProcessingView id={id} />;
  }

  // ── FAILED ────────────────────────────────────────────────
  if (review.status === "FAILED" || !review.result) {
    return (
      <StatusShell
        icon={<TriangleAlertIcon className="size-7 text-red-400" />}
        iconClass="bg-red-500/10 border-red-500/20"
        title="Review failed"
        body="We couldn't analyze this diagram. Your credit was refunded — please try again with a clearer image or Mermaid source."
      >
        <Link href="/design-review/new">
          <Button variant="gold">
            <RotateCcwIcon className="size-4" /> Try again
          </Button>
        </Link>
        <Link href="/design-review">
          <Button variant="outline">Back to reviews</Button>
        </Link>
      </StatusShell>
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
          <ReconstructionFeedback
            reviewId={review.id}
            initialValue={review.mermaidAccurate}
          />
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

// Shared centered shell for the not-found / failed states.
const StatusShell = ({ icon, iconClass, title, body, children }) => (
  <section className="min-h-screen pt-40 pb-24 px-5 sm:px-8 bg-black">
    <div className="max-w-md mx-auto text-center">
      <span
        className={cn(
          "size-16 rounded-2xl border mx-auto flex items-center justify-center mb-8",
          iconClass
        )}
      >
        {icon}
      </span>
      <h1 className="font-serif text-3xl tracking-tight text-stone-100">{title}</h1>
      <p className="text-stone-400 mt-3 text-sm">{body}</p>
      <div className="flex justify-center gap-3 mt-8">{children}</div>
    </div>
  </section>
);
