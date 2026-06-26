"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
              <Link href={`/${locale}/contact`}>
                <MagneticButton>
                  <Button
                    size="lg"
                    className="bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold shadow-lg shadow-[#ffb81b]/25 hover:shadow-xl hover:shadow-[#ffb81b]/30 hover:scale-105 transition-all duration-300 rounded-full animate-pulse-glow"
                  >
                    <Mail01 size={16} className={isRtl ? "ml-2" : "mr-2"} />
                    {t("button")}
                  </Button>
                </MagneticButton>
              </Link>
              <Link href={`/${locale}/services`}>
                <MagneticButton>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300"
                  >
                    {t("secondary")}
                    {!isRtl && <ArrowRight size={16} className="ml-2" />}
                  </Button>
                </MagneticButton>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </section>
  )
}
