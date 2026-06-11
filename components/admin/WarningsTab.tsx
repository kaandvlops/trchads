"use client";

import { useMemo } from "react";
import Link from "next/link";
import { UserWarning } from "@/types";
import { supabase } from "@/lib/supabase";

interface WarningsTabProps {
  warnings: UserWarning[];
  setWarnings: React.Dispatch<React.SetStateAction<UserWarning[]>>;
}

export default function WarningsTab({ warnings, setWarnings }: WarningsTabProps) {

  const handleUnbanUser = async (userId: string, warningId: string) => {
    if (!window.confirm("Bu kullanıcının ban cezasını kaldırmak istediğinize emin misiniz?")) return;
    
    try {
      const { error } = await supabase.rpc('admin_unban_user', { 
        target_user_id: userId 
      });
      
      if (error) throw error;
      
      // BAN KALDIRMA UI YAMASI: 
      // Null vermek yerine, süresi dolmuş bir tarihi zorla state'e işleyerek 
      // React'in butonları ve rozetleri anında kaldırmasını garanti altına alıyoruz.
      const expiredDate = new Date("1970-01-01").toISOString();

      setWarnings(warnings.map(w => {
        if (w.user_id === userId && w.warned_user) {
          return { ...w, warned_user: { ...w.warned_user, banned_until: expiredDate } };
        }
        return w;
      }));
      
      alert("Kullanıcının ban cezası başarıyla kaldırıldı.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("İşlem sırasında hata oluştu: " + error.message);
      } else {
        alert("Beklenmeyen bir hata oluştu.");
      }
    }
  };

  const warningsWithCounts = useMemo(() => {
    const userCounts: Record<string, number> = {};
    const result = new Array(warnings.length);
    
    for (let i = warnings.length - 1; i >= 0; i--) {
      const warn = warnings[i];
      userCounts[warn.user_id] = (userCounts[warn.user_id] || 0) + 1;
      result[i] = { ...warn, warningCount: userCounts[warn.user_id] };
    }
    
    return result;
  }, [warnings]);

  if (warningsWithCounts.length === 0) {
    return (
      <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-12 text-center text-white/30 font-mono text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm">
        Sistemde henüz bir sabıka kaydı bulunmuyor.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {warningsWithCounts.map((warn) => {
        // UI kontrolü: Şu anki tarihten büyük mü? Değilse ban yoktur.
        const isBanned = warn.warned_user?.banned_until && new Date(warn.warned_user.banned_until) > new Date();
        
        return (
          <div key={warn.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.03] transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href={`/profil/${warn.user_id}`} target="_blank" className="text-lg font-medium text-white tracking-wide hover:text-indigo-300 transition-colors">
                  {warn.warned_user?.full_name || "Bilinmeyen Kullanıcı"}
                </Link>
                
                {isBanned && (
                  <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[8px] px-2 py-0.5 rounded-full font-mono tracking-[0.2em] uppercase">
                    Banlı
                  </span>
                )}
              </div>
              
              <div className="text-white/60 text-sm font-light flex items-center gap-2 mt-3">
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-mono px-2 py-1 rounded-md uppercase tracking-[0.2em]">
                  {warn.warningCount}. Uyarı
                </span>
                <span>Sebep: <span className="text-white/90">{warn.reason}</span></span>
              </div>
              
              {isBanned && (
                <div className="mt-4">
                  <button 
                    onClick={() => handleUnbanUser(warn.user_id, warn.id)}
                    className="text-[9px] font-mono uppercase tracking-[0.2em] text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full hover:bg-green-500/20 hover:border-green-500/40 transition-all opacity-0 group-hover:opacity-100"
                  >
                    Ban Cezasini Kaldır
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-left md:text-right flex flex-col gap-2 border-t border-white/5 md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
              <Link href={`/profil/${warn.admin_id}`} target="_blank" className="text-indigo-300/40 hover:text-indigo-300 text-[10px] uppercase tracking-[0.2em] font-mono transition-colors">
                Yetkili: {warn.admin_user?.full_name}
              </Link>
              <span className="text-white/30 text-[9px] font-mono">{new Date(warn.created_at).toLocaleString('tr-TR')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}