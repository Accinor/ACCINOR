import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

// Public endpoint: returns admin/team members for the About → Team page.
// Uses the service-role client server-side and only exposes public fields.
export async function GET() {
  try {
    const admin = getAdminClient()
    const { data, error } = await admin
      .from("profiles")
      .select("id, full_name, first_name, last_name, position, title, bio, avatar_url, website, linkedin_url, city, region, role, profile_type, created_at")
      .or("role.eq.admin,profile_type.in.(admin,coach,facilitator,presenter,partner)")
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ members: [], error: error.message }, { status: 200 })
    }

    const members = (data ?? []).map((p: any) => ({
      id: p.id,
      name: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.full_name || (p.email?.split("@")[0] ?? ""),
      position: p.position || p.title || "",
      bio: p.bio || "",
      avatar: p.avatar_url || null,
      website: p.website || null,
      linkedin: p.linkedin_url || null,
      city: p.city || null,
    }))

    return NextResponse.json({ members })
  } catch (err: any) {
    return NextResponse.json({ members: [], error: err?.message || "Failed" }, { status: 200 })
  }
}
