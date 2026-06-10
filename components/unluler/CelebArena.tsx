"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Celebrity } from "@/types"; 

interface CelebArenaProps {
  isOpen: boolean;
  onClose: () => void;
  allCelebs: Celebrity[];
}

export default function CelebArena({ isOpen, onClose, allCelebs }: CelebArenaProps) {
  const [currentPair, setCurrentPair] = useState<[Celebrity, Celebrity] | null>(null);
  const [queue, setQueue] = useState<Celebrity[]>([]); 
  const [nextRound, setNextRound] = useState<Celebrity[]>([]);
  const [stage, setStage] = useState<string>(""); 
  const [champion, setChampion] = useState<Celebrity | null>(null);

  const startTournament = useCallback(() => {
    if (allCelebs.length >= 4) {
      const shuffled = [...allCelebs].sort(() => 0.5 - Math.random());
      const tournamentSize = shuffled.length >= 8 ? 8 : 4;
      const selected = shuffled.slice(0, tournamentSize);
      
      setStage(tournamentSize === 8 ? "Çeyrek Final" : "Yarı Final");
      setCurrentPair([selected[0], selected[1]]);
      setQueue(selected.slice(2));
      setNextRound([]);
      setChampion(null);
    }
  }, [allCelebs]);

  useEffect(() => {
    if (isOpen) {
      startTournament();
    }
  }, [isOpen, startTournament]);

  if (!isOpen) return null;

  if (allCelebs.length < 4) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md">
        <div className="bg-[#050505] border dergi-border p-12 text-center max-w-lg shadow-2xl">
          <p className="dergi-kicker text-red-400 mb-4">Erişim Reddedildi</p>
          <h2 className="text-xl font-light text-white mb-8">Arenanın açılabilmesi için sisteme en az 4 kişi eklemelisin.</h2>
          <button onClick={onClose} className="dergi-btn bg-white text-black hover:bg-white/80 w-full">Geri Dön</button>
        </div>
      </div>
    );
  }

  const handleVote = (winner: Celebrity) => {
    const updatedNextRound = [...nextRound, winner];
    
    if (queue.length >= 2) {
      setCurrentPair([queue[0], queue[1]]);
      setQueue(queue.slice(2));
      setNextRound(updatedNextRound);
    } else {
      if (updatedNextRound.length === 1) {
        setChampion(updatedNextRound[0]);
      } else {
        setCurrentPair([updatedNextRound[0], updatedNextRound[1]]);
        setQueue(updatedNextRound.slice(2));
        setNextRound([]);
        setStage(updatedNextRound.length === 4 ? "Yarı Final" : "Büyük Final");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-[80rem] h-[85vh] min-h-[600px] bg-[#050505] border dergi-border flex flex-col shadow-2xl overflow-hidden">
        
        {/* Üst Çubuk */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
          <div className="flex flex-col gap-2">
            <span className="bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 dergi-kicker text-yellow-400 mb-0 shadow-lg">
              Güzellik / Yakışıklılık Arenası
            </span>
            {!champion && (
              <span className="bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 text-sm md:text-base font-light text-white tracking-widest uppercase shadow-lg inline-block w-fit">
                {stage}
              </span>
            )}
          </div>
          <button onClick={onClose} className="bg-black/60 backdrop-blur-md border border-white/10 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white text-2xl font-light pointer-events-auto transition-colors shadow-lg">
            ×
          </button>
        </div>

        {/* ŞAMPİYON EKRANI */}
        {champion ? (
          <div className="flex-1 w-full bg-[#050505] flex items-center justify-center p-6 md:p-16 animate-in fade-in duration-700">
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 md:gap-16">
              
              <div className="w-full max-w-[280px] md:max-w-md aspect-[3/4] relative border border-white/10 shadow-[0_0_40px_rgba(250,204,21,0.05)] bg-black shrink-0 overflow-hidden">
                <Image src={champion.image_url} alt={champion.name} fill className="object-cover object-top grayscale-[15%]" />
                <div className="absolute top-4 left-4 border border-white/20 bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-white/70">
                  Kazanan
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <span className="dergi-kicker text-yellow-400 mb-4">Arena Şampiyonu</span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-widest text-white mb-10 leading-tight">
                  {champion.name}
                </h2>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Link href={`/unluler/${champion.id}`} className="dergi-btn border-white text-white hover:bg-white hover:text-black px-8 py-4">
                    Profili İncele
                  </Link>
                  <button 
                    onClick={startTournament} 
                    className="text-xs font-mono text-white/40 hover:text-white uppercase tracking-[0.2em] border-b border-transparent hover:border-white/40 transition-all pb-1"
                  >
                    Tekrar Başlat
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* VS KAPIŞMA EKRANI */
          currentPair && (
            <div className="flex-1 w-full flex flex-col md:flex-row relative">
              
              <div 
                onClick={() => handleVote(currentPair[0])}
                className="flex-1 relative cursor-pointer group transition-all duration-700 hover:flex-[1.2] border-b md:border-b-0 md:border-r border-white/5 overflow-hidden"
              >
                <Image src={currentPair[0].image_url} alt={currentPair[0].name} fill className="object-cover object-top grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-wider truncate max-w-[90%]">{currentPair[0].name}</h2>
                  <p className="dergi-kicker text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 mt-2">Daha İyi (Seç)</p>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 md:w-20 md:h-20 bg-black/80 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md pointer-events-none">
                <span className="text-lg md:text-2xl font-mono text-white/60 italic tracking-widest">VS</span>
              </div>

              <div 
                onClick={() => handleVote(currentPair[1])}
                className="flex-1 relative cursor-pointer group transition-all duration-700 hover:flex-[1.2] overflow-hidden"
              >
                <Image src={currentPair[1].image_url} alt={currentPair[1].name} fill className="object-cover object-top grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 text-right translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-wider truncate max-w-[90%]">{currentPair[1].name}</h2>
                  <p className="dergi-kicker text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 mt-2">Daha İyi (Seç)</p>
                </div>
              </div>

            </div>
          )
        )}
      </div>
    </div>
  );
}