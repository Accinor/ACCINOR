"use client"

import { useEffect, useMemo, useState } from "react"

type Client = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  company: string | null
  city: string | null
  region: string | null
  engagement: string | null
  stage: string
  notes: string | null
  created_at: string
}

type Draft = Partial<Client>

const STAGES = ["onboarding", "active", "on_hold", "completed", "churned"]
const stageColors: Record<string, string> = {
  onboarding: "bg-blue-500/15 text-blue-400",
  active: "bg-green-500/15 text-green-400",
  on_hold: "bg-yellow-500/15 text-yellow-400",
  completed: "bg-purple-500/15 text-purple-400",
  churned: "bg-muted text-muted-foreground",
}

const inputClass =
  "w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"

export default function AdminClientsPage() {
  const [rows, setRows] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [needsMigration, setNeedsMigration] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Draft | null>(null)
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("all")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/clients")
      const data = await res.json()
      if (data?.needsMigration) {
        setNeedsMigration(true)
        setRows([])
        return
      }
      if (!res.ok) throw new Error(data?.error || "Failed to load")
      setRows(Array.isArray(data.rows) ? data.rows : [])
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to save")
      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return
    setError("")
    try {
      const res = await fetch(`/api/admin/clients?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to delete")
      await load()
    } catch (e: any) {
      setError(e.message || "Failed to delete")
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length }
    for (const s of STAGES) c[s] = 0
    for (const r of rows) if (r.stage in c) c[r.stage]++
    return c
  }, [rows])

  const filtered = rows.filter((r) => {
    if (stageFilter !== "all" && r.stage !== stageFilter) return false
    if (!search) return true
    const hay = [r.full_name, r.email, r.company, r.city, r.engagement].join(" ").toLowerCase()
    return hay.includes(search.toLowerCase())
  })

  const newClient = () =>
    setEditing({ full_name: "", email: "", phone: "", company: "", city: "", region: "", engagement: "", stage: "onboarding", notes: "" })

  if (needsMigration) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm">
          <p className="font-medium text-yellow-400 mb-2">Database setup required</p>
          <p className="text-muted-foreground">
            The clients table hasn&apos;t been created yet. In the Supabase SQL Editor, run the
            migration <code className="text-foreground">supabase/migrations/00005_crm_and_blog.sql</code>,
            then reload this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Active engagements — converted, ongoing relationships.</p>
        </div>
        {!editing && (
          <button onClick={newClient}
            className="px-4 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] text-sm font-semibold hover:bg-[#e5a318] transition-colors">
            Add client
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {editing ? (
        <div className="rounded-2xl border border-border bg-card p-6 max-w-2xl">
          <h2 className="text-lg font-semibold mb-6">{editing.id ? "Edit Client" : "New Client"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full name *</label>
                <input className={inputClass} value={editing.full_name || ""} required
                  onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Company</label>
                <input className={inputClass} value={editing.company || ""}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className={inputClass} value={editing.email || ""}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Phone</label>
                <input className={inputClass} value={editing.phone || ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">City</label>
                <input className={inputClass} value={editing.city || ""}
                  onChange={(e) => setEditing({ ...editing, city: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Engagement</label>
                <input className={inputClass} placeholder="e.g. Consulting, Incubation" value={editing.engagement || ""}
                  onChange={(e) => setEditing({ ...editing, engagement: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Stage</label>
                <select className={inputClass} value={editing.stage ?? "onboarding"}
                  onChange={(e) => setEditing({ ...editing, stage: e.target.value })}>
                  {STAGES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes</label>
              <textarea className={`${inputClass} resize-y min-h-[80px]`} value={editing.notes || ""}
                onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] text-sm font-semibold hover:bg-[#e5a318] disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(null)}
                className="px-6 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setStageFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                stageFilter === "all" ? "bg-[#ffb81b]/15 text-[#ffb81b] border-[#ffb81b]/30" : "border-border text-muted-foreground hover:bg-muted"
              }`}>
              All ({counts.all})
            </button>
            {STAGES.map((s) => (
              <button key={s} onClick={() => setStageFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-colors ${
                  stageFilter === s ? "bg-[#ffb81b]/15 text-[#ffb81b] border-[#ffb81b]/30" : "border-border text-muted-foreground hover:bg-muted"
                }`}>
                {s.replace("_", " ")} ({counts[s] ?? 0})
              </button>
            ))}
          </div>

          <input type="text" placeholder="Search clients..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md mb-6 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b]" />

          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">No clients yet. Add your first client.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Company</th>
                    <th className="p-3 font-medium">Engagement</th>
                    <th className="p-3 font-medium">City</th>
                    <th className="p-3 font-medium">Stage</th>
                    <th className="p-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                      <td className="p-3 font-medium">{c.full_name}</td>
                      <td className="p-3">{c.company || "—"}</td>
                      <td className="p-3">{c.engagement || "—"}</td>
                      <td className="p-3">{c.city || "—"}</td>
                      <td className="p-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${stageColors[c.stage] || "bg-muted text-muted-foreground"}`}>
                          {c.stage?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditing(c)}
                            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(c.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
