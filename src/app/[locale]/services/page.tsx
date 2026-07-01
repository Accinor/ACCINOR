"use client"

import { useTranslations, useLocale } from "next-intl"
import { EditableText } from "@/components/shared/editable-text"

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

export default function ServicesPage() {
  const t = useTranslations("home.services")
  const sp = useTranslations("services_page")
  const locale = useLocale()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <EditableText page="services" section="header" field="title" as="span" locale={locale}>
              {sp("title")}
            </EditableText>
          </h1>
          <p className="text-xl text-muted-foreground">
            <EditableText page="services" section="header" field="subtitle" as="span" locale={locale}>
              {sp("subtitle")}
            </EditableText>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {sp("process.title")}
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="rounded-lg border p-4 text-center"
              >
                <div className="text-2xl font-bold text-primary mb-2">
                  {step}
                </div>
                <div className="text-sm font-medium">
                  {sp(`process.step${step}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
