import { getAdminClient } from "@/lib/supabase/admin"
import { sendProjectEmails } from "@/lib/email"
import { logger } from "@/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Service-role client: public form tables have RLS enabled with no anon
    // insert policy, so the anon client is denied. This is a trusted server route.
    const supabase = getAdminClient()

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

    // Best-effort emails (confirmation to user + notify admin) — never block success.
    await sendProjectEmails({
      name: body.full_name,
      email: body.email,
      phone: body.phone,
      projectName: body.project_name,
      description: body.project_description,
      stage: body.project_stage,
      city: body.city,
      funding: body.funding_needed,
      locale: body.locale,
    })

    logger.info("Project submission saved", { project: body.project_name, email: body.email })
    return Response.json({ success: true })
  } catch (err) {
    logger.error("Project submission failed", { error: String(err) })
    return Response.json({ error: "Failed to save submission" }, { status: 500 })
  }
}
