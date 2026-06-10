"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Celebrity } from "@/types";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth"; 

import CelebProfileCard from "@/components/unluler/CelebProfileCard";
import VotePanel from "@/components/unluler/VotePanel";
import EstetikPano from "@/components/unluler/EstetikPano"; 
// YENİ: Eski yorum sistemi yerine Jenerik Yorum Sistemini içeri aktardık
import GenericCommentSection from "@/components/GenericCommentSection";

interface VoteScores {
  appearance: number;
  symmetry: number;
  jawline: number;
  eyes: number;
  style: number;
  charisma: number;
}

// ============================================================================
// 1. BUSINESS LOGIC HOOK'U
// ============================================================================
function useCelebrityManager(celebrityId: string) {
  const router = useRouter();
  const { user, profile: currentUserProfile, authLoading } = useAuth();
  
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [voteData, setVoteData] = useState<{ hasVoted: boolean; scores: VoteScores }>({
    hasVoted: false,
    scores: { appearance: 5, symmetry: 5, jawline: 5, eyes: 5, style: 5, charisma: 5 }
  });

  const fetchCelebData = useCallback(async () => {
    const { data } = await supabase.from("celebrities").select("*").eq("id", celebrityId).single();
    if (data) setCelebrity(data as Celebrity);
  }, [celebrityId]);

  useEffect(() => {
    fetchCelebData().then(() => setDataLoading(false));
  }, [fetchCelebData]);

  useEffect(() => {
    if (user) {
      supabase.from("votes").select("*").eq("user_id", user.id).eq("celebrity_id", celebrityId).single()
        .then(({ data }) => {
          if (data) {
            setVoteData({
              hasVoted: true,
              scores: { appearance: data.appearance, symmetry: data.symmetry, jawline: data.jawline, eyes: data.eyes, style: data.style, charisma: data.charisma }
            });
          }
        });
    }
  }, [user, celebrityId]);

  // DOSYA YÜKLEME
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image_url' | 'gallery_1' | 'gallery_2' | 'gallery_3') => {
    const file = e.target.files?.[0];
    if (!file || !currentUserProfile?.is_admin || !celebrity) return;

    if (!window.confirm("Bu fotoğrafı bilgisayardan yükleyerek değiştirmek istediğinize emin misiniz?")) {
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('celebrities').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl: newImageUrl } } = supabase.storage.from('celebrities').getPublicUrl(fileName);

      const { error: updateError } = await supabase.from('celebrities').update({ [fieldName]: newImageUrl }).eq('id', celebrityId);
      if (updateError) throw updateError;

      const oldUrl = celebrity[fieldName] as string | undefined;
      if (oldUrl && oldUrl.includes('supabase.co')) {
        const oldFileName = oldUrl.split('/').pop();
        if (oldFileName) await supabase.storage.from('celebrities').remove([oldFileName]);
      }

      await fetchCelebData();
    } catch (err: unknown) {
      alert(err instanceof Error ? "Hata: " + err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUrlUpdate = async (url: string, fieldName: 'image_url' | 'gallery_1' | 'gallery_2' | 'gallery_3') => {
    if (!currentUserProfile?.is_admin || !celebrity) return;
    if (!window.confirm("Bu alanı harici bir link ile değiştirmek istediğinize emin misiniz?")) return;

    setIsUploadingImage(true);
    try {
      const { error } = await supabase.from('celebrities').update({ [fieldName]: url }).eq('id', celebrityId);
      if (error) throw error;

      const oldUrl = celebrity[fieldName] as string | undefined;
      if (oldUrl && oldUrl.includes('supabase.co')) {
        const oldFileName = oldUrl.split('/').pop();
        if (oldFileName) await supabase.storage.from('celebrities').remove([oldFileName]);
      }

      await fetchCelebData();
    } catch (err: unknown) {
      alert(err instanceof Error ? "Hata: " + err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageDelete = async (fieldName: 'image_url' | 'gallery_1' | 'gallery_2' | 'gallery_3') => {
    if (!currentUserProfile?.is_admin || !celebrity) return;
    if (!window.confirm("Bu fotoğrafı tamamen kaldırmak istediğinize emin misiniz?")) return;

    setIsUploadingImage(true);
    try {
      const { error } = await supabase.from('celebrities').update({ [fieldName]: null }).eq('id', celebrityId);
      if (error) throw error;

      const oldUrl = celebrity[fieldName] as string | undefined;
      if (oldUrl && oldUrl.includes('supabase.co')) {
        const oldFileName = oldUrl.split('/').pop();
        if (oldFileName) await supabase.storage.from('celebrities').remove([oldFileName]);
      }

      await fetchCelebData();
    } catch (err: unknown) {
      alert(err instanceof Error ? "Hata: " + err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteCeleb = async () => {
    if (!celebrity || !window.confirm("Profili silmek istediğinize emin misiniz?")) return;
    
    try {
      const filesToRemove: string[] = [];
      const extractFile = (url?: string | null) => {
        if (url && url.includes('supabase.co')) filesToRemove.push(url.split('/').pop()!);
      };

      extractFile(celebrity.image_url);
      extractFile(celebrity.gallery_1);
      extractFile(celebrity.gallery_2);
      extractFile(celebrity.gallery_3);

      if (filesToRemove.length > 0) await supabase.storage.from('celebrities').remove(filesToRemove);

      const { error } = await supabase.rpc('admin_delete_content', { content_type: 'celebrity', target_id: celebrityId });
      if (error) throw error;
      
      router.push("/unluler");
    } catch (err: unknown) {
      alert(err instanceof Error ? "Silme işlemi başarısız oldu: " + err.message : "Beklenmeyen bir hata oluştu.");
    }
  };

  return { 
    user, currentUserProfile, authLoading, dataLoading, 
    celebrity, voteData, isUploadingImage, 
    fetchCelebData, handleImageUpload, handleUrlUpdate, handleImageDelete, handleDeleteCeleb 
  };
}

// ============================================================================
// 2. ANA GÖVDE (UI)
// ============================================================================
export default function UnluDetaySayfasi() {
  const params = useParams();
  const celebrityId = params.id as string;

  const { 
    user, currentUserProfile, authLoading, dataLoading, 
    celebrity, voteData, isUploadingImage, 
    fetchCelebData, handleImageUpload, handleUrlUpdate, handleImageDelete, handleDeleteCeleb 
  } = useCelebrityManager(celebrityId);

  if (authLoading || dataLoading) return <Loader />;
  if (!celebrity) return <div className="w-full min-h-[50vh] flex items-center justify-center dergi-kicker">Kayıt Bulunamadı.</div>;

  const isAdmin = !!currentUserProfile?.is_admin;

  return (
    <div className="w-full">
      <main className="relative max-w-[80rem] mx-auto p-6 py-24 flex flex-col gap-16">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* SOL SÜTUN */}
          <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col">
            <CelebProfileCard 
              celebrity={celebrity} 
              isAdmin={isAdmin} 
              onDeleteCeleb={handleDeleteCeleb} 
              onImageUpload={handleImageUpload}
              onUrlUpdate={handleUrlUpdate}
              onImageDelete={handleImageDelete}
              isUploading={isUploadingImage}
            />
          </div>

          {/* SAĞ SÜTUN */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-12">
            <VotePanel 
              celebrityId={celebrityId}
              user={user}
              hasVotedProp={voteData.hasVoted}
              initialScores={voteData.scores}
              onVoteSuccess={fetchCelebData}
            />
            <EstetikPano 
              celebrity={celebrity}
              isAdmin={isAdmin}
              onImageUpload={handleImageUpload}
              onUrlUpdate={handleUrlUpdate}
              onImageDelete={handleImageDelete}
              isUploading={isUploadingImage}
            />
          </div>

        </div>

        {/* YENİ: Jenerik Yorum Sistemi Entegrasyonu */}
        <GenericCommentSection 
          tableName="celebrity_comments" 
          targetColumn="celebrity_id" 
          targetId={celebrityId} 
          title="Değerlendirme Ekle" 
          placeholder="Profil hakkındaki detaylı fikrini belirt..."
        />

      </main>
    </div>
  );
}