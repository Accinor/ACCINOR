import { createClient } from "@/lib/supabase/server"
import { logger } from "@/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("consultation_requests").insert({
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      service_type: body.service_type,
      message: body.message || null,
    })

    if (error) throw error

    logger.info("Consultation request saved", { email: body.email })
    return Response.json({ success: true })
  } catch (err) {
    logger.error("Consultation request failed", { error: String(err) })
    return Response.json({ error: "Failed to save request" }, { status: 500 })
  }
}
