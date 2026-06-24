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
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      } />
      <SheetContent side={locale === "ar" ? "right" : "left"}>
        <SheetHeader>
          <SheetTitle>ACCINOR</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
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
            <Button className="w-full">
              احجز استشارة
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
