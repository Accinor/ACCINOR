"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Briefcase02, Rocket01, Building06, Lightbulb01 } from "@untitledui/icons"
import { Reveal, StaggerReveal, StaggerItem } from "@/components/shared/animations"
import { MagicBentoCard } from "@/components/shared/magic-bento-card"
import { EditableText } from "@/components/shared/editable-text"
import { useRef } from "react"
import { SectionSpotlight } from "@/components/shared/section-spotlight"

const audienceIcons = [Briefcase02, Rocket01, Building06, Lightbulb01]

export function AudienceSection() {
  const t = useTranslations("home.audience")
  const params = useParams()
  const locale = params.locale as string
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <SectionSpotlight sectionRef={sectionRef} glowColor="255, 184, 27" spotlightRadius={260} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,184,27,0.04),transparent_70%)]" />

      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15, 0],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          className="absolute w-16 h-16 rounded-full border border-[#ffb81b]/20"
          style={{
            top: `${15 + i * 22}%`,
            left: `${i % 2 === 0 ? 5 : 90}%`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            <EditableText page="home" section="audience" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h2>
          <p className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto">
            <EditableText page="home" section="audience" field="subtitle" as="span" locale={locale}>
              {t("subtitle")}
            </EditableText>
          </p>
        </Reveal>

        <StaggerReveal staggerDelay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {(["entrepreneurs", "startups", "organizations", "investors"] as const).map((audience, i) => {
              const Icon = audienceIcons[i]
              return (
                <StaggerItem key={audience}>
                  <MagicBentoCard>
                    <div className="relative p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-12 h-12 rounded-xl bg-[#ffb81b]/15 flex items-center justify-center mb-4"
                      >
                        <Icon size={24} color="#ffb81b" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {t(`items.${audience}.title`)}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(`items.${audience}.description`)}
                      </p>
                    </div>
                  </MagicBentoCard>
                </StaggerItem>
              )
            })}
          </div>
        </StaggerReveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
