"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Auth ve profil yüklemesi devam ediyorsa bekle
    if (loading) return;

    // Yükleme bittiğinde kullanıcı yoksa veya admin değilse ana sayfaya yönlendir
    // (router.replace geçmişe ekleme yapmaz, geri tuşu döngüsünü önler)
    if (!user || !profile?.is_admin) {
      router.replace("/");
    }
  }, [user, profile, loading, router]);

  // Auth durumu netleşene kadar bekleme ekranını göster
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50 tracking-[0.3em] uppercase text-xs">
        Yönetici Kimliği Doğrulanıyor...
      </div>
    );
  }

  // Kullanıcı yoksa veya admin değilse içeriği render etme
  if (!user || !profile?.is_admin) {
    return null; 
  }

  return <>{children}</>;
}