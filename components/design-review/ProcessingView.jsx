"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import { cn } from "@/lib/utils";
import { SparklesIcon, Loader2Icon } from "lucide-react";

const STAGES = [
  "Reading your diagram…",
  "Analyzing scalability…",
  "Checking reliability & security…",
  "Compiling findings…",
];
const STAGE_MS = 1500;
const POLL_MS = 2500;

// Shown while a review row is still PROCESSING (e.g. the user navigated here
// mid-flight). Cycles staged messages and polls the API; when the row leaves
// PROCESSING, refreshes the server component to render the final report.
export default function ProcessingView({ id }) {
  const router = useRouter();
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const stageTimer = setInterval(() => {
      i = Math.min(i + 1, STAGES.length - 1);
      setStageIdx(i);
    }, STAGE_MS);

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/design-review/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status !== "PROCESSING") router.refresh();
      } catch {
        // network blip — keep polling
      }
    }, POLL_MS);

    return () => {
      clearInterval(stageTimer);
      clearInterval(poll);
    };
  }, [id, router]);

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
