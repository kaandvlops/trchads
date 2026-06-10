"use client";

import { useState } from "react";
import BaseModal from "./BaseModal"; // Merkezi modalımızı içeri aktarıyoruz

interface PunishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, banDuration: string) => void;
  targetName?: string;
}

export default function PunishModal({ isOpen, onClose, onSubmit, targetName }: PunishModalProps) {
  const [reason, setReason] = useState("Küfür / Hakaret");
  const [banDuration, setBanDuration] = useState("0");

  return (
    // Spagetti kodlar gitti, BaseModal ile sarmaladık!
    <BaseModal isOpen={isOpen} onClose={onClose} glowColor="yellow">
      <h3 className="text-white font-extralight text-2xl mb-2 tracking-tight">Kullanıcı İşlemi</h3>
      
      <p className="text-white/40 font-mono text-[10px] uppercase mb-6 tracking-widest">
        Hedef: <span className="text-yellow-400">{targetName || "Bilinmeyen Kullanıcı"}</span>
      </p>
      
      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 ml-2">Ceza Sebebi:</label>
      <select 
        value={reason} 
        onChange={(e) => setReason(e.target.value)}
        className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl mb-4 outline-none focus:border-yellow-500/50 appearance-none font-light"
      >
        <option value="Küfür / Hakaret" className="bg-[#121212]">Küfür / Hakaret</option>
        <option value="Spam / Reklam" className="bg-[#121212]">Spam / Reklam</option>
        <option value="Aşırı Cinsellik / NSFW" className="bg-[#121212]">Aşırı Cinsellik / NSFW</option>
        <option value="Kural Dışı İçerik" className="bg-[#121212]">Kural Dışı İçerik</option>
      </select>

      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 ml-2">Uzaklaştırma (Ban) Süresi:</label>
      <select 
        value={banDuration} 
        onChange={(e) => setBanDuration(e.target.value)}
        className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl mb-8 outline-none focus:border-red-500/50 appearance-none font-light"
      >
        <option value="0" className="bg-[#121212]">Sadece Uyarı (Ban Yok)</option>
        <option value="1" className="bg-[#121212]">1 Gün Uzaklaştırma</option>
        <option value="3" className="bg-[#121212]">3 Gün Uzaklaştırma</option>
        <option value="7" className="bg-[#121212]">1 Hafta Uzaklaştırma</option>
        <option value="999" className="bg-[#121212]">Sınırsız (Kalıcı) Ban</option>
      </select>

      <div className="flex gap-3">
        <button onClick={() => onSubmit(reason, banDuration)} className="flex-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-mono uppercase tracking-[0.2em] py-3 rounded-full hover:bg-yellow-500/30 transition-all">
          İşlemi Onayla
        </button>
        <button onClick={onClose} className="flex-1 bg-white/5 text-white/50 border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] py-3 rounded-full hover:bg-white/10 transition-all">
          İptal
        </button>
      </div>
    </BaseModal>
  );
}