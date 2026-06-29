import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

const ADMIN_EMAILS = ["yassin24624@gmail.com", "saad.ofqir.1995@gmail.com"]

const ADMIN_NAMES: Record<string, string> = {
  "yassin24624@gmail.com": "Yassine Benali",
  "saad.ofqir.1995@gmail.com": "Saad Ofqir",
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const email = session.user.email!
    const userId = session.user.id
    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user"
    const profile_type = ADMIN_EMAILS.includes(email) ? "admin" : "user"

    const admin = getAdminClient()
    const profiles = admin.from("profiles") as any

    const { error: upsertError } = await profiles.upsert({
      id: userId,
      email,
      full_name: ADMIN_NAMES[email] || session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split("@")[0],
      role,
      profile_type,
    }, { onConflict: "id" })

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    return NextResponse.json({ role, email })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Sync failed" }, { status: 500 })
  }
}
