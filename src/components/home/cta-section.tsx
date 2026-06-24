"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  const t = useTranslations("home.cta")
  const cta = useTranslations("common.cta")
  const params = useParams()
  const locale = params.locale as string

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${locale}/consultation`}>
            <Button size="lg">{cta("consultation")}</Button>
          </Link>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" variant="outline">
              {cta("learn_more")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
