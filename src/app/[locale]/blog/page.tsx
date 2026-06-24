"use client"

import { useTranslations } from "next-intl"

export default function BlogPage() {
  const t = useTranslations("blog")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground mb-4">{t("subtitle")}</p>
          <div className="inline-block rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            {t("notice")}
          </div>
        </div>
        <div className="text-center text-muted-foreground">
          <p>Blog posts will be displayed here (M4)</p>
        </div>
      </div>
    </div>
  )
}
