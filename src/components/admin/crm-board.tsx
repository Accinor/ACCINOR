"use client"

import { useEffect, useMemo, useState } from "react"

export type CrmColumn = {
  key: string
  label: string
  // optional formatter
  format?: (value: any, row: Record<string, any>) => string
}

type Props = {
  type: "leads" | "consultations" | "requests"
  title: string
  subtitle: string
  columns: CrmColumn[]
  statuses: string[]
  statusColors: Record<string, string>
}

const badge =
  "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize whitespace-nowrap"

function formatDate(v: string | undefined) {
  if (!v) return "—"
  const d = new Date(v)
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
}

export function CrmBoard({ type, title, subtitle, columns, statuses, statusColors }: Props) {
  const [rows, setRows] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/crm?type=${type}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to load")
      setRows(Array.isArray(data.rows) ? data.rows : [])
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [type])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    const prev = rows
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)))
    try {
      const res = await fetch("/api/admin/crm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Update failed")
      }
    } catch (e: any) {
      setRows(prev) // revert on failure
      setError(e.message || "Update failed")
    } finally {
      setUpdating(null)
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length }
    for (const s of statuses) c[s] = 0
    for (const row of rows) if (row.status in c) c[row.status]++
    return c
  }, [rows, statuses])

  const filtered = rows.filter((row) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false
    if (!search) return true
    const hay = columns.map((col) => String(row[col.key] ?? "")).join(" ").toLowerCase()
    return hay.includes(search.toLowerCase())
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            statusFilter === "all" ? "bg-[#ffb81b]/15 text-[#ffb81b] border-[#ffb81b]/30" : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          All ({counts.all})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-colors ${
              statusFilter === s ? "bg-[#ffb81b]/15 text-[#ffb81b] border-[#ffb81b]/30" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b]"
      />

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No records found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                {columns.map((col) => (
                  <th key={col.key} className="p-3 font-medium whitespace-nowrap">{col.label}</th>
                ))}
                <th className="p-3 font-medium whitespace-nowrap">Date</th>
                <th className="p-3 font-medium whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 align-top">
                      {col.format ? col.format(row[col.key], row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                  <td className="p-3 align-top whitespace-nowrap text-muted-foreground">{formatDate(row.created_at)}</td>
                  <td className="p-3 align-top">
                    <div className="flex items-center gap-2">
                      <span className={`${badge} ${statusColors[row.status] || "bg-muted text-muted-foreground"}`}>
                        {row.status || "—"}
                      </span>
                      <select
                        value={row.status || statuses[0]}
                        disabled={updating === row.id}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[#ffb81b] disabled:opacity-50"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
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
