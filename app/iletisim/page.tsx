import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | TrChads",
  description: "TrChads platformuna ulaşın. Destek, iş birliği, hukuki bildirim ve topluluk önerileri için iletişim kanallarımız.",
};

export default function IletisimPage() {
  const contactChannels = [
    {
      id: "destek",
      title: "TEKNİK DESTEK",
      description: "Hesap erişim sorunları, platform hataları, giriş problemleri veya teknik aksaklıklar için destek ekibimize ulaşabilirsiniz.",
      email: "support@trchads.com",
      responseTime: "24-48 saat",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: "hukuki",
      title: "HUKUKİ BİLDİRİMLER",
      description: "Telif hakkı ihlali bildirimleri (DMCA/UYAR-KALDIR), mahkeme celpleri, savcılık talepleri ve diğer resmi hukuki bildirimler için.",
      email: "legal@trchads.com",
      responseTime: "48 saat (acil durumlarda 24 saat)",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      id: "gizlilik",
      title: "VERİ GÜVENLİĞİ VE GİZLİLİK",
      description: "Kişisel verilerinizle ilgili talepler, KVKK kapsamındaki hak başvuruları, veri silme ve düzeltme istekleri için.",
      email: "privacy@trchads.com",
      responseTime: "30 gün (KVKK zorunluluğu)",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: "isbirligi",
      title: "İŞ BİRLİĞİ VE MEDYA",
      description: "Reklam, sponsorluk, içerik iş birliği, basın ve medya talepleri, marka ortaklıkları için.",
      email: "partnerships@trchads.com",
      responseTime: "72 saat",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const faqItems = [
    {
      question: "Hesabımı nasıl silebilirim?",
      answer: "Profil sayfanızdaki 'Hesabı Sil' seçeneğini kullanabilir veya support@trchads.com adresine e-posta gönderebilirsiniz. Hesap silme işlemi geri alınamaz.",
    },
    {
      question: "Telif hakkı ihlali bildiriminde bulunmak istiyorum.",
      answer: "İhlal edilen içeriğin URL'si, size ait olduğunu kanıtlayan belgeler ve iletişim bilgilerinizi legal@trchads.com adresine gönderin. En geç 48 saat içinde yanıt verilecektir.",
    },
    {
      question: "Verilerimi nasıl indirebilirim?",
      answer: "KVKK kapsamında veri taşınabilirliği hakkınızı kullanmak için privacy@trchads.com adresine başvuruda bulunabilirsiniz. Verileriniz JSON formatında hazırlanacaktır.",
    },
  ];

  return (
    <main className="w-full flex flex-col items-center pt-24 pb-32 px-6 md:px-12 relative z-10">
      
      {/* Başlık */}
      <div className="max-w-[85rem] w-full flex flex-col gap-6 mb-20 animate-title text-center md:text-left">
        <span className="dergi-kicker text-[#EAEAEA]">BİZE ULAŞIN</span>
        <h1 className="dergi-title text-4xl md:text-6xl">İletişim.</h1>
        <p className="dergi-body max-w-3xl mt-4">
          Sorularınız, önerileriniz, teknik destek talepleriniz veya hukuki bildirimleriniz için doğru kanalı seçin. Her bir talep türü için ayrılmış e-posta adreslerimizden bize ulaşabilirsiniz.
        </p>
      </div>

      {/* İletişim Kanalları */}
      <div className="max-w-[85rem] w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {contactChannels.map((channel) => (
          <div 
            key={channel.id}
            className="flex flex-col gap-4 p-6 md:p-8 border dergi-border bg-black/20 hover:bg-black/40 transition-colors duration-500 rounded-sm"
          >
            <div className="flex items-center gap-4">
              <span className="text-white/30">{channel.icon}</span>
              <span className="dergi-kicker text-white/40 mb-0">{channel.title}</span>
            </div>
            
            <p className="dergi-body text-white/50 text-sm leading-relaxed">
              {channel.description}
            </p>

            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <a 
                  href={`mailto:${channel.email}`}
                  className="text-white/70 text-sm font-light hover:text-white transition-colors underline underline-offset-4"
                >
                  {channel.email}
                </a>
                <span className="text-white/20 text-xs font-extralight tracking-wide">
                  Yanıt süresi: {channel.responseTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sıkça Sorulan Sorular */}
      <div className="max-w-[85rem] w-full flex flex-col gap-12 mb-20">
        <span className="dergi-kicker text-[#EAEAEA]">SIKÇA SORULAN SORULAR</span>
        
        {faqItems.map((faq, index) => (
          <div 
            key={index}
            className={`flex flex-col gap-3 pb-10 ${
              index === faqItems.length - 1 ? "" : "border-b border-white/5"
            }`}
          >
            <h3 className="text-white/80 text-sm font-light tracking-wide">
              {faq.question}
            </h3>
            <p className="dergi-body text-white/40 text-sm leading-relaxed md:pl-4">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Alternatif Kanallar */}
      <div className="max-w-[85rem] w-full bg-black/30 p-6 md:p-12 border dergi-border rounded-sm mb-20">
        <span className="dergi-kicker text-[#EAEAEA] mb-6 block">SOSYAL MEDYA</span>
        <h2 className="dergi-subtitle mb-6">Diğer Platformlardan Bize Ulaşın</h2>
        <p className="dergi-body mb-8">
          Resmi duyurular, güncellemeler ve topluluk etkileşimi için sosyal medya hesaplarımızı takip edebilirsiniz. Ancak teknik destek veya kişisel veri içeren talepler için yukarıdaki e-posta kanallarını kullanmanızı rica ederiz.
        </p>

        <div className="flex flex-wrap gap-4">
          <a 
            href="https://x.com/trchads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-white/30 transition-all duration-500 rounded-sm"
          >
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-white/50 text-sm font-light group-hover:text-white transition-colors">X (Twitter)</span>
          </a>

          <a 
            href="https://instagram.com/trchads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-white/30 transition-all duration-500 rounded-sm"
          >
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span className="text-white/50 text-sm font-light group-hover:text-white transition-colors">Instagram</span>
          </a>

          <a 
            href="https://discord.gg/trchads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-white/30 transition-all duration-500 rounded-sm"
          >
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span className="text-white/50 text-sm font-light group-hover:text-white transition-colors">Discord</span>
          </a>
        </div>
      </div>

      {/* Yasal Uyarı */}
      <div className="max-w-[85rem] w-full pt-8 border-t border-white/5">
        <p className="text-white/20 text-xs font-extralight tracking-wide leading-relaxed text-center md:text-left">
          TrChads platformuna gönderilen tüm e-postalar, yasal süreçlerde delil olarak kullanılabilir. Spam, tehdit veya hakaret içeren iletişimler yasal işlem başlatılmasına neden olabilir. 
          Resmi hukuki bildirimler için lütfen yalnızca <span className="text-white/30">legal@trchads.com</span> adresini kullanın.
        </p>
      </div>

    </main>
  );
}