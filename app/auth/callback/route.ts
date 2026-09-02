import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // 1. Open Redirect Koruması: Sadece site içi göreceli yollara izin ver
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    next = '/';
  }

  // 2. Güvenli Yönlendirme Tabanı (Host Header Poisoning Koruması)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const redirectBase = isLocalEnv 
    ? origin 
    : (forwardedHost ? `https://${forwardedHost}` : origin);

  // 3. Hedef URL'i doğrula
  let targetUrl: URL;
  try {
    targetUrl = new URL(next, redirectBase);
    // Dışarıya açık yönlendirmeyi kesin olarak engelle
    if (targetUrl.origin !== new URL(redirectBase).origin) {
      targetUrl = new URL('/', redirectBase);
    }
  } catch {
    targetUrl = new URL('/', redirectBase);
  }

  // 4. PKCE Kod Takası (Code Exchange)
  if (code) {
    const response = NextResponse.redirect(targetUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }

    console.error("Auth callback exchangeCodeForSession hatası:", error.message);
  }

  // Bir sorun olursa güvenli şekilde ana sayfaya yönlendir
  return NextResponse.redirect(new URL('/?error=auth_callback_failed', redirectBase));
}