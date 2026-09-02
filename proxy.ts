import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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
          // 1. Request üzerindeki çerezleri güncelle (Server component'lerin taze oturumu görmesi için)
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

  // ÖNEMLİ: getSession() yerine kesinlikle getUser() kullanılmalıdır
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';

  // DÜZELTME: Sadece kendi profil yönetim sayfası (/profil) korunur.
  // /profil/[id] (örn: /profil/usr_123) herkese açık profil sayfasıdır, ziyaretçilere açıktır.
  const isPrivateProfileRoute = pathname === '/profil';
  const isAdminRoute = pathname.startsWith('/admin');

  // 1. KONTROL: Giriş yapmamış kullanıcı kalkanı
  if (!user && (isPrivateProfileRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    const redirectResponse = NextResponse.redirect(url);
    
    // Çerezlerin (varsa temizleme/yenileme) kaybolmaması için kopyala
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // 2. KONTROL: Admin Kalkanı (Yetkisiz erişimi sunucu tarafında keser)
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
      
      // Oturum çerezlerini koruyarak yönlendir (çıkış yaptırmaması için)
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