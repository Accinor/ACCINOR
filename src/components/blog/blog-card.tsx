import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

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
      <Card className="group h-full overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 bg-card">
        {post.cover_image ? (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="aspect-video relative bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-6xl font-bold text-muted-foreground/10">A</span>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {post.author_name}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
            )}
          </div>
          <CardTitle className="text-xl group-hover:text-[#ffb81b] transition-colors duration-200">
            {post.title}
          </CardTitle>
        </CardHeader>
        {post.excerpt && (
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {post.excerpt}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
