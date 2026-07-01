import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"

/**
 * Server-side admin gate. Returns true only when the current session belongs to
 * an admin — verified against the profiles.role column, with the email whitelist
 * as a fallback. Use this to protect admin-only API routes.
 */
export async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.id) return false

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle()

  if (profile?.role === "admin") return true
  return isAdminEmail(session.user.email ?? "")
}
