import { useTranslations, useLocale } from "next-intl"
import { EditableText } from "@/components/shared/editable-text"

export default function AboutPage() {
  const t = useTranslations("about")
  const locale = useLocale()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-12">
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
          <p className="text-muted-foreground">
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
          <p className="text-muted-foreground">
            <EditableText page="about" section="vision" field="body" as="span" locale={locale}>
              {t("vision.body")}
            </EditableText>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">{t("values.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["integrity", "excellence", "innovation", "solidarity"].map((v) => (
              <div key={v} className="rounded-lg border p-4 text-center">
                <span className="font-medium">{t(`values.${v}`)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            <EditableText page="about" section="region" field="title" as="span" locale={locale}>
              {t("region.title")}
            </EditableText>
          </h2>
          <p className="text-muted-foreground">
            <EditableText page="about" section="region" field="body" as="span" locale={locale}>
              {t("region.body")}
            </EditableText>
          </p>
        </div>
      </div>
    </div>
  )
}
