import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
})

export async function proxy(request: NextRequest) {
  const defaultLocale = request.cookies.get('NEXT_LOCALE')?.value || 'ar'

  if (request.nextUrl.pathname === '/') {
    if (request.nextUrl.searchParams.has('code') || request.nextUrl.searchParams.has('token')) {
      return NextResponse.redirect(new URL(`/${defaultLocale}/auth/callback${request.nextUrl.search}`, request.url))
    }
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  const intlResponse = intlMiddleware(request)

  const response = NextResponse.next({
    request: { headers: intlResponse.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getSession()
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
