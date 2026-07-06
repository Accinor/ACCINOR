"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { MarkerPin01, Route, Award01, Heart } from "@untitledui/icons"
import { Reveal, StaggerReveal, StaggerItem } from "@/components/shared/animations"
import { MagicBentoCard } from "@/components/shared/magic-bento-card"
import { EditableText } from "@/components/shared/editable-text"

const items = [
  { key: "local", Icon: MarkerPin01 },
  { key: "method", Icon: Route },
  { key: "expertise", Icon: Award01 },
  { key: "commitment", Icon: Heart },
] as const

export function WhyAccinorSection() {
  const t = useTranslations("home.why")
  const params = useParams()
  const locale = params.locale as string

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,184,27,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            <EditableText page="home" section="why" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h2>
          <p className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto">
            <EditableText page="home" section="why" field="subtitle" as="span" locale={locale}>
              {t("subtitle")}
            </EditableText>
          </p>
        </Reveal>

        <StaggerReveal staggerDelay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {items.map(({ key, Icon }) => (
              <StaggerItem key={key}>
                <MagicBentoCard className="h-full" particleCount={6}>
                  <div className="h-full p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/70 transition-colors duration-300">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="w-12 h-12 rounded-xl bg-[#ffb81b]/15 flex items-center justify-center mb-4"
                    >
                      <Icon size={24} color="#ffb81b" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t(`items.${key}.desc`)}
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
