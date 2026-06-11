"use client";

import Link from "next/link";
import { UserReport } from "@/types";
import { supabase } from "@/lib/supabase";

interface ReportsTabProps {
  reports: UserReport[];
  setReports: React.Dispatch<React.SetStateAction<UserReport[]>>;
  onPunishClick: (report: UserReport) => void;
}

export default function ReportsTab({ reports, setReports, onPunishClick }: ReportsTabProps) {
  
  const handleResolveReport = async (reportId: string) => {
    try {
      await supabase.from("user_reports").update({ status: "resolved" }).eq("id", reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      console.error("Şikayet kapatılırken hata oluştu.");
    }
  };

  const handleDeleteContent = async (report: UserReport) => {
    if (!report.forum_comment_id && !report.celeb_comment_id && !report.character_comment_id && !report.topic_id) {
      alert("HATA: Silinecek hedef içerik zaten veritabanından kaldırılmış.");
      return;
    }

    if (!window.confirm("Bu içeriği silmek istediğinize emin misiniz?")) return;
    
    try {
      if (report.forum_comment_id) {
        const { error } = await supabase.rpc('admin_delete_content', { content_type: 'forum_comment', target_id: report.forum_comment_id });
        if (error) throw error;
      } else if (report.celeb_comment_id) {
        const { error } = await supabase.rpc('admin_delete_content', { content_type: 'celebrity_comment', target_id: report.celeb_comment_id });
        if (error) throw error;
      } else if (report.character_comment_id) {
        const { error } = await supabase.rpc('admin_delete_content', { content_type: 'character_comment', target_id: report.character_comment_id });
        if (error) throw error;
      } else if (report.topic_id) {
        const { error } = await supabase.rpc('admin_delete_content', { content_type: 'forum_topic', target_id: report.topic_id });
        if (error) throw error;
      }

      await supabase.from("user_reports").update({ status: "resolved" }).eq("id", report.id);
      setReports(reports.filter(r => r.id !== report.id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("İçerik silinirken bir hata oluştu: " + err.message);
      } else {
        alert("İçerik silinirken beklenmeyen bir hata oluştu.");
      }
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-12 text-center text-white/30 font-mono text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm">
        Sistemde bekleyen şikayet bulunmuyor.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {reports.map((report) => {
        const targetTopicId = report.topic_id || report.forum_comment?.topic_id;
        const targetCelebId = report.celeb_comment?.celebrity_id;
        // Tip güvenliği (any kaldırıldı)
        const targetCharId = report.character_comment?.character_id;

        return (
          <div key={report.id} className="bg-white/[0.02] border border-red-500/10 p-6 md:p-8 rounded-3xl backdrop-blur-md flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] pointer-events-none" />
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-[9px] font-mono bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full uppercase tracking-[0.2em]">Acil İşlem Bekliyor</span>
                <span className="text-white/40 text-[10px] font-mono">{new Date(report.created_at).toLocaleString('tr-TR')}</span>
              </div>
              <p className="text-white font-light text-base mt-4 leading-relaxed">
                <Link href={`/profil/${report.reporter_id}`} target="_blank" className="text-indigo-300 font-medium px-1.5 py-0.5 bg-indigo-500/10 rounded-md hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors">
                  {report.reporter?.full_name || "Bilinmeyen"}
                </Link> 
                {' '}adlı kullanıcı,{' '} 
                <Link href={`/profil/${report.reported_user_id}`} target="_blank" className="text-yellow-400 font-medium px-1.5 py-0.5 bg-yellow-500/10 rounded-md hover:bg-yellow-500/20 hover:text-yellow-200 transition-colors">
                  {report.reported_user?.full_name || "Bilinmeyen"}
                </Link> 
                {' '}adlı kullanıcıyı <strong className="text-red-400">"{report.reason}"</strong> sebebiyle şikayet etti.
              </p>
            </div>

            <div className="bg-[#050505]/50 border-l-2 border-red-500/50 p-5 rounded-r-2xl">
              {report.forum_comment ? (
                <>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">Şikayet Edilen Forum Yorumu</p>
                  <p className="text-white/80 font-light italic leading-relaxed">"{report.forum_comment.content}"</p>
                </>
              ) : report.celeb_comment ? (
                <>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">Şikayet Edilen Ünlü Yorumu</p>
                  <p className="text-white/80 font-light italic leading-relaxed">"{report.celeb_comment.content}"</p>
                </>
              ) : report.character_comment ? (
                <>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">Şikayet Edilen Karakter Yorumu</p>
                  <p className="text-white/80 font-light italic leading-relaxed">"{report.character_comment.content}"</p>
                </>
              ) : report.topic ? (
                <>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">Şikayet Edilen Konu ({report.topic.title})</p>
                  <p className="text-white/80 font-light italic leading-relaxed">"{report.topic.content}"</p>
                </>
              ) : (
                <p className="text-white/40 font-light italic">Bu içerik kullanıcı veya başka bir admin tarafından silinmiş olabilir.</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-2 border-t border-white/5 pt-6">
              {targetTopicId && (
                <Link href={`/forum/konu/${targetTopicId}`} target="_blank" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-3 rounded-full transition-all text-center">
                  Olay Yerine Git
                </Link>
              )}
              {targetCelebId && (
                <Link href={`/unluler/${targetCelebId}`} target="_blank" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-3 rounded-full transition-all text-center">
                  Ünlü Profiline Git
                </Link>
              )}
              {targetCharId && (
                <Link href={`/karakterler/${targetCharId}`} target="_blank" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-3 rounded-full transition-all text-center">
                  Karakter Profiline Git
                </Link>
              )}
              
              <button onClick={() => handleResolveReport(report.id)} className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-3 rounded-full transition-all">
                Kapat (İhlal Yok)
              </button>
              
              {(report.forum_comment || report.celeb_comment || report.character_comment || report.topic) && (
                <button onClick={() => handleDeleteContent(report)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-3 rounded-full transition-all">
                  İçeriği Sil
                </button>
              )}
              <button onClick={() => onPunishClick(report)} className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-3 rounded-full transition-all">
                Cezalandır (Ban / Uyarı)
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}