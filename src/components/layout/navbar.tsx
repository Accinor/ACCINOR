"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { MobileNav } from "./mobile-nav"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import { Sun, Moon } from "lucide-react"

export function Navbar() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()

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

  const isLight = theme === "light"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-xl ${
        scrolled ? "border-b border-border shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo.png"
            alt={t("site_name")}
            width={200}
            height={60}
            className="h-14 w-auto transition-all duration-300"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="relative px-3 py-2 text-sm font-medium text-foreground/70 hover:text-amber-500 transition-colors duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-amber-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2.5 rounded-full text-foreground/70 hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <LanguageSwitcher />
          <Link href={`/${locale}/consultation`}>
            <Button className="hidden sm:inline-flex bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
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
