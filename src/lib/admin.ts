export const ADMIN_EMAILS = ["yassin24624@gmail.com", "saad.ofqir.1995@gmail.com"]

export const ADMIN_ACCOUNTS = [
  { email: "yassin24624@gmail.com", password: "AccinorAdmin2026!1" },
  { email: "saad.ofqir.1995@gmail.com", password: "AccinorAdmin2026!2" },
]

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}

export function getAdminRole(email: string): "admin" | "user" {
  return isAdminEmail(email) ? "admin" : "user"
}
