"use client"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu01, ChevronDown } from "@untitledui/icons"
import { useState } from "react"

type NavLink = {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

type Props = {
  links: NavLink[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function MobileNavItem({ link, locale, pathname, onClose }: { link: NavLink; locale: string; pathname: string; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false)

  function isActive(href: string): boolean {
    if (href === "/") return pathname === `/${locale}` || pathname === `/${locale}/`
    return pathname.startsWith(`/${locale}${href}`)
  }

  if (!link.children) {
    const active = isActive(link.href)
    return (
      <Link
        href={`/${locale}${link.href}`}
        className={`text-lg font-medium transition-colors px-3 py-2 rounded-lg block ${active ? "text-[#ffb81b] bg-[#ffb81b]/10" : "text-muted-foreground hover:text-[#ffb81b] hover:bg-[#ffb81b]/10"}`}
        onClick={onClose}
      >
        {link.label}
      </Link>
    )
  }

  const hasActiveChild = link.children?.some((c) => isActive(c.href))

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-center justify-between text-lg font-medium transition-colors px-3 py-2 rounded-lg ${
          hasActiveChild ? "text-[#ffb81b] bg-[#ffb81b]/10" : "text-muted-foreground hover:text-[#ffb81b] hover:bg-[#ffb81b]/10"
        }`}
      >
        {link.label}
        <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className={`${locale === "ar" ? "mr-4 border-r-2 pr-3" : "ml-4 border-l-2 pl-3"} mt-1 flex flex-col gap-1 border-[#ffb81b]/30`}>
          {link.children.map((child) => {
            const active = isActive(child.href)
            return (
              <Link
                key={child.href}
                href={`/${locale}${child.href}`}
                className={`text-base font-normal transition-colors px-3 py-1.5 rounded-lg ${
                  active ? "text-[#ffb81b] bg-[#ffb81b]/10" : "text-muted-foreground/70 hover:text-[#ffb81b] hover:bg-[#ffb81b]/10"
                }`}
                onClick={onClose}
              >
                {child.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function MobileNav({ links, open, onOpenChange }: Props) {
  const params = useParams()
  const locale = params.locale as string
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white/70 hover:text-[#ffb81b] hover:bg-white/10"
          >
            <Menu01 size={20} />
          </Button>
        }
      />
      <SheetContent side={locale === "ar" ? "right" : "left"}>
        <SheetHeader>
          <SheetTitle className="text-foreground">ACCINOR</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-8">
          {links.map((link) => (
            <MobileNavItem
              key={link.href}
              link={link}
              locale={locale}
              pathname={pathname}
              onClose={() => onOpenChange(false)}
            />
          ))}
          <Link
            href={`/${locale}/auth`}
            className="mt-4"
            onClick={() => onOpenChange(false)}
          >
            <Button className="w-full bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold shadow-sm">
              {locale === "ar" ? "تسجيل الدخول" : locale === "fr" ? "Connexion" : "Sign in"}
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
