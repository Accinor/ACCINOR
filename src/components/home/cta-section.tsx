"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Button } from "@/components/base/buttons/button"
import { motion } from "framer-motion"
import { ArrowRight, Mail01 } from "@untitledui/icons"
import { MagneticButton, Reveal } from "@/components/shared/animations"
import { EditableText } from "@/components/shared/editable-text"

export function CtaSection() {
  const t = useTranslations("home.cta")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1035] via-[#0f1645] to-[#050a30]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,27,0.1),transparent_60%)]" />

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: 5 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
          className="absolute w-64 h-64 rounded-full bg-[#ffb81b] blur-[120px]"
          style={{
            top: `${15 + i * 18}%`,
            left: `${10 + i * 18}%`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            <EditableText page="home" section="cta" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h2>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto">
              <EditableText page="home" section="cta" field="subtitle" as="span" locale={locale}>
                {t("subtitle")}
              </EditableText>
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Button
                  href={`/${locale}/contact`}
                  size="xl"
                  color="primary"
                  iconLeading={Mail01}
                  className="rounded-full shadow-lg shadow-[#ffb81b]/25 animate-pulse-glow"
                >
                  {t("button")}
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button
                  href={`/${locale}/services`}
                  size="xl"
                  color="secondary"
                  iconTrailing={isRtl ? undefined : ArrowRight}
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                >
                  {t("secondary")}
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </section>
  )
}
