"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Celebrity } from "@/types";
import ReportContentModal from "@/components/modals/ReportContentModal";

interface CelebProfileCardProps {
  celebrity: Celebrity;
  isAdmin: boolean;
  onDeleteCeleb: () => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url') => void;
  onUrlUpdate?: (url: string, field: 'image_url') => void;
  onImageDelete?: (field: 'image_url') => void;
  isUploading?: boolean;
}

export default function CelebProfileCard({ 
  celebrity, 
  isAdmin, 
  onDeleteCeleb, 
  onImageUpload, 
  onUrlUpdate,
  onImageDelete,
  isUploading 
}: CelebProfileCardProps) {
  const averageScore = ((celebrity.avg_appearance + celebrity.avg_symmetry + celebrity.avg_jawline + celebrity.avg_eyes + celebrity.avg_style + celebrity.avg_charisma) / 6 || 0).toFixed(1);
  
  const weight = celebrity.weight;

  const [link, setLink] = useState("");
  // Şikayet Modalı için state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col h-full">
      
      {/* Şikayet Modalı */}
      <ReportContentModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        targetName={celebrity.name} 
      />

      {/* Üst Menü */}
      <div className="flex items-center justify-between mb-6 border-b dergi-border pb-4">
        <Link href="/unluler" className="dergi-kicker hover:text-white transition-colors mb-0">
          ← Arşive Dön
        </Link>
        {isAdmin && (
          <button onClick={onDeleteCeleb} className="dergi-kicker text-red-500/50 hover:text-red-400 transition-colors mb-0">
            [ Profili Komple Sil ]
          </button>
        )}
      </div>

      {/* Ana Fotoğraf Alanı (Kapak) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden border dergi-border bg-black group mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        {celebrity.image_url ? (
           <Image 
            src={celebrity.image_url} alt={celebrity.name} fill sizes="(max-width: 1024px) 100vw, 50vw" unoptimized
            className={`object-cover transition-all duration-1000 scale-105 group-hover:scale-100 grayscale-[20%] ${isUploading ? 'opacity-50 blur-sm' : ''}`} 
          />
        ) : (
           <div className="absolute inset-0 flex items-center justify-center dergi-kicker text-white/20 mb-0">Kapak Bekleniyor</div>
        )}
        
        {/* Sol Üst - ID */}
        <div className="absolute top-5 left-5 z-20">
          <span className="dergi-kicker bg-black/40 backdrop-blur-md border dergi-border px-4 py-2 shadow-xl mb-0 text-white/70">
            ID: {celebrity.id.substring(0, 8)}
          </span>
        </div>

        {/* Sağ Üst - Şikayet Butonu */}
        <button 
          onClick={() => setIsReportModalOpen(true)}
          className="absolute top-5 right-5 z-20 text-[10px] uppercase font-mono text-white/50 hover:text-white bg-black/40 backdrop-blur-md border dergi-border px-3 py-1.5 transition-colors"
        >
          [ ⚠️ İhlal Bildir ]
        </button>
      </div>

      {/* Admin Ana Kapak Kontrolleri */}
      {isAdmin && (
        <div className="mb-6 bg-white/[0.02] border border-white/10 p-4 flex flex-col gap-3">
           {/* 1. Dosya Yükleme */}
          <div>
            <input type="file" id="cover-upload" accept="image/*" className="hidden" onChange={(e) => onImageUpload?.(e, 'image_url')} disabled={isUploading} />
            <label htmlFor="cover-upload" className={`text-[10px] uppercase font-mono tracking-widest block transition-colors ${isUploading ? 'text-white/30 cursor-not-allowed' : 'text-white/60 hover:text-white cursor-pointer'}`}>
              {isUploading ? '[ Yükleniyor... ]' : '[ 📁 Kapak Yükle ]'}
            </label>
          </div>

          {/* 2. Link Ekleme */}
          <div className="flex items-center gap-2">
            <input 
              type="url" 
              placeholder="Pinterest/Web linki..." 
              value={link} 
              onChange={e => setLink(e.target.value)} 
              className="bg-transparent border-b border-white/20 text-white text-[10px] px-1 py-1.5 w-full outline-none focus:border-white/50 font-mono transition-colors" 
            />
            <button 
              onClick={() => { onUrlUpdate?.(link, 'image_url'); setLink(""); }} 
              disabled={!link || isUploading} 
              className="text-[9px] uppercase font-mono text-white/60 hover:text-white border border-white/20 px-3 py-1.5 disabled:opacity-30 hover:bg-white/10 transition-all"
            >
              Ekle
            </button>
          </div>

          {/* 3. Görseli Sil */}
          {celebrity.image_url && (
            <button 
              onClick={() => onImageDelete?.('image_url')} 
              disabled={isUploading}
              className="text-[10px] uppercase font-mono text-red-500/60 hover:text-red-400 text-left mt-2 transition-colors w-fit"
            >
              [ 🗑️ Kapağı Kaldır ]
            </button>
          )}
        </div>
      )}

      {/* İsim ve Puan Alanı */}
      <div className="flex items-end justify-between mt-4 mb-8 border-b dergi-border pb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-widest uppercase truncate pr-4">
          {celebrity.name}
        </h1>
        <div className="flex flex-col items-end shrink-0">
          <span className="dergi-kicker mb-2">Genel Puan</span>
          <span className="text-4xl md:text-5xl font-light text-white">{averageScore}</span>
        </div>
      </div>

      {/* Model & Fiziksel Özellikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 border-b dergi-border pb-8">
        <div className="flex flex-col gap-2 border-l dergi-border pl-4">
          <span className="dergi-kicker mb-0">Menşei</span>
          <span className="text-sm font-light text-white uppercase tracking-widest">{celebrity.country || "Bilinmiyor"}</span>
        </div>
        <div className="flex flex-col gap-2 border-l dergi-border pl-4">
          <span className="dergi-kicker mb-0">Doğum</span>
          <span className="text-sm font-light text-white uppercase tracking-widest">{celebrity.birth_year || "Bilinmiyor"}</span>
        </div>
        <div className="flex flex-col gap-2 border-l dergi-border pl-4">
          <span className="dergi-kicker mb-0">Boy</span>
          <span className="text-sm font-light text-white uppercase tracking-widest">{celebrity.height ? `${celebrity.height} CM` : "-"}</span>
        </div>
        <div className="flex flex-col gap-2 border-l dergi-border pl-4">
          <span className="dergi-kicker mb-0">Kilo</span>
          <span className="text-sm font-light text-white uppercase tracking-widest">{weight ? `${weight} KG` : "-"}</span>
        </div>
      </div>

      {/* Biyografi */}
      <div className="flex flex-col w-full">
        <h3 className="dergi-kicker mb-6">Hakkında</h3>
        <div className="dergi-body whitespace-pre-wrap">
          {celebrity.description || "Bu profil için henüz bir biyografi girilmemiş."}
        </div>
      </div>
      
    </div>
  );
}