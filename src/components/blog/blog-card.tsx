import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  author_name: string
  published_at: string | null
}

export function BlogCard({ post, locale }: { post: Post; locale: string }) {
  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
        {post.cover_image && (
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={post.cover_image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{post.author_name}</span>
            {post.published_at && (
              <>
                <span>•</span>
                <span>
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
          <CardTitle className="text-xl">{post.title}</CardTitle>
        </CardHeader>
        {post.excerpt && (
          <CardContent>
            <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
