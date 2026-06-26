"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  phone: string | null
  region: string | null
  city: string | null
  project_type: string | null
  project_stage: string | null
  project_description: string | null
  created_at: string
}

export default function AdminUsersPage() {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    loadProfiles()
  }, [])

  async function loadProfiles() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setProfiles(data)
    setLoading(false)
  }

  async function toggleRole(profile: Profile) {
    setToggling(profile.id)
    const newRole = profile.role === "admin" ? "user" : "admin"
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profile.id)

    if (!error) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === profile.id ? { ...p, role: newRole } : p))
      )
    }
    setToggling(null)
  }

  const filtered = profiles.filter(
    (p) =>
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b]"
      />

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2 pr-4">Phone</th>
                <th className="pb-2 pr-4">Region</th>
                <th className="pb-2 pr-4">City</th>
                <th className="pb-2 pr-4">Project</th>
                <th className="pb-2 pr-4">Stage</th>
                <th className="pb-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile) => (
                <tr key={profile.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 pr-4">{profile.email}</td>
                  <td className="py-3 pr-4">{profile.full_name || "—"}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        profile.role === "admin"
                          ? "bg-green-100 text-green-800 bg-green-900 text-green-200"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {profile.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{profile.phone || "—"}</td>
                  <td className="py-3 pr-4">{profile.region || "—"}</td>
                  <td className="py-3 pr-4">{profile.city || "—"}</td>
                  <td className="py-3 pr-4 max-w-[120px] truncate" title={profile.project_description || ""}>
                    {profile.project_type || "—"}
                  </td>
                  <td className="py-3 pr-4">{profile.project_stage || "—"}</td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleRole(profile)}
                      disabled={toggling === profile.id}
                      className="text-xs px-3 py-1 rounded border hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      {toggling === profile.id
                        ? "Updating..."
                        : profile.role === "admin"
                          ? "Demote to user"
                          : "Promote to admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
