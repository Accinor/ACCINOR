"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { User01, Grid01, LogOut01, ChevronDown } from "@untitledui/icons"
import { useAuth } from "@/contexts/auth"

export function UserMenu() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const { profile, loading, isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

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

  const goToProfile = () => {
    setOpen(false)
    // Admin profile lives outside the [locale] tree — use a full navigation so
    // it never hits the "couldn't load" soft-navigation error.
    if (isAdmin) window.location.href = "/admin/profile"
    else router.push(`/${locale}/profile`)
  }

  const goToDashboard = () => {
    setOpen(false)
    window.location.href = "/admin"
  }

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    window.location.href = `/${locale}`
  }

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("profile.title")}
        className="flex items-center gap-1 rounded-full border border-white/10 hover:border-[#ffb81b]/60 transition-colors p-0.5"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
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
        </span>
        <ChevronDown size={14} className={`text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl py-1.5 z-[60]">
          <div className="px-3 py-2 border-b border-border mb-1">
            <div className="text-sm font-medium truncate">{profile.full_name || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
          </div>

          <button onClick={goToProfile}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
            <User01 size={16} className="text-muted-foreground" />
            {t("profile.title")}
          </button>

          {isAdmin && (
            <button onClick={goToDashboard}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
              <Grid01 size={16} className="text-muted-foreground" />
              {t("profile.dashboard")}
            </button>
          )}

          <div className="my-1 h-px bg-border" />

          <button onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut01 size={16} />
            {t("profile.sign_out")}
          </button>
        </div>
      )}
    </div>
  )
}
