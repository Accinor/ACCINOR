"use client"

import { useTranslations } from "next-intl"

const serviceKeys = [
  "consulting",
  "coaching",
  "business_plan",
  "funding",
  "training",
  "guidance",
] as const

const icons: Record<string, string> = {
  consulting: "💡",
  coaching: "🤝",
  business_plan: "📋",
  funding: "💰",
  training: "🎓",
  guidance: "🧭",
}

export function ServicesSection() {
  const t = useTranslations("home.services")

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceKeys.map((key) => (
            <div
              key={key}
              className="group rounded-lg border p-6 transition-colors hover:border-primary"
            >
              <div className="text-3xl mb-4">{icons[key]}</div>
              <h3 className="font-semibold text-lg mb-2">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
