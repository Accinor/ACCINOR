"use client"

import { useTranslations } from "next-intl"

const audienceKeys = [
  "students",
  "youth",
  "project_holders",
  "entrepreneurs",
  "startups",
  "associations",
] as const

export function AudienceSection() {
  const t = useTranslations("home.audience")

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {audienceKeys.map((key) => (
            <div
              key={key}
              className="rounded-lg border bg-background p-6 text-center transition-colors hover:border-primary"
            >
              <span className="text-lg font-medium">{t(`items.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
