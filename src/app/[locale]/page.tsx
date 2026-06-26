import { HeroSection } from "@/components/home/hero-section"
import { NameMeaningSection } from "@/components/home/name-meaning-section"
import { ServicesSection } from "@/components/home/services-section"
import { TeamSection } from "@/components/home/team-section"
import { StatsSection } from "@/components/home/stats-section"
import { AudienceSection } from "@/components/home/audience-section"
import { CtaSection } from "@/components/home/cta-section"
import { SectionDivider } from "@/components/shared/section-divider"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <NameMeaningSection />
      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <TeamSection />
      <SectionDivider />
      <StatsSection />
      <SectionDivider />
      <AudienceSection />
      <SectionDivider />
      <CtaSection />
    </>
  )
}
