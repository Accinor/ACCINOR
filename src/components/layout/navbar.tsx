"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { MobileNav } from "./mobile-nav"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

export function Navbar() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/programs-training", label: t("nav.programs") },
    { href: "/funding-support", label: t("nav.funding") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt={t("site_name")}
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href={`/${locale}/consultation`}>
            <Button className="hidden sm:inline-flex">
              {t("cta.consultation")}
            </Button>
          </Link>
          <MobileNav
            links={links}
            open={mobileOpen}
            onOpenChange={setMobileOpen}
          />
        </div>
      </div>
    </header>
  )
}
