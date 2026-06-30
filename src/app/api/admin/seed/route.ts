import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { ADMIN_ACCOUNTS } from "@/lib/admin"

const ADMINS = ADMIN_ACCOUNTS

export async function POST() {
  try {
    const admin = getAdminClient()
    const profiles = admin.from("profiles") as any
    const results: { email: string; success: boolean; error?: string }[] = []

    const { data: listData } = await admin.auth.admin.listUsers()
    const existingByEmail = new Map(listData?.users.map(u => [u.email, u]) ?? [])

    for (const { email, password } of ADMINS) {
      try {
        let userId: string | null = null
        const existing = existingByEmail.get(email)

        if (existing) {
          userId = existing.id
          const { error: updateError } = await admin.auth.admin.updateUserById(userId, { password, email_confirm: true })
          if (updateError) {
            results.push({ email, success: false, error: updateError.message })
            continue
          }
        } else {
          const { data: userData, error: createError } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          })

          if (createError) {
            results.push({ email, success: false, error: createError.message })
            continue
          }

          userId = userData.user.id
        }

        const { error: profileError } = await profiles.upsert({
          id: userId,
          email,
          full_name: email.split("@")[0],
          role: "admin",
          profile_type: "admin",
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
