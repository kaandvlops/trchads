"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useContentGuard } from "@/hooks/useContentGuard";
import CommentItem from "@/components/CommentItem";
import ReportModal from "@/components/modals/ReportModal";
import WarnModal from "@/components/modals/WarnModal";
import GifPicker from "@/components/ui/GifPicker";

interface GenericCommentSectionProps {
  tableName: string;
  targetColumn: string;
  targetId: string;
  title?: string;
  placeholder?: string;
}

export default function GenericCommentSection({ 
  tableName, 
  targetColumn, 
  targetId, 
  title = "Değerlendirme Ekle", 
  placeholder = "Fikrini belirt..." 
}: GenericCommentSectionProps) {
  
  const { user, profile: currentUserProfile, isBanned } = useAuth();
  const { verifyAndExecute, isProcessing, securityError } = useContentGuard();
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  
  const [warnModalOpen, setWarnModalOpen] = useState(false);
  const [userToWarn, setUserToWarn] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{id: string, reportedUserId: string} | null>(null);

  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const fetchComments = useCallback(async () => {
    // parent_id de dahil olmak üzere tüm verileri çekiyoruz
    const { data, error } = await supabase
      .from(tableName)
      .select(`
        *,
        profiles!${tableName}_user_id_fkey(id, full_name, avatar_url, is_admin, is_verified)
      `)
      .eq(targetColumn, targetId)
      // Ana yorumlarda yeniler üstte, yanıtlarda eskiler üstte olması için temel bir sıralama
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formattedData = data.map((item: any) => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      }));
      setComments(formattedData);
    }
  }, [tableName, targetColumn, targetId]);

  useEffect(() => { 
    fetchComments(); 
  }, [fetchComments]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsGifPickerOpen(false);
      }
    };
    if (isGifPickerOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGifPickerOpen]);

  // YENİ: Hem ana yorum hem de yanıt atabilmek için birleştirilmiş submit fonksiyonu
  const handleSubmitContent = async (content: string, parentId: string | null = null) => {
    if (!user || !content.trim()) return false;

    let isSuccess = false;

    await verifyAndExecute(content, async () => {
      const { data, error } = await supabase
        .from(tableName)
        .insert([{ 
          [targetColumn]: targetId, 
          user_id: user.id, 
          content: content,
          parent_id: parentId // Ana yorumsa null, yanıtsa ID gider
        }])
        .select();

      if (error) throw error;
      if (data) {
        const newCommentData = {
          ...data[0],
          profiles: {
            id: currentUserProfile?.id,
            full_name: currentUserProfile?.full_name,
            avatar_url: currentUserProfile?.avatar_url,
            is_admin: currentUserProfile?.is_admin,
            is_verified: currentUserProfile?.is_verified
          }
        };
        // Yeni yorumu mevcut state'e ekle
        setComments(prev => [newCommentData, ...prev]);
        isSuccess = true;
      }
    });

    return isSuccess;
  };

  const handleMainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmitContent(newComment);
    if (success) setNewComment("");
  };

