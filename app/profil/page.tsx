"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth"; 
import { UserWarning } from "@/types";

// ============================================================================
// 1. GÜVENLİ TİPLER VE YARDIMCI FONKSİYONLAR
// ============================================================================

interface SupabaseWarningResponse {
  id: string;
  user_id: string;
  admin_id: string;
  reason: string;
  created_at: string;
  admin_user: { full_name: string } | null;
}

const isValidSocialLink = (url: string, platform: 'instagram' | 'tiktok' | 'spotify') => {
  if (!url.trim()) return true;
  if (url.length > 200) return false;
  try {
    const urlObject = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = urlObject.hostname.toLowerCase();
    
    if (platform === 'instagram' && !(host === 'instagram.com' || host.endsWith('.instagram.com'))) return false;
    if (platform === 'tiktok' && !(host === 'tiktok.com' || host.endsWith('.tiktok.com'))) return false;
    if (platform === 'spotify' && !(host === 'spotify.com' || host.endsWith('.spotify.com') || host.includes('googleusercontent.com'))) return false;
    
    return true;
  } catch { 
    return false; 
  }
};

const isValidAvatarUrl = (url: string) => {
  if (!url.trim()) return true; 
  if (url.length > 255) return false;
  
  try {
    const urlObject = new URL(url);
    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') return false;

    const pathname = urlObject.pathname.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    if (urlObject.hostname.includes('dicebear.com') || urlObject.hostname.includes('ui-avatars.com')) return true;

    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    if (!hasValidExtension) return false;

    return true;
  } catch {
    return false;
  }
};

const formatUrl = (url: string) => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;
  return trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
};

// ============================================================================
// 2. MİNİ BİLEŞENLER
// ============================================================================

const StatBlock = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col gap-3">
    <div className="dergi-kicker mb-0">{label}</div>
    <div className="text-4xl md:text-5xl font-extralight text-white">{value}</div>
  </div>
);

