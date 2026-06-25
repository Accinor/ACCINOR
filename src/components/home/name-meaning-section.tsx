"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"

export function NameMeaningSection() {
  const t = useTranslations("home.name_meaning")

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a30] to-[#020515]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,27,0.05),transparent_70%)]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#ffb81b]/5"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-16"
          >
            {t("title")}
          </motion.h2>

          <div className="grid gap-8">
            {(["acc", "in", "or"] as const).map((part, i) => (
              <motion.div
                key={part}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group"
              >
                <div className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#ffb81b]/20 transition-all duration-300">
                  <span className="text-2xl md:text-3xl font-black text-[#ffb81b]">{part.toUpperCase()}</span>
                  <span className="w-px h-8 bg-white/10" />
                  <span
                    className="text-base md:text-lg text-white/80 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: t.raw(part).replace(/<orange>/g, '<span class="text-[#ffb81b] font-bold">').replace(/<\/orange>/g, "</span>"),
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-lg text-white/40 italic"
          >
            {t("footer")}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
