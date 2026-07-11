"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AppointmentCard from "@/components/AppointmentCard";
import { GoldTitle, GrayTitle } from "@/components/reusables";
import { APPOINTMENTS, CREDIT_BALANCE } from "@/lib/data";
import { CoinsIcon, CalendarCheckIcon, PlusIcon } from "lucide-react";

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function DashboardPage() {
  const [tab, setTab] = useState("upcoming");

  const upcoming = APPOINTMENTS.filter((a) => a.status === "SCHEDULED");
  const past = APPOINTMENTS.filter((a) => a.status !== "SCHEDULED");

  return (
    <section className="min-h-screen pt-28 pb-24 px-5 sm:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
              <GrayTitle>Your</GrayTitle> <GoldTitle>dashboard</GoldTitle>
            </h1>
            <p className="text-stone-400 mt-2 text-sm">
              Manage your sessions, credits, and feedback.
            </p>
          </div>
          <Link href="/explore">
            <Button variant="gold">
              <PlusIcon className="size-4" /> Book a session
            </Button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-linear-to-br from-amber-400/10 to-transparent border border-amber-400/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <CoinsIcon className="size-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">
                Credits
              </span>
            </div>
            <p className="text-3xl font-serif text-stone-100">
              {CREDIT_BALANCE.available}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {CREDIT_BALANCE.plan} plan · renews {formatDate(CREDIT_BALANCE.renewsOn)}
            </p>
          </div>

          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-stone-300 mb-2">
              <CalendarCheckIcon className="size-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">
                Upcoming
              </span>
            </div>
            <p className="text-3xl font-serif text-stone-100">{upcoming.length}</p>
            <p className="text-xs text-stone-500 mt-1">scheduled sessions</p>
          </div>

          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-stone-300 mb-2">
              <CalendarCheckIcon className="size-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">
                Completed
              </span>
            </div>
            <p className="text-3xl font-serif text-stone-100">
              {CREDIT_BALANCE.used}
            </p>
            <p className="text-xs text-stone-500 mt-1">sessions all-time</p>
          </div>
        </div>

        {/* Appointments */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} />
                ))}
              </div>
            ) : (
              <EmptyState
                text="No upcoming sessions yet."
                cta="Browse interviewers"
              />
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length > 0 ? (
              <div className="space-y-3">
                {past.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} />
                ))}
              </div>
            ) : (
              <EmptyState text="No past sessions." cta="Book your first one" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

const EmptyState = ({ text, cta }) => (
  <div className="text-center py-16 bg-[#0f0f11] border border-white/10 rounded-2xl">
    <p className="text-stone-400 mb-4">{text}</p>
    <Link href="/explore">
      <Button variant="gold" size="sm">
        {cta}
      </Button>
    </Link>
  </div>
);
