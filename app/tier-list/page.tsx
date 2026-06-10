"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toPng } from "html-to-image";
import PageHeader from "@/components/ui/PageHeader";
import Loader from "@/components/ui/Loader";

// Tier List Seviyeleri ve Renkleri
const TIERS = [
  { id: "ADAM", label: "SS - Gigachad", color: "bg-red-900" },
  { id: "CHAD", label: "S - Top Tier", color: "bg-red-600" },
  { id: "HTN", label: "HTN (High Tier Normie)", color: "bg-orange-600" },
  { id: "MTN", label: "MTN (Mid Tier Normie)", color: "bg-yellow-600" },
  { id: "LTN", label: "LTN (Low Tier Normie)", color: "bg-green-600" },
  { id: "Sub5", label: "Sub5", color: "bg-blue-600" },
  { id: "Mogged", label: "Giga-Mogged", color: "bg-purple-700" },
];

interface TierItem {
  id: string;
  name: string;
  image_url: string;
  type: "celeb" | "character";
  currentTier: string;
}

// CORS Hatasını Çözen Mucizevi Proxy Fonksiyonu
const getProxiedImageUrl = (url: string) => {
  if (!url) return "";
  // Eğer resim zaten lokaldeyse veya base64 ise dokunma
  if (url.startsWith("data:") || url.startsWith("/")) return url;
  
  // Dış bağlantıları (linkleri) CORS izinli bir proxy üzerinden geçir
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
};

