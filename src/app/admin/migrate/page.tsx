"use client"

import { useState } from "react"

export default function MigratePage() {
  const [sql, setSql] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const loadSql = async () => {
    const res = await fetch("/api/admin/migrate")
    const data = await res.json()
    setSql(data.sql)
  }

  const run = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch("/api/admin/migrate", { method: "POST" })
      const data = await res.json()
      if (data.sql) setSql(data.sql)
      setStatus(data.message || data.error || data.hint || "Done")
    } catch (err: any) {
      setStatus(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <h1 className="text-2xl font-bold">Profile Schema Migration</h1>
      <p className="text-sm text-muted-foreground">
        Run this SQL in your Supabase Dashboard (SQL Editor) to add missing
        columns to the <code>profiles</code> table.
      </p>

      <div className="flex gap-3">
        <button
          onClick={loadSql}
          className="px-4 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-muted transition"
        >
          Show SQL
        </button>
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] text-sm font-medium hover:bg-[#e5a318] transition disabled:opacity-50"
        >
          {loading ? "Running..." : "Auto-migrate"}
        </button>
      </div>

      {status && (
        <div className="rounded-lg border border-[#ffb81b]/30 bg-[#ffb81b]/5 px-4 py-3 text-sm">
          {status}
        </div>
      )}

      {sql && (
        <pre className="rounded-xl border bg-card p-4 text-xs overflow-x-auto whitespace-pre-wrap">
          {sql}
        </pre>
      )}

      <details className="rounded-xl border bg-card p-4">
        <summary className="text-sm font-medium cursor-pointer">
          Manual instructions
        </summary>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Go to your Supabase Dashboard</li>
          <li>Open the SQL Editor</li>
          <li>Paste the SQL above and run it</li>
          <li>Come back here and refresh the profile page</li>
        </ol>
      </details>
    </div>
  )
}
