import Link from "next/link";
import { SITE_INFO } from "@/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t dergi-border py-16 mt-auto relative z-10 bg-transparent">
      <div className="max-w-[85rem] mx-auto px-6 md:px-12 flex flex-col gap-12">
        
        {/* Üst Kısım — 3'lü Link Grupları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Grup 1: Yasal Metinler */}
          <div className="flex flex-col gap-4">
            <span className="dergi-kicker text-white/40 mb-1">YASAL</span>
            <div className="flex flex-col gap-3">
              <Link href="/sozlesme" className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                Kullanıcı Sözleşmesi
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </Link>
              <Link href="/gizlilik" className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                Gizlilik Politikası
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </Link>
              <Link href="/cerezler" className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                Çerez Politikası
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Grup 2: Topluluk */}
          <div className="flex flex-col gap-4">
            <span className="dergi-kicker text-white/40 mb-1">TOPLULUK</span>
            <div className="flex flex-col gap-3">
              <Link href="/kurallar" className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                Topluluk Kuralları
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </Link>
              <Link href="/forum" className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                Forum
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </Link>
              <Link href="/unluler" className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                Sıralama
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Grup 3: İletişim */}
          <div className="flex flex-col gap-4">
            <span className="dergi-kicker text-white/40 mb-1">İLETİŞİM</span>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${SITE_INFO.social.contact_email}`} className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                E-posta
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </a>
              <a href={SITE_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative text-white/60 hover:text-white transition-colors duration-500 py-1 inline-block w-fit">
                Instagram
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
              </a>
            </div>
          </div>

        </div>

        {/* Alt Kısım — Telif ve Logo */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Sol: Logo + Telif */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <Link href="/" className="text-lg md:text-xl font-light text-white tracking-[0.3em] uppercase hover:text-white/70 transition-colors duration-500">
              {SITE_INFO.name}<span className="text-white/20">.</span>
            </Link>
            <p className="dergi-kicker mb-0 text-white/30">
              © {currentYear} {SITE_INFO.name} PUBLISHING.
            </p>
          </div>

          {/* Sağ: Mikro telif metni */}
          <p className="text-[8px] font-extralight tracking-[0.5em] uppercase text-white/20 max-w-xl leading-loose text-center md:text-right">
            Sitemizdeki içeriklerin çoğu topluluk tarafından veya internetin açık kaynaklarından derlenmiştir. Herhangi bir görselin telif hakkı sahibi olduğunuzu düşünüyorsanız, lütfen {SITE_INFO.social.contact_email} adresinden bizimle iletişime geçin. Haklı taleplerinizde görsel sistemimizden 48 saat içerisinde kaldırılacaktır.
          </p>

        </div>

      </div>
    </footer>
  );
}