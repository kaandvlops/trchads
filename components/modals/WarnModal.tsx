"use client";

import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

interface WarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
  targetName?: string;
}

export default function WarnModal({ isOpen, onClose, onSubmit, targetName }: WarnModalProps) {
  const [reason, setReason] = useState("Küfür / Hakaret");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("Küfür / Hakaret");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit(reason);
      onClose();
    } catch (error) {
      console.error("Uyarı işleme hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} glowColor="yellow">
      <h3 className="text-white font-extralight text-2xl mb-2 tracking-tight">Kullanıcıyı Uyar</h3>
      
      {targetName && (
        <p className="text-white/40 font-mono text-[10px] uppercase mb-6 tracking-widest">
          Hedef: <span className="text-yellow-400">{targetName}</span>
        </p>
      )}
      
      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 ml-2">
        Uyarı Sebebi:
      </label>
      
      <select 
        value={reason} 
        disabled={isSubmitting}
        onChange={(e) => setReason(e.target.value)}
        className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl mb-6 outline-none focus:border-yellow-500/50 appearance-none font-light disabled:opacity-50"
      >
        <option value="Küfür / Hakaret" className="bg-[#121212]">Küfür / Hakaret</option>
        <option value="Aşırı Cinsellik / NSFW" className="bg-[#121212]">Aşırı Cinsellik / NSFW</option>
        <option value="Spam / Reklam" className="bg-[#121212]">Spam / Reklam</option>
        <option value="Kural Dışı İçerik" className="bg-[#121212]">Kural Dışı İçerik</option>
      </select>
      
      <div className="flex gap-3">
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-mono uppercase tracking-[0.2em] py-3 rounded-full hover:bg-yellow-500/30 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "İşleniyor..." : "Uyarıyı İşle"}
        </button>
        <button 
          onClick={onClose} 
          disabled={isSubmitting}
          className="flex-1 bg-white/5 text-white/50 border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] py-3 rounded-full hover:bg-white/10 transition-all disabled:opacity-50"
        >
          İptal
        </button>
      </div>
    </BaseModal>
  );
}