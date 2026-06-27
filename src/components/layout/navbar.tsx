"use client"

import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { MobileNav } from "./mobile-nav"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "@untitledui/icons"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { UserMenu } from "@/components/shared/user-menu"

type NavLink = {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

export function Navbar() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScroll = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > 100 && y > lastScroll.current)
      lastScroll.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links: NavLink[] = [
    { href: "/", label: t("nav.home") },
    {
      href: "/about",
      label: t("nav.about"),
      children: [
        { href: "/about", label: t("nav.about_sub.story") },
        { href: "/about/team", label: t("nav.about_sub.team") },
        { href: "/about/careers", label: t("nav.about_sub.careers") },
      ],
    },
    {
      href: "/services",
      label: t("nav.services"),
      children: [
        { href: "/services", label: t("nav.services_sub.consulting") },
        { href: "/services", label: t("nav.services_sub.coaching") },
        { href: "/services", label: t("nav.services_sub.business_plan") },
        { href: "/services", label: t("nav.services_sub.training") },
      ],
    },
    { href: "/programs-training", label: t("nav.programs") },
    { href: "/funding-support", label: t("nav.funding") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ]

  function isActive(href: string): boolean {
    if (href === "/") return pathname === `/${locale}` || pathname === `/${locale}/`
    return pathname.startsWith(`/${locale}${href}`)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-[#050a30]/80 backdrop-blur-xl border-white/5 shadow-lg shadow-black/30"
          : "bg-[#050a30] border-white/10"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`container mx-auto flex items-center justify-between px-4 transition-all duration-500 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0 group relative">
          <div className="absolute -inset-4 bg-[#ffb81b]/0 group-hover:bg-[#ffb81b]/5 rounded-2xl transition-all duration-500" />
          <Image
            src="/images/logo.png"
            alt={t("site_name")}
            width={240}
            height={75}
            className={`brightness-0 invert transition-all duration-500 ${
              scrolled ? "h-12 w-auto" : "h-16 w-auto"
            }`}
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const active = isActive(link.href)
            return link.children ? (
              <DropdownMenu key={link.href}>
                <DropdownMenuTrigger
                  render={
                    <button
                      className={`flex cursor-default items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#ffb81b] after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100 relative ${
                        active
                          ? "text-[#ffb81b] after:scale-x-100"
                          : "text-white/70 hover:text-[#ffb81b]"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </button>
                  }
                />
                <DropdownMenuContent align="start" sideOffset={8}>
                  {link.children.map((child) => (
                    <DropdownMenuItem
                      key={child.href}
                      render={<Link href={`/${locale}${child.href}`} className="w-full" />}
                    >
                      {child.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#ffb81b] after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100 ${
                  active
                    ? "text-[#ffb81b] after:scale-x-100"
                    : "text-white/70 hover:text-[#ffb81b]"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <UserMenu />
          <LanguageSwitcher />
          <MobileNav links={links} open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>
      </div>
    </header>
  )
}
