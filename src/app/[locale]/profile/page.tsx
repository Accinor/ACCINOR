"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { LogOut01, Upload03, Trash01 } from "@untitledui/icons"

interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  region?: string
  city?: string
  avatar_url?: string
  role?: string
  profile_type?: string
  bio?: string
  website?: string
  title?: string
  has_project?: boolean
  project_description?: string
  project_stage?: string
}

export default function ProfilePage() {
  const t = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push(`/${locale}/auth`); return }
        const res = await fetch("/api/auth/profile")
        if (res.ok) {
          const p = await res.json()
          setProfile(p)
        }
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  const updateField = useCallback((field: string, value: any) => {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev)
  }, [])

  const handleSave = useCallback(async () => {
    if (!profile) return
    setSaving(true)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profile.full_name,
          phone: profile.phone,
          region: profile.region,
          city: profile.city,
          has_project: profile.has_project,
          project_description: profile.has_project ? profile.project_description : null,
          project_stage: profile.has_project ? profile.project_stage : null,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {} finally { setSaving(false) }
  }, [profile])

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)
      const res = await fetch("/api/auth/upload-avatar", { method: "POST", body: formData })
      if (res.ok) {
        const data = await res.json()
        setProfile((prev) => prev ? { ...prev, avatar_url: data.avatar_url } : prev)
      }
    } catch {} finally { setUploading(false) }
  }, [])

  const handleAvatarDelete = useCallback(async () => {
    const res = await fetch("/api/auth/delete-avatar", { method: "POST" })
    if (res.ok) {
      setProfile((prev) => prev ? { ...prev, avatar_url: undefined } : prev)
    }
  }, [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050a30]">
      <div className="w-6 h-6 border-2 border-white/30 border-t-[#ffb81b] rounded-full animate-spin" />
    </div>
  )

  if (!profile) return null

  const initials = (profile.full_name || profile.email)
    .split(" ").map((s: string) => s[0]).join("").toUpperCase().slice(0, 2)

  const Input = ({ label, value, field, type = "text" }: { label: string; value?: string; field: string; type?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#ffb81b]/60 transition resize-none"
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#ffb81b]/60 transition"
        />
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050a30] pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-[#ffb81b]/20" />
            ) : (
              <span className="w-24 h-24 rounded-full bg-[#ffb81b]/20 text-[#ffb81b] flex items-center justify-center text-2xl font-bold ring-4 ring-[#ffb81b]/20 mx-auto">
                {initials}
              </span>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#ffb81b] text-[#050a30] flex items-center justify-center hover:bg-[#e5a318] transition disabled:opacity-50"
            >
              <Upload03 size={14} />
            </button>
            {profile.avatar_url && (
              <button
                onClick={handleAvatarDelete}
                className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition"
              >
                <Trash01 size={14} />
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">{profile.full_name || "User"}</h1>
          <p className="text-gray-400 text-sm">{profile.email}</p>
          {profile.role && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-[#ffb81b]/15 text-[#ffb81b] border border-[#ffb81b]/20">
              {profile.role === "admin" ? "Administrator" : profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          )}
        </div>

        {/* Profile form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Full Name" value={profile.full_name} field="full_name" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/50 outline-none cursor-not-allowed"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Phone" value={profile.phone} field="phone" />
            <Input label="City" value={profile.city} field="city" />
          </div>
          <Input label="Region" value={profile.region} field="region" />
          <Input label="Bio" value={profile.bio} field="bio" type="textarea" />
          <Input label="Title / Position" value={profile.title} field="title" />
          <Input label="Website" value={profile.website} field="website" />

          {/* Project info */}
          <label className="flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.has_project || false}
              onChange={(e) => updateField("has_project", e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-[#ffb81b]"
            />
            I have a project
          </label>
          {profile.has_project && (
            <div className="space-y-4 pl-6 border-l border-white/10">
              <Input label="Project Description" value={profile.project_description} field="project_description" type="textarea" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project Stage</label>
                <select
                  value={profile.project_stage || ""}
                  onChange={(e) => updateField("project_stage", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ffb81b]/60 transition"
                >
                  <option value="" className="bg-[#050a30]">Select stage</option>
                  <option value="idea" className="bg-[#050a30]">Idea</option>
                  <option value="working" className="bg-[#050a30]">Working on it</option>
                </select>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#ffb81b] text-[#050a30] font-medium text-sm hover:bg-[#e5a318] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && <span className="text-green-400 text-sm">Saved!</span>}
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-full border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition"
            >
              <LogOut01 size={14} className="inline mr-1.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