export default function TierListSayfasi() {
  const [items, setItems] = useState<TierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "celeb" | "character">("all");
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [celebsRes, charsRes] = await Promise.all([
          supabase.from("ranked_celebrities").select("id, name, image_url").limit(50),
          supabase.from("ranked_characters").select("id, name, image_url").limit(50)
        ]);

        const combinedItems: TierItem[] = [];

        if (celebsRes.data) {
          celebsRes.data.forEach((c) => combinedItems.push({ ...c, type: "celeb", currentTier: "unranked" }));
        }
        if (charsRes.data) {
          charsRes.data.forEach((c) => combinedItems.push({ ...c, type: "character", currentTier: "unranked" }));
        }

        setItems(combinedItems.sort(() => 0.5 - Math.random()));
      } catch (error) {
        console.error("Veri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- DRAG & DROP FONKSİYONLARI ---
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("itemId", itemId);
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = "0.4";
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, targetTier: string) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData("itemId");
    
    if (draggedItemId) {
      setItems((prevItems) => 
        prevItems.map((item) => 
          item.id === draggedItemId ? { ...item, currentTier: targetTier } : item
        )
      );
    }
  };

  // --- AKSİYON BUTONLARI ---
  const handleReset = () => {
    if (window.confirm("Tüm sıralamayı sıfırlamak istediğine emin misin?")) {
      setItems((prevItems) => prevItems.map(item => ({ ...item, currentTier: "unranked" })));
    }
  };

  const handleDownloadPNG = async () => {
    if (!captureRef.current) return;
    
    try {
      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: "#050505",
        pixelRatio: 2, // Yüksek kalite
        cacheBust: true, // Tarayıcı önbellek takılmalarını önler
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `looksmax-tier-list-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Canvas Hatası:", error);
      alert("Fotoğraf oluşturulurken bir hata meydana geldi. Sayfayı yenileyip tekrar deneyin.");
    }
  };

  if (loading) return <Loader text="Tier List Havuzu Hazırlanıyor..." />;

  const unrankedItems = items.filter((item) => {
    if (item.currentTier !== "unranked") return false;
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <main className="relative min-h-screen w-full pt-24 md:pt-32 pb-24 px-4 md:px-12 flex flex-col">
      <PageHeader 
        kicker="Sıralama Motoru"
        issue="İnteraktif"
        title="LOOKSMAX TIER LIST"
        description="Kendi estetik ve güç hiyerarşini oluştur. Aşağıdaki havuzdan karakterleri ve ünlüleri sürükleyip S Tier'dan Sub5'a kadar sırala, sonra PNG olarak indirip paylaş."
      />

      {/* AKSİYON ÇUBUĞU */}
      <div className="max-w-[85rem] mx-auto w-full mb-12 flex flex-col md:flex-row justify-between items-center gap-6 dergi-border border-b pb-6 animate-title">
        
        {/* Editorial Filtreler */}
        <div className="flex bg-[#0a0a0a] dergi-border border p-1">
          <button onClick={() => setFilter("all")} className={`px-6 py-3 text-xs font-mono uppercase tracking-[0.3em] transition-all duration-500 ${filter === "all" ? "bg-white text-black font-semibold" : "text-white/40 hover:text-white"}`}>Karışık</button>
          <button onClick={() => setFilter("celeb")} className={`px-6 py-3 text-xs font-mono uppercase tracking-[0.3em] transition-all duration-500 ${filter === "celeb" ? "bg-white text-black font-semibold" : "text-white/40 hover:text-white"}`}>Ünlüler</button>
          <button onClick={() => setFilter("character")} className={`px-6 py-3 text-xs font-mono uppercase tracking-[0.3em] transition-all duration-500 ${filter === "character" ? "bg-white text-black font-semibold" : "text-white/40 hover:text-white"}`}>Karakterler</button>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex gap-4">
          <button onClick={handleReset} className="px-6 py-3 border border-white/10 text-xs tracking-[0.3em] uppercase text-white/40 hover:text-red-400 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-500">
            [ Sıfırla ]
          </button>
          <button onClick={handleDownloadPNG} className="dergi-btn !bg-white !text-black !border-white hover:!bg-white/90 !font-semibold flex items-center gap-2">
            📷 PNG İNDİR
          </button>
        </div>
      </div>

      {/* TIER LIST ALANI (Fotoğrafı Çekilecek Alan) */}
      <div className="max-w-[85rem] mx-auto w-full overflow-x-auto mb-20 shadow-2xl">
        <div 
          ref={captureRef} 
          className="min-w-[900px] flex flex-col bg-[#050505] dergi-border border p-4 md:p-6 gap-3"
        >
          {TIERS.map((tier) => (
            <div key={tier.id} className="flex min-h-[140px] md:min-h-[160px] bg-[#0a0a0a] dergi-border border">
              
              {/* Tier Başlığı */}
              <div className={`w-32 md:w-40 flex-shrink-0 ${tier.color} flex flex-col items-center justify-center border-r border-black/50 p-2 shadow-inner`}>
                <span className="text-white font-black text-3xl md:text-4xl text-center drop-shadow-xl tracking-tighter">
                  {tier.id}
                </span>
                <span className="text-white/80 text-[9px] md:text-[10px] uppercase tracking-widest mt-2 text-center font-mono font-medium">
                  {tier.label.replace(tier.id + " - ", "").replace(`(${tier.id})`, "")}
                </span>
              </div>

              {/* Bırakma Alanı */}
              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, tier.id)}
                className="flex-1 flex flex-wrap content-start gap-3 p-3 md:p-4"
              >
                {items.filter(item => item.currentTier === tier.id).map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragEnd={handleDragEnd}
                    className="relative w-24 h-24 md:w-32 md:h-32 aspect-square dergi-border border cursor-grab active:cursor-grabbing hover:border-white/60 transition-all overflow-hidden group shadow-lg"
                  >
                    {/* Artık resimler CORS hatası vermeyen proxy URL'si ile yükleniyor */}
                    <img 
                      src={getProxiedImageUrl(item.image_url)} 
                      alt={item.name} 
                      crossOrigin="anonymous"
                      draggable={false}
                      className="object-cover object-top w-full h-full pointer-events-none" 
                    />
                    <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-sm text-[10px] md:text-xs text-center text-white/90 truncate px-2 py-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity font-light tracking-wide">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Filigran */}
          <div className="w-full flex justify-between items-end pt-4 px-2">
            <span className="text-white/20 font-mono text-[10px] uppercase tracking-widest">Aesthetics Engine v1.0</span>
            <span className="text-white/30 font-mono text-sm md:text-base uppercase tracking-[0.4em] font-bold">TRCHADS.COM</span>
          </div>
        </div>
      </div>

      {/* SIRALANMAMIŞLAR HAVUZU */}
      <div className="max-w-[85rem] mx-auto w-full">
        <h3 className="dergi-kicker mb-6">Sıralanmamış Havuz (Sürükle)</h3>
        
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "unranked")}
          className="w-full min-h-[300px] bg-[#0a0a0a] dergi-border border p-8 flex flex-wrap gap-5 items-start justify-center md:justify-start"
        >
          {unrankedItems.length === 0 ? (
            <span className="dergi-body m-auto text-center">Havuzda kimse kalmadı veya bu filtrede sonuç yok.</span>
          ) : (
            unrankedItems.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                className="relative w-28 h-28 md:w-36 md:h-36 aspect-square dergi-border border cursor-grab active:cursor-grabbing hover:scale-105 hover:border-white transition-all shadow-xl overflow-hidden group"
              >
                {/* Havuzdaki resimler de proxy üzerinden çekiliyor */}
                <img 
                  src={getProxiedImageUrl(item.image_url)} 
                  alt={item.name} 
                  crossOrigin="anonymous"
                  draggable={false}
                  className="object-cover object-top w-full h-full pointer-events-none" 
                />
                <div className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                  <span className={`w-2 h-2 rounded-full block ${item.type === 'celeb' ? 'bg-yellow-400' : 'bg-indigo-400'}`}></span>
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent text-xs md:text-sm text-center text-white truncate px-2 py-2 font-light">
                  {item.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </main>
  );
}