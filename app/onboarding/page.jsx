"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import {
  ONBOARDING_ROLES,
  YEARS_OPTIONS,
  CATEGORIES,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [years, setYears] = useState(null);
  const [category, setCategory] = useState(null);
  const [rate, setRate] = useState("");
  const [bio, setBio] = useState("");

  const categories = CATEGORIES.filter((c) => c.value);
  const isInterviewer = role === "INTERVIEWER";

  const next = () => {
    if (step === 1 && !role) return toast.error("Please choose a role");
    setStep(2);
  };

  const finish = () => {
    if (!years) return toast.error("Select your experience level");
    if (!category) return toast.error("Pick your focus area");
    if (isInterviewer && !rate) return toast.error("Set your session rate");
    // Frontend only — would persist to DB here, then route by role.
    toast.success("You're all set! Welcome to Prept.");
    router.push(isInterviewer ? "/dashboard" : "/explore");
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-5 sm:px-8 overflow-hidden">
      <StarsBackgroundDemo />

      <div className="relative max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all",
                step >= s ? "w-12 bg-amber-400" : "w-8 bg-white/10"
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">
                <GrayTitle>How do you want</GrayTitle>{" "}
                <GoldTitle>to use Prept?</GoldTitle>
              </h1>
              <p className="text-stone-400 mt-4 text-sm">
                You can always switch later from your dashboard.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {ONBOARDING_ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "relative text-left rounded-2xl border p-7 transition duration-300",
                    role === r.value
                      ? "border-amber-400/50 bg-amber-400/5"
                      : "border-white/10 bg-[#0f0f11] hover:border-white/25"
                  )}
                >
                  {role === r.value && (
                    <span className="absolute top-4 right-4 size-6 rounded-full bg-amber-400 text-black flex items-center justify-center">
                      <CheckIcon className="size-4" />
                    </span>
                  )}
                  <span className="text-3xl">{r.icon}</span>
                  <h3 className="font-serif text-xl mt-4 mb-2 text-stone-100">
                    {r.title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{r.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-10">
              <Button variant="gold" size="hero" onClick={next}>
                Continue <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">
                <GrayTitle>Tell us a bit</GrayTitle>{" "}
                <GoldTitle>about you</GoldTitle>
              </h1>
              <p className="text-stone-400 mt-4 text-sm">
                {isInterviewer
                  ? "This helps candidates find and book the right expert."
                  : "We'll tailor interviewer recommendations to your goals."}
              </p>
            </div>

            <div className="space-y-8 bg-[#0f0f11] border border-white/10 rounded-2xl p-7">
              {/* Experience */}
              <div>
                <Label className="mb-3 text-stone-200">Years of experience</Label>
                <div className="flex flex-wrap gap-2">
                  {YEARS_OPTIONS.map((y) => (
                    <button
                      key={y.value}
                      type="button"
                      onClick={() => setYears(y.value)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm transition",
                        years === y.value
                          ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                          : "border-white/10 text-stone-400 hover:border-white/25"
                      )}
                    >
                      {y.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus area */}
              <div>
                <Label className="mb-3 text-stone-200">
                  {isInterviewer ? "What can you interview for?" : "What are you preparing for?"}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm transition",
                        category === c.value
                          ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                          : "border-white/10 text-stone-400 hover:border-white/25"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewer-only fields */}
              {isInterviewer && (
                <>
                  <div>
                    <Label htmlFor="rate" className="mb-3 text-stone-200">
                      Credits per session
                    </Label>
                    <Input
                      id="rate"
                      type="number"
                      min={1}
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="e.g. 3"
                      className="max-w-40"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="mb-3 text-stone-200">
                      Short bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Where you've worked, what you're great at interviewing for…"
                      className="min-h-28"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-10">
              <Button variant="outline" size="hero" onClick={() => setStep(1)}>
                <ArrowLeftIcon className="size-4" /> Back
              </Button>
              <Button variant="gold" size="hero" onClick={finish}>
                Finish setup <CheckIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
