import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanıcı Sözleşmesi | TrChads",
  description: "TrChads platformunun kullanım koşulları, yasal uyarılar ve kullanıcı sözleşmesi.",
};

export default function SozlesmePage() {
  const sections = [
    {
      id: "01",
      title: "TARAFLAR VE KABUL",
      content: "Bu sözleşme, TrChads ('Platform', 'Site', 'Biz') ile Site'ye Google altyapısı üzerinden giriş yapan veya Site'yi ziyaret eden kullanıcı ('Kullanıcı', 'Siz') arasında akdedilmiştir. Site'ye giriş yaparak veya Site'yi kullanarak bu sözleşmedeki tüm şartları gayrikabili rücu olarak kabul etmiş sayılırsınız."
    },
    {
      id: "02",
      title: "GOOGLE İLE GİRİŞ VE HESAP GÜVENLİĞİ",
      content: "TrChads, kullanıcı hesaplarını yönetmek için Supabase ve Google OAuth altyapısını kullanmaktadır. Platformumuz herhangi bir şifre talep etmez veya saklamaz. Sistemimize giriş yaptığınızda yalnızca Google tarafından sağlanan temel profil bilgileriniz (İsim, E-posta, Profil Fotoğrafı) alınır. Google hesabınızın güvenliğinden tamamen siz sorumlusunuz. Hesabınız üzerinden yapılan tüm işlemlerin sizin tarafınızdan yapıldığı kabul edilir."
    },
    {
      id: "03",
      title: "İÇERİK VE YASAL SORUMLULUK (ÖNEMLİ)",
      content: "TrChads bir topluluk forumudur. Kullanıcılar tarafından oluşturulan başlıklar, mesajlar, görseller ve tüm içerikler (User-Generated Content) tamamen ilgili kullanıcının yasal sorumluluğundadır. TrChads yönetimi, paylaşılan içeriklerin doğruluğunu, yasallığını veya güvenilirliğini garanti etmez ve önceden denetleme yükümlülüğü taşımaz. Hakaret, tehdit, telif hakkı ihlali veya Türkiye Cumhuriyeti yasalarına (ve uluslararası hukuka) aykırı herhangi bir içerikten doğacak adli ve idari yaptırımlarda tek muhatap içeriği üreten kullanıcıdır."
    },
    {
      id: "04",
      title: "FİKRİ MÜLKİYET VE TELİF HAKLARI",
      content: "Platformda yer alan TrChads'e ait logo, tasarım (CSS/HTML/JS yapıları), metinler ve kodların tüm fikri mülkiyet hakları TrChads yayıncısına aittir. İzinsiz kopyalanamaz. Kullanıcılar, Site'ye yükledikleri içeriklerin telif haklarına sahip olduklarını veya paylaşmak için gerekli izinleri aldıklarını beyan ederler. Bir telif ihlali durumunda 'Uyar-Kaldır' prensibi işletilir."
    },
    {
      id: "05",
      title: "HİZMETİN KESİNTİSİ VE DEĞİŞİKLİKLER",
      content: "TrChads, platformu 'olduğu gibi' sunar. Sitenin 7/24 kesintisiz, hatasız çalışacağını veya verilerin kaybolmayacağını garanti etmez. Yönetim, önceden haber vermeksizin platformun tamamını veya bir kısmını kapatma, özelliklerini değiştirme veya kullanıcı hesaplarını askıya alma hakkını saklı tutar."
    },
    {
      id: "06",
      title: "HESAP İPTALİ VE UZAKLAŞTIRMA (BAN)",
      content: "Topluluk kurallarına, yasalara veya bu sözleşmeye aykırı davranan kullanıcıların hesapları (ve Google kimlikleri ile platforma erişimleri), site yönetimi tarafından hiçbir uyarı yapılmaksızın ve gerekçe gösterilmeksizin kalıcı veya geçici olarak askıya alınabilir."
    }
  ];

  return (
    <main className="w-full flex flex-col items-center pt-24 pb-32 px-6 md:px-12 relative z-10">
      
      {/* Başlık Alanı */}
      <div className="max-w-[85rem] w-full flex flex-col gap-6 mb-20 animate-title text-center md:text-left">
        <span className="dergi-kicker text-[#EAEAEA]">YASAL BİLDİRİM VE ŞARTLAR</span>
        <h1 className="dergi-title text-4xl md:text-6xl">Kullanıcı Sözleşmesi.</h1>
        <p className="dergi-body max-w-3xl mt-4">
          Lütfen TrChads platformunu kullanmadan önce aşağıdaki yasal metni dikkatlice okuyunuz. Siteyi kullanmanız, içerik üretmeniz veya Google hesabınız ile giriş yapmanız, bu şartları kabul ettiğiniz anlamına gelir.
        </p>
      </div>

      {/* Sözleşme Maddeleri */}
      <div className="max-w-[85rem] w-full flex flex-col gap-12 bg-black/30 p-6 md:p-12 border dergi-border rounded-sm">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className={`flex flex-col gap-4 pb-10 ${
              index === sections.length - 1 ? "" : "border-b border-white/5"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-white/20 font-light text-xl md:text-2xl">{section.id}.</span>
              <h2 className="text-lg md:text-xl font-normal tracking-wide text-white/90">
                {section.title}
              </h2>
            </div>
            <p className="dergi-body md:pl-10 text-justify">
              {section.content}
            </p>
          </div>
        ))}

        {/* Son Güncelleme Tarihi */}
        <div className="mt-8 pt-8 border-t border-white/10 md:pl-10">
          <p className="dergi-kicker">
            SON GÜNCELLEME: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>

    </main>
  );
}