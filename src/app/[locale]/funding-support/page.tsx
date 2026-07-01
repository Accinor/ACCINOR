"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { EditableText } from "@/components/shared/editable-text"

const supportKeys = [
  "readiness",
  "preparation",
  "guidance",
  "application",
  "pitch",
  "followup",
] as const

const icons: Record<string, string> = {
  readiness: "✅",
  preparation: "📁",
  guidance: "🧭",
  application: "📝",
  pitch: "🎤",
  followup: "🔄",
}

export default function FundingSupportPage() {
  const t = useTranslations("funding")
  const params = useParams()
  const locale = params.locale as string

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <EditableText page="funding" section="header" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            <EditableText page="funding" section="header" field="subtitle" as="span" locale={locale}>
              {t("subtitle")}
            </EditableText>
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <EditableText page="funding" section="header" field="intro" as="span" locale={locale}>
              {t("intro")}
            </EditableText>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {supportKeys.map((key) => (
            <div
              key={key}
              className="group rounded-lg border p-6 transition-colors hover:border-primary"
            >
              <div className="text-3xl mb-4">{icons[key]}</div>
              <h3 className="font-semibold text-lg mb-2">{t(`items.${key}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`items.${key}.desc`)}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t("process.title")}</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{step}</div>
                <div className="text-sm font-medium">{t(`process.step${step}`)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">{t("cta.title")}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{t("cta.desc")}</p>
          <Link
            href={`/${locale}/consultation`}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-semibold text-sm transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </div>
  )
}
