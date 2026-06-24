"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { GraduationCap, Users, FileText, Briefcase, Rocket, HeartHandshake } from "lucide-react"

const audienceKeys = [
  "students",
  "youth",
  "project_holders",
  "entrepreneurs",
  "startups",
  "associations",
] as const

const icons = [
  GraduationCap,
  Users,
  FileText,
  Briefcase,
  Rocket,
  HeartHandshake,
]

const colors = [
  "text-blue-600 bg-blue-100",
  "text-amber-600 bg-amber-100",
  "text-emerald-600 bg-emerald-100",
  "text-violet-600 bg-violet-100",
  "text-rose-600 bg-rose-100",
  "text-cyan-600 bg-cyan-100",
]

export function AudienceSection() {
  const t = useTranslations("home.audience")

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[var(--gradient-subtle)]" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {audienceKeys.map((key, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="group"
              >
                <div className="relative rounded-xl bg-white border border-border/50 p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-amber-500/30 cursor-default">
                  <div className={`inline-flex w-12 h-12 rounded-lg ${colors[i]} items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-base font-medium text-foreground block">
                    {t(`items.${key}`)}
                  </span>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 group-hover:ring-amber-500/20 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
