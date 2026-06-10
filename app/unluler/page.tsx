"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Celebrity } from "@/types";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
// YENİ: Arena bileşenini dahil ettik
import CelebArena from "@/components/unluler/CelebArena";

export default function UnlulerSayfasi() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  // YENİ: Arena kontrol state'i
  const [isArenaOpen, setIsArenaOpen] = useState(false);

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const { data, error } = await supabase
          .from("ranked_celebrities")
          .select("*")
          .limit(100);

        if (error) throw error;
        if (data) setCelebrities(data as Celebrity[]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Beklenmeyen bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrities();
  }, []);

  if (loading) return <Loader text="Sıralama Yükleniyor..." />;

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white/50 tracking-widest uppercase text-sm gap-4">
        <span>Sıralama Yüklenemedi</span>
        <span className="text-xs text-white/30 normal-case">{errorMsg}</span>
      </div>
    );
  }

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden pt-24 md:pt-32 pb-24 px-6 md:px-12 flex flex-col">
      
      {/* YENİ: Arena Bileşeni */}
      <CelebArena 
        isOpen={isArenaOpen} 
        onClose={() => setIsArenaOpen(false)} 
        allCelebs={celebrities} 
      />

      <PageHeader 
        title="Sıralama"
        description="Estetiğin kesin mimari hiyerarşisi. Topluluk tarafından dikkatle değerlendirildi, titizlikle analiz edildi ve sıralandı. Sayısallaştırılmış mükemmellik."
      />

      {/* YENİ: Arena'ya Gir Butonu (Sarı Konseptli) */}
      <section className="max-w-[85rem] mx-auto w-full mb-12 flex justify-end">
        <button 
          onClick={() => setIsArenaOpen(true)}
          className="group relative flex items-center gap-4 bg-yellow-600/10 hover:bg-yellow-600/20 border border-yellow-500/30 hover:border-yellow-400 px-6 py-3 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-yellow-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
          <span className="relative z-10 flex items-center justify-center w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          <span className="relative z-10 dergi-kicker mb-0 text-yellow-300 group-hover:text-white transition-colors">Arena'ya Gir</span>
          <span className="relative z-10 font-mono text-xs text-yellow-500 group-hover:text-yellow-300 transition-colors">[ VS Modu ]</span>
        </button>
      </section>

      {/* Grid Konteyner */}
      <section className="max-w-[85rem] mx-auto w-full flex-1">
        {celebrities.length === 0 ? (
          <div className="w-full border-y dergi-border py-32 text-center dergi-kicker">
            Sistemde veri bulunamadı.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {celebrities.map((celeb, index) => {
              const isFirst = index === 0;

              return (
                <div key={celeb.id} className="relative w-full group block">
                  {isFirst && (
                    <div className="absolute -inset-1 bg-yellow-400 blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700 z-0 rounded-sm"></div>
                  )}

                  <Link href={`/unluler/${celeb.id}`} className={`relative z-10 w-full aspect-[3/4] bg-[#050505] border overflow-hidden block transition-all duration-700 ${isFirst ? 'border-yellow-400' : 'border-white/10 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]'}`}>
                    <Image 
                      src={celeb.image_url} alt={celeb.name} fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 transition-opacity duration-500 z-0" />
                    
                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8">
                      <div className="flex justify-between items-start w-full gap-4">
                        <div className="flex items-start">
                          <span className={`dergi-kicker mr-2 mt-2 ${isFirst ? 'text-yellow-400/80' : ''}`}>No.</span>
                          <span className={`text-5xl md:text-6xl font-extralight tracking-tighter ${isFirst ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white/70 group-hover:text-white'} transition-colors duration-500`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className={`dergi-kicker mb-1 ${isFirst ? 'text-yellow-400/80' : ''}`}>Puan</span>
                          <span className={`text-3xl md:text-4xl font-light tracking-widest ${isFirst ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white group-hover:text-white/90'} transition-colors duration-500`}>
                            {celeb.overall_avg?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                      </div>

                      <div className="border-t dergi-border pt-6 flex flex-col justify-end w-full mt-auto">
                        <h2 className="dergi-subtitle uppercase mb-3 group-hover:text-white/90 transition-colors duration-500 truncate w-full">{celeb.name}</h2>
                        <span className="dergi-kicker mb-0">{celeb.total_votes} Değerlendirme</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="max-w-[85rem] mx-auto w-full border-t dergi-border mt-32"></div>
    </main>
  );
}