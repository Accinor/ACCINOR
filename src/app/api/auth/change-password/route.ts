import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { current_password, new_password } = await req.json()

  if (!current_password || !new_password) {
    return NextResponse.json({ error: "Current and new password are required" }, { status: 400 })
  }

  if (new_password.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: session.user.email!,
    password: current_password,
  })

  if (signInError) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: new_password,
  })

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
