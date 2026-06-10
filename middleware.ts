import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Token geçerliliğini doğrulayan güvenli çağrı
  const { data: { user } } = await supabase.auth.getUser()

  const isProfileRoute = request.nextUrl.pathname.startsWith('/profil')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // 1. KONTROL: Giriş yapmamış kullanıcılar korumalı sayfalara giremez
  if (!user && (isProfileRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. KONTROL: Gerçek Admin Kalkanı (Defense in Depth)
  if (user && isAdminRoute) {
    // ÇÖZÜM: Yanlış cebe (metadata) bakmak yerine, doğrudan veritabanındaki (profiles) gerçek is_admin değerini sorguluyoruz.
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    // Eğer veritabanı bu kişinin admin olmadığını söylerse veya kayıt bulamazsa, o zaman anasayfaya at.
    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}