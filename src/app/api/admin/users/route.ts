import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()

  return profile?.role === "admin"
}

export async function GET() {
  const supabase = await createClient()
  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id, role } = await req.json()

  if (!id || !role || !["user", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
