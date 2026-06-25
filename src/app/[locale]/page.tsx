import { HeroSection } from "@/components/home/hero-section"
import { NameMeaningSection } from "@/components/home/name-meaning-section"
import { ServicesSection } from "@/components/home/services-section"
import { StatsSection } from "@/components/home/stats-section"
import { AudienceSection } from "@/components/home/audience-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NameMeaningSection />
      <ServicesSection />
      <StatsSection />
      <AudienceSection />
      <CtaSection />
    </>
  )
}
