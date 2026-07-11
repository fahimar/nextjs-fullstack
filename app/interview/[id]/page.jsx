"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  MonitorUpIcon,
  PhoneOffIcon,
  SparklesIcon,
  SendIcon,
  MessageSquareIcon,
} from "lucide-react";
import { toast } from "sonner";

const AI_QUESTIONS = [
  "Walk me through how you'd design a rate limiter for an API gateway.",
  "What trade-offs would you make between consistency and availability here?",
  "How would this scale to 10M requests per second?",
  "Tell me about a time you disagreed with a senior engineer's design.",
];

const SEED_CHAT = [
  { from: "them", text: "Hey! Ready when you are 👋", time: "10:00" },
  { from: "me", text: "Yep, let's do it!", time: "10:01" },
];

export default function InterviewRoomPage() {
  const router = useRouter();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [panel, setPanel] = useState("ai"); // "ai" | "chat"
  const [questions, setQuestions] = useState(AI_QUESTIONS.slice(0, 2));
  const [chat, setChat] = useState(SEED_CHAT);
  const [draft, setDraft] = useState("");

  const generateQuestion = () => {
    const next = AI_QUESTIONS[questions.length % AI_QUESTIONS.length];
    setQuestions((q) => [...q, next]);
    toast.success("New AI question generated");
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setChat((c) => [...c, { from: "me", text: draft.trim(), time: "10:05" }]);
    setDraft("");
  };

  const endCall = () => {
    toast("Call ended. Generating your AI feedback report…");
    router.push("/dashboard");
  };

  return (
    <section className="h-screen pt-16 bg-[#0a0a0b] flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row gap-3 p-3 min-h-0">
        {/* Video area */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Main (interviewer) tile */}
          <div className="relative flex-1 rounded-2xl bg-[#111113] border border-white/10 overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <div className="size-24 rounded-full bg-amber-400/10 border border-amber-400/20 mx-auto flex items-center justify-center text-3xl">
                🧑‍💼
              </div>
              <p className="text-stone-300 mt-4 font-medium">Sarah Chen</p>
              <p className="text-xs text-stone-500">Senior Frontend Engineer · Google</p>
            </div>
            <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur px-3 py-1 text-xs text-stone-300">
              <span className="size-2 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
            <span className="absolute bottom-4 left-4 rounded-md bg-black/50 backdrop-blur px-2 py-1 text-xs text-stone-300">
              Sarah Chen
            </span>

            {/* Self tile */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-[#1a1a1d] border border-white/10 overflow-hidden flex items-center justify-center">
              {cam ? (
                <span className="text-2xl">🙂</span>
              ) : (
                <VideoOffIcon className="size-6 text-stone-500" />
              )}
              <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-stone-300">
                You
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 py-2">
            <ControlButton
              active={mic}
              onClick={() => setMic((m) => !m)}
              on={<MicIcon className="size-5" />}
              off={<MicOffIcon className="size-5" />}
            />
            <ControlButton
              active={cam}
              onClick={() => setCam((c) => !c)}
              on={<VideoIcon className="size-5" />}
              off={<VideoOffIcon className="size-5" />}
            />
            <button
              type="button"
              onClick={() => toast("Screen sharing started")}
              className="size-12 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10 flex items-center justify-center transition"
            >
              <MonitorUpIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={endCall}
              className="h-12 px-6 rounded-full bg-red-500/90 hover:bg-red-500 text-white flex items-center gap-2 font-medium transition"
            >
              <PhoneOffIcon className="size-5" /> Leave
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-96 flex flex-col rounded-2xl bg-[#111113] border border-white/10 overflow-hidden">
          <div className="flex border-b border-white/10">
            <PanelTab
              active={panel === "ai"}
              onClick={() => setPanel("ai")}
              icon={<SparklesIcon className="size-4" />}
              label="AI Questions"
            />
            <PanelTab
              active={panel === "chat"}
              onClick={() => setPanel("chat")}
              icon={<MessageSquareIcon className="size-4" />}
              label="Chat"
            />
          </div>

          {panel === "ai" ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-amber-400/5 border border-amber-400/15 p-4"
                  >
                    <span className="text-xs text-amber-400/70 font-semibold">
                      Question {i + 1}
                    </span>
                    <p className="text-sm text-stone-200 mt-1.5 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/10">
                <Button variant="gold" className="w-full" onClick={generateQuestion}>
                  <SparklesIcon className="size-4" /> Generate next question
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chat.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      m.from === "me" ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2 text-sm",
                        m.from === "me"
                          ? "bg-amber-400 text-black"
                          : "bg-white/5 border border-white/10 text-stone-200"
                      )}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-stone-600 mt-1">{m.time}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={sendChat} className="p-3 border-t border-white/10 flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="h-10 rounded-full bg-white/5 border-white/10"
                />
                <Button type="submit" variant="gold" size="icon" className="size-10 rounded-full">
                  <SendIcon className="size-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const ControlButton = ({ active, onClick, on, off }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "size-12 rounded-full flex items-center justify-center transition border",
      active
        ? "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
        : "bg-red-500/15 border-red-500/30 text-red-400"
    )}
  >
    {active ? on : off}
  </button>
);

const PanelTab = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition",
      active
        ? "text-amber-400 border-b-2 border-amber-400"
        : "text-stone-400 hover:text-stone-200"
    )}
  >
    {icon} {label}
  </button>
);
