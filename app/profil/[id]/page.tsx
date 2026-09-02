"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UserProfile, UserWarning } from "@/types";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";

// ============================================================================
// MİNİ BİLEŞENLER
// ============================================================================

const StatBlock = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col gap-3">
    <div className="text-xs text-white/30 uppercase tracking-[0.4em] font-mono">{label}</div>
    <div className="text-4xl md:text-5xl font-extralight text-white">{value}</div>
  </div>
);

const SocialButton = ({ url, label }: { url: string; label: string }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer nofollow" 
    className="flex items-center gap-3 bg-black border border-white/10 hover:border-white/30 text-white/70 hover:text-white px-6 py-3 rounded-none transition-all text-xs font-mono tracking-widest uppercase"
  >
    <span className="text-white/40">{label}</span>
  </a>
);

const WarningRow = ({ warn }: { warn: UserWarning & { warningCount: number } }) => (
  <div className="bg-black border border-white/5 p-6 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
      <span className="border border-white/10 text-white/50 text-xs font-mono px-3 py-1.5 rounded-none uppercase tracking-[0.3em] shrink-0 w-fit mx-auto md:mx-0">
        {warn.warningCount}. Uyarı
      </span>
      <span className="text-white/70 text-base font-light text-center md:text-left">
        İhlal Gerekçesi: <strong className="text-white font-normal">{warn.reason}</strong>
      </span>
    </div>
    <div className="text-center sm:text-right flex flex-col font-mono text-xs text-white/30 shrink-0 gap-1 mt-4 sm:mt-0">
      <span>Yetkili: {warn.admin_user?.full_name || "Yönetici"}</span>
      <span>{new Date(warn.created_at).toLocaleDateString('tr-TR')}</span>
    </div>
  </div>
);

