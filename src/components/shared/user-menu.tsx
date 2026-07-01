"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { User01 } from "@untitledui/icons"
import { useAuth } from "@/contexts/auth"

export function UserMenu() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const { profile, loading, isAdmin } = useAuth()

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

  // Clicking the avatar goes straight to the profile — admins to the admin
  // profile (full navigation, since /admin is outside the [locale] tree),
  // regular users to their site profile.
  const goToProfile = () => {
    if (isAdmin) window.location.href = "/admin/profile"
    else router.push(`/${locale}/profile`)
  }

  return (
    <button
      onClick={goToProfile}
      title={t("profile.title")}
      aria-label={t("profile.title")}
      className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-white/10 hover:border-[#ffb81b]/60 transition-colors overflow-hidden"
    >
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt=""
          className="w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />
      ) : (
        <span className="w-full h-full rounded-full bg-[#ffb81b]/20 text-[#ffb81b] flex items-center justify-center text-xs font-semibold">
          {initials}
        </span>
      )}
    </button>
  )
}
