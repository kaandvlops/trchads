"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

// Hardcore Looksmaxxing Kriterleri
interface CharacterScoreData {
  jawline: number;    // Çene Hattı, Ramus, Kütlük
  eyes: number;       // Hunter Eyes, Canthal Tilt, Göz Çevresi
  midface: number;    // Orta Yüz, Burun Yapısı, Kompaktlık
  harmony: number;    // Yüz Simetrisi, Altın Oran (Facial Harmony)
  dimorphism: number; // Maskülen/Feminen Keskinlik (Sexual Dimorphism)
  grooming: number;   // Saç Çizgisi, Sakal, Cilt Kalitesi (Halo Effect)
}

interface CharacterVotePanelProps {
  characterId: string;
  user: User | null;
  hasVotedProp: boolean;
  initialScores: CharacterScoreData;
  onVoteSuccess: () => void;
}

export default function CharacterVotePanel({ characterId, user, hasVotedProp, initialScores, onVoteSuccess }: CharacterVotePanelProps) {
  const { user: authUser, isBanned } = useAuth();
  const currentUser = user || authUser;

  const [scores, setScores] = useState<CharacterScoreData>(initialScores);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(hasVotedProp);

  useEffect(() => {
    setScores(initialScores);
    setHasVoted(hasVotedProp);
  }, [initialScores, hasVotedProp]);

  // Puanları 1 ile 10 arasında güvenli tutan yardımcı fonksiyon
  const sanitizeScore = (val: number) => {
    const num = Number(val);
    if (isNaN(num)) return 5.0;
    return Math.min(10, Math.max(1, Math.round(num * 10) / 10));
  };

  const handleVoteSubmit = async () => {
    if (!currentUser) {
      alert("Değerlendirme yapmak için sistemde kimliğinizi doğrulamalısınız.");
      return;
    }

    if (isBanned) {
      alert("Hesabınız uzaklaştırıldığı için oy kullanamazsınız.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const sanitizedPayload = {
        user_id: currentUser.id,
        character_id: characterId,
        jawline: sanitizeScore(scores.jawline),
        eyes: sanitizeScore(scores.eyes),
        midface: sanitizeScore(scores.midface),
        harmony: sanitizeScore(scores.harmony),
        dimorphism: sanitizeScore(scores.dimorphism),
        grooming: sanitizeScore(scores.grooming),
      };

      // GÜVENLİK: upsert ile yarış durumu (race condition) ve mükerrer oy hatası önlenir
      const { error } = await supabase
        .from("character_votes")
        .upsert(sanitizedPayload, { onConflict: "user_id,character_id" });

      if (error) throw error;
      
      setHasVoted(true);
      alert("Yüz analizi başarıyla PSL veri tabanına işlendi.");
      onVoteSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Kayıt sırasında bir hata oluştu: " + err.message);
      } else {
        alert("Kayıt sırasında beklenmeyen bir hata oluştu.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSlider = (label: string, key: keyof CharacterScoreData) => (
    <div className="mb-6 group">
      <div className="flex justify-between items-end mb-4">
        <span className="dergi-kicker mb-0 text-indigo-200/70 group-hover:text-indigo-300 transition-colors">{label}</span>
        <span className="text-xl font-light text-white group-hover:text-white/80 transition-colors">
          {scores[key].toFixed(1)}<span className="text-white/20 text-xs font-mono ml-1">/10</span>
        </span>
      </div>
      <input 
        type="range" min="1" max="10" step="0.1"
        value={scores[key]} 
        onChange={(e) => setScores({ ...scores, [key]: parseFloat(e.target.value) })}
        className="w-full appearance-none bg-indigo-900/30 h-[1px] outline-none 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-indigo-300 [&::-webkit-slider-thumb]:transition-all 
                  transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={!currentUser || isSubmitting || isBanned}
      />
    </div>
  );

  return (
    <div className="w-full flex flex-col h-full">
      <div className="bg-transparent border dergi-border p-8 md:p-10 flex flex-col h-full">
        
        <div className="flex flex-col xl:flex-row xl:items-start justify-between border-b dergi-border pb-8 mb-10 gap-6">
          <div>
            <h2 className="dergi-subtitle uppercase mb-2">PSL Yüz Analizi</h2>
            <div className="dergi-kicker mb-0 text-indigo-400">Kemik Yapısı & Simetri Değerlendirmesi</div>
          </div>
          {hasVoted && (
            <div className="dergi-kicker px-4 py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0 mb-0">
              Kayıtlı Analiz
            </div>
          )}
        </div>

        {isBanned && (
          <div className="border border-red-500/30 bg-red-950/20 p-4 mb-6 text-center dergi-kicker text-red-400">
            HESABINIZ UZAKLAŞTIRILDIĞI İÇİN OY KULLANAMAZSINIZ.
          </div>
        )}

        {!currentUser && (
          <div className="border border-indigo-500/20 bg-indigo-950/10 p-6 mb-10 flex flex-col items-center justify-center text-center">
            <span className="dergi-kicker mb-2 text-indigo-300">Erişim Sınırlı</span>
            <p className="dergi-body uppercase text-xs mb-0">Sisteme kimliğinizi tanıtmalısınız.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 flex-1">
          {renderSlider("Çene Hattı & Kemik (Jawline)", "jawline")}
          {renderSlider("Göz Bölgesi (Hunter Eyes/Tilt)", "eyes")}
          {renderSlider("Orta Yüz & Burun (Midface)", "midface")}
          {renderSlider("Yüz Simetrisi (Facial Harmony)", "harmony")}
          {renderSlider("Keskinlik (Sexual Dimorphism)", "dimorphism")}
          {renderSlider("Saç, Sakal & Cilt (Halo Effect)", "grooming")}
        </div>

        <button 
          onClick={handleVoteSubmit} 
          disabled={!currentUser || isSubmitting || isBanned}
          className="dergi-btn w-full mt-10 disabled:opacity-30 disabled:cursor-not-allowed bg-black hover:border-indigo-400 hover:text-indigo-400"
        >
          {isSubmitting ? "Arşive İşleniyor..." : (hasVoted ? "Analizi Güncelle" : "Sisteme Gönder")}
        </button>

      </div>
    </div>
  );
}