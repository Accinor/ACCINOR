"use client"

import { useTranslations, useLocale } from "next-intl"
import { ContactForm } from "@/components/forms/contact-form"
import { EditableText } from "@/components/shared/editable-text"

export default function ContactPage() {
  const t = useTranslations("contact")
  const locale = useLocale()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <EditableText page="contact" section="header" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h1>
          <p className="text-xl text-muted-foreground">
            <EditableText page="contact" section="header" field="subtitle" as="span" locale={locale}>
              {t("subtitle")}
            </EditableText>
          </p>
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
