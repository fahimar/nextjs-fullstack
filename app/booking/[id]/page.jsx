"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import {
  getInterviewerById,
  CATEGORY_LABEL,
  EXPECT_ITEMS,
  CREDIT_BALANCE,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  StarIcon,
  CoinsIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const interviewer = getInterviewerById(id);

  const [slot, setSlot] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!interviewer) {
    return (
      <section className="min-h-screen pt-40 px-6 text-center bg-black">
        <h1 className="font-serif text-3xl text-stone-100">Interviewer not found</h1>
        <p className="text-stone-400 mt-3">This profile may have been removed.</p>
        <Link href="/explore">
          <Button variant="gold" className="mt-6">
            Back to Explore
          </Button>
        </Link>
      </section>
    );
  }

  const enoughCredits = CREDIT_BALANCE.available >= interviewer.price;

  const confirmBooking = () => {
    // Frontend only — would create the appointment + deduct credits here.
    toast.success(`Session booked with ${interviewer.name}!`);
    setConfirmOpen(false);
    router.push("/dashboard");
  };

  return (
    <section className="relative min-h-screen pt-28 pb-24 px-5 sm:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-400 transition mb-8"
        >
          <ArrowLeftIcon className="size-4" /> Back to Explore
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — profile */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-7">
              <div className="flex items-start gap-5">
                <div className="size-20 rounded-full overflow-hidden border border-white/10 shrink-0">
                  <Image
                    src={interviewer.avatar}
                    alt={interviewer.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-serif text-2xl tracking-tight text-stone-100">
                    {interviewer.name}
                  </h1>
                  <p className="text-stone-400">{interviewer.title}</p>
                  <p className="text-sm text-amber-400/80 mt-0.5">
                    @ {interviewer.company}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-amber-300">
                      <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
                      {interviewer.rating.toFixed(1)}
                      <span className="text-stone-500">({interviewer.reviews})</span>
                    </span>
                    <span className="flex items-center gap-1 text-stone-400">
                      <BriefcaseIcon className="size-3.5" /> {interviewer.experience} yrs
                    </span>
                    <Badge variant="outline" className="text-stone-300">
                      {CATEGORY_LABEL[interviewer.category]}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-stone-400 leading-relaxed mt-6">{interviewer.bio}</p>

              <div className="flex flex-wrap gap-2 mt-6">
                {interviewer.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-stone-300 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* What to expect */}
            <div>
              <h2 className="font-serif text-xl tracking-tight mb-5">
                <GrayTitle>What to</GrayTitle> <GoldTitle>expect</GoldTitle>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {EXPECT_ITEMS.map(([emoji, title, desc]) => (
                  <div
                    key={title}
                    className="bg-[#0f0f11] border border-white/10 rounded-xl p-5"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <h3 className="font-medium text-stone-100 mt-3 mb-1">{title}</h3>
                    <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — booking panel */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28 bg-[#0f0f11] border border-white/10 rounded-2xl p-7">
              <div className="flex items-baseline justify-between mb-1">
                <span className="flex items-center gap-1.5 text-stone-100">
                  <CoinsIcon className="size-5 text-amber-400" />
                  <strong className="text-2xl text-amber-400">
                    {interviewer.price}
                  </strong>
                  <span className="text-sm text-stone-400">credits</span>
                </span>
                <span className="text-xs text-stone-500">45 min session</span>
              </div>
              <p className="text-xs text-stone-500 mb-6">
                You have{" "}
                <span className="text-amber-400">{CREDIT_BALANCE.available} credits</span>{" "}
                available
              </p>

              <p className="text-sm font-medium text-stone-200 mb-3">
                Pick a time slot
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {interviewer.slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition",
                      slot === s
                        ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                        : "border-white/10 text-stone-400 hover:border-white/25"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Button
                variant="gold"
                className="w-full"
                disabled={!slot || !enoughCredits}
                onClick={() => setConfirmOpen(true)}
              >
                {enoughCredits ? "Book session" : "Not enough credits"}
              </Button>
              {!enoughCredits && (
                <Link href="/#pricing">
                  <Button variant="outline" className="w-full mt-2">
                    Upgrade plan
                  </Button>
                </Link>
              )}
              <p className="text-xs text-stone-600 text-center mt-3">
                Free cancellation up to 24h before
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">Confirm your booking</DialogTitle>
            <DialogDescription>
              You're booking a 45-minute session with {interviewer.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-400">Time slot</span>
              <span className="text-stone-100">{slot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Cost</span>
              <span className="text-amber-400">{interviewer.price} credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Balance after</span>
              <span className="text-stone-100">
                {CREDIT_BALANCE.available - interviewer.price} credits
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={confirmBooking}>
              <CheckIcon className="size-4" /> Confirm booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
