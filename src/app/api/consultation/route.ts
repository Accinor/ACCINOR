import { getAdminClient } from "@/lib/supabase/admin"
import { sendConsultationEmails } from "@/lib/email"
import { logger } from "@/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Service-role client: public form tables have RLS enabled with no anon
    // insert policy, so the anon client is denied. This is a trusted server route.
    const supabase = getAdminClient()

    const { error } = await supabase.from("consultation_requests").insert({
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      service_type: body.service_type,
      message: body.message || null,
    })

    if (error) throw error

    // Best-effort emails (confirmation to user + notify admin) — never block success.
    await sendConsultationEmails({
      name: body.full_name,
      email: body.email,
      phone: body.phone,
      serviceType: body.service_type,
      message: body.message,
      locale: body.locale,
    })

    logger.info("Consultation request saved", { email: body.email })
    return Response.json({ success: true })
  } catch (err) {
    logger.error("Consultation request failed", { error: String(err) })
    return Response.json({ error: "Failed to save request" }, { status: 500 })
  }
}
