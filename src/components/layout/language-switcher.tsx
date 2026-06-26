"use client"

import { usePathname } from "next/navigation"
import { routing } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Globe } from "lucide-react"

const labels: Record<string, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const pathWithoutLocale = pathname.replace(/^\/(ar|fr|en)/, "")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white/70 hover:text-[#ffb81b] hover:bg-white/10"
          >
            <Globe className="w-4 h-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            render={<Link href={`/${l}${pathWithoutLocale}`} />}
          >
            {labels[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
