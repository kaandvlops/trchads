"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth"; 

import CharacterProfileCard from "@/components/Characters/CharacterProfileCard";
import CharacterVotePanel from "@/components/Characters/CharacterVotePanel";
import EstetikPano from "@/components/unluler/EstetikPano"; 
import GenericCommentSection from "@/components/GenericCommentSection";

// Karakter skorları (Celebrity'den farklı olabilir, ağaç yapına göre ayarladım)
interface CharacterVoteScores {
  jawline: number;
  eyes: number;
  midface: number;
  harmony: number;
  dimorphism: number;
  grooming: number;
}

// ============================================================================
// 1. BUSINESS LOGIC HOOK'U (KARAKTERLERE ÖZEL)
// ============================================================================
function useCharacterManager(characterId: string) {
  const router = useRouter();
  const { user, profile: currentUserProfile, loading } = useAuth();
  
  const [character, setCharacter] = useState<any | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [voteData, setVoteData] = useState<{ hasVoted: boolean; scores: CharacterVoteScores }>({
    hasVoted: false,
    scores: { jawline: 5, eyes: 5, midface: 5, harmony: 5, dimorphism: 5, grooming: 5 }
  });

  const fetchCharacterData = useCallback(async () => {
    // ÇÖZÜM BURADA: celebrities yerine characters (veya ranked_characters) tablosundan çekiyoruz!
    const { data } = await supabase.from("characters").select("*").eq("id", characterId).single();
    if (data) setCharacter(data);
  }, [characterId]);

  useEffect(() => {
    fetchCharacterData().then(() => setDataLoading(false));
  }, [fetchCharacterData]);

  useEffect(() => {
    if (user) {
      // Karakter oyları için 'character_id' üzerinden arama yapıyoruz
      supabase.from("votes").select("*").eq("user_id", user.id).eq("character_id", characterId).single()
        .then(({ data }) => {
          if (data) {
            setVoteData({
              hasVoted: true,
              scores: { 
                jawline: data.jawline, 
                eyes: data.eyes, 
                midface: data.midface, 
                harmony: data.harmony, 
                dimorphism: data.dimorphism, 
                grooming: data.grooming 
              }
            });
          }
        });
    }
  }, [user, characterId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image_url' | 'gallery_1' | 'gallery_2' | 'gallery_3') => {
    const file = e.target.files?.[0];
    if (!file || !currentUserProfile?.is_admin || !character) return;

    if (!window.confirm("Bu fotoğrafı bilgisayardan yükleyerek değiştirmek istediğinize emin misiniz?")) {
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

      // ÇÖZÜM: 'characters' bucket'ına yüklüyoruz
      const { error: uploadError } = await supabase.storage.from('characters').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl: newImageUrl } } = supabase.storage.from('characters').getPublicUrl(fileName);

      const { error: updateError } = await supabase.from('characters').update({ [fieldName]: newImageUrl }).eq('id', characterId);
      if (updateError) throw updateError;

      const oldUrl = character[fieldName] as string | undefined;
      if (oldUrl && oldUrl.includes('supabase.co')) {
        const oldFileName = oldUrl.split('/').pop();
        if (oldFileName) await supabase.storage.from('characters').remove([oldFileName]);
      }

      await fetchCharacterData();
    } catch (err: unknown) {
      alert(err instanceof Error ? "Hata: " + err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUrlUpdate = async (url: string, fieldName: 'image_url' | 'gallery_1' | 'gallery_2' | 'gallery_3') => {
    if (!currentUserProfile?.is_admin || !character) return;
    if (!window.confirm("Bu alanı harici bir link ile değiştirmek istediğinize emin misiniz?")) return;

    setIsUploadingImage(true);
    try {
      const { error } = await supabase.from('characters').update({ [fieldName]: url }).eq('id', characterId);
      if (error) throw error;

      const oldUrl = character[fieldName] as string | undefined;
      if (oldUrl && oldUrl.includes('supabase.co')) {
        const oldFileName = oldUrl.split('/').pop();
        if (oldFileName) await supabase.storage.from('characters').remove([oldFileName]);
      }

      await fetchCharacterData();
    } catch (err: unknown) {
      alert(err instanceof Error ? "Hata: " + err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageDelete = async (fieldName: 'image_url' | 'gallery_1' | 'gallery_2' | 'gallery_3') => {
    if (!currentUserProfile?.is_admin || !character) return;
    if (!window.confirm("Bu fotoğrafı tamamen kaldırmak istediğinize emin misiniz?")) return;

    setIsUploadingImage(true);
    try {
      const { error } = await supabase.from('characters').update({ [fieldName]: null }).eq('id', characterId);
      if (error) throw error;

      const oldUrl = character[fieldName] as string | undefined;
      if (oldUrl && oldUrl.includes('supabase.co')) {
        const oldFileName = oldUrl.split('/').pop();
        if (oldFileName) await supabase.storage.from('characters').remove([oldFileName]);
      }

      await fetchCharacterData();
    } catch (err: unknown) {
      alert(err instanceof Error ? "Hata: " + err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!character || !window.confirm("Karakteri silmek istediğinize emin misiniz?")) return;
    
    try {
      const filesToRemove: string[] = [];
      const extractFile = (url?: string | null) => {
        if (url && url.includes('supabase.co')) filesToRemove.push(url.split('/').pop()!);
      };

      extractFile(character.image_url);
      extractFile(character.gallery_1);
      extractFile(character.gallery_2);
      extractFile(character.gallery_3);

      if (filesToRemove.length > 0) await supabase.storage.from('characters').remove(filesToRemove);

      // ÇÖZÜM: admin_delete_content rpc'sinde 'character' olarak iletiyoruz
      const { error } = await supabase.rpc('admin_delete_content', { content_type: 'character', target_id: characterId });
      if (error) throw error;
      
      router.push("/karakterler");
    } catch (err: unknown) {
      alert(err instanceof Error ? "Silme işlemi başarısız oldu: " + err.message : "Beklenmeyen bir hata oluştu.");
    }
  };

  return { 
    user, currentUserProfile, loading, dataLoading, 
    character, voteData, isUploadingImage, 
    fetchCharacterData, handleImageUpload, handleUrlUpdate, handleImageDelete, handleDeleteCharacter 
  };
}

// ============================================================================
// 2. ANA GÖVDE (UI)
// ============================================================================
export default function KarakterDetaySayfasi() {
  const params = useParams();
  const characterId = params.id as string;

  const { 
    user, currentUserProfile, loading, dataLoading, 
    character, voteData, isUploadingImage, 
    fetchCharacterData, handleImageUpload, handleUrlUpdate, handleImageDelete, handleDeleteCharacter 
  } = useCharacterManager(characterId);

  if (loading || dataLoading) return <Loader text="Karakter Verileri Çekiliyor..." />;
  if (!character) return <div className="w-full min-h-[50vh] flex items-center justify-center dergi-kicker">Kayıt Bulunamadı.</div>;

  const isAdmin = !!currentUserProfile?.is_admin;

  return (
    <div className="w-full">
      <main className="relative max-w-[80rem] mx-auto p-6 py-24 flex flex-col gap-16">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* SOL SÜTUN */}
          <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col">
            <CharacterProfileCard 
              character={character} 
              isAdmin={isAdmin} 
              onDeleteCharacter={handleDeleteCharacter} 
              onImageUpload={handleImageUpload}
              onUrlUpdate={handleUrlUpdate}
              onImageDelete={handleImageDelete}
              isUploading={isUploadingImage}
            />
          </div>

          {/* SAĞ SÜTUN */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-12">
            <CharacterVotePanel 
              characterId={characterId}
              user={user}
              hasVotedProp={voteData.hasVoted}
              initialScores={voteData.scores}
              onVoteSuccess={fetchCharacterData}
            />
            {/* Estetik Pano bileşenine 'celebrity' prop'u olarak karakter verisini geçiyoruz */}
            <EstetikPano 
              celebrity={character}
              isAdmin={isAdmin}
              onImageUpload={handleImageUpload}
              onUrlUpdate={handleUrlUpdate}
              onImageDelete={handleImageDelete}
              isUploading={isUploadingImage}
            />
          </div>

        </div>

        {/* YENİ: Jenerik Yorum Sistemi Entegrasyonu (Karakterlere Özel) */}
        <GenericCommentSection 
          tableName="character_comments" 
          targetColumn="character_id" 
          targetId={characterId} 
          title="Karakter Analizi Ekle" 
          placeholder="Karakterin kemik yapısı ve aurası hakkındaki detaylı fikrini belirt..."
        />

      </main>
    </div>
  );
}