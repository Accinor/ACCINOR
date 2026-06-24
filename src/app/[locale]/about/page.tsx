import { useTranslations } from "next-intl"

export default function AboutPage() {
  const t = useTranslations("about")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">{t("mission.title")}</h2>
          <p className="text-muted-foreground">{t("mission.body")}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">{t("vision.title")}</h2>
          <p className="text-muted-foreground">{t("vision.body")}</p>
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
          <h2 className="text-2xl font-semibold mb-3">{t("region.title")}</h2>
          <p className="text-muted-foreground">{t("region.body")}</p>
        </div>
      </div>
    </div>
  )
}
