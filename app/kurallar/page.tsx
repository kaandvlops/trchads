import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurallar | TrChads",
  description: "TrChads topluluğunun vizyonu ve temel kuralları.",
};

export default function KurallarPage() {
  // Kuralları bir dizi içinde tutmak, ileride ekleme/çıkarma yapmanı kolaylaştırır.
  const rules = [
    {
      id: "01",
      title: "KARŞILIKLI SAYGI VE ÜSLUP",
      description: "Topluluk üyeleri arasında dil, din, ırk veya cinsiyet ayrımı yapılamaz. Fikir ayrılıklarında dahi saygı çerçevesi korunmalı; hakaret, küfür ve aşağılayıcı söylemlerden kesinlikle uzak durulmalıdır."
    },
    {
      id: "02",
      title: "YASA DIŞI İÇERİK VE FAALİYETLER",
      description: "Türkiye Cumhuriyeti kanunlarına aykırı içerikler, suç teşkil eden paylaşımlar, terör propagandası, dolandırıcılık faaliyetleri, nefret söylemi, tehdit ve şiddet çağrıları kesinlikle yasaktır."
    },
    {
      id: "03",
      title: "GİZLİLİK VE KİŞİSEL VERİLER",
      description: "Başka üyelerin kişisel bilgilerini (isim, adres, telefon, fotoğraf vb.) onların açık rızası olmadan ifşa etmek (doxing) yasaktır. Topluluk içindeki güven ortamı en büyük önceliğimizdir."
    },
    {
      id: "04",
      title: "TELİF HAKLARI VE FİKRİ MÜLKİYET",
      description: "Telif hakkı ihlali oluşturabilecek içeriklerin paylaşılması yasaktır. Hak sahiplerinden gelen bildirimler doğrultusunda içerikler kaldırılabilir. Pinterest, TikTok ve diğer platformlardan yapılan alıntılarda kaynak belirtilmesine veya emeğe saygı gösterilmesine özen gösterilmelidir."
    },
    {
      id: "05",
      title: "SAHTE HESAPLAR VE BOTLAR",
      description: "Bot kullanımı, otomatik içerik üretimi, hesap çoğaltma (multi-account), oy/etkileşim manipülasyonu ve platformun organik işleyişini bozacak her türlü faaliyet yasaktır."
    },
    {
      id: "06",
      title: "DIŞ BAĞLANTILAR VE ÜÇÜNCÜ TARAF SİTELER",
      description: "Kullanıcılar tarafından paylaşılan harici bağlantıların (linklerin) içeriğinden ilgili kullanıcı sorumludur. Zararlı, oltalama (phishing) veya virüs içeren linkler paylaşmak yasaktır. TrChads üçüncü taraf sitelerin içeriklerinden sorumlu tutulamaz."
    },
    {
      id: "07",
      title: "SPAM VE REKLAM YASAĞI",
      description: "Platform içerisinde izinsiz reklam yapmak, sürekli aynı mesajı veya içeriği tekrarlayarak spam oluşturmak yasaktır. Kendi projelerinizi paylaşabileceğiniz özel alanlar dışında ticari tanıtım yapılamaz."
    },
    {
      id: "08",
      title: "HASSAS VE RAHATSIZ EDİCİ İÇERİKLER",
      description: "Aşırı şiddet (gore), kan, vahşet veya pornografik/müstehcen materyallerin topluluk içerisinde paylaşılması kesinlikle yasaktır. İçeriklerin genel kitle standartlarına uygunluğu gözetilmelidir."
    },
    {
      id: "09",
      title: "KALİTELİ VE VİZYONER İÇERİK",
      description: "TrChads, modern ve gelişime açık bir topluluktur. Paylaşılan içeriklerin topluluğa değer katmasına, estetik ve bilgi açısından belirli bir standardın üzerinde olmasına özen gösterilmelidir."
    },
    {
      id: "10",
      title: "YÖNETİM VE MODERASYON YETKİSİ",
      description: "Moderatörler ve yöneticiler, topluluğun düzenini sağlamakla görevlidir. Yönetim, topluluk düzenini korumak amacıyla herhangi bir içeriği kaldırma, düzenleme, görünürlüğünü azaltma veya kural ihlallerinde kullanıcı hesabını geçici/kalıcı olarak askıya alma hakkını saklı tutar."
    }
  ];

  return (
    <main className="w-full flex flex-col items-center pt-24 pb-32 px-6 md:px-12 relative z-10">
      
      {/* Sayfa Başlığı - Senin animate-title sınıfın ile şık bir giriş yapacak */}
      <div className="max-w-[85rem] w-full flex flex-col gap-6 mb-20 animate-title text-center md:text-left">
        <span className="dergi-kicker text-[#EAEAEA]">TRCHADS BİLDİRİSİ</span>
        <h1 className="dergi-title">Topluluk Kuralları.</h1>
        <p className="dergi-body max-w-2xl mt-4">
          Bu kurallar, TrChads topluluğunun sağlıklı, saygılı ve vizyoner yapısını korumak; her bir üyenin bu ekosistemde güvenle var olabilmesini sağlamak amacıyla oluşturulmuştur.
        </p>
      </div>

      {/* Kurallar Listesi */}
      <div className="max-w-[85rem] w-full flex flex-col gap-12">
        {rules.map((rule, index) => (
          <section 
            key={rule.id} 
            className={`flex flex-col md:flex-row gap-6 md:gap-16 pb-12 border-b dergi-border ${
              index === rules.length - 1 ? "border-none" : ""
            }`}
          >
            {/* Kural Numarası ve Başlığı */}
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <span className="dergi-kicker">KURAL {rule.id}</span>
              <h2 className="dergi-subtitle">{rule.title}</h2>
            </div>
            
            {/* Kural Açıklaması */}
            <div className="w-full md:w-2/3">
              <p className="dergi-body">
                {rule.description}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* Ekstra Bilgi veya İletişim Yönlendirmesi */}
      <div className="max-w-[85rem] w-full mt-24 p-8 md:p-12 border dergi-border bg-black/20 backdrop-blur-sm text-center flex flex-col items-center gap-6">
        <h3 className="dergi-subtitle text-xl">Bir sorun mu var?</h3>
        <p className="dergi-body max-w-xl">
          Kuralların ihlal edildiğini düşünüyorsan veya bir durum hakkında şüphelerin varsa bizimle iletişime geçmekten çekinme.
        </p>
        <a href="mailto:support@trchads.com" className="dergi-btn mt-2 inline-block">
          BİZE ULAŞIN
        </a>
      </div>

    </main>
  );
}