const handleReportSubmit = async (reason: string) => {
    if (!user || !reportTarget) return;

    // YENİ: Hangi tabloya yorum yapılıyorsa, şikayet tablosundaki hedef sütunu belirliyoruz
    let reportColumn = "";
    if (tableName === "forum_comments") reportColumn = "forum_comment_id";
    else if (tableName === "celebrity_comments") reportColumn = "celeb_comment_id";
    else if (tableName === "character_comments") reportColumn = "character_comment_id";

    // Gönderilecek temel veriler
    const payload: any = {
      reporter_id: user.id, 
      reported_user_id: reportTarget.reportedUserId,
      reason: reason, 
      status: 'pending'
    };

    // Yorum ID'sini doğru sütuna yerleştir
    if (reportColumn) {
      payload[reportColumn] = reportTarget.id;
    }

    const { error } = await supabase.from("user_reports").insert([payload]);

    if (error) {
      console.error("Şikayet Hatası:", error);
      alert("Şikayet gönderilirken bir hata oluştu.");
    } else {
      alert("Şikayetiniz sistem yöneticilerine başarıyla iletildi.");
    }
    
    setReportModalOpen(false); 
    setReportTarget(null);
  };

  
  const submitWarning = async (reason: string) => {
    if (!userToWarn || !currentUserProfile?.is_admin) return;
    await supabase.from("user_warnings").insert([{ 
      user_id: userToWarn, 
      admin_id: currentUserProfile.id, 
      reason: reason 
    }]);
    alert("Kullanıcıya sistem üzerinden başarıyla uyarı eklendi!");
    setWarnModalOpen(false); 
    setUserToWarn(null);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', commentId);
      if (error) throw error;
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      alert("İşlem başarısız oldu.");
    }
  };

  // YENİ: Yorumları Ana Yorumlar ve Yanıtlar olarak ayırma
  const mainComments = comments.filter(c => !c.parent_id);

  return (
    <div className="mt-16 border-t dergi-border pt-16 w-full max-w-4xl mx-auto">
      <ReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} onSubmit={handleReportSubmit} />
      <WarnModal isOpen={warnModalOpen} onClose={() => setWarnModalOpen(false)} onSubmit={submitWarning} />

      <div className="mb-16">
        <h3 className="dergi-subtitle uppercase mb-8 text-indigo-400">{title}</h3>

        {isBanned ? (
          <div className="border border-red-500/30 bg-black p-12 text-center dergi-kicker text-red-500/80 leading-loose">
            HESABINIZ UZAKLAŞTIRILDIĞI İÇİN DEĞERLENDİRME YAZAMAZSINIZ.
          </div>
        ) : user ? (
          <form onSubmit={handleMainSubmit} className="flex flex-col gap-4">
            {securityError && (
              <div className="bg-black border border-red-500/30 text-red-500 p-4 dergi-kicker text-left mb-2">
                {securityError}
              </div>
            )}
            
            <textarea 
              rows={4} 
              required 
              maxLength={1000}
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              disabled={isProcessing} 
              placeholder={placeholder} 
              className="w-full bg-[#050505] border dergi-border px-5 py-4 text-white font-light text-sm focus:outline-none focus:border-indigo-500/50 resize-none transition-colors disabled:opacity-30" 
            />
            
            <div className="flex justify-between items-center relative" ref={pickerRef}>
              
              <button 
                type="button" 
                onClick={() => setIsGifPickerOpen(!isGifPickerOpen)}
                className={`flex items-center gap-2 px-4 py-3 border transition-all duration-300 ${isGifPickerOpen ? 'bg-white/10 border-white/40 text-white' : 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase">GIF</span>
              </button>

              {isGifPickerOpen && (
                <GifPicker 
                  onSelect={(url) => setNewComment(prev => prev ? `${prev}\n${url}` : url)} 
                  onClose={() => setIsGifPickerOpen(false)} 
                />
              )}

              <button 
                type="submit" 
                disabled={isProcessing || !newComment.trim()} 
                className="dergi-btn disabled:opacity-20 ml-auto"
              >
                {isProcessing ? "TARANIYOR..." : "YAYINLA"}
              </button>

            </div>
          </form>
        ) : (
          <div className="border border-white/5 bg-white/[0.01] p-6 text-center mb-12">
            <p className="dergi-body text-white/40 text-xs uppercase tracking-widest mb-0">
              Tartışmaya katılmak için sisteme giriş yapmalısınız.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 border-b dergi-border pb-4 mb-4">
          <span className="dergi-kicker mb-0">Kayıtlar ({mainComments.length})</span>
        </div>

        {mainComments.length === 0 ? (
          <p className="text-sm font-mono text-white/20 tracking-wide text-center py-10 border dergi-border bg-black">
            Henüz bir değerlendirme yazılmamış. İlk yorumu sen yap.
          </p>
        ) : (
          mainComments.map((comment) => {
            // YENİ: Bu yoruma ait yanıtları kronolojik (eski üstte) sıraya göre bul
            const commentReplies = comments
              .filter(c => c.parent_id === comment.id)
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

            return (
              <CommentItem 
                key={comment.id}
                comment={comment}
                author={comment.profiles} 
                currentUserId={user?.id}
                isAdmin={currentUserProfile?.is_admin}
                onReport={(id, reportedId) => { setReportTarget({ id, reportedUserId: reportedId }); setReportModalOpen(true); }}
                onWarn={(reportedId) => { setUserToWarn(reportedId); setWarnModalOpen(true); }}
                onDelete={handleDelete}
                // Yanıt propları:
                replies={commentReplies}
                onReplySubmit={handleSubmitContent}
              />
            )
          })
        )}
      </div>
    </div>
  );
}