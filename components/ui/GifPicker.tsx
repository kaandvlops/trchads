"use client";

import { useState, useEffect } from "react";

interface GifPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

// Tenor Güvenlik Ağı (API çökerse yüklenecek Chad GIFleri)
const FALLBACK_GIFS = [
  "https://media.tenor.com/Z42K9Wv0HWEAAAAC/chad-gigachad.gif",
  "https://media.tenor.com/vHq9y2P2WfwAAAAC/sigma-male.gif",
  "https://media.tenor.com/4F50p37wWuoAAAAC/patrick-bateman-sigma.gif",
  "https://media.tenor.com/2s_tN-yY0aEAAAAC/nod-yes.gif",
  "https://media.tenor.com/lM_L2uIurS8AAAAC/bruce-wayne-the-batman.gif",
  "https://media.tenor.com/b_xZ1iMnbDkAAAAC/ryan-gosling.gif",
  "https://media.tenor.com/o1l8_dJ8Z8cAAAAC/yes-nod.gif",
  "https://media.tenor.com/tZqT0lBw13AAAAAC/christian-bale-american-psycho.gif"
];

export default function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGifs = async () => {
      setLoading(true);
      try {
        const apiKey = "LIVDSRZULELA";
        
        const endpoint = search.trim() 
          ? `https://g.tenor.com/v1/search?q=${encodeURIComponent(search)}&key=${apiKey}&limit=16`
          : `https://g.tenor.com/v1/trending?key=${apiKey}&limit=16`;

        const res = await fetch(endpoint);
        
        if (!res.ok) throw new Error("Tarayıcı Engeli veya API Hatası");
        
        const data = await res.json();
        
        if (data && data.results && data.results.length > 0) {
          const fetchedGifs = data.results.map((item: any) => item.media[0].gif.url);
          setGifs(fetchedGifs);
        } else {
          setGifs([]); 
        }
        
      } catch (error) {
        setGifs(FALLBACK_GIFS);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchGifs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="absolute bottom-full mb-2 left-0 w-72 sm:w-80 bg-[#0a0a0a] border border-white/10 rounded-none shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden">
      
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black">
        <input 
          type="text" 
          placeholder="Tenor'da GIF Ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-white focus:outline-none w-full font-light placeholder:text-white/30"
          autoFocus
        />
        <button onClick={onClose} className="text-white/40 hover:text-white ml-2 transition-colors">
          ✕
        </button>
      </div>
      
      <div className="p-2 h-72 overflow-y-auto grid grid-cols-2 gap-2 custom-scrollbar bg-[#050505]">
        {loading ? (
          <div className="col-span-2 text-center text-white/30 text-xs py-4 font-mono uppercase tracking-widest flex items-center justify-center h-full">
            Taranıyor...
          </div>
        ) : gifs.length > 0 ? (
          gifs.map((url) => (
            <div 
              key={url} 
              onClick={() => { onSelect(url); onClose(); }}
              className="cursor-pointer border border-white/5 hover:border-white/40 transition-all h-28 w-full relative overflow-hidden bg-black group rounded-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={url} 
                alt="gif" 
                className="absolute inset-0 w-full h-full object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300 p-1" 
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-white/30 text-xs py-4 font-mono uppercase tracking-widest flex items-center justify-center h-full">
            Sonuç bulunamadı
          </div>
        )}
      </div>
    </div>
  );
}