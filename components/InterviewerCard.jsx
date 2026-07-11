import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL } from "@/lib/data";
import { StarIcon, CoinsIcon } from "lucide-react";

const InterviewerCard = ({ interviewer }) => {
  const { id, name, avatar, title, company, category, rating, reviews, price, tags } =
    interviewer;

  return (
    <div className="group relative flex flex-col bg-[#0f0f11] border border-white/10 hover:border-amber-400/30 rounded-2xl p-6 transition duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="size-14 rounded-full overflow-hidden border border-white/10 shrink-0">
          <Image
            src={avatar}
            alt={name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-lg tracking-tight text-stone-100 truncate">
            {name}
          </h3>
          <p className="text-sm text-stone-400 truncate">{title}</p>
          <p className="text-xs text-amber-400/80 mt-0.5">@ {company}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mt-5 text-sm">
        <span className="flex items-center gap-1 text-amber-300">
          <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
          {rating.toFixed(1)}
          <span className="text-stone-500">({reviews})</span>
        </span>
        <Badge variant="outline" className="text-stone-300">
          {CATEGORY_LABEL[category]}
        </Badge>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-xs text-stone-400 bg-white/5 border border-white/10 rounded-full px-2.5 py-1"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
        <span className="flex items-center gap-1.5 text-sm text-stone-300">
          <CoinsIcon className="size-4 text-amber-400" />
          <strong className="text-amber-400">{price}</strong> credits / session
        </span>
        <Link href={`/booking/${id}`}>
          <Button variant="gold" size="sm">
            Book
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewerCard;
