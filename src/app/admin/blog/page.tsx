"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export default function AdminBlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Partial<Post> | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: Post[] | null }) => {
        if (data) setPosts(data)
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return

    if (editing.id) {
      await supabase
        .from("blog_posts")
        .update({
          title: editing.title,
          slug: editing.slug,
          excerpt: editing.excerpt,
          content: editing.content,
          published: editing.published,
          locale: editing.locale,
        })
        .eq("id", editing.id)
    } else {
      await supabase.from("blog_posts").insert({
        title: editing.title,
        slug: editing.slug,
        excerpt: editing.excerpt,
        content: editing.content,
        published: editing.published ?? false,
        locale: editing.locale ?? "ar",
        author_name: "ACCINOR",
      })
    }

    setShowForm(false)
    setEditing(null)
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: Post[] | null }) => {
        if (data) setPosts(data)
      })
  }

  const handleDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id)
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: Post[] | null }) => {
        if (data) setPosts(data)
      })
  }

  const editPost = (post: Post) => {
    setEditing(post)
    setShowForm(true)
  }

  const newPost = () => {
    setEditing({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      published: false,
      locale: "ar",
    })
    setShowForm(true)
  }

  if (showForm && editing) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">
          {editing.id ? "Edit Post" : "New Post"}
        </h1>
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editing.excerpt || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, excerpt: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  className="min-h-[200px]"
                  value={editing.content}
                  onChange={(e) =>
                    setEditing({ ...editing, content: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Locale</Label>
                  <Select
                    value={editing.locale ?? "ar"}
                    onValueChange={(v) =>
                      setEditing({ ...editing, locale: v ?? "ar" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Published</Label>
                  <Select
                    value={editing.published ? "true" : "false"}
                    onValueChange={(v) =>
                      setEditing({ ...editing, published: v === "true" })
                    }

                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Draft</SelectItem>
                      <SelectItem value="true">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditing(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button onClick={newPost}>New Post</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Locale</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No posts yet. Create your first post.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.locale}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      post.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(post.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editPost(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
