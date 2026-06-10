"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth"; 

import CharacterVotePanel from "@/components/Characters/CharacterVotePanel";
import EstetikPano from "@/components/unluler/EstetikPano"; 
import CharacterProfileCard from "@/components/Characters/CharacterProfileCard"; 
import GenericCommentSection from "@/components/GenericCommentSection";

interface CharacterVoteScores {
  jawline: number;
  eyes: number;
  midface: number;
  harmony: number;
  dimorphism: number;
  grooming: number;
}

// 1. BUSINESS LOGIC HOOK'U
function useCharacterManager(characterId: string) {
  const router = useRouter();
  
  // DÜZELTME BURADA: AuthProvider'da tanımlı olan "loading" değişkenini çekiyoruz
  const { user, profile: currentUserProfile, loading } = useAuth();
  
  const [character, setCharacter] = useState<any | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [voteData, setVoteData] = useState<{ hasVoted: boolean; scores: CharacterVoteScores }>({
    hasVoted: false,
    scores: { jawline: 5, eyes: 5, midface: 5, harmony: 5, dimorphism: 5, grooming: 5 }
  });

  const fetchCharacterData = useCallback(async () => {
    const { data } = await supabase.from("characters").select("*").eq("id", characterId).single();
    if (data) setCharacter(data);
  }, [characterId]);

  useEffect(() => {
    fetchCharacterData().then(() => setDataLoading(false));
  }, [fetchCharacterData]);

  useEffect(() => {
    if (user) {
      supabase.from("character_votes").select("*").eq("user_id", user.id).eq("character_id", characterId).single()
        .then(({ data }) => {
          if (data) {
            setVoteData({
              hasVoted: true,
              scores: { jawline: data.jawline, eyes: data.eyes, midface: data.midface, harmony: data.harmony, dimorphism: data.dimorphism, grooming: data.grooming }
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
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

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
    if (!character || !window.confirm("Bu karakteri tamamen silmek istediğinize emin misiniz?")) return;
    
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

      const { error } = await supabase.from('characters').delete().eq('id', characterId);
      
      if (error) throw error;
      
      router.push("/karakterler");
    } catch (err: unknown) {
      alert(err instanceof Error ? "Silme işlemi başarısız oldu: " + err.message : "Beklenmeyen bir hata oluştu.");
    }
  };

  // DÜZELTME BURADA: Dışarıya "loading" olarak gönderiyoruz
  return { 
    user, currentUserProfile, loading, dataLoading, 
    character, voteData, isUploadingImage, 
    fetchCharacterData, handleImageUpload, handleUrlUpdate, handleImageDelete, handleDeleteCharacter 
  };
}

// 2. ANA GÖVDE (UI)
export default function KarakterDetaySayfasi() {
  const params = useParams();
  const characterId = params.id as string;

  // DÜZELTME BURADA: Dışarıdan "loading" olarak karşılıyoruz
  const { 
    user, currentUserProfile, loading, dataLoading, 
    character, voteData, isUploadingImage, 
    fetchCharacterData, handleImageUpload, handleUrlUpdate, handleImageDelete, handleDeleteCharacter 
  } = useCharacterManager(characterId);

  // DÜZELTME BURADA: Yüklenme durumunu "loading" değişkeniyle kontrol ediyoruz
  if (loading || dataLoading) return <Loader />;
  if (!character) return <div className="w-full min-h-[50vh] flex items-center justify-center dergi-kicker">Kayıt Bulunamadı.</div>;

  const isAdmin = !!currentUserProfile?.is_admin;

  return (
    <div className="w-full">
      <main className="relative max-w-[80rem] mx-auto p-6 py-24 flex flex-col gap-16">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
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

          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-12">
            <CharacterVotePanel 
              characterId={characterId}
              user={user}
              hasVotedProp={voteData.hasVoted}
              initialScores={voteData.scores}
              onVoteSuccess={fetchCharacterData}
            />
            <EstetikPano 
              celebrity={character as any} 
              isAdmin={isAdmin}
              onImageUpload={handleImageUpload}
              onUrlUpdate={handleUrlUpdate}
              onImageDelete={handleImageDelete}
              isUploading={isUploadingImage}
            />
          </div>

        </div>

        {/* Jenerik Yorum Sistemi Entegrasyonu */}
        <GenericCommentSection 
          tableName="character_comments" 
          targetColumn="character_id" 
          targetId={characterId} 
          title="PSL Analizleri & Yorumlar" 
          placeholder="Bu karakterin kemik yapısı ve aurası hakkında ne düşünüyorsun? PSL analizi bırak..."
        />

      </main>
    </div>
  );
}