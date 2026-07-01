import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth-guard"

const MIGRATIONS = [
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_type TEXT DEFAULT 'user' CHECK (profile_type IN ('user', 'admin', 'coach', 'facilitator', 'presenter', 'partner'));`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS title TEXT;`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS position TEXT;`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '{}'::jsonb;`,
]

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return NextResponse.json({
    sql: MIGRATIONS.join("\n"),
    instructions:
      "Copy the SQL above and run it in your Supabase Dashboard > SQL Editor.",
    management_api:
      "Or set SUPABASE_MANAGEMENT_ACCESS_TOKEN env var to auto-migrate.",
  })
}

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const managementToken = process.env.SUPABASE_MANAGEMENT_ACCESS_TOKEN
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/(.+)\.supabase\.co/
  )?.[1]

  if (!managementToken || !projectRef) {
    return NextResponse.json(
      {
        error: "SUPABASE_MANAGEMENT_ACCESS_TOKEN not configured",
        sql: MIGRATIONS.join("\n"),
        hint: "Copy this SQL and run it in Supabase Dashboard > SQL Editor",
      },
      { status: 400 }
    )
  }

  const results: { sql: string; success: boolean; error?: string }[] = []

  for (const sql of MIGRATIONS) {
    try {
      const res = await fetch(
        `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${managementToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: sql }),
        }
      )
      if (!res.ok) {
        const body = await res.text()
        results.push({ sql, success: false, error: body })
      } else {
        results.push({ sql, success: true })
      }
    } catch (err: any) {
      results.push({ sql, success: false, error: err.message })
    }
  }

  const allOk = results.every((r) => r.success)

  if (allOk) {
    // Refresh PostgREST schema cache
    try {
      const admin = getAdminClient()
      // Do a select to refresh schema cache
      await admin.from("profiles").select("avatar_url").limit(1).maybeSingle()
    } catch {}
  }

  return NextResponse.json({
    success: allOk,
    results,
    message: allOk
      ? "All columns added. Schema cache refreshed." as string
      : "Some migrations failed. Try running SQL manually." as string,
  })
}
