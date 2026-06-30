"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/contexts/auth"
import { cn } from "@/lib/utils"
import {
  User01, Lock01, Bell01, LogOut01, Check,
  ChevronRight, AlertCircle, Camera01, Trash01,
} from "@untitledui/icons"

type Section = "details" | "password" | "notifications"

const NAV_ITEMS: { key: Section; icon: typeof User01 }[] = [
  { key: "details", icon: User01 },
  { key: "password", icon: Lock01 },
  { key: "notifications", icon: Bell01 },
]

const NOTIFICATION_KEYS = [
  { key: "new_consultations", msg: "notif_consultations" },
  { key: "new_leads", msg: "notif_leads" },
  { key: "new_blog_comments", msg: "notif_comments" },
  { key: "weekly_summary", msg: "notif_summary" },
] as const

export default function ProfilePage() {
  const t = useTranslations("common.profile")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"
  const router = useRouter()
  const { profile, loading: authLoading, signOut } = useAuth()

  const [form, setForm] = useState(profile)
  const [section, setSection] = useState<Section>("details")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Password state
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" })
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdError, setPwdError] = useState("")
  const [pwdSuccess, setPwdSuccess] = useState("")

  useEffect(() => { setForm(profile) }, [profile])

  useEffect(() => {
    if (!authLoading && !profile) router.push(`/${locale}/auth`)
  }, [authLoading, profile])

  const update = useCallback((field: string, value: any) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }, [])

  const updateNotif = useCallback((key: string, value: boolean) => {
    setForm((prev) => {
      if (!prev) return prev
      return { ...prev, notifications: { ...(prev.notifications || {} as Record<string, boolean>), [key]: value } }
    })
  }, [])

  const handleSave = useCallback(async () => {
    if (!form) return
    setSaving(true); setError(""); setSaved(false)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          region: form.region,
          city: form.city,
          bio: form.bio,
          title: form.title,
          website: form.website,
          linkedin_url: form.linkedin_url,
          position: form.position,
          notifications: form.notifications,
        }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Save failed") }
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (err: any) { setError(err.message) }
    setSaving(false)
  }, [form])

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError("")
    try {
      const fd = new FormData(); fd.append("avatar", file)
      const res = await fetch("/api/auth/upload-avatar", { method: "POST", body: fd })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Upload failed") }
      const d = await res.json()
      setForm((prev) => (prev ? { ...prev, avatar_url: d.avatar_url } : prev))
    } catch (err: any) { setError(err.message) }
    setUploading(false)
  }, [])

  const handleAvatarRemove = useCallback(async () => {
    setUploading(true)
    try {
      const res = await fetch("/api/auth/delete-avatar", { method: "POST" })
      if (res.ok) setForm((prev) => (prev ? { ...prev, avatar_url: undefined } : prev))
    } catch {}
    setUploading(false)
  }, [])

  const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); setPwdError(""); setPwdSuccess("")
    if (pwd.new !== pwd.confirm) { setPwdError(t("password_error_match")); return }
    if (pwd.new.length < 6) { setPwdError(t("password_error_length")); return }
    setPwdSaving(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: pwd.current, new_password: pwd.new }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed") }
      setPwdSuccess(t("password_success")); setPwd({ current: "", new: "", confirm: "" })
      setTimeout(() => setPwdSuccess(""), 3000)
    } catch (err: any) { setPwdError(err.message) }
    setPwdSaving(false)
  }, [pwd, t])

  const handleLogout = useCallback(async () => {
    await signOut()
    router.push(`/${locale}`)
    router.refresh()
  }, [signOut, router, locale])

  if (authLoading || !form) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-[#ffb81b] rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    </div>
  )

  const initials = (form.full_name || form.email || "U").charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-background pt-24 pb-16" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{t("settings")}</span>
            <ChevronRight size={14} className={cn(isRtl && "rotate-180")} />
            <span className="text-foreground font-medium">{t("title")}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <nav className="lg:w-48 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {NAV_ITEMS.map(({ key, icon: Icon }) => {
                const active = section === key
                return (
                  <button
                    key={key}
                    onClick={() => setSection(key)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                      active
                        ? "bg-[#ffb81b]/10 text-[#ffb81b]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon size={16} />
                    {t(key === "details" ? "my_details" : key)}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Global feedback */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* ──── MY DETAILS ──── */}
            {section === "details" && (
              <>
                {/* Avatar */}
                <div className="rounded-xl border bg-card p-5 flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                      {form.avatar_url ? (
                        <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground/60">{initials}</span>
                      )}
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{form.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground mb-2 truncate">{form.email}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-50"
                      >
                        <Camera01 size={14} />
                        {t("avatar_change")}
                      </button>
                      {form.avatar_url && (
                        <button
                          onClick={handleAvatarRemove}
                          disabled={uploading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-medium text-destructive hover:bg-destructive/5 transition disabled:opacity-50"
                        >
                          <Trash01 size={14} />
                          {t("avatar_remove")}
                        </button>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                </div>

                {/* Personal info */}
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">{t("my_details")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("first_name")}</label>
                      <input
                        type="text"
                        value={form.first_name || ""}
                        onChange={(e) => update("first_name", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("last_name")}</label>
                      <input
                        type="text"
                        value={form.last_name || ""}
                        onChange={(e) => update("last_name", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("email")}</label>
                      <input
                        type="email"
                        value={form.email}
                        readOnly
                        className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground outline-none cursor-not-allowed"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("phone")}</label>
                      <input
                        type="tel"
                        value={form.phone || ""}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("city")}</label>
                      <input
                        type="text"
                        value={form.city || ""}
                        onChange={(e) => update("city", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("region")}</label>
                      <input
                        type="text"
                        value={form.region || ""}
                        onChange={(e) => update("region", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">{t("bio")}</label>
                    <textarea
                      value={form.bio || ""}
                      onChange={(e) => update("bio", e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition resize-none"
                      placeholder={t("bio_placeholder")}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("title_position")}</label>
                      <input
                        type="text"
                        value={form.title || ""}
                        onChange={(e) => update("title", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                        placeholder={t("title_placeholder")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("website")}</label>
                      <input
                        type="url"
                        value={form.website || ""}
                        onChange={(e) => update("website", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">{t("linkedin")}</label>
                    <input
                      type="url"
                      value={form.linkedin_url || ""}
                      onChange={(e) => update("linkedin_url", e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Save bar */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-input text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition"
                  >
                    <LogOut01 size={14} />
                    {t("sign_out")}
                  </button>
                  <div className="flex items-center gap-3">
                    {saved && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <Check size={14} />
                        {t("saved")}
                      </span>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] font-medium text-sm hover:bg-[#e5a318] transition disabled:opacity-50"
                    >
                      {saving ? t("saving") : t("save")}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ──── PASSWORD ──── */}
            {section === "password" && (
              <>
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">{t("password")}</h3>

                  {pwdError && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      <AlertCircle size={16} />
                      {pwdError}
                    </div>
                  )}

                  {pwdSuccess && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-500">
                      <Check size={16} />
                      {pwdSuccess}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">{t("current_password")}</label>
                      <input
                        type="password"
                        value={pwd.current}
                        onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground">{t("new_password")}</label>
                        <input
                          type="password"
                          value={pwd.new}
                          onChange={(e) => setPwd({ ...pwd, new: e.target.value })}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                          minLength={6}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground">{t("confirm_password")}</label>
                        <input
                          type="password"
                          value={pwd.confirm}
                          onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={pwdSaving}
                      className="px-6 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] font-medium text-sm hover:bg-[#e5a318] transition disabled:opacity-50"
                    >
                      {pwdSaving ? t("updating") : t("update_password")}
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* ──── NOTIFICATIONS ──── */}
            {section === "notifications" && (
              <>
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">{t("notifications")}</h3>
                  <div className="space-y-1">
                    {NOTIFICATION_KEYS.map(({ key, msg }) => (
                      <label
                        key={key}
                        className="flex items-center justify-between py-3 px-1 cursor-pointer group rounded-lg hover:bg-muted/50 transition"
                      >
                        <span className="text-sm text-foreground">{t(msg)}</span>
                        <button
                          type="button"
                          onClick={() => updateNotif(key, !(form.notifications as Record<string, boolean>)?.[key])}
                          className={cn(
                            "relative w-10 h-6 rounded-full transition-colors shrink-0",
                            (form.notifications as Record<string, boolean>)?.[key]
                              ? "bg-[#ffb81b]"
                              : "bg-muted-foreground/30"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                              (form.notifications as Record<string, boolean>)?.[key]
                                ? isRtl ? "right-0.5 translate-x-0" : "left-0.5 translate-x-4"
                                : isRtl ? "right-0.5" : "left-0.5"
                            )}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  {saved && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <Check size={14} />
                      {t("saved")}
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] font-medium text-sm hover:bg-[#e5a318] transition disabled:opacity-50"
                  >
                    {saving ? t("saving") : t("save")}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
