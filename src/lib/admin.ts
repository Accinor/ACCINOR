// Admin email whitelist. Sourced from the ADMIN_EMAILS env var (comma-separated)
// on the server, falling back to the known admins so nothing breaks if unset.
// NOTE: no passwords live in source code — admin credentials are managed in
// Supabase Auth. Seeding/reset reads passwords from the ADMIN_SEED_PASSWORDS env var.
const FALLBACK_ADMIN_EMAILS = ["yassin24624@gmail.com", "saad.ofqir.1995@gmail.com"]

export const ADMIN_EMAILS: string[] = (() => {
  const fromEnv = process.env.ADMIN_EMAILS
    ?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return fromEnv && fromEnv.length > 0 ? fromEnv : FALLBACK_ADMIN_EMAILS
})()

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}

export function getAdminRole(email: string): "admin" | "user" {
  return isAdminEmail(email) ? "admin" : "user"
}
