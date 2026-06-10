"use client";

import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("Uygunsuz İçerik / Hakaret");

  if (!isOpen) return null;

  const reasons = [
    "Uygunsuz İçerik / Hakaret",
    "Spam / Reklam",
    "Forum Kuralları İhlali",
    "Yanıltıcı Bilgi"
  ];

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#050505] border dergi-border flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="border-b border-white/10 p-6 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="dergi-kicker mb-1 text-white/80">İçeriği Şikayet Et</h3>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-0">Moderatörlere İlet</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl">
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 flex flex-col gap-6">
          <p className="text-sm font-light text-white/60 leading-relaxed">
            Bu içeriğin topluluk kurallarımızı ihlal ettiğini düşünüyorsanız, lütfen en uygun sebebi seçin:
          </p>

          <div className="flex flex-col gap-3">
            {reasons.map((reason, idx) => (
              <label 
                key={idx} 
                className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${
                  selectedReason === reason 
                    ? 'border-red-500/50 bg-red-500/5' 
                    : 'border-white/10 hover:border-white/30 bg-transparent'
                }`}
              >
                <div className={`w-3 h-3 border rounded-full flex items-center justify-center transition-all ${
                  selectedReason === reason ? 'border-red-500' : 'border-white/30'
                }`}>
                  {selectedReason === reason && <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                </div>
                <input 
                  type="radio" 
                  name="reportReason" 
                  value={reason} 
                  checked={selectedReason === reason} 
                  onChange={(e) => setSelectedReason(e.target.value)} 
                  className="hidden" 
                />
                <span className={`text-xs font-mono tracking-wide uppercase transition-colors ${
                  selectedReason === reason ? 'text-red-400/90' : 'text-white/80'
                }`}>
                  {reason}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-6 flex gap-4 bg-white/[0.01]">
          <button 
            onClick={onClose} 
            className="flex-1 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all"
          >
            İptal
          </button>
          <button 
            onClick={handleSubmit} 
            className="flex-1 bg-red-900/40 text-red-100 hover:bg-red-800/60 border border-red-500/50 py-3 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all"
          >
            Gönder
          </button>
        </div>
        
      </div>
    </div>
  );
}