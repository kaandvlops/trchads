import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Politikası | TrChads",
  description: "TrChads platformunun çerez kullanım politikası, çerez türleri ve yönetim seçenekleri.",
};

export default function CerezlerPage() {
  const cookieTypes = [
    {
      id: "zorunlu",
      title: "ZORUNLU ÇEREZLER",
      description: "Platformun temel işlevlerini yerine getirmesi için zorunlu olan çerezlerdir. Oturum yönetimi (Supabase Auth), güvenlik doğrulamaları ve CSRF koruması bu kapsamdadır. Bu çerezler devre dışı bırakılamaz; aksi halde siteye giriş yapamaz veya forum özelliklerini kullanamazsınız.",
      examples: ["supabase-auth-token", "sb-refresh-token", "csrf-token"],
      duration: "Oturum süresi / 7 gün",
      required: true,
    },
    {
      id: "fonksiyonel",
      title: "FONKSİYONEL ÇEREZLER",
      description: "Kullanıcı tercihlerini hatırlamak ve kişiselleştirilmiş deneyim sunmak için kullanılır. Tema seçimi, dil tercihi ve son ziyaret edilen sayfalar bu kapsamdadır. Bu çerezler olmadan site çalışmaya devam eder ancak deneyim standartlaşır.",
      examples: ["theme-preference", "last-visited", "ui-settings"],
      duration: "30 gün",
      required: false,
    },
    {
      id: "analitik",
      title: "ANALİTİK ÇEREZLER",
      description: "Ziyaretçi sayısı, sayfa görüntüleme, oturum süresi ve coğrafi konum gibi anonim istatistiksel verileri toplar. Bu veriler platformun performansını ölçmek ve kullanıcı deneyimini iyileştirmek amacıyla kullanılır. Kişisel kimlik bilgisi içermez.",
      examples: ["_ga", "_gid", "_gat", "vercel-insights"],
      duration: "2 yıl / 24 saat",
      required: false,
    },
    {
      id: "pazarlama",
      title: "PAZARLAMA ÇEREZLERİ",
      description: "Şu anda TrChads platformunda pazarlama çerezleri kullanılmamaktadır. Gelecekte kullanılması durumunda bu bölüm güncellenecek ve açık rızanız talep edilecektir. Üçüncü taraf reklam ağlarıyla veri paylaşımı yapılmaz.",
      examples: ["Yok"],
      duration: "N/A",
      required: false,
    },
  ];

  const managementSteps = [
    {
      browser: "Google Chrome",
      path: "Ayarlar > Gizlilik ve Güvenlik > Çerezler ve Diğer Site Verileri",
    },
    {
      browser: "Mozilla Firefox",
      path: "Ayarlar > Gizlilik ve Güvenlik > Çerezler ve Site Verileri",
    },
    {
      browser: "Safari",
      path: "Tercihler > Gizlilik > Çerezler ve Web Sitesi Verileri",
    },
    {
      browser: "Microsoft Edge",
      path: "Ayarlar > Çerezler ve Site İzinleri > Çerezleri Yönet ve Sil",
    },
  ];

  return (
    <main className="w-full flex flex-col items-center pt-24 pb-32 px-6 md:px-12 relative z-10">
      
      {/* Başlık */}
      <div className="max-w-[85rem] w-full flex flex-col gap-6 mb-20 animate-title text-center md:text-left">
        <span className="dergi-kicker text-[#EAEAEA]">VERİ YÖNETİMİ VE ŞEFFAFLIK</span>
        <h1 className="dergi-title text-4xl md:text-6xl">Çerez Politikası.</h1>
        <p className="dergi-body max-w-3xl mt-4">
          TrChads olarak, platformumuzu ziyaret ettiğinizde cihazınıza yerleştirilen küçük veri dosyaları olan çerezleri nasıl kullandığımızı şeffaf bir şekilde açıklıyoruz. Aşağıda çerez türlerimizi, amaçlarını ve yönetim seçeneklerinizi bulabilirsiniz.
        </p>
      </div>

      {/* Çerez Türleri */}
      <div className="max-w-[85rem] w-full flex flex-col gap-12 mb-20">
        {cookieTypes.map((type, index) => (
          <div 
            key={type.id}
            className={`flex flex-col gap-4 pb-10 ${
              index === cookieTypes.length - 1 ? "" : "border-b border-white/5"
            }`}
          >
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`text-xs font-light tracking-[0.2em] uppercase px-3 py-1 border rounded-sm ${
                type.required 
                  ? "border-white/20 text-white/40" 
                  : "border-white/10 text-white/20"
              }`}>
                {type.required ? "ZORUNLU" : "OPSİYONEL"}
              </span>
              <h2 className="text-lg md:text-xl font-normal tracking-wide text-white/90">
                {type.title}
              </h2>
            </div>
            
            <p className="dergi-body text-justify leading-relaxed md:pl-4">
              {type.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:pl-4 mt-2">
              <div className="flex flex-col gap-1">
                <span className="dergi-kicker text-white/30 mb-0 text-[10px]">ÖRNEK ÇEREZLER</span>
                <span className="text-white/50 text-sm font-light">
                  {type.examples.join(", ")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="dergi-kicker text-white/30 mb-0 text-[10px]">SAKLAMA SÜRESİ</span>
                <span className="text-white/50 text-sm font-light">
                  {type.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Çerez Yönetimi */}
      <div className="max-w-[85rem] w-full bg-black/30 p-6 md:p-12 border dergi-border rounded-sm mb-20">
        <span className="dergi-kicker text-[#EAEAEA] mb-6 block">ÇEREZ YÖNETİMİ</span>
        <h2 className="dergi-subtitle mb-6">Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
        <p className="dergi-body mb-8">
          Tarayıcı ayarlarınızdan çerezleri engelleyebilir, mevcut çerezleri silebilir veya belirli siteler için çerez kullanımına izin verebilirsiniz. Aşağıda popüler tarayıcılardaki yönetim yollarını bulabilirsiniz:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managementSteps.map((step) => (
            <div key={step.browser} className="flex flex-col gap-2 p-4 border border-white/5 rounded-sm">
              <span className="text-white/70 text-sm font-light">{step.browser}</span>
              <span className="text-white/40 text-xs font-extralight tracking-wide">
                {step.path}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-white/30 text-xs leading-relaxed">
            Not: Zorunlu çerezleri devre dışı bırakmak platformun temel işlevlerini kullanmanızı engelleyebilir. Analitik ve fonksiyonel çerezleri reddetmeniz durumunda site çalışmaya devam edecek ancak kişiselleştirilmiş özellikler devre dışı kalacaktır.
          </p>
        </div>
      </div>

      {/* Yasal Dayanak */}
      <div className="max-w-[85rem] w-full flex flex-col gap-4">
        <span className="dergi-kicker text-white/30">YASAL DAYANAK</span>
        <p className="dergi-body text-white/40 text-sm leading-relaxed">
          Bu çerez politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK), e-Privacy Yönetmeliği ve 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun kapsamında hazırlanmıştır. Çerez kullanımına ilişkin açık rızanız, ilk ziyaretinizde gösterilen çerez banner'ı aracılığıyla alınmaktadır. Rızanızı istediğiniz zaman geri çekebilirsiniz.
        </p>
      </div>

      {/* Son Güncelleme */}
      <div className="max-w-[85rem] w-full mt-16 pt-8 border-t border-white/5">
        <p className="dergi-kicker text-white/20">
          SON GÜNCELLEME: {new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>

    </main>
  );
}