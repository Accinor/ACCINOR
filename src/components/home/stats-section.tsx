"use client"

import { useTranslations } from "next-intl"

export function StatsSection() {
  const t = useTranslations("home.stats")

  const stats = [
    { value: "50+", key: "projects" },
    { value: "200+", key: "clients" },
    { value: "30+", key: "trainings" },
    { value: "8", key: "cities" },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("title")}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {t(stat.key)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
