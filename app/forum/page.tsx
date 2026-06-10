"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
// YENİ: Tekrar kullanılabilir animasyon hook'umuzu dahil ettik
import { useScrollAnim } from "@/hooks/useScrollAnim";

export default function ForumAnaSayfasi() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const { addToRefs } = useScrollAnim(0.15);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("forum_categories")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        if (data) setCategories(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Sistemden veriler alınırken bilinmeyen bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-12 h-[1px] bg-white/20 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-white/80 animate-[ping_1.5s_ease-in-out_infinite]"></div>
        </div>
        <span className="dergi-kicker mb-0">Sistem Başlatılıyor...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 p-6">
        <span className="dergi-kicker text-red-500/80 border border-red-500/20 px-4 py-2 bg-red-500/5 mb-0">
          KRİTİK HATA
        </span>
        <span className="dergi-kicker text-center max-w-md">
          {errorMsg}
        </span>
      </div>
    );
  }

  return (
    <main className="w-full overflow-x-hidden pt-24 md:pt-32 pb-32 px-6 flex flex-col items-center">
      
      <div className="w-full max-w-[55rem] flex flex-col border-t border-l dergi-border">
        
        <header ref={addToRefs} className="p-8 md:p-12 lg:p-16 border-b border-r dergi-border bg-black flex flex-col justify-end scroll-anim relative z-10 hover:bg-[#080808] transition-colors duration-500">
          <div className="flex items-center gap-4 mb-10 md:mb-12">
            <span className="dergi-kicker mb-0 whitespace-nowrap">
              Topluluk
            </span>
            <div className="h-[1px] w-8 md:w-12 bg-white/10"></div>
            <span className="dergi-kicker mb-0 whitespace-nowrap">
              İndeks
            </span>
          </div>

          <h1 className="dergi-title lg:text-[7rem] leading-[0.85] mb-8 uppercase">
            KÜRSÜ
          </h1>
          
          <p className="dergi-body max-w-3xl">
            Fikirlerin, estetiğin ve gerçeklerin tartışıldığı yeraltı arşivi. Yalnızca mantık, argüman ve vizyon barındırır. Lütfen kurallara sadık kalın.
          </p>
        </header>

        {categories.length === 0 ? (
          <div className="w-full border-b border-r dergi-border py-24 text-center dergi-kicker bg-black">
            Sistemde kategori bulunamadı.
          </div>
        ) : (
          categories.map((category, index) => (
            <Link 
              href={`/forum/${category.slug}`} 
              key={category.id}
              ref={addToRefs}
              className="group p-8 md:p-10 lg:p-12 border-b border-r dergi-border flex flex-col md:flex-row md:items-center justify-between bg-black hover:bg-[#080808] hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 cursor-pointer scroll-anim relative z-10 hover:z-20"
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 mb-6 md:mb-0">
                <span className="dergi-kicker mb-0 group-hover:text-white/80 transition-all duration-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="dergi-subtitle uppercase text-white/70 group-hover:text-white transition-colors duration-500">
                  {category.name}
                </h2>
              </div>
              
              <div className="flex items-center gap-4 md:gap-6 ml-0 md:ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                <span className="dergi-kicker mb-0 group-hover:text-white hidden sm:block transition-colors duration-500">
                  Kürsüye İn
                </span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="text-white/50 group-hover:text-white transition-colors duration-500">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          ))
        )}

      </div>

      <div ref={addToRefs} className="max-w-[55rem] w-full h-[1px] bg-white/5 mt-24 scroll-anim flex justify-center">
        <div className="w-12 h-[1px] bg-white/20"></div>
      </div>

    </main>
  );
}