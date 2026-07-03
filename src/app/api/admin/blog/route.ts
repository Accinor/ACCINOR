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

// Rough reading-time estimate (~200 words / minute), min 1.
function readingMinutes(content: string) {
  const words = String(content || "").trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

// Accepts tags as an array or a comma-separated string.
function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean)
  if (typeof tags === "string") return tags.split(",").map((t) => t.trim()).filter(Boolean)
  return []
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const {
    id, title, slug, excerpt, content, published, locale,
    cover_image, category, tags, seo_title, seo_description, featured,
  } = body

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
    cover_image: cover_image || null,
    category: category || null,
    tags: normalizeTags(tags),
    seo_title: seo_title || null,
    seo_description: seo_description || null,
    featured: !!featured,
    reading_minutes: readingMinutes(content),
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
