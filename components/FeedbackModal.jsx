"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RATING_CONFIG } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const RATINGS = ["POOR", "AVERAGE", "GOOD", "EXCELLENT"];

const FeedbackModal = ({ appointment, trigger }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!rating) {
      toast.error("Please pick a rating first");
      return;
    }
    // Frontend only — would POST to an API / server action here.
    toast.success("Thanks! Your feedback has been recorded.");
    setOpen(false);
    setRating(null);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            How was your session with {appointment?.interviewerName}?
          </DialogTitle>
          <DialogDescription>
            Your feedback helps other engineers find great interviewers.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {RATINGS.map((key) => {
            const cfg = RATING_CONFIG[key];
            const active = rating === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRating(key)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-4 transition",
                  active
                    ? cfg.className
                    : "border-white/10 text-stone-400 hover:border-white/25"
                )}
              >
                <span className="text-2xl">{cfg.emoji}</span>
                <span className="text-sm font-medium">{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Share what went well or what could improve (optional)…"
          className="mt-2 min-h-24"
        />

        <Button variant="gold" onClick={submit} className="w-full">
          Submit feedback
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
