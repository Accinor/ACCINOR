import { createClient } from "@/lib/supabase/server"
import { logger } from "@/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("project_submissions").insert({
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      project_name: body.project_name,
      project_description: body.project_description || null,
      project_stage: body.project_stage,
      city: body.city,
      funding_needed: body.funding_needed || null,
    })

    if (error) throw error

    logger.info("Project submission saved", {
      project: body.project_name,
      email: body.email,
    })
    return Response.json({ success: true })
  } catch (err) {
    logger.error("Project submission failed", { error: String(err) })
    return Response.json({ error: "Failed to save submission" }, { status: 500 })
  }
}
