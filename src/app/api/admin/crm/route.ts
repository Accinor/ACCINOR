import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth-guard"

// Unified CRM endpoint. Reads go through the service-role client so admins see
// every row regardless of RLS (a browser query would be limited to the caller).
//
//   GET  /api/admin/crm?type=leads|consultations|requests
//   PATCH { type, id, status, notes? }   -> update a row's status / notes

type CrmType = "leads" | "consultations" | "requests"

const TABLE: Record<CrmType, string> = {
  leads: "contacts",
  consultations: "consultation_requests",
  requests: "project_submissions",
}

const ALLOWED_STATUS: Record<CrmType, string[]> = {
  leads: ["new", "contacted", "qualified", "converted", "archived"],
  consultations: ["pending", "contacted", "completed", "cancelled"],
  requests: ["pending", "reviewing", "accepted", "rejected"],
}

function isCrmType(v: string | null): v is CrmType {
  return v === "leads" || v === "consultations" || v === "requests"
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const type = new URL(req.url).searchParams.get("type")
  if (!isCrmType(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }

  const admin = getAdminClient()
  const { data, error } = await admin
    .from(TABLE[type])
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rows: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { type, id, status, notes } = await req.json()

  if (!isCrmType(type) || !id) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const payload: Record<string, unknown> = {}
  if (status !== undefined) {
    if (!ALLOWED_STATUS[type].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    payload.status = status
  }
  if (notes !== undefined) payload.notes = notes

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  const admin = getAdminClient()
  const { error } = await (admin.from(TABLE[type]) as any).update(payload).eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
