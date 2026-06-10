"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Category } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import { useContentGuard } from "@/hooks/useContentGuard";

export default function YeniKonuSayfasi() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.slug as string;

  const { user, profile, isBanned, loading: authLoading } = useAuth();
  
  const { verifyAndExecute, isProcessing, securityError, setSecurityError } = useContentGuard();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      const { data } = await supabase
         .from("forum_categories")
         .select("*")
         .eq("slug", categorySlug)
         .maybeSingle(); 
         
      if (data) setCategory(data as Category);
      setDataLoading(false);
    };
    fetchCategory();
  }, [categorySlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError("");

    if (!user) return setSecurityError("Giriş yapmalısınız.");
    if (isBanned) return setSecurityError("Banlı olduğunuz için işlem yapamazsınız.");
    if (!category) return setSecurityError("Geçersiz kategori.");
    if (title.trim().length < 5) return setSecurityError("Konu başlığı çok kısa.");
    if (content.trim().length < 20) return setSecurityError("İçerik daha detaylı olmalıdır.");

    const fullText = `${title} ${content}`;

    await verifyAndExecute(fullText, async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .insert([{ category_id: category.id, user_id: user.id, title: title.trim(), content: content.trim() }])
        .select().single();
        
      if (error) throw error;
      if (data) router.push(`/forum/konu/${data.id}`);
    });
  };

  if (authLoading || dataLoading) return <Loader text="Arşiv Taranıyor..." />;
  
  if (isBanned) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="bg-black border border-red-500/30 p-8 md:p-16 max-w-2xl text-center shadow-2xl rounded-none">
          <div className="w-16 h-16 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto mb-8 rounded-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
          <h2 className="dergi-title text-red-500/90 mb-6 uppercase">Erişim Engellendi</h2>
          <p className="dergi-body text-red-200/70 mb-10">
            Hesabınız kuralları ihlal ettiği gerekçesiyle geçici olarak uzaklaştırılmıştır. Arşive yeni bir kayıt ekleyemezsiniz.
          </p>
          <div className="border-t border-red-500/20 pt-6 mb-10">
            <span className="dergi-kicker text-red-500/50 mb-0">
              Ceza Bitiş: {new Date(profile!.banned_until!).toLocaleString('tr-TR')}
            </span>
          </div>
          <Link href={`/forum/${categorySlug}`} className="dergi-btn bg-transparent border-red-500/30 hover:border-red-500/60 text-red-500/60 hover:text-red-400">
            Kategoriye Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return <div className="min-h-[70vh] flex items-center justify-center dergi-kicker text-red-500">Erişim Reddedildi. Kayıt oluşturmak için giriş yapmalısınız.</div>;
  if (!category) return <div className="min-h-[70vh] flex items-center justify-center dergi-kicker text-red-500">Kategori Bulunamadı.</div>;

  return (
    <main className="relative min-h-screen max-w-4xl mx-auto p-6 py-24">
      {/* Parlama efektleri silindi */}

      <div className="mb-12 border-b dergi-border pb-8 flex flex-col gap-6">
        <Link href={`/forum/${categorySlug}`} className="dergi-kicker hover:text-white transition-colors w-fit mb-0">
          ← {category.name}
        </Link>
        <div>
          <h1 className="dergi-title mb-4">YENİ KAYIT.</h1>
          <p className="dergi-body">
            Sistem arşivi için kurallara uygun, objektif bir başlık açın.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-transparent border dergi-border p-8 md:p-12 rounded-none flex flex-col gap-8 shadow-2xl">
        
        {securityError && (
          <div className="bg-black border border-red-500/30 text-red-500 p-5 rounded-none dergi-kicker text-center mb-0">
            {securityError}
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <label className="dergi-kicker ml-0 mb-0">Konu Başlığı</label>
          <input 
            type="text" 
            required 
            maxLength={100} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            disabled={isProcessing} 
            placeholder="Tartışmak istediğiniz konuyu özetleyin..." 
            className="w-full bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors" 
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="dergi-kicker ml-0 mb-0">Detaylar & İçerik</label>
          <textarea 
            required 
            rows={8} 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            disabled={isProcessing} 
            placeholder="Konuyu detaylandırın, argümanlarınızı sunun..." 
            className="w-full bg-[#050505] border dergi-border rounded-none px-5 py-4 dergi-body text-white focus:outline-none focus:border-white/40 transition-colors resize-none" 
          />
        </div>

        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={isProcessing || title.trim().length === 0 || content.trim().length === 0} 
            className="dergi-btn w-full md:w-auto disabled:opacity-50"
          >
            {isProcessing ? "Taranıyor..." : "Konuyu Yayınla"}
          </button>
        </div>

      </form>
    </main>
  );
}