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
  "text-[#050a30] text-[#f0f2ff] bg-[#f0f2ff] bg-[#0e1440]",
  "text-[#ffb81b] text-[#ffb81b] bg-[#ffb81b]/10 bg-[#ffb81b]/10",
  "text-emerald-600 text-emerald-400 bg-emerald-100 bg-emerald-950/50",
  "text-violet-600 text-violet-400 bg-violet-100 bg-violet-950/50",
  "text-rose-600 text-rose-400 bg-rose-100 bg-rose-950/50",
  "text-cyan-600 text-cyan-400 bg-cyan-100 bg-cyan-950/50",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

export function AudienceSection() {
  const t = useTranslations("home.audience")

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-secondary/50 bg-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {audienceKeys.map((key, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={key}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="relative rounded-xl bg-card border border-border/50 p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-[#ffb81b]/30 cursor-default">
                  <div className={`inline-flex w-12 h-12 rounded-lg ${colors[i]} items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-base font-medium text-foreground block">
                    {t(`items.${key}`)}
                  </span>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 group-hover:ring-[#ffb81b]/20 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
