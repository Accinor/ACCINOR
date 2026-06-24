"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { MobileNav } from "./mobile-nav"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"

export function Navbar() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt={t("site_name")}
            width={120}
            height={40}
            className={`h-10 w-auto transition-all duration-300 ${
              scrolled ? "" : "brightness-0 invert"
            }`}
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className={`text-sm font-medium transition-colors duration-200 hover:text-amber-500 ${
                scrolled ? "text-muted-foreground" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href={`/${locale}/consultation`}>
            <Button
              className={`hidden sm:inline-flex transition-all duration-300 ${
                scrolled
                  ? ""
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              }`}
            >
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
