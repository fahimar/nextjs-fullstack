"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeedbackModal from "@/components/FeedbackModal";
import {
  CATEGORY_LABEL,
  STATUS_STYLES,
  RATING_STYLES,
  RATING_LABEL,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon, VideoIcon } from "lucide-react";

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const AppointmentCard = ({ appointment }) => {
  const { interviewerName, interviewerAvatar, category, date, time, status, rating } =
    appointment;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#0f0f11] border border-white/10 rounded-2xl p-5">
      <div className="size-12 rounded-full overflow-hidden border border-white/10 shrink-0">
        <Image
          src={interviewerAvatar}
          alt={interviewerName}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-serif text-base text-stone-100">{interviewerName}</h3>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
              STATUS_STYLES[status]
            )}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>
          {rating && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                RATING_STYLES[rating]
              )}
            >
              {RATING_LABEL[rating]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1.5 text-xs text-stone-400">
          <span className="text-amber-400/80">{CATEGORY_LABEL[category]}</span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3" /> {formatDate(date)}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3" /> {time}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {status === "SCHEDULED" && (
          <Link href={`/interview/${appointment.id}`}>
            <Button variant="gold" size="sm">
              <VideoIcon className="size-4" /> Join
            </Button>
          </Link>
        )}
        {status === "COMPLETED" && !rating && (
          <FeedbackModal
            appointment={appointment}
            trigger={
              <Button variant="outline" size="sm">
                Leave feedback
              </Button>
            }
          />
        )}
        {status === "COMPLETED" && rating && (
          <Button variant="ghost" size="sm" className="border border-white/10" disabled>
            Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
