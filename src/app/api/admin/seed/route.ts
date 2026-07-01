import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { ADMIN_EMAILS } from "@/lib/admin"
import { requireAdmin } from "@/lib/auth-guard"

// Seed/reset admin credentials from the ADMIN_SEED_PASSWORDS env var.
// Format: "email1:password1,email2:password2". Only emails present in the
// admin whitelist are accepted. No credentials are stored in source code.
function getSeedAccounts(): { email: string; password: string }[] {
  const raw = process.env.ADMIN_SEED_PASSWORDS
  if (!raw) return []
  return raw
    .split(",")
    .map((pair) => {
      const idx = pair.indexOf(":")
      if (idx === -1) return null
      return { email: pair.slice(0, idx).trim(), password: pair.slice(idx + 1).trim() }
    })
    .filter(
      (a): a is { email: string; password: string } =>
        !!a && !!a.email && !!a.password && ADMIN_EMAILS.includes(a.email.toLowerCase())
    )
}

export async function POST() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ADMINS = getSeedAccounts()
    if (ADMINS.length === 0) {
      return NextResponse.json(
        { error: "No seed accounts configured. Set ADMIN_SEED_PASSWORDS env var (email:password,...)." },
        { status: 400 }
      )
    }

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
