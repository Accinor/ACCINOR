import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("avatar") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const ext = file.name.split(".").pop() || "png"
    const fileName = `${session.user.id}/${Date.now()}.${ext}`

    const admin = getAdminClient()
    const { data: uploadData, error: uploadError } = await admin.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage
      .from("avatars")
      .getPublicUrl(uploadData.path)

    const profiles = admin.from("profiles") as any
    const { error: profileError } = await profiles
      .update({ avatar_url: publicUrl })
      .eq("id", session.user.id)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ avatar_url: publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 })
  }
}
