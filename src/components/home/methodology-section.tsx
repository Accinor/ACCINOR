"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Reveal, StaggerReveal, StaggerItem } from "@/components/shared/animations"
import { MagicBentoCard } from "@/components/shared/magic-bento-card"
import { EditableText } from "@/components/shared/editable-text"

const steps = ["discover", "structure", "build", "grow"] as const

export function MethodologySection() {
  const t = useTranslations("home.methodology")
  const params = useParams()
  const locale = params.locale as string

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,184,27,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            <EditableText page="home" section="methodology" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h2>
          <p className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto">
            <EditableText page="home" section="methodology" field="subtitle" as="span" locale={locale}>
              {t("subtitle")}
            </EditableText>
          </p>
        </Reveal>

        <StaggerReveal staggerDelay={0.12}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <StaggerItem key={step}>
                <MagicBentoCard className="h-full" particleCount={6}>
                  <div className="relative h-full p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="shrink-0 w-10 h-10 rounded-full bg-[#ffb81b] text-[#050a30] font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">
                        {t(`steps.${step}.title`)}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t(`steps.${step}.desc`)}
                    </p>
                  </div>
                </MagicBentoCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerReveal>
      </div>
    </section>
  )
}
