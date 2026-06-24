"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Lightbulb, Handshake, FileText, Coins, GraduationCap, Compass } from "lucide-react"

const serviceKeys = [
  "consulting",
  "coaching",
  "business_plan",
  "funding",
  "training",
  "guidance",
] as const

const icons = {
  consulting: Lightbulb,
  coaching: Handshake,
  business_plan: FileText,
  funding: Coins,
  training: GraduationCap,
  guidance: Compass,
}

const gradients = [
  "from-blue-600 to-blue-700",
  "from-amber-500 to-amber-600",
  "from-emerald-500 to-emerald-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
]

export function ServicesSection() {
  const t = useTranslations("home.services")

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceKeys.map((key, i) => {
            const Icon = icons[key as keyof typeof icons]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="group relative bg-white rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-[var(--brand-navy)] transition-colors">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`items.${key}.desc`)}
                  </p>
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
