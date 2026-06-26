"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Reveal, StaggerReveal, StaggerItem } from "@/components/shared/animations"
import { EditableText } from "@/components/shared/editable-text"

export function NameMeaningSection() {
  const t = useTranslations("home.name_meaning")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"

  const parts = ["acc", "in", "or"] as const

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,27,0.06),transparent_70%)]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#ffb81b]/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#ffb81b]/5"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
              <EditableText page="home" section="name_meaning" field="title" as="span" locale={locale}>
                {t("title")}
              </EditableText>
            </h2>
          </Reveal>

          <StaggerReveal staggerDelay={0.2} y={24}>
            {parts.map((part) => (
              <StaggerItem key={part}>
                <div className="w-full mb-6">
                  <div
                    className={`flex items-center gap-4 md:gap-6 px-6 md:px-10 py-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-[#ffb81b]/30 hover:shadow-lg hover:shadow-[#ffb81b]/10 transition-all duration-300 group ${
                      isRtl ? "flex-row-reverse" : ""
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      className="shrink-0 bg-[#ffb81b] text-[#050a30] font-black text-xl md:text-2xl rounded-xl px-4 py-3 min-w-[80px] text-center group-hover:shadow-lg group-hover:shadow-[#ffb81b]/30 transition-shadow"
                    >
                      {part.toUpperCase()}
                    </motion.div>
                    <span className="w-px h-10 bg-border shrink-0 hidden sm:block" />
                    <span className="text-base md:text-lg text-foreground/80 leading-relaxed">
                      {t(part)}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <Reveal delay={0.6}>
            <p
              className={`mt-12 text-lg text-foreground/40 italic ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              {t("footer")}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
