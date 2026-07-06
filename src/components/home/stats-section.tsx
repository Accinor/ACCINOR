"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { CountUp, Reveal } from "@/components/shared/animations"
import { EditableText } from "@/components/shared/editable-text"

export function StatsSection() {
  const t = useTranslations("home.stats")
  const params = useParams()
  const locale = params.locale as string

  // Honest, verifiable facts about ACCINOR's scope — no fabricated track record
  // (pre-launch: see docs/STATUS.md "do not invent trust content").
  const stats = [
    { value: 8, suffix: "", label: t("cities") },
    { value: 6, suffix: "", label: t("services") },
    { value: 6, suffix: "", label: t("programs") },
    { value: 3, suffix: "", label: t("languages") },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,184,27,0.04)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,184,27,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#ffb81b] blur-[150px]"
      />

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
            <EditableText page="home" section="stats" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl md:text-5xl font-bold text-[#ffb81b] mb-2 transition-transform"
              >
                <CountUp end={stat.value} suffix={stat.suffix} duration={2} />
              </motion.div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
