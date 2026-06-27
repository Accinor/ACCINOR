"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Mail01, Lock01, EyeOff, Eye, ArrowRight } from "@untitledui/icons"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const t = useTranslations("auth.sign_in")
  const common = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next") || `/${locale}`
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) throw new Error("Client not available")
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error(t("error"))
        }
        if (authError.message.includes("Email not confirmed")) {
          throw new Error(t("not_confirmed"))
        }
        throw authError
      }
      router.push(nextUrl)
    } catch (err: any) {
      setError(err?.message || t("error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Link href={`/${locale}`} className="mb-8">
            <Image
              src="/images/logo.png"
              alt={common("site_name")}
              width={200}
              height={65}
              className="h-14 w-auto"
            />
          </Link>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">{t("title")}</CardTitle>
              <CardDescription>{t("subtitle")}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">{t("email")}</Label>
                  <div className="relative">
                    <Mail01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Lock01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="rounded border-border accent-[#ffb81b]" />
                    {t("remember")}
                  </label>
                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("forgot")}
                  </Link>
                </div>

                <Button type="submit" className="w-full" isLoading={loading} iconTrailing={ArrowRight}>
                  {t("button")}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center border-t gap-1">
              <span className="text-sm text-muted-foreground">{t("no_account")}</span>
              <Link
                href={`/${locale}/auth/create-account`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("create_one")}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
