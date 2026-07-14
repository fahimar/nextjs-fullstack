"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UploadCloudIcon, ImageIcon, CodeIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const MERMAID_PLACEHOLDER = `flowchart LR
  Client --> LB[Load Balancer]
  LB --> App[App Server]
  App --> DB[(Postgres)]`;

const UploadDropzone = ({
  mode,
  onModeChange,
  imagePreview,
  imageName,
  onImageChange,
  mermaid,
  onMermaidChange,
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file. Upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image is too large. Max size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result, file.name);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <Tabs value={mode} onValueChange={onModeChange}>
      <TabsList className="mb-5 w-full">
        <TabsTrigger value="image" className="flex-1">
          <ImageIcon className="size-4" /> Upload image
        </TabsTrigger>
        <TabsTrigger value="mermaid" className="flex-1">
          <CodeIcon className="size-4" /> Paste Mermaid
        </TabsTrigger>
      </TabsList>

      {/* Image tab */}
      <TabsContent value="image">
        {imagePreview ? (
          <div className="relative rounded-2xl border border-white/10 bg-[#0f0f11] overflow-hidden">
            <div className="relative w-full h-72">
              <Image
                src={imagePreview}
                alt={imageName || "Diagram preview"}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
              <span className="text-sm text-stone-400 truncate">{imageName}</span>
              <button
                type="button"
                onClick={() => onImageChange(null, null)}
                className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-400 transition"
              >
                <XIcon className="size-3.5" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center transition",
              dragging
                ? "border-amber-400/50 bg-amber-400/5"
                : "border-white/15 bg-[#0f0f11] hover:border-white/30"
            )}
          >
            <span className="size-14 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <UploadCloudIcon className="size-6 text-amber-400" />
            </span>
            <span className="text-stone-200 font-medium">
              Drag &amp; drop your diagram here
            </span>
            <span className="text-sm text-stone-500">
              or <span className="text-amber-400">browse</span> — PNG, JPG or WebP,
              up to 5MB
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </TabsContent>

      {/* Mermaid tab */}
      <TabsContent value="mermaid">
        <div className="rounded-2xl border border-white/10 bg-[#0f0f11] p-4">
          <Textarea
            value={mermaid}
            onChange={(e) => onMermaidChange(e.target.value)}
            placeholder={MERMAID_PLACEHOLDER}
            className="min-h-56 font-mono text-sm border-white/10 bg-black/30"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-stone-500">
            <span>Paste valid Mermaid flowchart syntax</span>
            <span>{mermaid.trim().length} characters</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UploadDropzone;
