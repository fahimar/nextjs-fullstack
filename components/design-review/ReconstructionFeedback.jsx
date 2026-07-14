"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { toast } from "sonner";

// "Was this reconstruction accurate?" — stored on the review row. Over time this
// becomes the eval dataset for the vision pipeline (project_brain.md §7).
export default function ReconstructionFeedback({ reviewId, initialValue }) {
  const [value, setValue] = useState(initialValue ?? null);
  const [saving, setSaving] = useState(false);

  const vote = async (accurate) => {
    if (saving) return;
    const previous = value;
    setValue(accurate); // optimistic
    setSaving(true);

    try {
      const res = await fetch(`/api/design-review/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mermaidAccurate: accurate }),
      });
      if (!res.ok) throw new Error();
      toast.success("Thanks — this helps us improve the reviewer.");
    } catch {
      setValue(previous); // roll back
      toast.error("Couldn't save your feedback. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      <p className="text-xs text-stone-600">Was this reconstruction accurate?</p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => vote(true)}
          disabled={saving}
          aria-label="Reconstruction was accurate"
          className={cn(
            "size-7 rounded-lg border flex items-center justify-center transition",
            value === true
              ? "border-green-500/40 bg-green-500/10 text-green-400"
              : "border-white/10 text-stone-500 hover:border-white/25 hover:text-stone-300"
          )}
        >
          <ThumbsUpIcon className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => vote(false)}
          disabled={saving}
          aria-label="Reconstruction was inaccurate"
          className={cn(
            "size-7 rounded-lg border flex items-center justify-center transition",
            value === false
              ? "border-red-500/40 bg-red-500/10 text-red-400"
              : "border-white/10 text-stone-500 hover:border-white/25 hover:text-stone-300"
          )}
        >
          <ThumbsDownIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
