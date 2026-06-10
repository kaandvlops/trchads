import { useState } from "react";
import { detectSpam } from "@/lib/blacklist";

export function useContentGuard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityError, setSecurityError] = useState("");

  const verifyAndExecute = async (
    textToCheck: string, 
    actionCallback: () => Promise<void>,
    options?: { minLength?: number; maxLength?: number; cooldownSeconds?: number }
  ) => {
    setSecurityError("");
    
    const minLength = options?.minLength ?? 3;
    const maxLength = options?.maxLength ?? 500;
    const cooldownMs = (options?.cooldownSeconds ?? 60) * 1000;

    const trimmedText = textToCheck.trim();

    if (trimmedText.length < minLength) {
      setSecurityError(`İçerik çok kısa. En az ${minLength} karakter olmalıdır.`);
      return false;
    }
    if (trimmedText.length > maxLength) {
      setSecurityError(`İçerik çok uzun. En fazla ${maxLength} karakter olabilir (Şu an: ${trimmedText.length}).`);
      return false;
    }

    // UI Düzeyinde Hız Sınırı (F5/LocalStorage bypass edilebilir, asıl limit DB'de olmalıdır)
    const now = Date.now();
    const lastActionTime = parseInt(localStorage.getItem("trchads_last_action") || "0", 10);
    const timePassed = now - lastActionTime;
    
    if (timePassed < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - timePassed) / 1000);
      setSecurityError(`Çok hızlısınız! Yeni bir işlem için ${remainingSeconds} saniye beklemelisiniz.`);
      return false;
    }

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
      
      // Başarılı işlem sonrası zaman damgasını güncelle
      localStorage.setItem("trchads_last_action", Date.now().toString());
      return true; 
    } catch (error: any) {
      console.error("Supabase Reddi:", error.message);
      
      if (error.message?.includes("row-level security")) {
        setSecurityError("Erişim reddedildi. Bu işlemi yapmak için yetkiniz bulunmuyor veya hesabınız (RLS) kısıtlanmış olabilir.");
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