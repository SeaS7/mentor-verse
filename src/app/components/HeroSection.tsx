import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";


import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
  return <HeroParallax header={<HeroSectionHeader />}  />;
}