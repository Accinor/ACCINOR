"use client"

import { useTranslations } from "next-intl"
import { ConsultationForm } from "@/components/forms/consultation-form"

export default function ConsultationPage() {
  const t = useTranslations("consultation")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="rounded-lg border p-8">
          <ConsultationForm />
        </div>
      </div>
    </div>
  )
}
