"use client"

import { useEffect, useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  id: string
  email: string
  full_name: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  region: string | null
  city: string | null
  bio: string | null
  title: string | null
  website: string | null
  linkedin_url: string | null
  avatar_url: string | null
  role: string | null
}

export default function UserProfilePage() {
  const t = useTranslations("common.profile")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [avatarUploading, setAvatarUploading] = useState(false)

  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [passwordChanging, setPasswordChanging] = useState(false)

  async function loadProfile() {
    try {
      const supabase = createClient()
      const { data: { session } } = (await supabase?.auth.getSession()) ?? { data: { session: null } }
      if (!session?.user?.id) {
        router.replace(`/${locale}/auth`)
        return
      }
      const res = await fetch("/api/auth/profile")
      if (!res.ok) throw new Error("Failed to load profile")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      // Admins have a richer profile screen under /admin/profile.
      if (data.role === "admin") {
        router.replace("/admin/profile")
        return
      }
      setProfile(data)
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function updateField(field: keyof Profile, value: any) {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true); setError(""); setSaved(false)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.first_name, last_name: profile.last_name,
          phone: profile.phone, region: profile.region, city: profile.city,
          bio: profile.bio, title: profile.title,
          website: profile.website, linkedin_url: profile.linkedin_url,
        }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to save") }
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (err: any) { setError(err.message) }
    setSaving(false)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError("Image must be under 2MB"); return }
    setAvatarUploading(true); setError("")
    const fd = new FormData(); fd.append("avatar", file)
    try {
      const res = await fetch("/api/auth/upload-avatar", { method: "POST", body: fd })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Upload failed") }
      const d = await res.json(); updateField("avatar_url", d.avatar_url)
    } catch (err: any) { setError(err.message) }
    setAvatarUploading(false)
  }

  async function handleAvatarRemove() {
    setAvatarUploading(true)
    try { const res = await fetch("/api/auth/delete-avatar", { method: "POST" }); if (res.ok) updateField("avatar_url", null) } catch {}
    setAvatarUploading(false)
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault(); setPasswordError(""); setPasswordSuccess("")
    if (passwordData.new !== passwordData.confirm) { setPasswordError(t("password_error_match")); return }
    if (passwordData.new.length < 6) { setPasswordError(t("password_error_length")); return }
    setPasswordChanging(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: passwordData.current, new_password: passwordData.new }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed") }
      setPasswordSuccess(t("password_success"))
      setPasswordData({ current: "", new: "", confirm: "" })
      setTimeout(() => setPasswordSuccess(""), 3000)
    } catch (err: any) { setPasswordError(err.message) }
    setPasswordChanging(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#ffb81b]/30 border-t-[#ffb81b] rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        <p>{error || t("loading")}</p>
        <button onClick={() => { setLoading(true); setError(""); loadProfile() }}
          className="mt-4 px-4 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] text-sm font-bold">Retry</button>
      </div>
    )
  }

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.full_name || profile.email.split("@")[0]
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const inputClass = "w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8 pb-12">

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <button
            onClick={async () => {
              const supabase = createClient()
              if (supabase) await supabase.auth.signOut()
              router.replace(`/${locale}`)
            }}
            className="shrink-0 px-4 py-2 rounded-lg border border-input text-sm font-medium hover:bg-muted transition-colors"
          >
            {t("sign_out")}
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">{error}</div>
        )}
        {saved && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">{t("saved")}</div>
        )}

        {/* Avatar */}
        <div className="rounded-2xl border bg-card p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ffb81b]/40 bg-muted flex items-center justify-center shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-[#ffb81b]">{initials}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">{displayName}</div>
            <div className="text-sm text-muted-foreground mb-3">{profile.email}</div>
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={avatarUploading}
                className="px-3 py-1.5 rounded-lg bg-[#ffb81b] text-[#050a30] text-xs font-semibold disabled:opacity-50">
                {avatarUploading ? t("saving") : t("avatar_change")}
              </button>
              {profile.avatar_url && (
                <button onClick={handleAvatarRemove} disabled={avatarUploading}
                  className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium hover:bg-muted disabled:opacity-50">
                  {t("avatar_remove")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* My Details */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">{t("my_details")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" value={profile.first_name || ""} onChange={e => updateField("first_name", e.target.value)} className={inputClass} placeholder={t("first_name")} />
            <input type="text" value={profile.last_name || ""} onChange={e => updateField("last_name", e.target.value)} className={inputClass} placeholder={t("last_name")} />
          </div>
          <input type="email" value={profile.email} disabled className={`${inputClass} bg-muted text-muted-foreground cursor-not-allowed`} />
          <input type="tel" value={profile.phone || ""} onChange={e => updateField("phone", e.target.value)} className={inputClass} placeholder={t("phone")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" value={profile.city || ""} onChange={e => updateField("city", e.target.value)} className={inputClass} placeholder={t("city")} />
            <input type="text" value={profile.region || ""} onChange={e => updateField("region", e.target.value)} className={inputClass} placeholder={t("region")} />
          </div>
          <input type="text" value={profile.title || ""} onChange={e => updateField("title", e.target.value)} className={inputClass} placeholder={t("title_placeholder")} />
          <textarea value={profile.bio || ""} onChange={e => updateField("bio", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder={t("bio_placeholder")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="url" value={profile.website || ""} onChange={e => updateField("website", e.target.value)} className={inputClass} placeholder={t("website")} />
            <input type="url" value={profile.linkedin_url || ""} onChange={e => updateField("linkedin_url", e.target.value)} className={inputClass} placeholder={t("linkedin")} />
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-semibold text-sm transition-all disabled:opacity-50">
              {saving ? t("saving") : t("save")}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">{t("password")}</h3>
          {passwordError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">{passwordSuccess}</div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} className={inputClass} placeholder={t("current_password")} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="password" value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })} className={inputClass} placeholder={t("new_password")} minLength={6} required />
              <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} className={inputClass} placeholder={t("confirm_password")} minLength={6} required />
            </div>
            <button type="submit" disabled={passwordChanging}
              className="px-6 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-muted transition disabled:opacity-50">
              {passwordChanging ? t("updating") : t("update_password")}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
