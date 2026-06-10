import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Giriş tamamlandıktan sonra nereye gidecek? (Varsayılan: Ana Sayfa)
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // İŞTE DÜZELTTİĞİMİZ YER: await ekledik!
    const cookieStore = await cookies(); 
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options }); // delete yerine boş set kullanmak daha güvenlidir
          },
        },
      }
    );

    // Kodu güvenli bir Session'a çevir ve çerezlere yaz
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // İşlem başarısız olursa ana sayfaya at
  return NextResponse.redirect(`${origin}/`);
}