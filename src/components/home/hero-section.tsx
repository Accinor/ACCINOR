"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  const t = useTranslations("home.hero")
  const cta = useTranslations("common.cta")
  const params = useParams()
  const locale = params.locale as string

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("subtitle")}
            </p>
            <p className="text-base text-muted-foreground">
              {t("description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/consultation`}>
                <Button size="lg">{cta("consultation")}</Button>
              </Link>
              <Link href={`/${locale}/project-submission`}>
                <Button size="lg" variant="outline">
                  {cta("submit_project")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-80 lg:h-96">
            <Image
              src="/images/hero/placeholder.svg"
              alt={t("title")}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
