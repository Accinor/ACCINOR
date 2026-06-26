"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"

export function NameMeaningSection() {
  const t = useTranslations("home.name_meaning")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"

  return (
    <section className="py-24 relative overflow-hidden bg-section">
      <div className="absolute inset-0 bg-gradient-to-b from-section via-section/95 to-background" />
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-section-foreground mb-16 text-center"
          >
            {t("title")}
          </motion.h2>

          <div className="flex flex-col gap-6">
            {(["acc", "in", "or"] as const).map((part, i) => (
              <motion.div
                key={part}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="w-full"
              >
                <div className={`flex items-center gap-4 md:gap-6 px-6 md:px-10 py-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-[#ffb81b]/30 transition-all duration-300 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="shrink-0 bg-[#ffb81b] text-[#050a30] font-black text-xl md:text-2xl rounded-xl px-4 py-3 min-w-[80px] text-center">
                    {part.toUpperCase()}
                  </div>
                  <span className="w-px h-10 bg-border shrink-0 hidden sm:block" />
                  <span className="text-base md:text-lg text-section-foreground/80 leading-relaxed">
                    {t(part)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`mt-12 text-lg text-section-foreground/40 italic ${isRtl ? "text-right" : "text-left"}`}
          >
            {t("footer")}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
