import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// "middleware" yerine "proxy" olarak dışa aktarılıyor
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Request üzerindeki çerezleri güncelle
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          
          // 2. Yanıt nesnesini güncellenmiş request ile tazele
          supabaseResponse = NextResponse.next({
            request,
          });

          // 3. Tarayıcıya gönderilecek Set-Cookie başlıklarını ekle
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';

  const isPrivateProfileRoute = pathname === '/profil';
  const isAdminRoute = pathname.startsWith('/admin');

  // 1. KONTROL: Giriş yapmamış kullanıcı kalkanı
  if (!user && (isPrivateProfileRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    const redirectResponse = NextResponse.redirect(url);
    
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // 2. KONTROL: Admin Kalkanı
  if (user && isAdminRoute) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (error || !profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      const redirectResponse = NextResponse.redirect(url);
      
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};