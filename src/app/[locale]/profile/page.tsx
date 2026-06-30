"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth"
import { LogOut01 } from "@untitledui/icons"

export default function ProfilePage() {
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const { profile, loading: authLoading, signOut } = useAuth()
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setForm(profile) }, [profile])

  useEffect(() => {
    if (!authLoading && !profile) router.push(`/${locale}/auth`)
  }, [authLoading, profile])

  const update = useCallback((field: string, value: any) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev)
  }, [])

  const handleSave = useCallback(async () => {
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          region: form.region,
          city: form.city,
          bio: form.bio,
          title: form.title,
          website: form.website,
        }),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    } catch {} finally { setSaving(false) }
  }, [form])

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append("avatar", file)
      const res = await fetch("/api/auth/upload-avatar", { method: "POST", body: fd })
      if (res.ok) {
        const data = await res.json()
        setForm((prev) => prev ? { ...prev, avatar_url: data.avatar_url } : prev)
      }
    } catch {} finally { setUploading(false) }
  }, [])

  const handleAvatarDelete = useCallback(async () => {
    const res = await fetch("/api/auth/delete-avatar", { method: "POST" })
    if (res.ok) setForm((prev) => prev ? { ...prev, avatar_url: undefined } : prev)
  }, [])

  const handleLogout = useCallback(async () => {
    await signOut()
    router.push(`/${locale}`)
    router.refresh()
  }, [])

  if (authLoading || !form) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-[#ffb81b] rounded-full animate-spin" />
    </div>
  )

  const nameParts = (form.full_name || "").split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Settings</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-foreground font-medium">Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal information and preferences.</p>
        </div>

        {/* Avatar card */}
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground/60">
                    {(form.full_name || form.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{form.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground mb-3">{form.email}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-50"
                >
                  Change photo
                </button>
                {form.avatar_url && (
                  <button
                    onClick={handleAvatarDelete}
                    disabled={uploading}
                    className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-medium text-destructive hover:bg-destructive/5 transition disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Full Name</label>
              <input
                type="text"
                value={form.full_name || ""}
                onChange={(e) => update("full_name", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Email</label>
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Phone</label>
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                placeholder="+212 6XX XX XX XX"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">City</label>
              <input
                type="text"
                value={form.city || ""}
                onChange={(e) => update("city", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                placeholder="Oujda"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-medium text-foreground">Region</label>
            <input
              type="text"
              value={form.region || ""}
              onChange={(e) => update("region", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
              placeholder="Oriental"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-medium text-foreground">Bio</label>
            <textarea
              value={form.bio || ""}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition resize-none"
              placeholder="Write a short introduction about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Title / Position</label>
              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => update("title", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                placeholder="e.g. Entrepreneur"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Website</label>
              <input
                type="url"
                value={form.website || ""}
                onChange={(e) => update("website", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b]/60 focus:border-transparent transition"
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-input text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition flex items-center gap-2"
          >
            <LogOut01 size={14} />
            Sign Out
          </button>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-green-600">Changes saved</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] font-medium text-sm hover:bg-[#e5a318] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
