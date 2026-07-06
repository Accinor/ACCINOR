import { getAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Service-role: contacts has RLS enabled with no anon insert policy.
    const supabase = getAdminClient()

    const { error } = await supabase.from("contacts").insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      source: "contact_form",
      metadata: { message: body.message },
    })

    if (error) throw error

    logger.info("Contact form submission saved", { email: body.email })
    return Response.json({ success: true })
  } catch (err) {
    logger.error("Contact form submission failed", { error: String(err) })
    return Response.json({ error: "Failed to save submission" }, { status: 500 })
  }
}
