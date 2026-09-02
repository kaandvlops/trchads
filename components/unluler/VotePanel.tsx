"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

interface ScoreData {
  appearance: number; 
  symmetry: number; 
  jawline: number; 
  eyes: number; 
  style: number; 
  charisma: number;
}

interface VotePanelProps {
  celebrityId: string;
  user: User | null;
  hasVotedProp: boolean;
  initialScores: ScoreData;
  onVoteSuccess: () => void;
}

export default function VotePanel({ celebrityId, user, hasVotedProp, initialScores, onVoteSuccess }: VotePanelProps) {
  const { user: authUser, isBanned } = useAuth();
  const currentUser = user || authUser;

  const [scores, setScores] = useState<ScoreData>(initialScores);
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
        celebrity_id: celebrityId,
        appearance: sanitizeScore(scores.appearance),
        symmetry: sanitizeScore(scores.symmetry),
        jawline: sanitizeScore(scores.jawline),
        eyes: sanitizeScore(scores.eyes),
        style: sanitizeScore(scores.style),
        charisma: sanitizeScore(scores.charisma),
      };

      // GÜVENLİK: upsert ile yarış durumu (race condition) ve mükerrer oy hatası önlenir
      const { error } = await supabase
        .from("votes")
        .upsert(sanitizedPayload, { onConflict: "user_id,celebrity_id" });

      if (error) throw error;
      
      setHasVoted(true);
      alert("Analiziniz başarıyla arşive kaydedildi.");
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

  const renderSlider = (label: string, key: keyof ScoreData) => (
    <div className="mb-6 group">
      <div className="flex justify-between items-end mb-4">
        <span className="dergi-kicker mb-0">{label}</span>
        <span className="text-xl font-light text-white group-hover:text-white/80 transition-colors">
          {scores[key].toFixed(1)}<span className="text-white/20 text-xs font-mono ml-1">/10</span>
        </span>
      </div>
      <input 
        type="range" min="1" max="10" step="0.1"
        value={scores[key]} 
        onChange={(e) => setScores({ ...scores, [key]: parseFloat(e.target.value) })}
        className="w-full appearance-none bg-white/10 h-[1px] outline-none 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-white/80 [&::-webkit-slider-thumb]:transition-all 
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
            <h2 className="dergi-subtitle uppercase mb-2">Objektif Değerlendirme</h2>
            <div className="dergi-kicker mb-0">Filtresiz Analiz Paneli</div>
          </div>
          {hasVoted && (
            <div className="dergi-kicker px-4 py-2 bg-white/5 border dergi-border shrink-0 mb-0">
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
          <div className="border dergi-border bg-black/40 p-6 mb-10 flex flex-col items-center justify-center text-center">
            <span className="dergi-kicker mb-2">Erişim Sınırlı</span>
            <p className="dergi-body uppercase text-xs mb-0">Sisteme kimliğinizi tanıtmalısınız.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 flex-1">
          {renderSlider("Görünüş & Oran", "appearance")}
          {renderSlider("Yüz Simetrisi", "symmetry")}
          {renderSlider("Çene (Jawline)", "jawline")}
          {renderSlider("Göz Bölgesi", "eyes")}
          {renderSlider("Stil & Estetik", "style")}
          {renderSlider("Aura & Karizma", "charisma")}
        </div>

        <button 
          onClick={handleVoteSubmit} 
          disabled={!currentUser || isSubmitting || isBanned}
          className="dergi-btn w-full mt-10 disabled:opacity-30 disabled:cursor-not-allowed bg-black"
        >
          {isSubmitting ? "Arşive İşleniyor..." : (hasVoted ? "Analizi Güncelle" : "Sisteme Gönder")}
        </button>

      </div>
    </div>
  );
}