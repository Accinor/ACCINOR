"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

const stats = [
  { value: 50, suffix: "+", key: "projects", icon: "🚀" },
  { value: 200, suffix: "+", key: "clients", icon: "👥" },
  { value: 30, suffix: "+", key: "trainings", icon: "🎯" },
  { value: 8, suffix: "", key: "cities", icon: "📍" },
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
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-[var(--brand-navy)]">
      {count}{suffix}
    </div>
  )
}

export function StatsSection() {
  const t = useTranslations("home.stats")

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-primary)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.15_75/0.08),transparent_70%)]" />
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <Counter to={stat.value} suffix={stat.suffix} />
              <div className="text-sm text-white/70 mt-2">{t(stat.key)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
