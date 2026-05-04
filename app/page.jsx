import { GrayTitle, GoldTitle, SectionLabel } from "@/components/reusables";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AI_TAGS, AVATARS, LOGOS } from "@/lib/data";
import { CodeDemo } from "@/components/demo-components-animate-code";
import { SectionHeading } from "@/components/reusables";
import BentoCard from "@/components/bentoCard";
import { Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-black overflow-x-hidden">
      {/* Hero */}
      <section className="pt-28 sm:pt-32 relative min-h-screen grid grid-cols-1 lg:grid-cols-5 px-5 sm:px-8 pb-20 overflow-hidden">
        {/* <GrayTitle>Welcome to Prept</GrayTitle>
        <GoldTitle>The AI-powered interview prep platform</GoldTitle>
        <SectionLabel>Welcome to Prept</SectionLabel> */}
        <StarsBackgroundDemo />
        <div className="col-span-full lg:col-span-3 flex flex-col
        items-center justify-center text-center lg:-rotate-2 gap-4">
          <Badge variant="gold">Powered by AI - Now in Beta</Badge>
          <h1 className="font-serif relative text-5xl sm:text-6xl lg:text-7xl tracking-tight max-w-4xl">
            <GrayTitle>Ace your next interview</GrayTitle>
            <br />
            <GoldTitle>with AI-powered real experts and practice sessions</GoldTitle>
          </h1>

          <p className="relative text-sm sm:text-base md:text-lg text-stone-400 max-w-xl mt-6 leading-relaxed">
            Book 1:1 mock interviews with senior engineers from top companies. Get AI-powered feedback, practice with real questions, and land your dream job.
          </p>
          
          <div className="relative flex justify-center gap-2 sm:gap-4 mt-10 sm:w-auto">
            <Link href="/onboarding">
              <Button variant="gold" size="hero">
                Get started
              </Button>
            </Link>

            <Link href="/explore">
              <Button variant="outline" size="hero">
                Browse Interviewers →
              </Button>
            </Link>
          </div>

          <div className="relative flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-16">
            <div className="flex">
              {AVATARS.map((av,i) => (
                <div key={i} className={`size-8 rounded-full border border-[#0a0a0b] overflow-hidden 
                ${i > 0 ? `-ml-2` : ""        
                }`}>
                  <Image 
                  src={av.src}
                  alt={`Avatar ${i + 1}`}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ))}
            </div>

            <p className="text-sm text-stone-500 text-center sm:text-left">
              <strong className="text-amber-400">2.4k+ engineers

              </strong>{" "} cracked FAANG interviews via Prept
            </p>

          </div>

        </div>
        <div className="col-span-full lg:col-span-2 flex items-center justify-center
        lg:justify-start mt-12 lg:mt-0 lg:rotate-3">
          <CodeDemo duration={30000} delay={0} writing={true} cursor={true} />
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 py-14">
      <p className="text-center text-sm font-medium text-stone-600 tracking-widest uppercase mb-8">
        Prept is a platform that helps you prepare for your next interview.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-24 px-6">
        {LOGOS.map((l) => (
          <Image src={l.src} alt={l.alt} width={100} height={100} className="w-auto h-6 opacity-60 grayscale" />
        ))}
      
      </div>
      </section>

      <section className="relative z-10 py-28 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>Features</SectionLabel>
          <SectionHeading
          gray="What makes Prept different"
          gold="Real experts, real practice, real results"
          />
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-7">
              <BentoCard icon={<Bot size={20} className="text-amber-400" />} title={<GrayTitle>AI-powered interview prep</GrayTitle>} desc="Get personalized practice questions and feedback from real experts.">
                <div className="flex flex-wrap gap-2 mt-5">
                  {AI_TAGS.map((t) => (
                    <Badge key={t.label} variant={t.active ? "gold" : "outline"}>
                      {t.label}
                    </Badge>
                  ))}
                </div>
              </BentoCard>
            
            </div>
          </div>
          
      </section>
    </div>
  );
}
