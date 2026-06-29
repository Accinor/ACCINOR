"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AuthPage() {
  const t = useTranslations("auth")
  const common = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next") || `/${locale}`
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login"

  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const isRtl = locale === "ar"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const supabase = createClient()
      if (!supabase) throw new Error("Client not available")

      if (mode === "register") {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        })

        if (signUpError) throw signUpError

        // Sync profile for the new user
        try { await fetch("/api/auth/sync-profile", { method: "POST" }) } catch {}

        // If email confirmation is disabled, redirect; otherwise show success
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push(nextUrl)
        } else {
          setSuccess(t("create_account.success"))
          setMode("login")
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) {
          if (authError.message.includes("Invalid login credentials")) {
            throw new Error(t("sign_in.error"))
          }
          if (authError.message.includes("Email not confirmed")) {
            throw new Error(t("sign_in.not_confirmed"))
          }
          throw authError
        }

        try { await fetch("/api/auth/sync-profile", { method: "POST" }) } catch {}

        router.push(nextUrl)
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 overflow-hidden relative">
      {/* Soft Backdrop Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[600px] h-[460px] bg-gradient-to-tr from-[#ffb81b]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-[420px] h-[220px] bg-gradient-to-bl from-[#ffb81b]/10 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <Link href={`/${locale}`} className="flex justify-center mb-8">
          <img
            src="/images/logo.png"
            alt={common("site_name")}
            className="h-14 w-auto brightness-0 invert opacity-95"
          />
        </Link>

        <form
          onSubmit={handleSubmit}
          className="w-full text-center bg-white/6 border border-white/10 rounded-2xl px-8 pb-8 pt-10"
        >
          <h1 className="text-white text-3xl font-medium">
            {mode === "login" ? t("sign_in.title") : t("create_account.title")}
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            {mode === "login" ? t("sign_in.subtitle") : t("create_account.subtitle")}
          </p>

          {error && (
            <div className="mt-4 px-4 py-2.5 rounded-full bg-red-500/15 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 px-4 py-2.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          {mode === "register" && (
            <div className="flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-[#ffb81b]/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60 shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder={t("create_account.name")}
                className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none h-full pr-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className={`flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-[#ffb81b]/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ${mode === "register" ? "mt-4" : "mt-6"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60 shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder={t("sign_in.email")}
              className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none h-full pr-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-[#ffb81b]/60 h-12 rounded-full overflow-hidden pl-6 pr-3 gap-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60 shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder={t("sign_in.password")}
              className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none h-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {mode === "login" && (
            <div className="mt-4 text-left">
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-sm text-[#ffb81b] hover:underline"
              >
                {t("sign_in.forgot")}
              </Link>
            </div>
          )}

          {mode === "register" && (
            <label className="flex items-center gap-2 mt-4 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-white/5 accent-[#ffb81b]" required />
              <span>{t("create_account.terms")}</span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full h-11 rounded-full text-white bg-[#ffb81b] hover:bg-[#e5a318] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              mode === "login" ? t("sign_in.button") : t("create_account.button")
            )}
          </button>

          <p className="text-gray-400 text-sm mt-5 cursor-pointer" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess("") }}>
            {mode === "login" ? t("sign_in.no_account") : t("create_account.has_account")}
            <span className="text-[#ffb81b] hover:underline ml-1">
              {mode === "login" ? t("sign_in.create_one") : t("create_account.sign_in")}
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}
