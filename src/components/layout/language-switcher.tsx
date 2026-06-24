"use client"

import { useParams, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { routing } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const labels: Record<string, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  const pathWithoutLocale = pathname.replace(/^\/(ar|fr|en)/, "")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm">{labels[locale] || locale}</Button>} />
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem key={l} render={<Link href={`/${l}${pathWithoutLocale}`} />}>
            {labels[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
