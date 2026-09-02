import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/') || next.startsWith('//')) {
    next = '/';
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const redirectBase = isLocalEnv 
    ? origin 
    : (forwardedHost ? `https://${forwardedHost}` : origin);

  if (code) {
    const response = NextResponse.redirect(`${redirectBase}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookieHeader = request.headers.get('cookie') ?? '';
            const match = cookieHeader.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
            return match ? decodeURIComponent(match[3]) : undefined;
          },
          set(name: string, value: string, options: CookieOptions) {
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
      // ÖNEMLİ: Next.js router cache'ini baypas etmek için client'ı taze bir yüklemeye zorlar
      return response;
    }
  }

  return NextResponse.redirect(`${redirectBase}/`);
}