// ============================================================================
// ANA SAYFA BİLEŞENİ
// ============================================================================

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const targetUserId = params.id as string;

  const { user, profile: currentAuthProfile } = useAuth();
  const isOwnProfile = user?.id === targetUserId;
  const isAdmin = currentAuthProfile?.is_admin;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [warnings, setWarnings] = useState<UserWarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndWarnings = async () => {
      if (!targetUserId) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetUserId)
        .maybeSingle();
        
      if (profileData) {
        setProfile(profileData as UserProfile);

        // GÜVENLİK: Sabıka kaydı ve yetkili adları sadece profilin sahibine ve adminlere çekilir
        if (isOwnProfile || isAdmin) {
          const { data: warningsData } = await supabase
            .from("user_warnings")
            .select(`*, admin_user:profiles!admin_id(full_name)`)
            .eq("user_id", targetUserId)
            .order("created_at", { ascending: false });
            
          if (warningsData) {
            setWarnings(warningsData as unknown as UserWarning[]);
          }
        }
      }
      setLoading(false);
    };

    fetchProfileAndWarnings();
  }, [targetUserId, isOwnProfile, isAdmin]);

  const warningsWithCounts = useMemo(() => {
    return [...warnings].reverse().map((warn, index) => ({
      ...warn,
      warningCount: index + 1
    })).reverse();
  }, [warnings]);

  if (loading) return <Loader text="Kullanıcı Verileri Çekiliyor..." />;
  
  if (!profile || (profile as UserProfile & { is_deleted?: boolean }).is_deleted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="text-white/40 font-mono tracking-widest uppercase text-sm">
          {profile?.is_deleted ? "Bu Hesap Kullanıcı Tarafından Kapatılmıştır." : "Kullanıcı Bulunamadı."}
        </div>
        <button onClick={() => router.back()} className="text-xs font-mono text-white/50 border border-white/10 px-6 py-3 hover:bg-white/5 hover:text-white transition-all uppercase tracking-[0.3em]">
          ← Geri Dön
        </button>
      </div>
    );
  }

  const isBanned = profile.banned_until ? new Date(profile.banned_until) > new Date() : false;
  const avatarUrl = profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.full_name)}&backgroundColor=050505&textColor=ffffff`;

  return (
    <div className="w-full bg-black min-h-screen text-[#EAEAEA] font-sans selection:bg-white selection:text-black">
      <main className="relative max-w-6xl mx-auto p-6 py-24 flex flex-col items-center justify-center">

        {/* 1. UZAKLAŞTIRMA BİLDİRİMİ */}
        {isBanned && (
          <div className="w-full max-w-4xl bg-black border border-red-500/30 p-8 md:p-10 mb-8 flex flex-col items-center justify-center text-center">
            <span className="text-xs md:text-sm font-mono uppercase tracking-[0.4em] text-red-500 mb-4">Bu Hesap Uzaklaştırıldı</span>
            <p className="text-base font-light tracking-wide text-red-200/80 leading-relaxed">
              Bu kullanıcı topluluk kurallarını ihlal ettiği gerekçesiyle <strong className="text-red-400 font-mono">{new Date(profile.banned_until!).toLocaleString('tr-TR')}</strong> tarihine kadar sistemden uzaklaştırılmıştır.
            </p>
          </div>
        )}

        {/* 2. ÜST MENÜ */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-12">
          <button onClick={() => router.back()} className="text-xs font-mono text-white/50 uppercase tracking-[0.3em] hover:text-white transition-colors border border-transparent hover:border-white/10 bg-transparent px-0 py-2">
            ← Geri Dön
          </button>
          <span className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono">Kullanıcı Dosyası</span>
        </div>

        {/* 3. ANA KART */}
        <div className="w-full max-w-4xl bg-transparent border border-white/10 p-10 md:p-16 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center md:items-start">
            
            <div className="shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt={`${profile.full_name} Avatarı`} className="w-40 h-40 md:w-48 md:h-48 object-cover border border-white/10 transition-all duration-700" />
            </div>

            <div className="flex-1 flex flex-col w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 w-full">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full">
                  
                  <div className="flex flex-col gap-4">
                    <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-widest uppercase break-all">
                      {profile.full_name}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 font-mono mt-2 md:mt-0">
                      {profile.is_verified && <span className="border border-white/20 text-white/60 text-xs uppercase tracking-[0.3em] px-3 py-1">Onaylı</span>}
                      {profile.is_admin && <span className="border border-white/20 text-white/60 text-xs uppercase tracking-[0.3em] px-3 py-1">Yönetici</span>}
                    </div>
                  </div>

                  {isOwnProfile && (
                    <Link href="/profil" className="mt-6 md:mt-0 md:ml-auto text-xs font-mono uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-6 py-3 shrink-0 bg-black hover:bg-white/5">
                      Profili Düzenle
                    </Link>
                  )}
                </div>
              </div>
              
              <p className="text-base md:text-lg font-light text-white/60 mb-10 max-w-xl leading-relaxed break-words mx-auto md:mx-0">
                {profile.bio || "Bu kullanıcı henüz kendinden bahsetmemiş."}
              </p>

              {/* 4. SOSYAL MEDYA LİNKLERİ */}
              {(profile.instagram_url || profile.tiktok_url || profile.spotify_url) && (
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
                  {profile.instagram_url && <SocialButton url={profile.instagram_url} label="IG" />}
                  {profile.tiktok_url && <SocialButton url={profile.tiktok_url} label="TT" />}
                  {profile.spotify_url && <SocialButton url={profile.spotify_url} label="SP" />}
                </div>
              )}

              {/* 5. İSTATİSTİKLER */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-10 md:gap-16 pt-10 border-t border-white/5">
                <StatBlock label="Sistem Puanı" value={profile.score} />
                <div className="w-[1px] h-12 bg-white/10 hidden sm:block"></div>
                <StatBlock label="Etkileşim" value={profile.total_comments} />
                <div className="w-[1px] h-12 bg-white/10 hidden sm:block"></div>
                <StatBlock label="Açılan Konu" value={profile.total_topics} />
              </div>

              {/* 6. GİZLİ SABIKA KAYDI: Yalnızca kullanıcının kendisi veya Yönetici görebilir */}
              {(isOwnProfile || isAdmin) && warningsWithCounts.length > 0 && (
                <div className="mt-16 w-full border-t border-white/5 pt-10 text-left">
                  <h3 className="text-red-500 font-mono text-xs uppercase tracking-[0.4em] mb-8 flex items-center gap-3 justify-center md:justify-start">
                    <span className="w-2 h-2 bg-red-500 animate-pulse"></span> Kullanıcı Sabıka Dosyası (Gizli Moderasyon)
                  </h3>
                  <div className="flex flex-col gap-4">
                    {warningsWithCounts.map(w => <WarningRow key={w.id} warn={w} />)}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}