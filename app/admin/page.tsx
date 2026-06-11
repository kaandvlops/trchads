"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { UserReport, UserWarning } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import PunishModal from "@/components/modals/PunishModal";

import AddCelebTab from "@/components/admin/AddCelebTab";
import AddCharacterTab from "@/components/admin/AddCharacterTab"; 
import ReportsTab from "@/components/admin/ReportsTab";
import WarningsTab from "@/components/admin/WarningsTab";

interface SupabaseWarningResponse {
  id: string;
  user_id: string;
  admin_id: string;
  reason: string;
  created_at: string;
  warned_user: { full_name: string; banned_until: string | null } | null;
  admin_user: { full_name: string } | null;
}

export default function AdminPaneli() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("add_celeb");

  const [warnings, setWarnings] = useState<UserWarning[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);

  const [punishModalOpen, setPunishModalOpen] = useState(false);
  const [userToPunish, setUserToPunish] = useState<{ id: string, name: string, reportId: string } | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    if (user && !profile) return;

    if (profile && !profile.is_admin) {
      router.push("/");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const { data: warnData, error: warnError } = await supabase
          .from("user_warnings")
          .select("*, warned_user:profiles!user_id(full_name, banned_until), admin_user:profiles!admin_id(full_name)")
          .order("created_at", { ascending: false });

        if (warnError) throw new Error(`Sabıka Tablosu Hatası: ${warnError.message}`);

        if (warnData) {
          const safeWarnings: UserWarning[] = (warnData as SupabaseWarningResponse[]).map(w => ({
            id: w.id,
            user_id: w.user_id,
            admin_id: w.admin_id,
            reason: w.reason,
            created_at: w.created_at,
            warned_user: w.warned_user ? { full_name: w.warned_user.full_name, banned_until: w.warned_user.banned_until } : undefined,
            admin_user: w.admin_user ? { full_name: w.admin_user.full_name } : undefined
          }));
          setWarnings(safeWarnings);
        }

        const { data: repData, error: repError } = await supabase
          .from("user_reports")
          .select(`
            *, 
            reporter:profiles!reporter_id(full_name), 
            reported_user:profiles!reported_user_id(full_name), 
            topic:forum_topics!topic_id(id, title, content), 
            forum_comment:forum_comments!forum_comment_id(id, content, topic_id), 
            celeb_comment:celebrity_comments!celeb_comment_id(id, content, celebrity_id),
            character_comment:character_comments!character_comment_id(id, content, character_id)
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (repError) throw new Error(`Şikayet Tablosu Hatası: ${repError.message}`);

        if (repData) {
          setReports(repData as UserReport[]);
        }

      } catch (err: any) {
        setDbError(err.message);
      } finally {
        setDataLoading(false);
      }
    };

    fetchAdminData();
  }, [user, profile, authLoading, router]);

  const handlePunishSubmit = async (reason: string, banDuration: string) => {
    if (!userToPunish || !user?.id) return;

    try {
      const parsedBanDays = parseInt(banDuration, 10);
      const finalBanDays = parsedBanDays === 999 ? 36500 : parsedBanDays; // 100 yıl = Kalıcı
      
      // 1. Sabıka Kaydı Ekleme
      const { data: insertedWarn, error: warnError } = await supabase.from("user_warnings").insert([{
        user_id: userToPunish.id,
        admin_id: user.id,
        reason: reason
      }]).select().single();

      if (warnError) throw new Error("Sabıka kaydı yazılamadı: " + warnError.message);

      // 2. Ceza İşlemi (Güvenli DB hesaplaması için sadece günü gönderiyoruz)
      if (finalBanDays > 0) {
        const { error: banError } = await supabase.rpc('admin_manage_ban', { 
            target_user_id: userToPunish.id, 
            ban_days: finalBanDays 
        });
        
        if (banError) throw new Error("Kullanıcının ban süresi işlenemedi: " + banError.message);
      }

      // 3. Şikayeti Kapat
      const { error: repError } = await supabase.from("user_reports").update({ status: "resolved" }).eq("id", userToPunish.reportId);
      if (repError) throw new Error("Cezalandırma başarılı ancak şikayet kapatılamadı. Lütfen manuel kapatın.");
      
      // UI State Güncellemesi (Sadece önyüzü anında güncellemek için tahmini tarih hesaplaması)
      let uiBannedUntil = null;
      if (finalBanDays > 0) {
        const banDate = new Date();
        banDate.setDate(banDate.getDate() + finalBanDays);
        uiBannedUntil = banDate.toISOString();
      }

      setReports(reports.filter(r => r.id !== userToPunish.reportId));
      
      if (insertedWarn) {
        const newWarningUI: UserWarning = {
          ...insertedWarn,
          warned_user: { full_name: userToPunish.name, banned_until: uiBannedUntil },
          admin_user: { full_name: profile?.full_name || "Yönetici" }
        };
        setWarnings([newWarningUI, ...warnings]);
      }

      setPunishModalOpen(false);
      setUserToPunish(null);
      alert("İşlem başarıyla tamamlandı. Sabıka kaydı eklendi!");
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("HATA: " + error.message);
      } else {
        alert("HATA: Beklenmeyen bir sorun oluştu.");
      }
    }
  };

  if (authLoading || dataLoading) return <Loader text="Sistem Taranıyor..." />;
  
  if (dbError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6">
        <div className="bg-[#050505] border border-red-500/30 text-red-400 p-8 max-w-2xl text-center">
          <h2 className="text-xl mb-4 font-mono uppercase tracking-widest border-b border-red-500/20 pb-4">Kritik Veritabanı Hatası</h2>
          <p className="font-mono text-sm leading-loose">{dbError}</p>
        </div>
      </div>
    );
  }

  if (!profile?.is_admin) return null;

  return (
    <div className="w-full">
      <main className="relative max-w-5xl mx-auto p-6 py-24">
        
        <PunishModal 
          isOpen={punishModalOpen}
          onClose={() => { setPunishModalOpen(false); setUserToPunish(null); }}
          onSubmit={handlePunishSubmit}
          targetName={userToPunish?.name}
        />

        <div className="mb-12 border-b dergi-border pb-8">
          <h1 className="dergi-title mb-4">
            Sistem Yöneticisi
          </h1>
          <p className="dergi-kicker mb-0">
            Merkezi veritabanı ve moderasyon kontrol paneli.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 mb-16 border-b dergi-border">
          <button 
            onClick={() => setActiveTab("add_celeb")} 
            className={`pb-4 dergi-kicker transition-all duration-300 border-b-2 mb-0 ${activeTab === "add_celeb" ? "text-yellow-400 border-yellow-400" : "text-white/40 border-transparent hover:text-yellow-300"}`}
          >
            Yeni Kayıt (Kişi)
          </button>

          <button 
            onClick={() => setActiveTab("add_character")} 
            className={`pb-4 dergi-kicker transition-all duration-300 border-b-2 mb-0 ${activeTab === "add_character" ? "text-indigo-400 border-indigo-400" : "text-white/40 border-transparent hover:text-indigo-300"}`}
          >
            Yeni Kayıt (Karakter)
          </button>
          
          <button 
            onClick={() => setActiveTab("reports")} 
            className={`pb-4 dergi-kicker transition-all duration-300 border-b-2 flex items-center gap-3 mb-0 ${activeTab === "reports" ? "text-white border-white" : "text-white/40 border-transparent hover:text-white/70"}`}
          >
            Şikayetler 
            {reports.length > 0 && (
              <span className="bg-white/10 text-white px-2 py-0.5 text-[10px] font-sans">
                {reports.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("warnings")} 
            className={`pb-4 dergi-kicker transition-all duration-300 border-b-2 mb-0 ${activeTab === "warnings" ? "text-white border-white" : "text-white/40 border-transparent hover:text-white/70"}`}
          >
            Sabıka Kayıtları
          </button>
        </div>

        <div className="w-full">
          {activeTab === "add_celeb" && <AddCelebTab />}
          {activeTab === "add_character" && <AddCharacterTab />}
          
          {activeTab === "reports" && (
            <ReportsTab 
              reports={reports} 
              setReports={setReports} 
              onPunishClick={(report) => {
                setUserToPunish({ id: report.reported_user_id, name: report.reported_user?.full_name || "Bilinmeyen", reportId: report.id });
                setPunishModalOpen(true);
              }} 
            />
          )}
          
          {activeTab === "warnings" && <WarningsTab warnings={warnings} setWarnings={setWarnings} />}
        </div>
        
      </main>
    </div>
  );
}