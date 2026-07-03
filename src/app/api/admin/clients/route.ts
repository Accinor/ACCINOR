import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth-guard"

// Clients CRUD. A client is a converted, ongoing engagement — distinct from the
// inbound leads / consultations / project requests. All access is admin-gated and
// runs through the service-role client.

const STAGES = ["onboarding", "active", "on_hold", "completed", "churned"]

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const admin = getAdminClient()
  const { data, error } = await admin
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })

  // The clients table ships in migration 00005; if it hasn't been run yet, tell
  // the UI so it can show a setup notice instead of a hard error.
  if (error) {
    const missing = /relation .*clients.* does not exist/i.test(error.message)
    return NextResponse.json(
      { error: error.message, needsMigration: missing },
      { status: missing ? 200 : 500 }
    )
  }
  return NextResponse.json({ rows: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { id, full_name, email, phone, company, city, region, engagement, stage, notes } = body

  if (!full_name || !String(full_name).trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  if (stage && !STAGES.includes(stage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 })
  }

  const payload: Record<string, unknown> = {
    full_name: String(full_name).trim(),
    email: email || null,
    phone: phone || null,
    company: company || null,
    city: city || null,
    region: region || null,
    engagement: engagement || null,
    stage: stage || "onboarding",
    notes: notes || null,
  }

  const admin = getAdminClient()
  const table = admin.from("clients") as any
  const { error } = id
    ? await table.update(payload).eq("id", id)
    : await table.insert({ ...payload, source_type: "manual" })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const admin = getAdminClient()
  const { error } = await (admin.from("clients") as any).delete().eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
