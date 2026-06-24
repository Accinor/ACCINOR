"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { Rocket, Users, Target, MapPin } from "lucide-react"

const stats = [
  { value: 50, suffix: "+", key: "projects", icon: Rocket },
  { value: 200, suffix: "+", key: "clients", icon: Users },
  { value: 30, suffix: "+", key: "trainings", icon: Target },
  { value: 8, suffix: "", key: "cities", icon: MapPin },
]

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const steps = 60
          const increment = to / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= to) {
              setCount(to)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {count}{suffix}
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function StatsSection() {
  const t = useTranslations("home.stats")

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1e3a] via-[#0f2347] to-[#0c1e3a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08),transparent_70%)]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-amber-500/10"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.key} variants={itemVariants} className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-white/10 mb-4">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <Counter to={stat.value} suffix={stat.suffix} />
                <div className="text-sm text-white/60 mt-2">{t(stat.key)}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
