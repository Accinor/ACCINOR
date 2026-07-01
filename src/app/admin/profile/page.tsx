"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { RegionCitySelect } from "@/components/shared/region-city-select"

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
  position: string | null
  avatar_url: string | null
  role: string | null
  profile_type: string | null
  notifications: Record<string, boolean> | null
}

const DEFAULT_NOTIFICATIONS = {
  new_consultations: true,
  new_leads: true,
  new_blog_comments: false,
  weekly_summary: true,
}

export default function AdminProfile() {
  const supabase = createClient()
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
      const res = await fetch("/api/auth/profile")
      if (!res.ok) throw new Error("Failed to load profile")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setProfile({
        ...data,
        notifications: data.notifications || { ...DEFAULT_NOTIFICATIONS },
      })
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_IN") { setLoading(true); loadProfile() }
    })
    return () => subscription?.unsubscribe()
  }, [])

  function updateField(field: keyof Profile, value: any) {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  function updateNotification(key: string, value: boolean) {
    setProfile((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        notifications: { ...(prev.notifications as Record<string, boolean>), [key]: value },
      }
    })
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
          phone: profile.phone,
          region: profile.region, city: profile.city,
          bio: profile.bio, title: profile.title,
          website: profile.website, linkedin_url: profile.linkedin_url,
          position: profile.position, notifications: profile.notifications,
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
    if (passwordData.new !== passwordData.confirm) { setPasswordError("New passwords do not match"); return }
    if (passwordData.new.length < 6) { setPasswordError("New password must be at least 6 characters"); return }
    setPasswordChanging(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: passwordData.current, new_password: passwordData.new }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed") }
      setPasswordSuccess("Password changed successfully")
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
      <div className="text-center py-20 text-muted-foreground">
        <p>Failed to load profile.</p>
        <button onClick={() => { setLoading(true); setError(""); loadProfile() }}
          className="mt-4 px-4 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] text-sm font-bold">Retry</button>
      </div>
    )
  }

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.full_name || profile.email.split("@")[0]
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
          <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Profile updated successfully.
        </div>
      )}

      {/* ──── PROFILE CARD ──── */}
      <div className="relative w-full bg-white/90 dark:bg-white/5 backdrop-blur-3xl rounded-2xl p-8 shadow-[12px_12px_12px_-20px_rgba(0,0,0,0.3)] transform-gpu">
          <div className="absolute left-0 top-0 w-full h-24 bg-[#ffb81b] dark:bg-[#c99400] rounded-2xl rounded-b-none z-0" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-[0px_0px_6px_rgba(0,0,0,0.6)] -mt-12 mb-4 bg-[#f0f2f5] dark:bg-muted flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-[#ffb81b]">{initials}</span>
            )}
            {avatarUploading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Avatar upload / delete */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          <div className="flex gap-2 mb-6">
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={avatarUploading}
              className="px-3 py-1.5 rounded-lg bg-[#ffb81b] text-[#050a30] text-xs font-semibold disabled:opacity-50">
              {avatarUploading ? "Uploading..." : "Change photo"}
            </button>
            {profile.avatar_url && (
              <button type="button" onClick={handleAvatarRemove} disabled={avatarUploading}
                className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium hover:bg-muted disabled:opacity-50">
                Remove
              </button>
            )}
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-foreground">{displayName}</h1>
            <p className="text-sm text-[#666] dark:text-muted-foreground mt-1">
              {profile.position || profile.title || profile.profile_type || "Administrator"}
            </p>
            <p className="text-xs text-[#777] dark:text-muted-foreground/60 mt-3 max-w-md leading-relaxed">
              {profile.bio || "No bio yet. Tell visitors about yourself."}
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex gap-3 mb-6">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f0f2f5] dark:bg-muted flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.1)] hover:bg-[#e4e6e9] hover:-translate-y-1.5 hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all group">
                <svg className="w-5 h-5 fill-[#1a1a1a] dark:fill-foreground group-hover:fill-[#0066ff] transition-all" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f0f2f5] dark:bg-muted flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.1)] hover:bg-[#e4e6e9] hover:-translate-y-1.5 hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all group">
                <svg className="w-5 h-5 fill-[#1a1a1a] dark:fill-foreground group-hover:fill-[#0a66c2] transition-all" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="w-full flex justify-between pt-5 border-t border-[#eee] dark:border-border max-w-sm">
            <div className="text-center">
              <div className="font-semibold text-[#1a1a1a] dark:text-foreground">{profile.role || "—"}</div>
              <div className="text-xs text-[#666] dark:text-muted-foreground">Role</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-[#1a1a1a] dark:text-foreground">{profile.city || "—"}</div>
              <div className="text-xs text-[#666] dark:text-muted-foreground">City</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-[#1a1a1a] dark:text-foreground">{profile.region?.split("-")[0] || "—"}</div>
              <div className="text-xs text-[#666] dark:text-muted-foreground">Region</div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── EDIT SECTIONS ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Information */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" value={profile.first_name || ""} onChange={e => updateField("first_name", e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                placeholder="First Name" />
              <input type="text" value={profile.last_name || ""} onChange={e => updateField("last_name", e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                placeholder="Last Name" />
            </div>
            <input type="email" value={profile.email} disabled
              className="w-full rounded-lg border border-input bg-muted py-2.5 px-3 text-sm text-muted-foreground outline-none cursor-not-allowed" />
            <input type="tel" value={profile.phone || ""} onChange={e => updateField("phone", e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
              placeholder="+212 6XX XX XX XX" />
            <RegionCitySelect
              region={profile.region || ""}
              city={profile.city || ""}
              onRegionChange={(v) => updateField("region", v)}
              onCityChange={(v) => updateField("city", v)}
              regionLabel="Region"
              cityLabel="City"
            />
            <input type="text" value={profile.title || ""} onChange={e => updateField("title", e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
              placeholder="Title / Role" />
            <textarea value={profile.bio || ""} onChange={e => updateField("bio", e.target.value)} rows={3}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition resize-none"
              placeholder="Tell us about yourself..." />
          </div>
        </div>

        {/* Social & Public */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Social Links
            </h3>
            <input type="url" value={profile.website || ""} onChange={e => updateField("website", e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
              placeholder="Website URL" />
            <input type="url" value={profile.linkedin_url || ""} onChange={e => updateField("linkedin_url", e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
              placeholder="LinkedIn URL" />
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Public Profile
            </h3>
            <input type="text" value={profile.position || ""} onChange={e => updateField("position", e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
              placeholder="e.g. CEO & Founder" />
            <p className="text-xs text-muted-foreground">This position appears next to your name on public pages.</p>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </h3>
          {passwordError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">{passwordSuccess}</div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
              placeholder="Current Password" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="password" value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                placeholder="New Password" minLength={6} required />
              <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                placeholder="Confirm" minLength={6} required />
            </div>
            <button type="submit" disabled={passwordChanging}
              className="px-6 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-muted transition disabled:opacity-50">
              {passwordChanging ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications
          </h3>
          <div className="space-y-2">
            {[
              { key: "new_consultations", label: "New consultation requests" },
              { key: "new_leads", label: "New leads / contacts" },
              { key: "new_blog_comments", label: "New blog comments" },
              { key: "weekly_summary", label: "Weekly summary report" },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between py-2 cursor-pointer group">
                <span className="text-sm text-foreground">{item.label}</span>
                <button type="button" onClick={() => updateNotification(item.key, !profile.notifications?.[item.key])}
                  className={`relative w-10 h-6 rounded-full transition-colors ${profile.notifications?.[item.key] ? "bg-[#ffb81b]" : "bg-muted-foreground/30"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${profile.notifications?.[item.key] ? "translate-x-4" : ""}`} />
                </button>
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* ──── SAVE BAR ──── */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button onClick={handleSave} disabled={saving}
          className="px-8 py-2.5 rounded-xl bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm hover:-translate-y-0.5">
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : saved ? (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Saved</>
          ) : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
