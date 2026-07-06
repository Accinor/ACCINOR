"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { EditableText } from "@/components/shared/editable-text"
import { MagicBentoCard } from "@/components/shared/magic-bento-card"

const VALUES = ["integrity", "excellence", "innovation", "solidarity"] as const

export default function AboutPage() {
  const t = useTranslations("about")
  const params = useParams()
  const locale = params.locale as string

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-14">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            <EditableText page="about" section="header" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </h1>
          <p className="text-xl text-muted-foreground">
            <EditableText page="about" section="header" field="subtitle" as="span" locale={locale}>
              {t("subtitle")}
            </EditableText>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            <EditableText page="about" section="mission" field="title" as="span" locale={locale}>
              {t("mission.title")}
            </EditableText>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText page="about" section="mission" field="body" as="span" locale={locale}>
              {t("mission.body")}
            </EditableText>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            <EditableText page="about" section="vision" field="title" as="span" locale={locale}>
              {t("vision.title")}
            </EditableText>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText page="about" section="vision" field="body" as="span" locale={locale}>
              {t("vision.body")}
            </EditableText>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            <EditableText page="about" section="values" field="title" as="span" locale={locale}>
              {t("values.title")}
            </EditableText>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <MagicBentoCard key={v} className="h-full" particleCount={5}>
                <div className="h-full p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm text-center flex items-center justify-center min-h-[96px]">
                  <span className="font-semibold text-[#ffb81b]">
                    <EditableText page="about" section="values" field={v} as="span" locale={locale}>
                      {t(`values.${v}`)}
                    </EditableText>
                  </span>
                </div>
              </MagicBentoCard>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            <EditableText page="about" section="region" field="title" as="span" locale={locale}>
              {t("region.title")}
            </EditableText>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText page="about" section="region" field="body" as="span" locale={locale}>
              {t("region.body")}
            </EditableText>
          </p>
        </div>
      </div>
    </div>
  )
}
