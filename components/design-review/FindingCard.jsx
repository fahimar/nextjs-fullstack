"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_STYLES } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  BoxIcon,
  ZapIcon,
  WrenchIcon,
} from "lucide-react";

const SEVERITY_LABEL = {
  critical: "Critical",
  warning: "Warning",
  suggestion: "Suggestion",
};

// Left accent per severity — critical=red-500, warning=amber-500, suggestion=gold accent.
const SEVERITY_BORDER = {
  critical: "border-l-red-500",
  warning: "border-l-amber-500",
  suggestion: "border-l-amber-400/60",
};

const FindingCard = ({ finding }) => {
  const [open, setOpen] = useState(false);
  const { severity, category, component, issue, impact, fix } = finding;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 border-l-4 bg-[#0f0f11] transition-colors",
        SEVERITY_BORDER[severity]
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                SEVERITY_STYLES[severity]
              )}
            >
              {SEVERITY_LABEL[severity]}
            </span>
            <Badge variant="outline" className="text-stone-400 capitalize">
              {category}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-stone-500">
              <BoxIcon className="size-3" /> {component}
            </span>
          </div>
          <p className="text-sm text-stone-100 leading-relaxed">{issue}</p>
        </div>

        <ChevronDownIcon
          className={cn(
            "size-5 text-stone-500 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
          <div className="flex gap-3">
            <span className="mt-0.5 size-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <ZapIcon className="size-3.5 text-red-400" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Impact at scale
              </p>
              <p className="text-sm text-stone-300 leading-relaxed">{impact}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="mt-0.5 size-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <WrenchIcon className="size-3.5 text-amber-400" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Recommended fix
              </p>
              <p className="text-sm text-stone-300 leading-relaxed">{fix}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindingCard;
