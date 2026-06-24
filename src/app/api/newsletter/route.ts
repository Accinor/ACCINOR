import { createClient } from "@/lib/supabase/server"
import { logger } from "@/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("contacts").insert({
      name: body.name,
      email: body.email,
      source: "newsletter",
    })

    if (error) throw error

    logger.info("Newsletter subscription saved", { email: body.email })
    return Response.json({ success: true })
  } catch (err) {
    logger.error("Newsletter subscription failed", { error: String(err) })
    return Response.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}
