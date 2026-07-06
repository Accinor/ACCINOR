import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Untyped (no Database generic) so inserts/updates accept plain objects across
// all tables without a generated schema type.
let adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (adminClient) return adminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL")
  }

  adminClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
