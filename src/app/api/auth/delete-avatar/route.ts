import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const admin = getAdminClient()
    const profiles = admin.from("profiles") as any

    const { data: profile } = await profiles
      .select("avatar_url")
      .eq("id", session.user.id)
      .single()

    if (profile?.avatar_url) {
      const urlPath = profile.avatar_url.split("/avatars/").pop()
      if (urlPath) {
        await admin.storage.from("avatars").remove([urlPath])
      }
    }

    await profiles.update({ avatar_url: null }).eq("id", session.user.id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Delete failed" }, { status: 500 })
  }
}
