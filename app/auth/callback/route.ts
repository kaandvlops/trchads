import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/') || next.startsWith('//')) {
    next = '/';
  }

  // Reverse proxy / Vercel arkasında doğru host'u almak için
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const redirectBase = isLocalEnv 
    ? origin 
    : (forwardedHost ? `https://${forwardedHost}` : origin);

  if (code) {
    // 1. Yanıt nesnesini önceden oluştur
    const response = NextResponse.redirect(`${redirectBase}${next}`);

    // 2. Çerezleri doğrudan response nesnesine bağla
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // İstekten oku
            const cookieHeader = request.headers.get('cookie') ?? '';
            const match = cookieHeader.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
            return match ? decodeURIComponent(match[3]) : undefined;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Hem yanıta yaz hem request'e yansıt
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: '', ...options, maxAge: 0 });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response; // İçinde Set-Cookie başlıkları olan yönlendirme
    }
  }

  return NextResponse.redirect(`${redirectBase}/`);
}