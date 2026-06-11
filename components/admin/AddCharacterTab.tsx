"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

// XSS ve Güvenlik için URL Doğrulama Yardımcısı
const isValidUrl = (string: string) => {
  if (!string) return true;
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export default function AddCharacterTab() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFile1, setGalleryFile1] = useState<File | null>(null); 
  const [galleryFile2, setGalleryFile2] = useState<File | null>(null); 
  const [galleryFile3, setGalleryFile3] = useState<File | null>(null); 

  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrl1, setGalleryUrl1] = useState("");
  const [galleryUrl2, setGalleryUrl2] = useState("");
  const [galleryUrl3, setGalleryUrl3] = useState("");
  
  const [universe, setUniverse] = useState("");
  const [race, setRace] = useState("");
  const [role, setRole] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gallery1Ref = useRef<HTMLInputElement>(null);
  const gallery2Ref = useRef<HTMLInputElement>(null);
  const gallery3Ref = useRef<HTMLInputElement>(null);

  const handleAddCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !imageUrl.trim()) {
      return setMessage({ text: "Lütfen karakterin ana profil fotoğrafı için dosya yükleyin veya link girin.", type: "error" });
    }

    if (!isValidUrl(imageUrl) || !isValidUrl(galleryUrl1) || !isValidUrl(galleryUrl2) || !isValidUrl(galleryUrl3)) {
      return setMessage({ text: "Girdiğiniz bağlantılar geçersiz. Sadece 'http://' veya 'https://' ile başlayan geçerli bir URL girin.", type: "error" });
    }
    
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    const uploadedFileNames: string[] = []; 

    try {
      const resolveImage = async (file: File | null, url: string) => {
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
          
          const { error } = await supabase.storage.from('characters').upload(fileName, file); 
          if (error) throw error;
          
          uploadedFileNames.push(fileName); 
          const { data: { publicUrl } } = supabase.storage.from('characters').getPublicUrl(fileName);
          return publicUrl;
        }
        return url.trim() || null;
      };

      const [mainImageRes, g1Res, g2Res, g3Res] = await Promise.all([
        resolveImage(imageFile, imageUrl),
        resolveImage(galleryFile1, galleryUrl1),
        resolveImage(galleryFile2, galleryUrl2),
        resolveImage(galleryFile3, galleryUrl3)
      ]);
      
      const { error: dbError } = await supabase.from("characters").insert([{ 
        name, 
        image_url: mainImageRes, 
        gallery_1: g1Res, 
        gallery_2: g2Res,
        gallery_3: g3Res,
        description,
        universe: universe.trim() || null,
        race: race.trim() || null,
        role: role.trim() || null
      }]);
      
      if (dbError) throw dbError; 

      setMessage({ text: "Karakter başarıyla PSL veri tabanına işlendi!", type: "success" });
      
      setName(""); setDescription(""); setUniverse(""); setRace(""); setRole("");
      setImageFile(null); setGalleryFile1(null); setGalleryFile2(null); setGalleryFile3(null);
      setImageUrl(""); setGalleryUrl1(""); setGalleryUrl2(""); setGalleryUrl3("");
      
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (gallery1Ref.current) gallery1Ref.current.value = '';
      if (gallery2Ref.current) gallery2Ref.current.value = '';
      if (gallery3Ref.current) gallery3Ref.current.value = '';

    } catch (error: unknown) {
      if (uploadedFileNames.length > 0) {
        await supabase.storage.from('characters').remove(uploadedFileNames);
      }
      setMessage({ text: error instanceof Error ? `Hata: ${error.message}` : "Beklenmeyen bir hata oluştu.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#050505] border dergi-border rounded-none px-6 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20";
  const urlInputClass = "w-full bg-[#050505]/50 border-b border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20 font-mono";
  const fileClass = "w-full bg-[#050505] border dergi-border rounded-none px-6 py-4 text-white/60 font-light file:mr-4 file:py-2 file:px-6 file:rounded-none file:border-0 file:bg-white/10 file:text-white file:font-mono file:text-xs file:uppercase file:tracking-widest cursor-pointer hover:file:bg-white/20 transition-all text-sm";

  return (
    <div className="max-w-3xl bg-transparent border dergi-border p-8 md:p-12 rounded-none relative overflow-hidden">
      <form onSubmit={handleAddCharacter} className="flex flex-col gap-8 relative z-10">
        
        <div className="flex flex-col gap-3">
          <label className="dergi-kicker mb-0">Karakter Adı</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn: Arthur Morgan, Geralt, Leon Kennedy" className={inputClass} />
        </div>

        <div className="flex flex-col gap-3 border-l-2 border-indigo-500/50 pl-4">
          <label className="dergi-kicker mb-0 text-indigo-400">1. Karakter Profil Fotoğrafı (Ana Yüz Görseli)</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setImageFile(e.target.files[0]); }} className={fileClass} />
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
            <input type="url" placeholder="Web linki yapıştır" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={urlInputClass} />
          </div>
        </div>

        <div className="border border-white/5 bg-black/40 p-6 flex flex-col gap-8">
          <div className="border-b dergi-border pb-4">
            <h3 className="dergi-kicker text-white/60 mb-1">Karakter Estetik & Profil Panosu</h3>
            <p className="text-[10px] text-white/30 font-light">Karakterin fiziksel görünümünü, kemik yapısını ve aurasını yansıtan ek görseller ekleyin.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">2. Tam Boy / Fizik Gösterimi (Landscape)</label>
            <input ref={gallery1Ref} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setGalleryFile1(e.target.files[0]); }} className={fileClass} />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
              <input type="url" placeholder="Web linki yapıştır" value={galleryUrl1} onChange={(e) => setGalleryUrl1(e.target.value)} className={urlInputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">3. Yan Profil / Çene Hattı (Portrait)</label>
            <input ref={gallery2Ref} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setGalleryFile2(e.target.files[0]); }} className={fileClass} />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
              <input type="url" placeholder="Web linki yapıştır" value={galleryUrl2} onChange={(e) => setGalleryUrl2(e.target.value)} className={urlInputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">4. Aksiyon / Aura Anı (Portrait)</label>
            <input ref={gallery3Ref} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setGalleryFile3(e.target.files[0]); }} className={fileClass} />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
              <input type="url" placeholder="Web linki yapıştır" value={galleryUrl3} onChange={(e) => setGalleryUrl3(e.target.value)} className={urlInputClass} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y dergi-border py-8">
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">Evren / Oyun</label>
            <input type="text" placeholder="Örn: The Witcher" value={universe} onChange={(e) => setUniverse(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">Irk / Fenotip</label>
            <input type="text" placeholder="Örn: Mutant, İnsan" value={race} onChange={(e) => setRace(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">Rol / Sınıf</label>
            <input type="text" placeholder="Örn: Suikastçi, Büyücü" value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="dergi-kicker mb-0">Fiziksel Analiz & Lore (Karakter Özeti)</label>
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Karakterin kemik yapısı, aurası ve hikayedeki duruşu hakkında bilgiler..." className={`${inputClass} resize-none`} />
        </div>

        {message.text && (
          <div className={`p-5 rounded-none dergi-kicker mb-0 border ${message.type === "success" ? "bg-white/5 text-white border-white/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="dergi-btn w-full bg-white text-black hover:bg-white/80 font-bold border-white mt-4 disabled:opacity-50">
          {isSubmitting ? "ARŞİVE İŞLENİYOR..." : "KARAKTERİ SİSTEME YÜKLE"}
        </button>
        
      </form>
    </div>
  );
}