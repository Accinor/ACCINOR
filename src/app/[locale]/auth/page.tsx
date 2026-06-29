"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const MOROCCAN_REGIONS = [
  "Tanger-Tétouan-Al Hoceïma", "Oriental", "Fès-Meknès",
  "Rabat-Salé-Kénitra", "Béni Mellal-Khénifra", "Casablanca-Settat",
  "Marrakech-Safi", "Drâa-Tafilalet", "Souss-Massa",
  "Guelmim-Oued Noun", "Laâyoune-Sakia El Hamra", "Dakhla-Oued Ed-Dahab",
]

type AuthMode = "sign-in" | "register"

export default function AuthPage() {
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const isRtl = locale === "ar"
  const supabase = createClient()

  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showSiPassword, setShowSiPassword] = useState(false)

  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")
  const [city, setCity] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) router.replace(`/${locale}`)
    })
  }, [])

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email, password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    await fetch("/api/auth/sync-profile", { method: "POST" })
    router.push(`/${locale}`)
    router.refresh()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regName } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    await fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: regName, phone, region, city }),
    }).catch(() => {})

    setSuccess("Account created! Check your email to confirm.")
    setLoading(false)
    setTimeout(() => { setMode("sign-in"); setSuccess("") }, 4000)
  }

  async function handleGoogleAuth() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/${locale}/auth/callback` },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  function switchMode(m: AuthMode) {
    setMode(m); setError(""); setSuccess("")
  }

  const iconPos = isRtl ? "right-3" : "left-3"
  const padIcon = isRtl ? "pr-10" : "pl-10"

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <Link href={`/${locale}`} className="mb-8">
            <img src="/images/logo.png" alt="ACCINOR" className="h-14 w-auto" />
          </Link>

          <div className="w-full rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex rounded-xl bg-muted p-1 mb-6" dir="ltr">
              <button onClick={() => switchMode("sign-in")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === "sign-in" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>Sign In</button>
              <button onClick={() => switchMode("register")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>Create Account</button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
            )}
            {success && (
              <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">{success}</div>
            )}

            {mode === "sign-in" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                  <div className={`relative`}>
                    <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition`}
                      placeholder="you@example.com" required />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition">Forgot password?</button>
                  </div>
                  <div className={`relative`}>
                    <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input id="password" type={showSiPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition`}
                      placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowSiPassword(!showSiPassword)}
                      className={`absolute ${isRtl ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`} tabIndex={-1}>
                      {showSiPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#050a30]/30 border-t-[#050a30] rounded-full animate-spin" />
                  ) : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-name" className="block text-sm font-medium mb-1.5">Full Name</label>
                    <div className="relative">
                      <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input id="reg-name" type="text" value={regName} onChange={e => setRegName(e.target.value)}
                        className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition`}
                        placeholder="John Doe" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium mb-1.5">Email</label>
                    <div className="relative">
                      <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input id="reg-email" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition`}
                        placeholder="you@example.com" required />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input id="reg-password" type={showRegPassword ? "text" : "password"} value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition`}
                      placeholder="Min. 6 characters" minLength={6} required />
                    <button type="button" onClick={() => setShowRegPassword(!showRegPassword)}
                      className={`absolute ${isRtl ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`} tabIndex={-1}>
                      {showRegPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-medium mb-1.5">Phone</label>
                    <div className="relative">
                      <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input id="reg-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition`}
                        placeholder="+212 6XX XX XX XX" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-region" className="block text-sm font-medium mb-1.5">Region</label>
                    <div className="relative">
                      <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <select id="reg-region" value={region} onChange={e => setRegion(e.target.value)}
                        className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition appearance-none`} required>
                        <option value="">Select a region</option>
                        {MOROCCAN_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-city" className="block text-sm font-medium mb-1.5">City</label>
                  <div className="relative">
                    <svg className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <input id="reg-city" type="text" value={city} onChange={e => setCity(e.target.value)}
                      className={`w-full rounded-lg border border-input bg-background py-2.5 ${padIcon} pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition`}
                      placeholder="Oujda" required />
                  </div>
                </div>

                <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer pt-1">
                  <input type="checkbox" className="mt-0.5 rounded border-border accent-[#ffb81b]" required />
                  <span>I agree to the <span className="text-foreground underline underline-offset-2">Terms & Privacy Policy</span></span>
                </label>

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#050a30]/30 border-t-[#050a30] rounded-full animate-spin" />
                  ) : "Create Account"}
                </button>
              </form>
            )}

            <div className="mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground uppercase">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button onClick={handleGoogleAuth} disabled={loading}
              className="mt-3 w-full flex items-center justify-center gap-2.5 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition disabled:opacity-50">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {mode === "sign-in" ? "Sign in with Google" : "Create account with Google"}
            </button>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "sign-in" ? (
                <>Don't have an account? <button onClick={() => switchMode("register")} className="text-[#ffb81b] hover:underline font-medium">Create one</button></>
              ) : (
                <>Already have an account? <button onClick={() => switchMode("sign-in")} className="text-[#ffb81b] hover:underline font-medium">Sign in</button></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
