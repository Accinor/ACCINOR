import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

const ADMINS = [
  { email: "yassin24624@gmail.com", password: "AccinorAdmin2026!1" },
  { email: "saad.ofqir.1995@gmail.com", password: "AccinorAdmin2026!2" },
]

export async function POST() {
  try {
    const admin = getAdminClient()
    const profiles = admin.from("profiles") as any
    const results: { email: string; success: boolean; error?: string }[] = []

    for (const { email, password } of ADMINS) {
      try {
        let userId: string | null = null

        const { data: userData, error: createError } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })

        if (createError) {
          if (createError.message.includes("already registered")) {
            const { data: listData } = await admin.auth.admin.listUsers()
            const existingUser = listData?.users.find(u => u.email === email)
            if (!existingUser) {
              results.push({ email, success: false, error: "User registered but not found in list" })
              continue
            }
            userId = existingUser.id
          } else {
            results.push({ email, success: false, error: createError.message })
            continue
          }
        } else {
          userId = userData.user.id
        }

        const { error: profileError } = await profiles.upsert({
          id: userId,
          email,
          full_name: email.split("@")[0],
          role: "admin",
        }, { onConflict: "id" })

        results.push({
          email,
          success: !profileError,
          error: profileError?.message,
        })
      } catch (err: any) {
        results.push({ email, success: false, error: err?.message })
      }
    }

    return NextResponse.json({ results })
  } catch (err) {
    return NextResponse.json({ error: "Seed failed: " + String(err) }, { status: 500 })
  }
}
