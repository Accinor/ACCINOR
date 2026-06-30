"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut01, User01 } from "@untitledui/icons"
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
  const { profile, loading, signOut } = useAuth()

  if (loading) return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse hidden sm:block" />

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

  const handleLogout = async () => {
    await signOut()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="hidden sm:flex items-center gap-2 px-2 py-1.5 rounded-full border border-white/10 hover:border-white/30 transition-colors cursor-default">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <span className="w-7 h-7 rounded-full bg-[#ffb81b]/20 text-[#ffb81b] flex items-center justify-center text-xs font-semibold">
                {initials}
              </span>
            )}
            <span className="text-sm text-white/80 max-w-[100px] truncate hidden md:block">
              {profile.full_name || profile.email}
            </span>
          </button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuLabel>
          <div className="flex items-center gap-2.5 py-1">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-[#ffb81b]/20 text-[#ffb81b] flex items-center justify-center text-xs font-semibold">
                {initials}
              </span>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{profile.full_name || "User"}</span>
              <span className="text-xs text-muted-foreground">{profile.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<button className="w-full flex items-center gap-2" />}
          onClick={() => { window.location.href = `/${locale}/profile` }}
        >
          <User01 size={16} />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          render={<button className="w-full flex items-center gap-2" />}
          onClick={handleLogout}
        >
          <LogOut01 size={16} />
          {t("admin.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
