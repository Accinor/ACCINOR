"use client"

import { useTranslations } from "next-intl"

export default function ProgramsTrainingPage() {
  const t = useTranslations("programs")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground mb-8">{t("subtitle")}</p>
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
          {t("notice")}
        </div>
      </div>
    </div>
  )
}
