"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReportContentModal from "@/components/modals/ReportContentModal";

interface CharacterProfileCardProps {
  character: any; 
  isAdmin: boolean;
  onDeleteCharacter: () => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url') => void;
  onUrlUpdate?: (url: string, field: 'image_url') => void;
  onImageDelete?: (field: 'image_url') => void;
  isUploading?: boolean;
}

export default function CharacterProfileCard({ 
  character, 
  isAdmin, 
  onDeleteCharacter, 
  onImageUpload, 
  onUrlUpdate,
  onImageDelete,
  isUploading 
}: CharacterProfileCardProps) {
  
  // Güvenli skor hesaplaması (null/undefined hatalarını önler)
  const averageScore = ((
    (character?.avg_jawline || 0) + 
    (character?.avg_eyes || 0) + 
    (character?.avg_midface || 0) + 
    (character?.avg_harmony || 0) + 
    (character?.avg_dimorphism || 0) + 
    (character?.avg_grooming || 0)
  ) / 6 || 0).toFixed(1);

  const [link, setLink] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col h-full">

      <ReportContentModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        targetName={character?.name} 
      />
      
      <div className="flex items-center justify-between mb-6 border-b dergi-border pb-4">
        {/* HATA DÜZELTİLDİ: /oyunlar yerine /karakterler */}
        <Link href="/karakterler" className="dergi-kicker text-indigo-400/80 hover:text-indigo-300 transition-colors mb-0">
          ← Karakter Arşivine Dön
        </Link>
        {isAdmin && (
          <button onClick={onDeleteCharacter} className="dergi-kicker text-red-500/50 hover:text-red-400 transition-colors mb-0">
            [ Karakteri Komple Sil ]
          </button>
        )}
      </div>

      <div className="relative w-full aspect-[4/5] overflow-hidden border border-white/10 bg-black group mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        {character?.image_url ? (
           <Image 
            src={character.image_url} alt={character.name} fill sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover object-top transition-all duration-1000 scale-105 group-hover:scale-100 grayscale-[20%] ${isUploading ? 'opacity-50 blur-sm' : ''}`} 
          />
        ) : (
           <div className="absolute inset-0 flex items-center justify-center dergi-kicker text-white/20 mb-0">Profil Bekleniyor</div>
        )}
        
        <div className="absolute top-5 left-5 z-20">
          <span className="dergi-kicker bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 shadow-xl mb-0 text-white/70">
            ID: {character?.id?.substring(0, 8)}
          </span>
        </div>

        <button 
          onClick={() => setIsReportModalOpen(true)}
          className="absolute top-5 right-5 z-20 text-[10px] uppercase font-mono text-white/50 hover:text-white bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 transition-colors"
        >
          [ ⚠️ İhlal Bildir ]
        </button>
      </div>

      {isAdmin && (
        <div className="mb-6 bg-white/[0.02] border border-white/10 p-4 flex flex-col gap-3">
          <div>
            <input type="file" id="cover-upload" accept="image/*" className="hidden" onChange={(e) => onImageUpload?.(e, 'image_url')} disabled={isUploading} />
            <label htmlFor="cover-upload" className={`text-[10px] uppercase font-mono tracking-widest block transition-colors ${isUploading ? 'text-indigo-300/50 cursor-not-allowed' : 'text-indigo-400/80 hover:text-indigo-300 cursor-pointer'}`}>
              {isUploading ? '[ Yükleniyor... ]' : '[ 📁 Profil Yükle ]'}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="url" placeholder="Web linki..." value={link} 
              onChange={e => setLink(e.target.value)} 
              className="bg-transparent border-b border-white/20 text-white text-[10px] px-1 py-1.5 w-full outline-none focus:border-indigo-500/50 font-mono transition-colors" 
            />
            <button 
              onClick={() => { onUrlUpdate?.(link, 'image_url'); setLink(""); }} 
              disabled={!link || isUploading} 
              className="text-[9px] uppercase font-mono text-white/60 hover:text-white border border-white/20 px-3 py-1.5 disabled:opacity-30 hover:bg-white/10 transition-all"
            >
              Ekle
            </button>
          </div>

          {character?.image_url && (
            <button 
              onClick={() => onImageDelete?.('image_url')} disabled={isUploading}
              className="text-[10px] uppercase font-mono text-red-500/60 hover:text-red-400 text-left mt-2 transition-colors w-fit"
            >
              [ 🗑️ Fotoğrafı Kaldır ]
            </button>
          )}
        </div>
      )}

      <div className="flex items-end justify-between mt-4 mb-8 border-b dergi-border pb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-widest uppercase truncate pr-4">
          {character?.name}
        </h1>
        <div className="flex flex-col items-end shrink-0">
          <span className="dergi-kicker mb-2 text-indigo-400">Genel PSL Skoru</span>
          <span className="text-4xl md:text-5xl font-light text-white">{averageScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 border-b dergi-border pb-8">
        <div className="flex flex-col gap-2 border-l border-indigo-500/30 pl-4">
          <span className="dergi-kicker mb-0">Evren / Oyun</span>
          <span className="text-sm font-light text-white uppercase tracking-widest truncate" title={character?.universe || "Bilinmiyor"}>{character?.universe || "Bilinmiyor"}</span>
        </div>
        <div className="flex flex-col gap-2 border-l border-indigo-500/30 pl-4">
          <span className="dergi-kicker mb-0">Irk / Fenotip</span>
          <span className="text-sm font-light text-white uppercase tracking-widest truncate">{character?.race || "Bilinmiyor"}</span>
        </div>
        <div className="flex flex-col gap-2 border-l border-indigo-500/30 pl-4">
          <span className="dergi-kicker mb-0">Rol / Sınıf</span>
          <span className="text-sm font-light text-white uppercase tracking-widest truncate" title={character?.role || "Bilinmiyor"}>{character?.role || "-"}</span>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <h3 className="dergi-kicker mb-6">Fiziksel Analiz & Lore</h3>
        <div className="dergi-body whitespace-pre-wrap">
          {character?.description || "Bu karakterin yüz hatları için henüz bir analiz girilmemiş."}
        </div>
      </div>
      
    </div>
  );
}