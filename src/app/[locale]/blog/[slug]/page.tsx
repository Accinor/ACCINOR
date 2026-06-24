"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function BlogPostPage() {
  const t = useTranslations("blog")
  const params = useParams()
  const locale = params.locale as string
  const slug = params.slug as string

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block"
        >
          ← {t("title")}
        </Link>
        <div className="text-center text-muted-foreground mt-8">
          <p>Blog post: {slug}</p>
        </div>
      </div>
    </div>
  )
}
