import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | TrChads",
  description: "TrChads platformunun kişisel veri işleme politikası, KVKK uyumlu gizlilik bildirimi ve kullanıcı hakları.",
};

export default function GizlilikPage() {
  const dataCategories = [
    {
      category: "KİMLİK BİLGİLERİ",
      examples: "Google profil adı, soyadı, profil fotoğrafı URL'si, Google ID",
      purpose: "Hesap oluşturma, kimlik doğrulama, forum paylaşımlarında gösterim",
      legalBasis: "Sözleşmenin ifası (KVKK md. 5/2-c)",
    },
    {
      category: "İLETİŞİM BİLGİLERİ",
      examples: "E-posta adresi (Google hesabınıza bağlı)",
      purpose: "Hesap doğrulama, güvenlik bildirimleri, yasal talepler",
      legalBasis: "Sözleşmenin ifası (KVKK md. 5/2-c)",
    },
    {
      category: "LOKASYON VE TEKNİK VERİLER",
      examples: "IP adresi, tarayıcı bilgisi, cihaz tipi, erişim zamanı, coğrafi konum (yaklaşık)",
      purpose: "Güvenlik, spam önleme, analitik, yasal yükümlülükler",
      legalBasis: "Meşru menfaat (KVKK md. 5/2-f) ve yasal yükümlülük (KVKK md. 5/2-ç)",
    },
    {
      category: "KULLANICI İÇERİKLERİ",
      examples: "Forum başlıkları, yorumlar, yüklenen fotoğraflar, TikTok/Pinterest bağlantıları",
      purpose: "Platform hizmetinin sunulması, topluluk içeriğinin oluşturulması",
      legalBasis: "Açık rıza (KVKK md. 5/1) ve sözleşmenin ifası (KVKK md. 5/2-c)",
    },
  ];

  const userRights = [
    {
      right: "BİLGİ ALMA HAKKI",
      description: "Kişisel verilerinizin işlenip işlenmediğini, işlenme amacını ve verilerin aktarıldığı üçüncü tarafları öğrenme hakkı.",
      article: "KVKK md. 11/1-a, b, d",
    },
    {
      right: "DÜZELTME VE TAMAMLAMA",
      description: "Yanlış veya eksik işlenen kişisel verilerinizin düzeltilmesini veya tamamlanmasını talep etme hakkı.",
      article: "KVKK md. 11/1-c",
    },
    {
      right: "SİLME HAKKI (UNUTULMA HAKKI)",
      description: "KVKK'da öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini talep etme hakkı. Ancak yasal yükümlülükler ve topluluk bütünlüğü gereği bazı veriler anonimleştirilerek saklanabilir.",
      article: "KVKK md. 11/1-d",
    },
    {
      right: "İŞLEMENİN DURDURULMASI",
      description: "Verilerinizin hukuka aykırı işlendiğini düşünüyorsanız işleme faaliyetinin durdurulmasını talep etme hakkı.",
      article: "KVKK md. 11/1-e",
    },
    {
      right: "ZARARIN GİDERİLMESİ",
      description: "KVKK hükümlerine aykırı işleme nedeniyle uğradığınız zararın giderilmesini talep etme hakkı.",
      article: "KVKK md. 11/1-f",
    },
    {
      right: "İTİRAZ HAKKI",
      description: "Özel nedenlerinize dayanarak, meşru menfaat temeline dayalı işlemelere itiraz etme hakkı.",
      article: "KVKK md. 11/1-e",
    },
  ];

  const thirdParties = [
    {
      name: "Supabase Inc.",
      purpose: "Veritabanı yönetimi, kimlik doğrulama, dosya depolama",
      data: "Profil bilgileri, forum içerikleri, IP adresleri",
      location: "ABD (GDPR/KVKK uyumlu veri işleme sözleşmesi)",
      policy: "https://supabase.com/privacy",
    },
    {
      name: "Google LLC",
      purpose: "OAuth kimlik doğrulama, profil bilgileri alımı",
      data: "Ad, soyad, e-posta, profil fotoğrafı",
      location: "ABD",
      policy: "https://policies.google.com/privacy",
    },
    {
      name: "Vercel Inc.",
      purpose: "Hosting ve CDN hizmetleri",
      data: "IP adresi, erişim logları, tarayıcı bilgisi",
      location: "ABD",
      policy: "https://vercel.com/legal/privacy-policy",
    },
  ];

  return (
    <main className="w-full flex flex-col items-center pt-24 pb-32 px-6 md:px-12 relative z-10">
      
      {/* Başlık */}
      <div className="max-w-[85rem] w-full flex flex-col gap-6 mb-20 animate-title text-center md:text-left">
        <span className="dergi-kicker text-[#EAEAEA]">6698 SAYILI KVKK KAPSAMINDA</span>
        <h1 className="dergi-title text-4xl md:text-6xl">Gizlilik Politikası.</h1>
        <p className="dergi-body max-w-3xl mt-4">
          TrChads olarak kişisel verilerinizin güvenliği bizim için en üst önceliktir. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızı açık bir şekilde belirtmektedir.
        </p>
      </div>

      {/* Veri Sorumlusu */}
      <div className="max-w-[85rem] w-full flex flex-col gap-4 mb-16 pb-10 border-b border-white/5">
        <span className="dergi-kicker text-white/40">VERİ SORUMLUSU</span>
        <p className="dergi-body text-white/60">
          TrChads platformunun veri sorumlusu, platformu işleten gerçek veya tüzel kişidir. Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenmektedir. Veri sorumlusuna ilişkin güncel bilgiler için iletişim sayfamızdan bize ulaşabilirsiniz.
        </p>
      </div>

      {/* Veri Kategorileri */}
      <div className="max-w-[85rem] w-full flex flex-col gap-12 mb-20">
        <span className="dergi-kicker text-[#EAEAEA]">İŞLENEN VERİLER</span>
        
        {dataCategories.map((data, index) => (
          <div 
            key={data.category}
            className={`flex flex-col gap-4 pb-10 ${
              index === dataCategories.length - 1 ? "" : "border-b border-white/5"
            }`}
          >
            <h2 className="text-lg md:text-xl font-normal tracking-wide text-white/90">
              {data.category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:pl-4">
              <div className="flex flex-col gap-1">
                <span className="dergi-kicker text-white/30 mb-0 text-[10px]">ÖRNEK VERİLER</span>
                <span className="text-white/50 text-sm font-light leading-relaxed">
                  {data.examples}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="dergi-kicker text-white/30 mb-0 text-[10px]">AMAÇ</span>
                <span className="text-white/50 text-sm font-light leading-relaxed">
                  {data.purpose}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="dergi-kicker text-white/30 mb-0 text-[10px]">HUKUKİ DAYANAK</span>
                <span className="text-white/50 text-sm font-light leading-relaxed">
                  {data.legalBasis}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Üçüncü Taraflar */}
      <div className="max-w-[85rem] w-full bg-black/30 p-6 md:p-12 border dergi-border rounded-sm mb-20">
        <span className="dergi-kicker text-[#EAEAEA] mb-6 block">VERİ AKTARIMI</span>
        <h2 className="dergi-subtitle mb-6">Üçüncü Taraf Hizmet Sağlayıcılar</h2>
        <p className="dergi-body mb-8">
          Kişisel verileriniz, platform hizmetlerinin sunulması için aşağıdaki üçüncü taraflarla sınırlı ölçüde paylaşılabilir. Her bir sağlayıcı ile GDPR ve KVKK'ya uygun veri işleme sözleşmeleri imzalanmıştır.
        </p>

        <div className="flex flex-col gap-6">
          {thirdParties.map((party) => (
            <div key={party.name} className="flex flex-col gap-3 p-4 border border-white/5 rounded-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-white/80 text-sm font-light">{party.name}</span>
                <a 
                  href={party.policy} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/30 text-xs hover:text-white/60 transition-colors underline underline-offset-4"
                >
                  Gizlilik Politikası →
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/40 font-extralight">
                <span><span className="text-white/20">Amaç:</span> {party.purpose}</span>
                <span><span className="text-white/20">Aktarılan Veri:</span> {party.data}</span>
                <span><span className="text-white/20">Konum:</span> {party.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kullanıcı Hakları */}
      <div className="max-w-[85rem] w-full flex flex-col gap-12 mb-20">
        <span className="dergi-kicker text-[#EAEAEA]">HAKLARINIZ</span>
        
        {userRights.map((right, index) => (
          <div 
            key={right.right}
            className={`flex flex-col md:flex-row gap-4 md:gap-12 pb-10 ${
              index === userRights.length - 1 ? "" : "border-b border-white/5"
            }`}
          >
            <div className="w-full md:w-1/3 flex flex-col gap-1">
              <span className="dergi-kicker text-white/30 mb-0 text-[10px]">{right.article}</span>
              <h3 className="text-white/80 text-sm font-light">{right.right}</h3>
            </div>
            <div className="w-full md:w-2/3">
              <p className="dergi-body text-white/50 text-sm leading-relaxed">
                {right.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hak Kullanımı */}
      <div className="max-w-[85rem] w-full bg-black/30 p-6 md:p-12 border dergi-border rounded-sm mb-20">
        <span className="dergi-kicker text-[#EAEAEA] mb-6 block">BAŞVURU</span>
        <h2 className="dergi-subtitle mb-6">Haklarınızı Nasıl Kullanabilirsiniz?</h2>
        <p className="dergi-body mb-6">
          KVKK md. 11 kapsamındaki haklarınızı kullanmak için aşağıdaki yöntemlerle başvuruda bulunabilirsiniz. Başvurunuz en geç 30 gün içinde yanıtlanacaktır.
        </p>
        <div className="flex flex-col gap-3 md:pl-4">
          <div className="flex gap-4 items-start">
            <span className="text-white/20 text-sm">01.</span>
            <span className="text-white/50 text-sm font-light">
              E-posta: <a href="mailto:privacy@trchads.com" className="text-white/70 hover:text-white transition-colors underline underline-offset-4">privacy@trchads.com</a>
            </span>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-white/20 text-sm">02.</span>
            <span className="text-white/50 text-sm font-light">
              Platform üzerinden: Profil sayfanızdan "Veri Talebi" seçeneği (yakında)
            </span>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-white/20 text-sm">03.</span>
            <span className="text-white/50 text-sm font-light">
              Kişisel Verileri Koruma Kurumu'na şikayet hakkınız saklıdır (KVKK md. 14)
            </span>
          </div>
        </div>
      </div>

      {/* Saklama Süreleri */}
      <div className="max-w-[85rem] w-full flex flex-col gap-4 mb-16">
        <span className="dergi-kicker text-white/40">VERİ SAKLAMA</span>
        <p className="dergi-body text-white/60 leading-relaxed">
          Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve yasal zamanaşımı süreleri (genellikle 10 yıl) boyunca saklanır. Hesabınızı sildiğinizde, profil bilgileriniz ve kimlik verileriniz 30 gün içinde silinir; ancak forum paylaşımlarınız topluluk bütünlüğü açısından anonimleştirilerek saklanabilir. IP adresleri ve erişim logları güvenlik amacıyla 1 yıl boyunca saklanır.
        </p>
      </div>

      {/* Son Güncelleme */}
      <div className="max-w-[85rem] w-full pt-8 border-t border-white/5">
        <p className="dergi-kicker text-white/20">
          SON GÜNCELLEME: {new Date().toLocaleDateString('tr-TR')} — BU POLİTİKA, KVKK VE GDPR HÜKÜMLERİNE UYGUN OLARAK HAZIRLANMIŞTIR.
        </p>
      </div>

    </main>
  );
}