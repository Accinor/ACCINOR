"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

type Props = {
  links: { href: string; label: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ links, open, onOpenChange }: Props) {
  const params = useParams()
  const locale = params.locale as string

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        }
      />
      <SheetContent side={locale === "ar" ? "right" : "left"}>
        <SheetHeader>
          <SheetTitle className="text-[var(--brand-navy)]">ACCINOR</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-lg font-medium text-muted-foreground hover:text-amber-600 transition-colors px-3 py-2 rounded-lg hover:bg-amber-50"
              onClick={() => onOpenChange(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/consultation`}
            className="mt-4"
            onClick={() => onOpenChange(false)}
          >
            <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg">
              {locale === "ar" ? "احجز استشارة" : "Book a Consultation"}
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
