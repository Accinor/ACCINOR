"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function Footer() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string

  const sections = [
    {
      title: t("site_name"),
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/services", label: t("nav.services") },
        { href: "/contact", label: t("nav.contact") },
      ],
    },
    {
      title: t("nav.services"),
      links: [
        { href: "/services", label: t("nav.about") },
        { href: "/programs-training", label: t("nav.programs") },
        { href: "/funding-support", label: t("nav.funding") },
      ],
    },
    {
      title: "Suivez-nous",
      links: [
        { href: "#", label: "Facebook" },
        { href: "#", label: "LinkedIn" },
        { href: "#", label: "Instagram" },
      ],
    },
  ]

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t("site_name")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t("site_name")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}
