import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/logger"

const ADMINS = [
  { email: "yassin24624@gmail.com", password: "AccinorAdmin2026!1" },
  { email: "saad.ofqir.1995@gmail.com", password: "AccinorAdmin2026!2" },
]

export async function POST() {
  try {
    const admin = getAdminClient()
    const results: { email: string; success: boolean; error?: string }[] = []

    for (const { email, password } of ADMINS) {
      const db = admin.from("profiles") as any

      const { data: existingUser } = await db.select("id").eq("email", email).single()

      if (existingUser) {
        const { error: updateError } = await db.update({ role: "admin" }).eq("id", existingUser.id)
        results.push({
          email,
          success: !updateError,
          error: updateError?.message,
        })
        continue
      }

      const { data: userData, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createError) {
        results.push({ email, success: false, error: createError.message })
        continue
      }

      const { error: profileError } = await (admin.from("profiles") as any).upsert({
        id: userData.user.id,
        email: userData.user.email!,
        full_name: email.split("@")[0],
        role: "admin",
      })

      results.push({
        email,
        success: !profileError,
        error: profileError?.message,
      })
    }

    return NextResponse.json({ results })
  } catch (err) {
    logger.error("Seed failed", { error: String(err) })
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
