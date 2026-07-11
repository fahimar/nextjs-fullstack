"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import InterviewerCard from "@/components/InterviewerCard";
import { GoldTitle, GrayTitle, SectionLabel } from "@/components/reusables";
import { INTERVIEWERS, CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export default function ExplorePage() {
  const [category, setCategory] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return INTERVIEWERS.filter((i) => {
      const matchCat = !category || i.category === category;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [category, query]);

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-5 sm:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionLabel>Explore</SectionLabel>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">
            <GrayTitle>Find your</GrayTitle> <GoldTitle>perfect interviewer</GoldTitle>
          </h1>
          <p className="text-stone-400 mt-4 text-sm max-w-lg mx-auto">
            Browse senior engineers and managers from top companies. Filter by
            specialty, then book with credits from your plan.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, or skill…"
            className="h-11 pl-9 rounded-full bg-[#0f0f11] border-white/10"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
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

        {/* Results */}
        {filtered.length > 0 ? (
          <>
            <p className="text-sm text-stone-500 mb-6">
              {filtered.length} interviewer{filtered.length > 1 ? "s" : ""} available
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((interviewer) => (
                <InterviewerCard key={interviewer.id} interviewer={interviewer} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-400">
              No interviewers match your search. Try a different filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
