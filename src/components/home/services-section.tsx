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
  "from-[#0e1440] to-[#050a30]",
  "from-[#ffb81b] to-[#e5a318]",
  "from-emerald-500 to-emerald-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function ServicesSection() {
  const t = useTranslations("home.services")

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 dark:bg-transparent bg-secondary/50" />
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {serviceKeys.map((key, i) => {
            const Icon = icons[key as keyof typeof icons]
            return (
              <motion.div key={key} variants={cardVariants}>
                <div className="group relative bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#ffb81b]/30">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground transition-colors">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`items.${key}.desc`)}
                  </p>
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
