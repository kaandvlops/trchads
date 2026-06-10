"use client";

import { useState } from "react";
import Image from "next/image";
import { Celebrity } from "@/types";

interface EstetikPanoProps {
  celebrity: Celebrity;
  isAdmin: boolean;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>, field: 'gallery_1' | 'gallery_2' | 'gallery_3') => void;
  onUrlUpdate?: (url: string, field: 'gallery_1' | 'gallery_2' | 'gallery_3') => void;
  onImageDelete?: (field: 'gallery_1' | 'gallery_2' | 'gallery_3') => void;
  isUploading?: boolean;
}

export default function EstetikPano({ 
  celebrity, 
  isAdmin, 
  onImageUpload, 
  onUrlUpdate, 
  onImageDelete, 
  isUploading 
}: EstetikPanoProps) {
  
  // Eğer resim yoksa ve kullanıcı admin değilse bu paneli hiç gösterme
  if (!celebrity.gallery_1 && !celebrity.gallery_2 && !celebrity.gallery_3 && !isAdmin) {
    return null;
  }

  const AdminControls = ({ field, currentUrl }: { field: 'gallery_1' | 'gallery_2' | 'gallery_3', currentUrl?: string | null }) => {
    const [link, setLink] = useState("");

    if (!isAdmin) return null;

    return (
      <div className="mt-3 flex flex-col gap-3 text-left bg-white/[0.02] p-4 border border-white/10">
        
        {/* 1. Dosya Yükleme */}
        <div>
          <input type="file" id={`${field}-upload`} accept="image/*" className="hidden" onChange={(e) => onImageUpload?.(e, field)} disabled={isUploading} />
          <label htmlFor={`${field}-upload`} className={`text-[10px] uppercase font-mono tracking-widest block transition-colors ${isUploading ? 'text-white/30 cursor-not-allowed' : 'text-white/60 hover:text-white cursor-pointer'}`}>
            {isUploading ? '[ Yükleniyor... ]' : '[ 📁 Bilgisayardan Yükle ]'}
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
            onClick={() => { onUrlUpdate?.(link, field); setLink(""); }} 
            disabled={!link || isUploading} 
            className="text-[9px] uppercase font-mono text-white/60 hover:text-white border border-white/20 px-3 py-1.5 disabled:opacity-30 hover:bg-white/10 transition-all"
          >
            Ekle
          </button>
        </div>

        {/* 3. Görseli Sil */}
        {currentUrl && (
          <button 
            onClick={() => onImageDelete?.(field)} 
            disabled={isUploading}
            className="text-[10px] uppercase font-mono text-red-500/60 hover:text-red-400 text-left mt-2 transition-colors w-fit"
          >
            [ 🗑️ Görseli Kaldır ]
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col">
      <h3 className="dergi-kicker mb-6">Estetik Pano</h3>
      
      <div className="grid grid-cols-2 gap-4">
        
        {/* YATAY KARE (En üstte tam genişlik) */}
        {(celebrity.gallery_1 || isAdmin) && (
          <div className="col-span-2 relative group">
            <div className="relative w-full aspect-[16/9] border dergi-border bg-[#050505] overflow-hidden">
              {celebrity.gallery_1 ? (
                <Image src={celebrity.gallery_1} fill alt="Yatay Pano" unoptimized className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center dergi-kicker text-white/20 mb-0">Görsel Bekleniyor</div>
              )}
            </div>
            <AdminControls field="gallery_1" currentUrl={celebrity.gallery_1} />
          </div>
        )}

        {/* DİKEY KARE 1 (Sol alt) */}
        {(celebrity.gallery_2 || isAdmin) && (
          <div className="col-span-1 relative group">
            <div className="relative w-full aspect-[3/4] border dergi-border bg-[#050505] overflow-hidden">
              {celebrity.gallery_2 ? (
                <Image src={celebrity.gallery_2} fill alt="Dikey Pano 1" unoptimized className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center dergi-kicker text-white/20 mb-0 text-center">Görsel<br/>Bekleniyor</div>
              )}
            </div>
            <AdminControls field="gallery_2" currentUrl={celebrity.gallery_2} />
          </div>
        )}

        {/* DİKEY KARE 2 (Sağ alt) */}
        {(celebrity.gallery_3 || isAdmin) && (
          <div className="col-span-1 relative group">
            <div className="relative w-full aspect-[3/4] border dergi-border bg-[#050505] overflow-hidden">
              {celebrity.gallery_3 ? (
                <Image src={celebrity.gallery_3} fill alt="Dikey Pano 2" unoptimized className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center dergi-kicker text-white/20 mb-0 text-center">Görsel<br/>Bekleniyor</div>
              )}
            </div>
            <AdminControls field="gallery_3" currentUrl={celebrity.gallery_3} />
          </div>
        )}

      </div>
    </div>
  );
}