"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import {
  Lightbulb01,
  Users01,
  ClipboardCheck,
  GraduationHat02,
  TrendUp02,
  FileSearch02,
} from "@untitledui/icons"
import { Reveal, StaggerReveal, StaggerItem } from "@/components/shared/animations"
import { MagicBentoCard } from "@/components/shared/magic-bento-card"
import { EditableText } from "@/components/shared/editable-text"
import { useRef } from "react"
import { SectionSpotlight } from "@/components/shared/section-spotlight"

const serviceIcons = [
  Lightbulb01,
  Users01,
  ClipboardCheck,
  GraduationHat02,
  TrendUp02,
  FileSearch02,
]

export function ServicesSection() {
  const t = useTranslations("home.services")
  const params = useParams()
  const locale = params.locale as string
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <SectionSpotlight sectionRef={sectionRef} glowColor="255, 184, 27" spotlightRadius={280} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/97 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,27,0.05),transparent_80%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            <EditableText page="home" section="services" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h2>
          <p className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto">
            <EditableText page="home" section="services" field="subtitle" as="span" locale={locale}>
              {t("subtitle")}
            </EditableText>
          </p>
        </Reveal>

        <StaggerReveal staggerDelay={0.08}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(["consulting", "coaching", "business_plan", "training", "funding", "guidance"] as const).map(
              (service, i) => {
                const Icon = serviceIcons[i]
                return (
                  <StaggerItem key={service}>
                    <MagicBentoCard>
                      <div className="relative p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.4 }}
                          className="w-12 h-12 rounded-xl bg-[#ffb81b]/15 flex items-center justify-center mb-4"
                        >
                          <Icon size={24} color="#ffb81b" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          <EditableText page="home" section="services" field={`item_${service}_title`} as="span" locale={locale}>
                            {t(`items.${service}.title`)}
                          </EditableText>
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          <EditableText page="home" section="services" field={`item_${service}_desc`} as="span" locale={locale}>
                            {t(`items.${service}.desc`)}
                          </EditableText>
                        </p>
                      </div>
                    </MagicBentoCard>
                  </StaggerItem>
                )
              }
            )}
          </div>
        </StaggerReveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
