import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { GoldTitle, GrayTitle, SectionLabel } from "@/components/reusables";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import { getUserReviews } from "@/lib/reviews";
import {
  MOCK_REVIEWS,
  REVIEW_STATUS_STYLES,
  REVIEW_STATUS_LABEL,
  getOverallScore,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ScanSearchIcon,
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
  GaugeIcon,
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

async function loadReviews() {
  const { userId } = await auth();

  // Signed out: nothing to list (the hero still markets the feature).
  // In dev, show the mocks so the page is browsable without auth + DB.
  if (!userId) return IS_DEV ? MOCK_REVIEWS : [];

  try {
    const reviews = await getUserReviews(userId);
    if (reviews.length === 0 && IS_DEV) return MOCK_REVIEWS;
    return reviews;
  } catch (err) {
    // DB unreachable (e.g. paused Supabase project) — fall back to mocks in dev only.
    if (IS_DEV) {
      console.warn("design-review: DB unreachable, using mock data", err?.message);
      return MOCK_REVIEWS;
    }
    throw err;
  }
}

export default async function DesignReviewPage() {
  const reviews = await loadReviews();

  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-5 sm:px-8 overflow-hidden">
        <StarsBackgroundDemo />
        <div className="relative max-w-4xl mx-auto text-center">
          <SectionLabel>AI System Design Reviewer</SectionLabel>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            <GrayTitle>Get your architecture</GrayTitle>
            <br />
            <GoldTitle>reviewed by AI in seconds</GoldTitle>
          </h1>
          <p className="text-stone-400 mt-6 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Upload a system design diagram or paste Mermaid code. Get scored,
            component-level feedback on scalability, reliability, and trade-offs —
            plus the follow-up questions a real interviewer would ask.
          </p>

          <div className="flex justify-center gap-3 mt-10">
            <Link href="/design-review/new">
              <Button variant="gold" size="hero">
                <PlusIcon className="size-4" /> New Review
              </Button>
            </Link>
            <Link href="/explore?category=system-design">
              <Button variant="outline" size="hero">
                Talk to an expert →
              </Button>
            </Link>
          </div>

          <p className="text-xs text-stone-600 mt-6">
            Each review costs 1 credit · results in under 60 seconds
          </p>
        </div>
      </section>

      {/* History */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl tracking-tight text-stone-100">
            Your reviews
          </h2>
          <span className="text-sm text-stone-500">{reviews.length} total</span>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => {
              const completed = review.status === "COMPLETED";
              const overall = completed ? getOverallScore(review) : null;
              return (
                <Link
                  key={review.id}
                  href={`/design-review/${review.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-5 bg-[#0f0f11] border border-white/10 hover:border-amber-400/30 rounded-2xl p-6 transition duration-300"
                >
                  {/* Icon */}
                  <div className="size-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <ScanSearchIcon className="size-5 text-amber-400" />
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg text-stone-100">
                        {review.systemType}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          REVIEW_STATUS_STYLES[review.status]
                        )}
                      >
                        {REVIEW_STATUS_LABEL[review.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <GaugeIcon className="size-3" /> {review.scaleTarget}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3" />{" "}
                        {formatDate(review.createdAt)}
                      </span>
                      <span className="text-stone-500">
                        {review.result?.findings?.length ?? 0} findings
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      {completed ? (
                        <p
                          className={cn(
                            "font-serif text-2xl leading-none",
                            scoreColor(overall)
                          )}
                        >
                          {overall.toFixed(1)}
                          <span className="text-sm text-stone-500"> / 10</span>
                        </p>
                      ) : (
                        <p className="font-serif text-2xl leading-none text-stone-600">
                          —
                        </p>
                      )}
                      <p className="text-[10px] uppercase tracking-widest text-stone-600 mt-1">
                        Overall
                      </p>
                    </div>
                    <ArrowRightIcon className="size-5 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#0f0f11] border border-white/10 rounded-2xl">
            <p className="text-stone-400 mb-4">
              You haven&apos;t run any design reviews yet.
            </p>
            <Link href="/design-review/new">
              <Button variant="gold" size="sm">
                <PlusIcon className="size-4" /> Start your first review
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
