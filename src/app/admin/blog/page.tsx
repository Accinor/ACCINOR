"use client"

import { useEffect, useState } from "react"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  category: string | null
  tags: string[] | null
  seo_title: string | null
  seo_description: string | null
  featured: boolean
  published: boolean
  locale: string
  reading_minutes: number | null
  created_at: string
}

type Draft = Partial<Post> & { tagsText?: string }

const inputClass =
  "w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"

function formatDate(value: string | undefined) {
  if (!value) return "—"
  const d = new Date(value)
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
}

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
}

// Minimal, self-contained Markdown → HTML for the preview pane. HTML is escaped
// first, so admin content can't inject markup through the preview.
function renderPreview(md: string) {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const lines = esc(md || "").split(/\r?\n/)
  const html: string[] = []
  let inList = false
  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="text-[#ffb81b] underline" target="_blank" rel="noreferrer">$1</a>')
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^#{1,3}\s/.test(line)) {
      if (inList) { html.push("</ul>"); inList = false }
      const level = line.match(/^#+/)![0].length
      const text = inline(line.replace(/^#+\s/, ""))
      const size = level === 1 ? "text-xl font-bold" : level === 2 ? "text-lg font-semibold" : "text-base font-semibold"
      html.push(`<h${level} class="${size} mt-4 mb-2">${text}</h${level}>`)
    } else if (/^[-*]\s/.test(line)) {
      if (!inList) { html.push('<ul class="list-disc pl-5 space-y-1 my-2">'); inList = true }
      html.push(`<li>${inline(line.replace(/^[-*]\s/, ""))}</li>`)
    } else if (line === "") {
      if (inList) { html.push("</ul>"); inList = false }
    } else {
      if (inList) { html.push("</ul>"); inList = false }
      html.push(`<p class="my-2 leading-relaxed">${inline(line)}</p>`)
    }
  }
  if (inList) html.push("</ul>")
  return html.join("")
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Draft | null>(null)
  const [preview, setPreview] = useState(false)

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/blog")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load posts")
      setPosts(Array.isArray(data.posts) ? data.posts : [])
    } catch (e: any) {
      setError(e.message || "Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, tags: editing.tagsText ?? "" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save")
      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return
    setError("")
    try {
      const res = await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete")
      await load()
    } catch (e: any) {
      setError(e.message || "Failed to delete")
    }
  }

  const startEdit = (post: Post) =>
    setEditing({ ...post, tagsText: (post.tags ?? []).join(", ") })

  const newPost = () => {
    setPreview(false)
    setEditing({
      title: "", slug: "", excerpt: "", content: "", cover_image: "", category: "",
      tagsText: "", seo_title: "", seo_description: "", featured: false, published: false, locale: "ar",
    })
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">Write, categorize, and publish articles across languages.</p>
        </div>
        {!editing && (
          <button onClick={newPost}
            className="px-4 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] text-sm font-semibold hover:bg-[#e5a318] transition-colors">
            New Post
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {editing ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-6">{editing.id ? "Edit Post" : "New Post"}</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Title *</label>
                <input className={inputClass} value={editing.title || ""} required
                  onChange={(e) => {
                    const title = e.target.value
                    setEditing((prev) => {
                      if (!prev) return prev
                      // Auto-fill slug while it tracks the title (new posts only).
                      const autoSlug = !prev.id && (!prev.slug || prev.slug === slugify(prev.title || ""))
                      return { ...prev, title, slug: autoSlug ? slugify(title) : prev.slug }
                    })
                  }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Slug *</label>
                <input className={inputClass} value={editing.slug || ""} required
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Language</label>
                <select className={inputClass} value={editing.locale ?? "ar"}
                  onChange={(e) => setEditing({ ...editing, locale: e.target.value })}>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <input className={inputClass} placeholder="e.g. Entrepreneurship" value={editing.category || ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <select className={inputClass} value={editing.published ? "true" : "false"}
                  onChange={(e) => setEditing({ ...editing, published: e.target.value === "true" })}>
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cover image URL</label>
                <input className={inputClass} placeholder="https://..." value={editing.cover_image || ""}
                  onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <input className={inputClass} placeholder="funding, startups" value={editing.tagsText || ""}
                  onChange={(e) => setEditing({ ...editing, tagsText: e.target.value })} />
              </div>
            </div>

            {editing.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={editing.cover_image} alt="" className="w-full max-h-52 object-cover rounded-lg border border-border" />
            ) : null}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea className={`${inputClass} resize-none`} rows={2} value={editing.excerpt || ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content <span className="text-muted-foreground font-normal">(Markdown supported)</span></label>
                <div className="flex gap-1 text-xs">
                  <button type="button" onClick={() => setPreview(false)}
                    className={`px-2.5 py-1 rounded-md border ${!preview ? "bg-[#ffb81b]/15 text-[#ffb81b] border-[#ffb81b]/30" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    Write
                  </button>
                  <button type="button" onClick={() => setPreview(true)}
                    className={`px-2.5 py-1 rounded-md border ${preview ? "bg-[#ffb81b]/15 text-[#ffb81b] border-[#ffb81b]/30" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    Preview
                  </button>
                </div>
              </div>
              {preview ? (
                <div className="rounded-lg border border-border bg-background p-4 min-h-[220px] prose-preview"
                  dir={editing.locale === "ar" ? "rtl" : "ltr"}
                  dangerouslySetInnerHTML={{ __html: renderPreview(editing.content || "") }} />
              ) : (
                <textarea className={`${inputClass} resize-y min-h-[220px] font-mono`} value={editing.content || ""} required
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
              )}
            </div>

            {/* SEO */}
            <div className="rounded-lg border border-border p-4 space-y-4">
              <p className="text-sm font-semibold">SEO</p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">SEO title</label>
                <input className={inputClass} value={editing.seo_title || ""}
                  onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">SEO description</label>
                <textarea className={`${inputClass} resize-none`} rows={2} value={editing.seo_description || ""}
                  onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />
                <p className="text-xs text-muted-foreground">{(editing.seo_description || "").length} chars (aim for 120–160)</p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="w-4 h-4 accent-[#ffb81b]" />
              Feature this post
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#ffb81b] text-[#050a30] text-sm font-semibold hover:bg-[#e5a318] disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(null)}
                className="px-6 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : loading ? (
        <div className="py-16 text-center text-muted-foreground text-sm">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No posts yet. Create your first post.
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Lang</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="p-3 font-medium">
                    <span className="flex items-center gap-2">
                      {post.featured && <span className="text-[#ffb81b] text-xs" title="Featured">★</span>}
                      {post.title}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{post.category || "—"}</td>
                  <td className="p-3 uppercase text-xs text-muted-foreground">{post.locale}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.published ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"
                    }`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{formatDate(post.created_at)}</td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => startEdit(post)}
                        className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(post.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
