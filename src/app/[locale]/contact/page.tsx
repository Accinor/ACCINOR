"use client"

import { useTranslations } from "next-intl"
import { ContactForm } from "@/components/forms/contact-form"

export default function ContactPage() {
  const t = useTranslations("contact")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="rounded-lg border p-8">
          <div className="space-y-4 mb-8">
            <div>
              <span className="font-medium">{t("info.address")}</span>
            </div>
            <div>
              <span className="font-medium">{t("info.email")}</span>
            </div>
            <div>
              <span className="font-medium">{t("info.phone")}</span>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  )
}