const SocialButton = ({ url, prefix, label }: { url: string; prefix: string; label: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="dergi-btn py-3 px-6 flex items-center gap-3 bg-transparent">
    <span className="text-white/40">{prefix}</span> {label}
  </a>
);

const WarningRow = ({ w, index, total }: { w: UserWarning; index: number; total: number }) => (
  <div className="bg-transparent border dergi-border p-6 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
      <span className="border dergi-border dergi-kicker px-3 py-1.5 mb-0 shrink-0 w-fit">
        {total - index}. Uyarı
      </span>
      <span className="dergi-body">İhlal: <strong className="text-white font-normal">{w.reason}</strong></span>
    </div>
    <div className="text-left sm:text-right flex flex-col dergi-kicker shrink-0 gap-1 mb-0">
      <span>Yetkili: {w.admin_user?.full_name || "Yönetici"}</span>
      <span>{new Date(w.created_at).toLocaleDateString('tr-TR')}</span>
    </div>
  </div>
);

// ============================================================================
// 3. ANA SAYFA BİLEŞENİ
// ============================================================================

export default function ProfilSayfasi() {
  const { profile, setProfile, isBanned, loading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [warnings, setWarnings] = useState<UserWarning[]>([]);

  // SİLME İŞLEMİ İÇİN YENİ STATE'LER
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: "", bio: "", avatar_url: "", instagram_url: "", tiktok_url: "", spotify_url: "",
  });

  useEffect(() => {
    if (profile) {
      const fetchWarnings = async () => {
        const { data, error } = await supabase
          .from("user_warnings")
          .select("*, admin_user:profiles!admin_id(full_name)")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(10); 
          
        if (!error && data) {
          const mappedWarnings: UserWarning[] = (data as SupabaseWarningResponse[]).map(w => ({
            id: w.id,
            user_id: w.user_id,
            admin_id: w.admin_id,
            reason: w.reason,
            created_at: w.created_at,
            admin_user: w.admin_user ? { full_name: w.admin_user.full_name } : undefined
          }));
          setWarnings(mappedWarnings);
        }
      };
      fetchWarnings();
    }
  }, [profile]);

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "", 
        bio: profile.bio || "", 
        avatar_url: profile.avatar_url || "",
        instagram_url: profile.instagram_url || "", 
        tiktok_url: profile.tiktok_url || "", 
        spotify_url: profile.spotify_url || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!profile) return;
    setErrorMsg("");

    const trimmedName = editForm.full_name.trim();
    if (!trimmedName) return setErrorMsg("İsim alanı boş bırakılamaz.");
    if (trimmedName.length > 50) return setErrorMsg("İsim en fazla 50 karakter olabilir.");
    if (editForm.bio && editForm.bio.trim().length > 500) return setErrorMsg("Biyografi en fazla 500 karakter olabilir.");
    
    const formattedAvatar = editForm.avatar_url.trim() ? formatUrl(editForm.avatar_url) : null;
    if (formattedAvatar && !isValidAvatarUrl(formattedAvatar)) {
      return setErrorMsg("Geçersiz Profil Fotoğrafı URL'si. Sadece geçerli bir resim linki girilmelidir (.jpg, .png, .gif vb).");
    }

    if (!isValidSocialLink(editForm.instagram_url, 'instagram')) return setErrorMsg("Geçersiz Instagram URL'si.");
    if (!isValidSocialLink(editForm.tiktok_url, 'tiktok')) return setErrorMsg("Geçersiz TikTok URL'si.");
    if (!isValidSocialLink(editForm.spotify_url, 'spotify')) return setErrorMsg("Geçersiz Spotify URL'si.");

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedName, 
          bio: editForm.bio.trim(), 
          avatar_url: formattedAvatar, 
          instagram_url: formatUrl(editForm.instagram_url), 
          tiktok_url: formatUrl(editForm.tiktok_url), 
          spotify_url: formatUrl(editForm.spotify_url),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({
        ...profile, 
        full_name: trimmedName, 
        bio: editForm.bio.trim(), 
        avatar_url: formattedAvatar,
        instagram_url: formatUrl(editForm.instagram_url), 
        tiktok_url: formatUrl(editForm.tiktok_url), 
        spotify_url: formatUrl(editForm.spotify_url),
      });
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(`Veritabanı Reddi: ${error.message}`);
      } else {
        setErrorMsg("Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // YENİ: YASAL UYUMLU PROFİL SİLME (SOFT DELETE) FONKSİYONU
  const handleDeleteAccount = async () => {
    if (!profile) return;
    setIsDeleting(true);
    setErrorMsg("");

    try {
      // 1. Profil tablosunu anonimleştiriyoruz (IP ve id baki kalıyor)
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: "Silinmiş Kullanıcı",
          bio: null,
          avatar_url: null,
          instagram_url: null,
          tiktok_url: null,
          spotify_url: null,
          is_deleted: true, // Supabase'de bu sütunu eklediğinden emin ol!
          deleted_at: new Date().toISOString()
        })
        .eq("id", profile.id);

      if (error) throw error;

      // 2. Auth oturumunu sonlandır ve ana sayfaya at
      await supabase.auth.signOut();
      window.location.href = "/"; 
    } catch (error: unknown) {
      setErrorMsg("Hesap silinirken sunucu kaynaklı bir hata oluştu.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dergi-kicker">Profil Yükleniyor...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-red-400 font-mono tracking-widest uppercase text-sm">Erişim Reddedildi. Lütfen Giriş Yapın.</div>;

  const avatarUrl = profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}&backgroundColor=050505&textColor=ffffff`;

  return (
    <div className="w-full">
      <main className="relative max-w-6xl mx-auto p-6 py-24 flex flex-col items-center justify-center">

        {isBanned && (
          <div className="w-full max-w-4xl bg-[#050505] border border-red-500/30 rounded-none p-8 md:p-10 mb-8 flex flex-col items-center justify-center text-center">
            <span className="text-xs md:text-sm font-mono uppercase tracking-[0.4em] text-red-500 mb-4">Hesap Uzaklaştırıldı</span>
            <p className="dergi-body text-red-200/80">
              Sistem kurallarını ihlal ettiğiniz gerekçesiyle hesabınız <strong className="text-red-400 font-mono">{new Date(profile.banned_until!).toLocaleString('tr-TR')}</strong> tarihine kadar dondurulmuştur. Değerlendirme yapamaz ve foruma içerik gönderemezsiniz.
            </p>
          </div>
        )}

        <div className="w-full max-w-4xl flex items-center gap-6 mb-12">
          <span className="dergi-kicker mb-0">Kullanıcı Dosyası</span>
          <span className="flex-1 h-[1px] bg-white/10"></span>
        </div>

        <div className="w-full max-w-4xl bg-transparent border dergi-border p-10 md:p-16 rounded-none relative overflow-hidden group">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
            
            <div className="shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt={`${profile.full_name} Avatarı`} className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-none border dergi-border scale hover:grayscale-0 transition-all duration-700" />
            </div>

            <div className="flex-1 flex flex-col w-full">
              {!isEditing ? (
                <>
                  <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-4">
                      <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-widest uppercase break-all">
                        {profile.full_name}
                      </h1>
                      <div className="flex flex-wrap gap-3">
                        {profile.is_verified && <span className="border dergi-border dergi-kicker px-3 py-1 mb-0">Onaylı</span>}
                        {profile.is_admin && <span className="border dergi-border dergi-kicker px-3 py-1 mb-0">Yönetici</span>}
                      </div>
                    </div>
                    <button onClick={handleEditClick} className="dergi-btn py-3 px-6 bg-transparent shrink-0">
                      Profili Düzenle
                    </button>
                  </div>
                  
                  <p className="dergi-body text-base md:text-lg mb-10 max-w-xl break-words">
                    {profile.bio || "Sisteme henüz bir biyografi verisi girilmemiş."}
                  </p>

                  {(profile.instagram_url || profile.tiktok_url || profile.spotify_url) && (
                    <div className="flex flex-wrap gap-4 mb-10">
                      {profile.instagram_url && <SocialButton url={profile.instagram_url} prefix="IG" label="Instagram" />}
                      {profile.tiktok_url && <SocialButton url={profile.tiktok_url} prefix="TT" label="TikTok" />}
                      {profile.spotify_url && <SocialButton url={profile.spotify_url} prefix="SP" label="Spotify" />}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-6 mb-10 w-full max-w-2xl">
                  {errorMsg && <div className="bg-[#050505] border border-red-500/30 text-red-400 p-5 rounded-none text-xs font-mono tracking-[0.2em] uppercase">{errorMsg}</div>}
                  
                  <div className="flex flex-col gap-3">
                    <label htmlFor="full_name" className="dergi-kicker mb-0">İsim Soyisim</label>
                    <input id="full_name" type="text" maxLength={50} value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} className="bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label htmlFor="bio" className="dergi-kicker mb-0">Biyografi</label>
                    <textarea id="bio" maxLength={500} value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} rows={4} className="bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 resize-none transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="instagram_url" className="dergi-kicker mb-0">Instagram Bağlantısı</label>
                    <input id="instagram_url" type="text" maxLength={200} value={editForm.instagram_url} onChange={(e) => setEditForm({...editForm, instagram_url: e.target.value})} className="bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label htmlFor="tiktok_url" className="dergi-kicker mb-0">TikTok Bağlantısı</label>
                    <input id="tiktok_url" type="text" maxLength={200} value={editForm.tiktok_url} onChange={(e) => setEditForm({...editForm, tiktok_url: e.target.value})} className="bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label htmlFor="spotify_url" className="dergi-kicker mb-0">Spotify Favori Liste / Profil</label>
                    <input id="spotify_url" type="text" maxLength={200} value={editForm.spotify_url} onChange={(e) => setEditForm({...editForm, spotify_url: e.target.value})} className="bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="avatar_url" className="dergi-kicker mb-0">Profil Fotoğrafı URL (Opsiyonel)</label>
                    <input id="avatar_url" type="text" maxLength={255} value={editForm.avatar_url} onChange={(e) => setEditForm({...editForm, avatar_url: e.target.value})} placeholder="Örn: https://site.com/resim.jpg" className="bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onClick={handleSave} disabled={isSaving} className="dergi-btn flex-1 bg-white text-black hover:bg-white/90 font-bold border-white disabled:opacity-50">
                      Kaydet
                    </button>
                    <button onClick={() => { setIsEditing(false); setErrorMsg(""); }} disabled={isSaving} className="dergi-btn flex-1 bg-transparent disabled:opacity-50">
                      İptal
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-10 md:gap-16 pt-10 border-t dergi-border">
                <StatBlock label="Sistem Puanı" value={profile.score} />
                <div className="w-[1px] h-12 bg-white/10 hidden sm:block"></div>
                <StatBlock label="Etkileşim" value={profile.total_comments} />
                <div className="w-[1px] h-12 bg-white/10 hidden sm:block"></div>
                <StatBlock label="Açılan Konu" value={profile.total_topics} />
              </div>

              {/* YENİ: TEHLİKELİ BÖLGE (HESAP SİLME) */}
              <div className="mt-16 w-full border-t border-red-500/20 pt-10">
                <h3 className="text-red-500 font-mono text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                  Tehlikeli Bölge
                </h3>
                
                {!showDeleteConfirm ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)} 
                    className="dergi-btn py-3 px-6 bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors text-sm"
                  >
                    Hesabımı Kalıcı Olarak Sil
                  </button>
                ) : (
                  <div className="bg-[#050505] border border-red-500/30 p-6 md:p-8 flex flex-col gap-6">
                    <p className="dergi-body text-red-200/80 text-sm">
                      Hesabınızı silmek istediğinize emin misiniz? Profiliniz sistemden anonimleştirilerek kaldırılacaktır. Ancak yasal zorunluluklar gereği IP kayıtlarınız veritabanında loglanmaya devam eder. Bu işlem geri alınamaz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={handleDeleteAccount} 
                        disabled={isDeleting}
                        className="dergi-btn flex-1 bg-red-900/50 text-red-200 border-red-500/50 hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        {isDeleting ? "Siliniyor..." : "Evet, Hesabımı Sil"}
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(false)} 
                        disabled={isDeleting}
                        className="dergi-btn flex-1 bg-transparent border-white/20 hover:border-white/50 disabled:opacity-50"
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {warnings.length > 0 && (
                <div className="mt-16 w-full border-t dergi-border pt-10">
                  <h3 className="text-red-500 font-mono text-xs uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-none bg-red-500 animate-pulse"></span> Sistem Uyarıları (Sabıka Kaydı)
                  </h3>
                  <div className="flex flex-col gap-4">
                    {warnings.map((w, index) => (
                      <WarningRow key={w.id} w={w} index={index} total={warnings.length} />
                    ))}
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