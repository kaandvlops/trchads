"use client";

import { useState, useEffect } from "react";

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName?: string;
}

export default function ReportContentModal({ isOpen, onClose, targetName }: ReportContentModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reasons = [
    "Telif Hakkı İhlali (Bana / Kurumuma ait görsel)",
    "Uygunsuz / Rahatsız Edici İçerik",
    "Yanlış / İlgisiz Görsel Kullanımı",
    "Kişisel Verilerin İhlali",
    "Diğer"
  ];

  const handleSendEmail = () => {
    if (!selectedReason) {
      alert("Lütfen bir bildirim sebebi seçin.");
      return;
    }

    const subject = encodeURIComponent(`İçerik Bildirimi: ${targetName || "Bilinmeyen Sayfa"}`);
    const body = encodeURIComponent(
      `Merhaba TRCHADS Destek Ekibi,\n\nAşağıdaki içerik ile ilgili resmi bir bildirimde bulunmak istiyorum:\n\n` +
      `Bildirim Sebebi: ${selectedReason}\n` +
      `İlgili İçerik / Kişi: ${targetName || "Belirtilmemiş"}\n` +
      `Sayfa Bağlantısı: ${pageUrl}\n\n` +
      `Ek Açıklama (Lütfen buraya detayları, telif hakkı size aitse kanıt linklerini ekleyiniz):\n`
    );

    window.location.href = `mailto:support@trchads.com?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@trchads.com");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#050505] border dergi-border flex flex-col shadow-2xl overflow-hidden">
        
        <div className="border-b border-white/10 p-6 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="dergi-kicker mb-1 text-white/80">İçerik Bildirimi</h3>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-0">Destek Ekibine İlet</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl">
            ×
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <p className="text-sm font-light text-white/60 leading-relaxed">
            Eğer bu sayfadaki görsellerin telif hakkını ihlal ettiğini veya topluluk kurallarına aykırı olduğunu düşünüyorsanız, lütfen sebebi seçin:
          </p>

          <div className="flex flex-col gap-3">
            {reasons.map((reason, idx) => (
              <label 
                key={idx} 
                className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${selectedReason === reason ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30 bg-transparent'}`}
              >
                <div className={`w-3 h-3 border rounded-full flex items-center justify-center transition-all ${selectedReason === reason ? 'border-white' : 'border-white/30'}`}>
                  {selectedReason === reason && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <input 
                  type="radio" 
                  name="reportReason" 
                  value={reason} 
                  checked={selectedReason === reason} 
                  onChange={(e) => setSelectedReason(e.target.value)} 
                  className="hidden" 
                />
                <span className="text-xs font-mono tracking-wide text-white/80 uppercase">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 p-6 flex flex-col gap-4 bg-white/[0.01]">
          <div className="flex gap-4">
            <button 
              onClick={onClose} 
              className="flex-1 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all"
            >
              İptal
            </button>
            <button 
              onClick={handleSendEmail} 
              className="flex-1 bg-white text-black hover:bg-white/80 border border-white py-3 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all"
            >
              Mail Uygulamasını Aç
            </button>
          </div>
          
          {/* YENİ: Mail uygulaması bozuk olanlar için Manuel Kopyalama Alanı */}
          <div className="mt-2 text-center flex flex-col items-center gap-2 border-t border-white/5 pt-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Veya şikayetinizi manuel olarak iletin:</span>
            <button 
              onClick={handleCopyEmail}
              className={`text-xs font-mono px-4 py-2 border transition-all ${isCopied ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'}`}
            >
              {isCopied ? "✓ ADRES KOPYALANDI" : "support@trchads.com"}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}