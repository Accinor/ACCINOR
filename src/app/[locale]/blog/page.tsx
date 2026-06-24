import { createClient } from "@/lib/supabase/server"
import { BlogCard } from "@/components/blog/blog-card"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("locale", locale)
    .order("published_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        {(posts?.length ?? 0) === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("notice")}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts?.map((post) => (
              <BlogCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
