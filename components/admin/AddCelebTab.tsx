"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCelebTab() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // FOTOĞRAF ALANLARI (Dosya Yükleme)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFile1, setGalleryFile1] = useState<File | null>(null); 
  const [galleryFile2, setGalleryFile2] = useState<File | null>(null); 
  const [galleryFile3, setGalleryFile3] = useState<File | null>(null); 

  // YENİ: TELİF KORUMASI İÇİN LİNK (URL) ALANLARI
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrl1, setGalleryUrl1] = useState("");
  const [galleryUrl2, setGalleryUrl2] = useState("");
  const [galleryUrl3, setGalleryUrl3] = useState("");
  
  const [country, setCountry] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gallery1Ref = useRef<HTMLInputElement>(null);
  const gallery2Ref = useRef<HTMLInputElement>(null);
  const gallery3Ref = useRef<HTMLInputElement>(null);

  const handleAddCeleb = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ana kapak için en azından biri (Dosya veya Link) olmak zorunda
    if (!imageFile && !imageUrl.trim()) {
      return setMessage({ text: "Lütfen ana kapak resmi için dosya yükleyin veya link girin.", type: "error" });
    }
    
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    const uploadedFileNames: string[] = []; // Rollback (Hata durumunda silme) için liste

    try {
      // 1. Akıllı Yükleme Fonksiyonu (Dosya varsa yükler, Link varsa linki döndürür)
      const resolveImage = async (file: File | null, url: string) => {
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          
          const { error } = await supabase.storage.from('celebrities').upload(fileName, file);
          if (error) throw error;
          
          uploadedFileNames.push(fileName); 
          
          const { data: { publicUrl } } = supabase.storage.from('celebrities').getPublicUrl(fileName);
          return publicUrl;
        }
        return url.trim() || null;
      };

      // 2. PARALEL YÜKLEME (Promise.all ile 4 kat hız artışı!)
      const [mainImageRes, g1Res, g2Res, g3Res] = await Promise.all([
        resolveImage(imageFile, imageUrl),
        resolveImage(galleryFile1, galleryUrl1),
        resolveImage(galleryFile2, galleryUrl2),
        resolveImage(galleryFile3, galleryUrl3)
      ]);
      
      // 3. Veritabanına Kaydet
      const { error: dbError } = await supabase.from("celebrities").insert([{ 
        name, 
        image_url: mainImageRes, 
        gallery_1: g1Res, 
        gallery_2: g2Res,
        gallery_3: g3Res,
        description,
        country: country.trim() || null,
        birth_year: birthYear.trim() || null,
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null
      }]);
      
      if (dbError) throw dbError; 

      setMessage({ text: "Profil ve Dergi Panosu başarıyla sisteme işlendi!", type: "success" });
      
      // Formu tamamen temizle
      setName(""); setDescription(""); setCountry(""); setBirthYear(""); setHeight(""); setWeight("");
      setImageFile(null); setGalleryFile1(null); setGalleryFile2(null); setGalleryFile3(null);
      setImageUrl(""); setGalleryUrl1(""); setGalleryUrl2(""); setGalleryUrl3("");
      
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (gallery1Ref.current) gallery1Ref.current.value = '';
      if (gallery2Ref.current) gallery2Ref.current.value = '';
      if (gallery3Ref.current) gallery3Ref.current.value = '';

    } catch (error: unknown) {
      // Hata durumunda sadece Supabase Storage'a gerçekten yüklenen "dosyaları" sil (Rollback)
      if (uploadedFileNames.length > 0) {
        await supabase.storage.from('celebrities').remove(uploadedFileNames);
      }
      
      if (error instanceof Error) {
        setMessage({ text: `Hata: ${error.message}`, type: "error" });
      } else {
        setMessage({ text: "Sisteme yüklenirken beklenmeyen bir hata oluştu.", type: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#050505] border dergi-border rounded-none px-6 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20";
  const urlInputClass = "w-full bg-[#050505]/50 border-b border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20 font-mono";
  const fileClass = "w-full bg-[#050505] border dergi-border rounded-none px-6 py-4 text-white/60 font-light file:mr-4 file:py-2 file:px-6 file:rounded-none file:border-0 file:bg-white/10 file:text-white file:font-mono file:text-xs file:uppercase file:tracking-widest cursor-pointer hover:file:bg-white/20 transition-all text-sm";

  return (
    <div className="max-w-3xl bg-transparent border dergi-border p-8 md:p-12 rounded-none relative overflow-hidden">
      <form onSubmit={handleAddCeleb} className="flex flex-col gap-8 relative z-10">
        
        <div className="flex flex-col gap-3">
          <label className="dergi-kicker mb-0">Profil / Karakter Adı</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        {/* 1. ANA KAPAK (Dosya veya Link) */}
        <div className="flex flex-col gap-3 border-l-2 border-yellow-500/50 pl-4">
          <label className="dergi-kicker mb-0 text-yellow-500/80">1. Profil Fotoğrafı (Ana Kapak / Vesikalık)</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setImageFile(e.target.files[0]); }} className={fileClass} />
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
            <input type="url" placeholder="Pinterest vb. resim adresi (.jpg / .png) yapıştır" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={urlInputClass} />
          </div>
        </div>

        {/* ESTETİK PANO */}
        <div className="border border-white/5 bg-black/40 p-6 flex flex-col gap-8">
          <div className="border-b dergi-border pb-4">
            <h3 className="dergi-kicker text-white/60 mb-1">Estetik Pano (Dergi Konsepti)</h3>
            <p className="text-[10px] text-white/30 font-light">Sunucu kotası için dosyaları indirmek yerine Pinterest linklerini yapıştırabilirsiniz.</p>
          </div>
          
          {/* G1 */}
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">2. Yatay (Landscape) Ortam Karesi</label>
            <input ref={gallery1Ref} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setGalleryFile1(e.target.files[0]); }} className={fileClass} />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
              <input type="url" placeholder="Resim linki yapıştır" value={galleryUrl1} onChange={(e) => setGalleryUrl1(e.target.value)} className={urlInputClass} />
            </div>
          </div>

          {/* G2 */}
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">3. Dikey (Portrait) Detay Karesi 1</label>
            <input ref={gallery2Ref} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setGalleryFile2(e.target.files[0]); }} className={fileClass} />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
              <input type="url" placeholder="Resim linki yapıştır" value={galleryUrl2} onChange={(e) => setGalleryUrl2(e.target.value)} className={urlInputClass} />
            </div>
          </div>

          {/* G3 */}
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">4. Dikey (Portrait) Detay Karesi 2</label>
            <input ref={gallery3Ref} type="file" accept="image/*" onChange={(e) => { if (e.target.files) setGalleryFile3(e.target.files[0]); }} className={fileClass} />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">VEYA</span>
              <input type="url" placeholder="Resim linki yapıştır" value={galleryUrl3} onChange={(e) => setGalleryUrl3(e.target.value)} className={urlInputClass} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y dergi-border py-8">
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">Ülke / Menşei</label>
            <input type="text" placeholder="Örn: Türkiye" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">Doğum Yılı / Tarihi</label>
            <input type="text" placeholder="Örn: 1990 veya 15 Mayıs 1995" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">Boy (CM)</label>
            <input type="number" placeholder="Örn: 185" value={height} onChange={(e) => setHeight(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="dergi-kicker mb-0">Kilo (KG)</label>
            <input type="number" placeholder="Örn: 80" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="dergi-kicker mb-0">Biyografi / Hakkında</label>
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        {message.text && (
          <div className={`p-5 rounded-none dergi-kicker mb-0 border ${message.type === "success" ? "bg-white/5 text-white border-white/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="dergi-btn w-full bg-white text-black hover:bg-white/80 font-bold border-white mt-4 disabled:opacity-50">
          {isSubmitting ? "ARŞİVE EKLENİYOR..." : "SİSTEME YÜKLE"}
        </button>
        
      </form>
    </div>
  );
}