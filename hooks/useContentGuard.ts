import { useState } from "react";
import { detectSpam } from "@/lib/blacklist";

interface ContentGuardOptions {
  minLength?: number;
  maxLength?: number;
  cooldownSeconds?: number;
  cooldownKey?: string; // Farklı işlemler için ayrı cooldown anahtarı
}

export function useContentGuard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityError, setSecurityError] = useState("");

  const verifyAndExecute = async (
    textToCheck: string, 
    actionCallback: () => Promise<void>,
    options?: ContentGuardOptions
  ): Promise<boolean> => {
    setSecurityError("");
    
    const minLength = options?.minLength ?? 3;
    const maxLength = options?.maxLength ?? 1000;
    const cooldownSeconds = options?.cooldownSeconds ?? 5; // Makul arayüz beklemesi: 5 sn
    const storageKey = `trchads_action_${options?.cooldownKey || "generic"}`;

    const trimmedText = textToCheck.trim();

    if (trimmedText.length < minLength) {
      setSecurityError(`İçerik çok kısa. En az ${minLength} karakter olmalıdır.`);
      return false;
    }
    if (trimmedText.length > maxLength) {
      setSecurityError(`İçerik çok uzun. En fazla ${maxLength} karakter olabilir.`);
      return false;
    }

    // Arayüz Hız Sınırı (Rate Limiting)
    if (typeof window !== "undefined") {
      const now = Date.now();
      const lastActionTime = parseInt(localStorage.getItem(storageKey) || "0", 10);
      const timePassed = now - lastActionTime;
      const cooldownMs = cooldownSeconds * 1000;
      
      if (timePassed < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timePassed) / 1000);
        setSecurityError(`Çok hızlısınız! Yeni bir işlem için ${remainingSeconds} saniye beklemelisiniz.`);
        return false;
      }
    }

    // Spam ve küfür filtresi
    const spamCheck = detectSpam(textToCheck);
    if (!spamCheck.isClean) {
      setSecurityError(
        spamCheck.action === "ban" 
          ? `SİSTEM UYARISI: ${spamCheck.reason} İçerik reddedildi.` 
          : `İçerik Reddedildi: ${spamCheck.reason}`
      );
      return false;
    }

    setIsProcessing(true);
    try {
      await actionCallback();
      
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, Date.now().toString());
      }
      return true; 
    } catch (error: any) {
      console.error("Supabase İşlem Reddi:", error?.message);
      
      if (error?.message?.includes("row-level security")) {
        setSecurityError("Erişim reddedildi. Bu işlemi yapmak için yetkiniz bulunmuyor veya hesabınız kısıtlanmış olabilir.");
      } else if (error?.code === '429') {
        setSecurityError("Sistem meşgul, çok fazla istek gönderildi. Lütfen biraz bekleyin.");
      } else {
        setSecurityError("Sistemsel bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { verifyAndExecute, isProcessing, securityError, setSecurityError };
}