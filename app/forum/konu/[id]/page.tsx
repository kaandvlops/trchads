"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Topic, UserProfile } from "@/types";

import ReportModal from "@/components/modals/ReportModal";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth"; 
// YENİ: Jenerik Yorum Sistemimizi dahil ettik.
import GenericCommentSection from "@/components/GenericCommentSection";

type AuthorProfile = Pick<UserProfile, "id" | "full_name" | "avatar_url" | "is_admin" | "is_verified">;

export default function KonuDetaySayfasi() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const { user, profile: currentUserProfile, loading: authLoading } = useAuth(); 
  const [dataLoading, setDataLoading] = useState(true);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [author, setAuthor] = useState<AuthorProfile | null>(null);

  // Artık sadece konu şikayeti için tek bir modal yeterli.
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const { data: topicData } = await supabase
          .from("forum_topics")
          .select("*, profiles!user_id(id, full_name, avatar_url, is_admin, is_verified)") 
          .eq("id", topicId)
          .maybeSingle();

        if (topicData) {
          setTopic(topicData as Topic);
          setAuthor(topicData.profiles as unknown as AuthorProfile);
        }
      } catch (error: unknown) {
        console.error("Veri çekilirken hata oluştu:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]);

  const handleReportSubmit = async (reason: string) => {
    if (!user || !topic || !author) return;
    try {
      const { error } = await supabase.from("user_reports").insert([{
        reporter_id: user.id, 
        reported_user_id: author.id,
        topic_id: topic.id,
        reason: reason, 
        status: 'pending'
      }]);
      if (error) throw error;
      
      alert("Şikayetiniz sistem yöneticilerine başarıyla iletildi.");
      setReportModalOpen(false); 
    } catch (error: unknown) {
      if (error instanceof Error) alert("Hata: " + error.message);
      else alert("Beklenmeyen bir hata oluştu.");
    }
  };

  const handleDeleteTopic = async () => {
    if (!confirm("Bu konuyu tamamen silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await supabase.rpc('admin_delete_content', { content_type: 'forum_topic', target_id: topicId });
      if (error) throw error;
      router.push("/forum");
    } catch (error: unknown) {
      if (error instanceof Error) alert("Hata: " + error.message);
      else alert("Beklenmeyen bir hata oluştu.");
    }
  };

  if (authLoading || dataLoading) return <Loader text="Arşiv Taranıyor..." />;
  
  if (!topic) return (
    <div className="w-full min-h-[50vh] flex items-center justify-center dergi-kicker text-white/40">
      Kayıt bulunamadı veya arşivden kaldırılmış.
    </div>
  );

  const getAvatar = (url?: string | null, name?: string) => url || `https://api.dicebear.com/7.x/initials/svg?seed=${name || "U"}&backgroundColor=050505&textColor=ffffff`;

  return (
    <main className="w-full max-w-5xl mx-auto px-6 py-24 overflow-x-hidden">
      
      <ReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} onSubmit={handleReportSubmit} />

      {/* Ana Konu Paneli */}
      <div className="bg-transparent border dergi-border p-8 md:p-16 transition-all duration-500 hover:border-white/40 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
          <h1 className="text-3xl md:text-5xl font-extralight leading-tight tracking-tight max-w-3xl text-white/90 uppercase break-words">
            {topic.title}
          </h1>
          
          <div className="flex flex-row sm:flex-col gap-3 shrink-0">
            {user && user.id !== author?.id && (
              <button 
                onClick={() => setReportModalOpen(true)} 
                className="dergi-kicker bg-transparent border dergi-border px-4 py-2 hover:bg-white/5 hover:text-white transition-all duration-300 mb-0"
              >
                Şikayet Et
              </button>
            )}
            {currentUserProfile?.is_admin && (
              <button 
                onClick={handleDeleteTopic} 
                className="dergi-kicker bg-transparent text-red-500/70 border border-red-500/30 px-4 py-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 mb-0"
              >
                Konuyu Sil
              </button>
            )}
          </div>
        </div>
        
        {/* Yazar Bilgisi */}
        <div className="flex items-center gap-6 mb-10 pb-10 border-b dergi-border">
          <Image 
            src={getAvatar(author?.avatar_url, author?.full_name)} 
            alt="Avatar" 
            width={56} 
            height={56} 
            className="w-14 h-14 rounded-none object-cover border dergi-border filter grayscale hover:grayscale-0 transition-all duration-500" 
            priority
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <span className="text-base md:text-lg font-light text-white tracking-widest uppercase">{author?.full_name || "Bilinmeyen"}</span>
              {author?.is_admin && (
                <span className="bg-transparent border dergi-border text-white/60 text-[10px] font-mono px-2 py-1 tracking-[0.3em] uppercase">
                  Yönetici
                </span>
              )}
            </div>
            <div className="dergi-kicker mt-2 mb-0">
              {new Date(topic.created_at).toLocaleString('tr-TR')}
            </div>
          </div>
        </div>

        {/* Konu İçeriği */}
        <div className="dergi-body text-base md:text-lg whitespace-pre-wrap">
          {topic.content}
        </div>
      </div>

      {/* YENİ: Tek Satırla Jenerik Yorum (Kayıt) Sistemi! */}
      <GenericCommentSection 
        tableName="forum_comments" 
        targetColumn="topic_id" 
        targetId={topicId} 
        title="Arşive Katkıda Bulun" 
        placeholder="Düşüncelerini buraya aktar..."
      />

    </main>
  );
}