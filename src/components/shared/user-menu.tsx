"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { User01, Grid01, LogOut01 } from "@untitledui/icons"
import { useAuth } from "@/contexts/auth"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const { profile, loading, isAdmin, signOut } = useAuth()

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse hidden sm:block" />
  }

  if (!profile) {
    return (
      <Link
        href={`/${locale}/auth`}
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-200 text-white/70 hover:text-[#ffb81b]"
      >
        <User01 size={16} />
        {t("nav.sign_in")}
      </Link>
    )
  }

  const initials = (profile.full_name || profile.email)
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = `/${locale}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={t("profile.title")}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-white/10 hover:border-[#ffb81b]/60 transition-colors overflow-hidden"
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                draggable={false}
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            ) : (
              <span className="w-full h-full rounded-full bg-[#ffb81b]/20 text-[#ffb81b] flex items-center justify-center text-xs font-semibold">
                {initials}
              </span>
            )}
          </button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuLabel>
          <div className="flex flex-col py-0.5">
            <span className="text-sm font-medium text-foreground">{profile.full_name || "User"}</span>
            <span className="text-xs text-muted-foreground">{profile.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem onClick={() => { window.location.href = "/admin" }}>
            <Grid01 size={16} />
            {t("profile.dashboard")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push(`/${locale}/profile`)}>
            <User01 size={16} />
            {t("profile.title")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          render={<button className="w-full flex items-center gap-2" />}
          onClick={handleSignOut}
        >
          <LogOut01 size={16} />
          {t("profile.sign_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
