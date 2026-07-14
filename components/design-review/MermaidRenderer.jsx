"use client";

import { Component, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CopyIcon, CheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

// AI-produced Mermaid is untrusted (prompt injection via the user's diagram can
// flow through to extracted_mermaid). Strip everything that could execute or
// weaken sandboxing BEFORE handing it to mermaid.render:
//  - %%{...}%% directives (can override securityLevel/theme via init)
//  - click/callback/href interaction statements (run JS / open links)
//  - inline <script>, javascript: URLs, and on*= handlers
// mermaid's securityLevel:"strict" is the second layer under this one.
export function sanitizeMermaid(code) {
  if (!code) return "";
  return code
    .replace(/%%\{[\s\S]*?\}%%/g, "") // init/config directives
    .split("\n")
    .filter((line) => !/^\s*(click|callback)\b/i.test(line))
    .join("\n")
    .replace(/<script\b[\s\S]*?(<\/script>|$)/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/\son\w+\s*=/gi, " ");
}

// Gold-accented dark theme so the reconstructed diagram matches our design language.
const MERMAID_CONFIG = {
  startOnLoad: false,
  securityLevel: "strict", // sanitize — diagram text is never trusted/executed
  theme: "dark",
  themeVariables: {
    primaryColor: "#fbbf24", // amber-400 (our gold accent)
    primaryTextColor: "#0a0a0b",
    primaryBorderColor: "#f59e0b",
    lineColor: "#a8a29e",
    secondaryColor: "#1c1c1f",
    tertiaryColor: "#0f0f11",
    background: "#0f0f11",
    mainBkg: "#fbbf24",
    fontFamily: "var(--font-sans), sans-serif",
  },
};

// Raw-code fallback with a copy button — shown when mermaid can't parse the code.
function RawCodeFallback({ code, note }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Mermaid code copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-stone-500">
          {note || "Diagram source"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-400 transition"
        >
          {copied ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs text-stone-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Belt-and-suspenders: catches any synchronous crash while injecting the SVG.
class MermaidErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function MermaidDiagram({ code }) {
  const rawId = useId();
  const renderId = "mermaid-" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Dynamic import — mermaid touches `document`, so it must stay client-only.
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize(MERMAID_CONFIG);
        const { svg: rendered } = await mermaid.render(renderId, sanitizeMermaid(code));
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (failed) {
    return (
      <RawCodeFallback
        code={code}
        note="Couldn't render this diagram — here's the source"
      />
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-stone-500">
        <Loader2Icon className="size-4 animate-spin" /> Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex justify-center overflow-x-auto py-4 [&_svg]:max-w-full [&_svg]:h-auto"
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function MermaidRenderer({ code }) {
  if (!code?.trim()) {
    return (
      <p className="text-sm text-stone-500 py-8 text-center">
        No diagram was reconstructed for this review.
      </p>
    );
  }

  return (
    <MermaidErrorBoundary fallback={<RawCodeFallback code={code} />}>
      <MermaidDiagram code={code} />
    </MermaidErrorBoundary>
  );
}
