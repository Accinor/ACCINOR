import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    full_name, phone, region, city,
    has_project, project_description, project_stage,
    bio, title, website, linkedin_url, position, notifications
  } = body

  const profileData: Record<string, any> = {
    id: session.user.id,
    email: session.user.email!,
    full_name,
    phone,
    region,
    city,
    has_project: has_project || false,
    project_description: has_project ? project_description : null,
    project_stage: has_project ? project_stage : null,
    bio: bio || null,
    title: title || null,
    website: website || null,
    linkedin_url: linkedin_url || null,
    position: position || null,
  }

  if (notifications !== undefined) {
    profileData.notifications = notifications
  }

  const { error } = await supabase.from("profiles").upsert(profileData, { onConflict: "id" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const profile = data || {
    id: session.user.id,
    email: session.user.email,
    role: 'user',
    full_name: null,
    phone: null,
    region: null,
    city: null,
    avatar_url: null,
    bio: null,
    profile_type: 'user',
    website: null,
    title: null,
    has_project: false,
    project_description: null,
    project_stage: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return NextResponse.json(profile)
}
