"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Lock, EyeOff, Eye } from "lucide-react"
import { useState } from "react"

export default function SignInPage() {
  const t = useTranslations("auth.sign_in")
  const common = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate with Supabase Auth
    console.log("Sign in", { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Link href={`/${locale}`} className="mb-8">
            <Image
              src="/images/logo.png"
              alt={common("site_name")}
              width={200}
              height={65}
              className="h-14 w-auto"
            />
          </Link>

          <div className="w-full rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("subtitle")}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border accent-[#ffb81b]" />
                  {t("remember")}
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-[#ffb81b] hover:underline"
                >
                  {t("forgot")}
                </Link>
              </div>

              <Button type="submit" className="w-full bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold">
                {t("button")}
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground uppercase">{t("or")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-4 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition">
                <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition">
                <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.1.82-.26.82-.58v-2.23c-3.34.72-4.04-1.42-4.04-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.1-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.92 0-1.3.47-2.37 1.24-3.21-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0112 5.8c1.02.01 2.05.14 3.01.41C17.3 4.61 18.3 4.93 18.3 4.93c.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.21 0 4.6-2.8 5.62-5.47 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>
                    GitHub
                  </button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("no_account")}{" "}
              <Link
                href={`/${locale}/auth/create-account`}
                className="font-medium text-[#ffb81b] hover:underline"
              >
                {t("create_one")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
