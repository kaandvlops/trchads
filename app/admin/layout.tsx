"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 1. ZIRH: Eğer auth sistemi hala yükleniyorsa hiçbir şey yapma, bekle.
    if (loading) return;

    // 2. ZIRH: Kullanıcı hiç giriş yapmamışsa anasayfaya şutla.
    if (!user) {
      router.push("/");
      return;
    }

    // 3. ZIRH (KRİTİK): Kullanıcı var ama profil verisi (is_admin) henüz gelmediyse bekle!
    // Seni kapı dışarı eden hatanın kaynağı burasıydı.
    if (user && !profile) return;

    // 4. ZIRH: Profil geldi ve is_admin false ise anasayfaya şutla.
    if (profile && !profile.is_admin) {
      router.push("/");
    }
  }, [user, profile, loading, router]);

  // Auth durumu netleşene veya profil verisi gelene kadar bekleme ekranını göster
  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50 tracking-[0.3em] uppercase text-xs">
        Yönetici Kimliği Doğrulanıyor...
      </div>
    );
  }

  // Eğer kullanıcı yoksa veya admin değilse HTML render etme (Görsel flash riskini sıfırlar)
  if (!user || !profile?.is_admin) {
    return null; 
  }

  // Her şey tamamsa Admin sayfasını (children) göster
  return <>{children}</>;
}