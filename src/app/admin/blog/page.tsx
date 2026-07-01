"use client"

import { useEffect, useState } from "react"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  published: boolean
  locale: string
  created_at: string
}

type Draft = Partial<Post>

const inputClass =
  "w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"

function formatDate(value: string | undefined) {
  if (!value) return "—"
  const d = new Date(value)
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Draft | null>(null)

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
        body: JSON.stringify(editing),
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

  const newPost = () =>
    setEditing({ title: "", slug: "", excerpt: "", content: "", published: false, locale: "ar" })

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
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
        <div className="rounded-2xl border border-border bg-card p-6 max-w-2xl">
          <h2 className="text-lg font-semibold mb-6">{editing.id ? "Edit Post" : "New Post"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title</label>
              <input className={inputClass} value={editing.title || ""} required
                onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Slug</label>
              <input className={inputClass} value={editing.slug || ""} required
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea className={`${inputClass} resize-none`} rows={2} value={editing.excerpt || ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Content</label>
              <textarea className={`${inputClass} resize-y min-h-[200px]`} value={editing.content || ""} required
                onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="text-sm font-medium">Status</label>
                <select className={inputClass} value={editing.published ? "true" : "false"}
                  onChange={(e) => setEditing({ ...editing, published: e.target.value === "true" })}>
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
              </div>
            </div>
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
                <th className="p-3 font-medium">Language</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="p-3 font-medium">{post.title}</td>
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
                      <button onClick={() => setEditing(post)}
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
