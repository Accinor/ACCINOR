"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"

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
  ]

  const socialLinks = [
    {
      href: "#",
      label: "Facebook",
      svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
      href: "#",
      label: "LinkedIn",
      svg: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><path d="M2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
    },
    {
      href: "#",
      label: "Instagram",
      svg: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></>,
    },
  ]

  return (
    <footer className="relative border-t border-border/50 bg-section overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-section to-section" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,184,27,0.06),transparent_60%)]" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <Image
                src="/images/logo.png"
                alt="ACCINOR"
                width={200}
                height={65}
                className="h-14 w-auto opacity-90 dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="text-sm text-section-foreground/50 leading-relaxed mb-6">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-section-foreground/10 flex items-center justify-center hover:bg-[#ffb81b] transition-colors duration-200 text-section-foreground/50 hover:text-white"
                  aria-label={social.label}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-section-foreground/90">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm text-section-foreground/50 hover:text-[#ffb81b] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold mb-4 text-section-foreground/90">
              {locale === "ar" ? "اتصل بنا" : "Contact"}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-section-foreground/50">
                <MapPin className="w-4 h-4 mt-0.5 text-[#ffb81b] shrink-0" />
                <span>Oriental Region, Morocco</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-section-foreground/50">
                <Mail className="w-4 h-4 mt-0.5 text-[#ffb81b] shrink-0" />
                <span>contact@accinor.ma</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-section-foreground/50">
                <Phone className="w-4 h-4 mt-0.5 text-[#ffb81b] shrink-0" />
                <span>+212 5XX XX XX XX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-section-foreground/10 mt-12 pt-8 text-center text-sm text-section-foreground/30">
          © {new Date().getFullYear()} ACCINOR. {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}
