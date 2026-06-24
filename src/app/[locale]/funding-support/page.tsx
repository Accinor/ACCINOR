"use client"

import { useTranslations } from "next-intl"

export default function FundingSupportPage() {
  const t = useTranslations("funding")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
      </div>
    </div>
  )
}
