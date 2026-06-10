"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_INFO } from "@/constants";
// YENİ: Custom hook'umuzu dahil ettik
import { useScrollAnim } from "@/hooks/useScrollAnim";

export default function Home() {
  // YENİ: Tek satırla animasyon mantığını çekiyoruz
  const { addToRefs } = useScrollAnim(0.15);

  return (
    <main className="w-full">
      
      {/* 1. KAPAK (HERO) */}
      <section className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center px-6 md:px-12 py-12">
        <h1 
          className="font-black uppercase tracking-tighter text-transparent bg-clip-text select-none text-center animate-title"
          style={{ 
            fontSize: "min(18vw, 20rem)", 
            lineHeight: "0.8",
            backgroundImage: "url('/eyes.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            WebkitBackgroundClip: "text", 
          }}
        >
          {SITE_INFO.name}
        </h1>
      </section>

      {/* 2. MANİFESTO */}
      <section id="manifesto" className="w-full py-32 md:py-48 px-6 md:px-12 bg-black overflow-hidden">
        
        <div ref={addToRefs} className="flex flex-col items-center text-center mb-32 md:mb-40 scroll-anim">
          <span className="dergi-kicker mb-8">Manifesto</span>
          <h2 className="dergi-title">Felsefemiz</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-[80rem] mx-auto border-t border-l dergi-border">
          <div ref={addToRefs} className="p-12 md:p-16 border-b border-r dergi-border transition-all duration-500 bg-black cursor-pointer group hover:bg-[#080808] hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] relative z-10 hover:z-20 scroll-anim" style={{ transitionDelay: "100ms" }}>
            <span className="text-[10px] tracking-[0.3em] text-white/40 block mb-12 group-hover:text-white transition-all duration-500">01</span>
            <h3 className="dergi-subtitle mb-6 group-hover:text-white transition-colors duration-500">Mükemmellik</h3>
            <p className="dergi-body">Her boyutta ustalığı hedefleriz. Kalite bizim için tartışılamaz bir standarttır.</p>
          </div>

          <div ref={addToRefs} className="p-12 md:p-16 border-b border-r dergi-border transition-all duration-500 bg-black cursor-pointer group hover:bg-[#080808] hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] relative z-10 hover:z-20 scroll-anim" style={{ transitionDelay: "300ms" }}>
            <span className="text-[10px] tracking-[0.3em] text-white/40 block mb-12 group-hover:text-white transition-all duration-500">02</span>
            <h3 className="dergi-subtitle mb-6 group-hover:text-white transition-colors duration-500">Özgünlük</h3>
            <p className="dergi-body">Sıradanlığı tamamen reddeder ve gerçek, tavizsiz kişisel gelişimi benimseriz.</p>
          </div>

          <div ref={addToRefs} className="p-12 md:p-16 border-b border-r dergi-border transition-all duration-500 bg-black cursor-pointer group hover:bg-[#080808] hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] relative z-10 hover:z-20 scroll-anim" style={{ transitionDelay: "500ms" }}>
            <span className="text-[10px] tracking-[0.3em] text-white/40 block mb-12 group-hover:text-white transition-all duration-500">03</span>
            <h3 className="dergi-subtitle mb-6 group-hover:text-white transition-colors duration-500">Topluluk</h3>
            <p className="dergi-body">Birlikte inşa ederiz. Gücümüzü ve motivasyonumuzu kolektif yükselişimizden alırız.</p>
          </div>
        </div>
      </section>

      {/* 3. KURUCU */}
      <section className="w-full py-32 md:py-48 px-6 md:px-12 bg-[#020202] overflow-hidden">
        <div className="max-w-[70rem] mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          
          <div ref={addToRefs} className="w-full md:w-1/2 flex justify-center md:justify-end scroll-anim">
            <Image 
              src="/kurucu.jpg" 
              alt="Kurucu"
              width={320}
              height={400}
              className="object-cover w-[280px] h-[350px] md:w-[320px] md:h-[400px] shrink-0 border border-white/5" 
              priority
            />
          </div>

          <div ref={addToRefs} className="w-full md:w-1/2 flex flex-col justify-center max-w-[450px] scroll-anim" style={{ transitionDelay: "200ms" }}>
            <span className="dergi-kicker mb-4">Kurucu</span>
            <h2 className="dergi-title mb-8">Vizyon</h2>
            
            <div className="space-y-6 dergi-body">
              <p className="text-white/70 italic font-medium">&quot;{SITE_INFO.manifesto}&quot;</p>
              <p>
                Tavizlerle dolu bir dünyada biz farklı bir duruş sergiliyoruz. Hırsın kutlandığı, büyümenin durmaksızın devam ettiği ve mükemmellik arayışının kabul edilebilir tek yol olduğu bir alan yaratıyoruz.
              </p>
              <p>
                Bu herkes için değil. Bu, sadece yetinmeyi reddedenler için.
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/10 my-10"></div>

            <div>
              <span className="dergi-kicker mb-3">{SITE_INFO.founder.role}</span>
              <h3 className="text-xl md:text-2xl font-light text-white/90">
                {SITE_INFO.founder.name}
              </h3>
            </div>
          </div>
          
        </div>
      </section>

      {/* 4. ARKA KAPAK (CTA) */}
      <section className="w-full py-40 px-6 bg-black flex flex-col items-center justify-center text-center overflow-hidden">
        <h2 ref={addToRefs} className="text-3xl md:text-5xl font-extralight tracking-widest uppercase mb-12 scroll-anim text-white/90">
          Sayfayı Çevir.
        </h2>

        <div ref={addToRefs} className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center border-y dergi-border py-12 scroll-anim" style={{ transitionDelay: "200ms" }}>
          <Link href="/forum" className="dergi-btn">
            Forumu Oku
          </Link>
          <Link href="/kurallar" className="dergi-btn">
            Kurallarımız
          </Link>
        </div>
      </section>
      
    </main>
  );
}