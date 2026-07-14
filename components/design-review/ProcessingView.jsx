"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import { cn } from "@/lib/utils";
import {
  SparklesIcon,
  Loader2Icon,
  TriangleAlertIcon,
  RotateCcwIcon,
} from "lucide-react";

const STAGES = [
  "Reading your diagram…",
  "Analyzing scalability…",
  "Checking reliability & security…",
  "Compiling findings…",
];
const STAGE_MS = 1500;

// Polling: start at 3s, exponential backoff ×1.5 capped at 10s, give up at 2 min.
const POLL_BASE_MS = 3000;
const POLL_FACTOR = 1.5;
const POLL_MAX_MS = 10000;
const DEADLINE_MS = 2 * 60 * 1000;

// Shown while a review row is PROCESSING. Polls GET with backoff; renders the
// fast summaryPreview as soon as it lands (streamed-UX); refreshes the server
// component when the row completes; times out to a FAILED + retry state.
export default function ProcessingView({ id }) {
  const router = useRouter();
  const [stageIdx, setStageIdx] = useState(0);
  const [preview, setPreview] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const doneRef = useRef(false);

  // Staged messages
  useEffect(() => {
    let i = 0;
    const stageTimer = setInterval(() => {
      i = Math.min(i + 1, STAGES.length - 1);
      setStageIdx(i);
    }, STAGE_MS);
    return () => clearInterval(stageTimer);
  }, []);

  // Poll with exponential backoff up to the deadline
  useEffect(() => {
    const startedAt = Date.now();
    let delay = POLL_BASE_MS;
    let timer;

    const tick = async () => {
      if (doneRef.current) return;

      if (Date.now() - startedAt >= DEADLINE_MS) {
        setTimedOut(true);
        return;
      }

      try {
        const res = await fetch(`/api/design-review/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.summaryPreview) setPreview(data.summaryPreview);
          if (data.status !== "PROCESSING") {
            doneRef.current = true;
            router.refresh(); // server component re-renders with the final report
            return;
          }
        }
      } catch {
        // network blip — backoff continues
      }

      delay = Math.min(delay * POLL_FACTOR, POLL_MAX_MS);
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, POLL_BASE_MS);
    return () => {
      doneRef.current = true;
      clearTimeout(timer);
    };
  }, [id, router]);

  // ── Timed out (2 min) — treat as failed, offer retry ──
  if (timedOut) {
    return (
      <section className="min-h-screen pt-40 pb-24 px-5 sm:px-8 bg-black">
        <div className="max-w-md mx-auto text-center">
          <span className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto flex items-center justify-center mb-8">
            <TriangleAlertIcon className="size-7 text-red-400" />
          </span>
          <h1 className="font-serif text-3xl tracking-tight text-stone-100">
            This is taking too long
          </h1>
          <p className="text-stone-400 mt-3 text-sm">
            The review didn&apos;t finish within 2 minutes. If it failed, your credit
            is refunded automatically — check back shortly or run a new review.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <Link href="/design-review/new">
              <Button variant="gold">
                <RotateCcwIcon className="size-4" /> Try again
              </Button>
            </Link>
            <Link href="/design-review">
              <Button variant="outline">Back to reviews</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Fast first-impressions summary — lands before the full report */}
        {preview && (
          <div className="mt-8 text-left rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-amber-400 mb-2">
              First impressions
            </p>
            {/* Plain text only — AI output is never rendered as markup */}
            <p className="text-sm text-stone-300 leading-relaxed">{preview}</p>
            <p className="text-xs text-stone-600 mt-3">
              Full scored report is still compiling…
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
