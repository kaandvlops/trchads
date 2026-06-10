"use client";

import { useEffect } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  glowColor?: "red" | "yellow";
}

export default function BaseModal({ isOpen, onClose, children, glowColor = "yellow" }: BaseModalProps) {
  
  // GÜVENLİK VE UX YAMASI: ESC tuşu kontrolü ve Arka plan Scroll engelleme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // YENİ: Modal açıldığında arka plan kaymasını engelle
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "";
    }
    
    // Component silindiğinde veya kapandığında temizlik yap
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; 
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Renge göre parlama efekti (Glow)
  const glowClass = glowColor === "red" ? "bg-red-500/10" : "bg-yellow-500/10";

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 ${glowClass} blur-[50px] pointer-events-none`} />
        {children}
      </div>
    </div>
  );
}