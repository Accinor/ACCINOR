import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const admin = getAdminClient()
  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const { id, title, slug, excerpt, content, published, locale } = body

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 })
  }

  const admin = getAdminClient()
  const table = admin.from("blog_posts") as any

  const payload: Record<string, any> = {
    title,
    slug,
    excerpt: excerpt || null,
    content: content || "",
    published: !!published,
    locale: locale || "ar",
  }
  if (published) payload.published_at = new Date().toISOString()

  const { error } = id
    ? await table.update(payload).eq("id", id)
    : await table.insert({ ...payload, author_name: "ACCINOR" })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const admin = getAdminClient()
  const { error } = await (admin.from("blog_posts") as any).delete().eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
