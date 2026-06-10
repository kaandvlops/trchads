import Link from "next/link";
import { SITE_INFO } from "@/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t dergi-border py-16 mt-auto relative z-10 bg-transparent">
      <div className="max-w-[85rem] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
        
        {/* Sol Kısım / Dergi Yayın Künyesi */}
        <div className="text-center md:text-left flex flex-col gap-4 w-full md:w-auto">
          {/* Footer Logo */}
          <Link href="/" className="text-lg md:text-xl font-light text-white tracking-[0.3em] uppercase hover:text-white/70 transition-colors duration-500 block mb-2">
            {SITE_INFO.name}<span className="text-white/20">.</span>
          </Link>
          
          <div className="flex flex-col gap-2">
            <p className="dergi-kicker mb-0">
              © {currentYear} {SITE_INFO.name} PUBLISHING.
            </p>
            {/* Hukuki metin için ekstra küçük font (micro-text) korundu */}
            <p className="text-[8px] font-extralight tracking-[0.5em] uppercase text-white/20 max-w-2xl leading-loose">
              Sitemizdeki içeriklerin çoğu topluluk tarafından veya internetin açık kaynaklarından derlenmiştir. Herhangi bir görselin telif hakkı sahibi olduğunuzu düşünüyorsanız, lütfen support@trchads.com adresinden bizimle iletişime geçin. Haklı taleplerinizde görsel sistemimizden 48 saat içerisinde kaldırılacaktır.
            </p>
          </div>
        </div>

        {/* Sağ Kısım / Animasyonlu Linkler */}
        <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-12 dergi-kicker mb-0">
          <Link href="/gizlilik" className="group relative hover:text-white transition-colors duration-500 py-1 inline-block">
            Gizlilik
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
          </Link>
          
          <Link href="/kurallar" className="group relative hover:text-white transition-colors duration-500 py-1 inline-block">
            Kurallar
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
          </Link>
          
          <a href={SITE_INFO.social.contact_email} className="group relative hover:text-white transition-colors duration-500 py-1 inline-block">
            İletişim
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
          </a>
        </div>
        
      </div>
    </footer>
  );
}