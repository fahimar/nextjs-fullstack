import { cn } from "@/lib/utils";
import { CircleDashedIcon } from "lucide-react";

const SCORE_LABELS = {
  scalability: "Scalability",
  reliability: "Reliability",
  security: "Security",
  cost_efficiency: "Cost efficiency",
};

// Keep the visual order deterministic and matching the brain-doc contract.
const SCORE_ORDER = ["scalability", "reliability", "security", "cost_efficiency"];

const barColor = (score) => {
  if (score >= 7.5) return "bg-green-500";
  if (score >= 5) return "bg-amber-400";
  return "bg-red-500";
};

const ScoreBar = ({ label, score }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-stone-300">{label}</span>
      <span className="text-sm font-medium text-stone-100">
        {score}
        <span className="text-stone-500"> / 10</span>
      </span>
    </div>
    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all", barColor(score))}
        style={{ width: `${(score / 10) * 100}%` }}
      />
    </div>
  </div>
);

const ReviewReport = ({ result }) => {
  const { summary, scores, missing_components } = result;

  return (
    <div className="space-y-10">
      {/* Summary */}
      <div>
        <h2 className="text-xs font-semibold tracking-[0.14em] uppercase text-amber-400 mb-3">
          Summary
        </h2>
        <p className="text-stone-300 leading-relaxed">{summary}</p>
      </div>

      {/* Score bars */}
      <div>
        <h2 className="text-xs font-semibold tracking-[0.14em] uppercase text-amber-400 mb-5">
          Category scores
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {SCORE_ORDER.filter((key) => key in scores).map((key) => (
            <ScoreBar key={key} label={SCORE_LABELS[key]} score={scores[key]} />
          ))}
        </div>
      </div>

      {/* Missing components */}
      {missing_components?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-[0.14em] uppercase text-amber-400 mb-4">
            Missing components
          </h2>
          <div className="flex flex-wrap gap-2">
            {missing_components.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-stone-300"
              >
                <CircleDashedIcon className="size-3.5 text-stone-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewReport;
