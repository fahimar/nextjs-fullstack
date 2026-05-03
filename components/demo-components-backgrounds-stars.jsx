"use client";

import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';

export const StarsBackgroundDemo = () => {
  return (
    <StarsBackground
      starColor="#FFF"
      className="absolute inset-0 flex items-center justify-center rounded-xl bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]"
    />
  );
};