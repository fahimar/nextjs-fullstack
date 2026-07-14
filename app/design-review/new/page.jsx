"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UploadDropzone from "@/components/design-review/UploadDropzone";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import { CREDIT_BALANCE } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  CoinsIcon,
  SparklesIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";

const SYSTEM_TYPES = [
  { value: "url_shortener", label: "URL Shortener" },
  { value: "chat_app", label: "Chat App" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "video_streaming", label: "Video Streaming" },
  { value: "ride_sharing", label: "Ride Sharing" },
  { value: "custom", label: "Custom / Other" },
];

const SCALE_TARGETS = [
  { value: "1k", label: "1K DAU" },
  { value: "100k", label: "100K DAU" },
  { value: "1m", label: "1M DAU" },
  { value: "10m", label: "10M DAU" },
];

const FOCUS_AREAS = [
  { value: "scalability", label: "Scalability" },
  { value: "reliability", label: "Reliability" },
  { value: "security", label: "Security" },
  { value: "cost", label: "Cost" },
];

const REVIEW_COST = 1;

const STAGES = ["Reading diagram…", "Analyzing scalability…", "Writing findings…"];

export default function NewDesignReviewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 — diagram input
  const [mode, setMode] = useState("image"); // "image" | "mermaid"
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [mermaid, setMermaid] = useState("");

  // Step 2 — context
  const [systemType, setSystemType] = useState("");
  const [scaleTarget, setScaleTarget] = useState("");
  const [focusAreas, setFocusAreas] = useState([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);

  const hasDiagram =
    mode === "image" ? Boolean(imagePreview) : mermaid.trim().length > 0;
  const enoughCredits = CREDIT_BALANCE.available >= REVIEW_COST;

  const onImageChange = (preview, name) => {
    setImagePreview(preview);
    setImageName(name);
  };

  const toggleFocus = (value) => {
    setFocusAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const next = () => {
    if (!hasDiagram) {
      return toast.error(
        mode === "image"
          ? "Upload a diagram image to continue"
          : "Paste your Mermaid code to continue"
      );
    }
    setStep(2);
  };

  const openConfirm = () => {
    if (!systemType) return toast.error("Select a system type");
    if (!scaleTarget) return toast.error("Select a scale target");
    setConfirmOpen(true);
  };

  const systemLabel = SYSTEM_TYPES.find((s) => s.value === systemType)?.label;
  const scaleLabel = SCALE_TARGETS.find((s) => s.value === scaleTarget)?.label;
  const focusLabels = FOCUS_AREAS.filter((f) => focusAreas.includes(f.value)).map(
    (f) => f.label
  );

  const submit = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    setStageIdx(0);

    // Cycle the staged loading messages while the AI review runs.
    let i = 0;
    const timer = setInterval(() => {
      i = Math.min(i + 1, STAGES.length - 1);
      setStageIdx(i);
    }, 1500);

    try {
      const res = await fetch("/api/design-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: mode === "image" ? imagePreview : undefined,
          mermaidCode: mode === "mermaid" ? mermaid : undefined,
          context: {
            systemType: systemLabel,
            scaleTarget: scaleLabel,
            focusAreas: focusLabels,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        // Out of credits — upsell instead of erroring.
        if (res.status === 402) {
          setSubmitting(false);
          toast.error("You're out of credits", {
            description: "Upgrade your plan to keep running AI design reviews.",
            action: {
              label: "View plans",
              onClick: () => router.push("/#pricing"),
            },
          });
          return;
        }

        // AI failed after the row was created — credit refunded, FAILED row exists.
        if (body.id) {
          toast.error(body.error || "The review failed. Your credit was refunded.");
          router.push(`/design-review/${body.id}`);
          return;
        }

        throw new Error(body.error || "The review failed. Please try again.");
      }

      const data = await res.json();
      toast.success("Review complete");
      router.push(`/design-review/${data.id}`);
    } catch (err) {
      // Request never produced a review row (signed out, bad input, network) —
      // stay on the wizard so nothing entered is lost.
      setSubmitting(false);
      toast.error(err.message || "Something went wrong");
    } finally {
      clearInterval(timer);
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-5 sm:px-8 overflow-hidden">
      <StarsBackgroundDemo />

      {/* Staged loading overlay while the AI review runs */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm text-center">
            <span className="size-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 mx-auto flex items-center justify-center mb-8">
              <SparklesIcon className="size-7 text-amber-400 animate-pulse" />
            </span>
            <h2 className="font-serif text-2xl tracking-tight text-stone-100">
              Reviewing your architecture
            </h2>
            <p className="text-stone-400 mt-2 text-sm">This usually takes under a minute.</p>

            <div className="mt-8 space-y-3 text-left">
              {STAGES.map((stage, i) => {
                const state = i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
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
        </div>
      )}

      <div className="relative max-w-2xl mx-auto">
        {/* Back to history */}
        <Link
          href="/design-review"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-400 transition mb-8"
        >
          <ArrowLeftIcon className="size-4" /> Back to reviews
        </Link>

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
                <GrayTitle>Share your</GrayTitle> <GoldTitle>architecture</GoldTitle>
              </h1>
              <p className="text-stone-400 mt-4 text-sm">
                Upload a diagram image or paste Mermaid code — the AI will
                reconstruct and review it.
              </p>
            </div>

            <UploadDropzone
              mode={mode}
              onModeChange={setMode}
              imagePreview={imagePreview}
              imageName={imageName}
              onImageChange={onImageChange}
              mermaid={mermaid}
              onMermaidChange={setMermaid}
            />

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
                <GrayTitle>Add some</GrayTitle> <GoldTitle>context</GoldTitle>
              </h1>
              <p className="text-stone-400 mt-4 text-sm">
                Findings are scale-relative — a single Postgres is fine at 1K DAU
                but not at 10M.
              </p>
            </div>

            <div className="space-y-8 bg-[#0f0f11] border border-white/10 rounded-2xl p-7">
              {/* System type */}
              <div>
                <Label className="mb-3 text-stone-200">System type</Label>
                <Select value={systemType} onValueChange={setSystemType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="What are you designing?" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_TYPES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scale target */}
              <div>
                <Label className="mb-3 text-stone-200">Scale target</Label>
                <Select value={scaleTarget} onValueChange={setScaleTarget}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Expected daily active users" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCALE_TARGETS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Focus areas */}
              <div>
                <Label className="mb-3 text-stone-200">
                  Focus areas{" "}
                  <span className="text-stone-500 font-normal">(optional)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_AREAS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => toggleFocus(f.value)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm transition",
                        focusAreas.includes(f.value)
                          ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                          : "border-white/10 text-stone-400 hover:border-white/25"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <Button variant="outline" size="hero" onClick={() => setStep(1)}>
                <ArrowLeftIcon className="size-4" /> Back
              </Button>
              <Button
                variant="gold"
                size="hero"
                onClick={openConfirm}
                disabled={!enoughCredits}
              >
                <SparklesIcon className="size-4" />
                {enoughCredits ? "Run review" : "Not enough credits"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Credit confirm dialog — same pattern as booking/[id] */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Start this review?
            </DialogTitle>
            <DialogDescription>
              Running an AI design review deducts credits from your balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-400">System type</span>
              <span className="text-stone-100">{systemLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Scale target</span>
              <span className="text-stone-100">{scaleLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Cost</span>
              <span className="flex items-center gap-1 text-amber-400">
                <CoinsIcon className="size-3.5" /> {REVIEW_COST} credit
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Balance after</span>
              <span className="text-stone-100">
                {CREDIT_BALANCE.available - REVIEW_COST} credits
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={submit}>
              <CheckIcon className="size-4" /> Confirm &amp; run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
