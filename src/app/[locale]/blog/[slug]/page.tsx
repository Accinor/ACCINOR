import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block"
        >
          ← {t("title")}
        </Link>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
          <span>{post.author_name}</span>
          {post.published_at && (
            <>
              <span>•</span>
              <time>{new Date(post.published_at).toLocaleDateString()}</time>
            </>
          )}
        </div>

        {post.cover_image && (
          <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
            <img
              src={post.cover_image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {post.content.split("\n").map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  )
}
