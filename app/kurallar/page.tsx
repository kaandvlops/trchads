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
      title: "SPAM VE REKLAM YASAĞI",
      description: "Platform içerisinde izinsiz reklam yapmak, sürekli aynı mesajı veya içeriği tekrarlayarak spam oluşturmak yasaktır. Kendi projelerinizi paylaşabileceğiniz özel alanlar dışında tanıtım yapılamaz."
    },
    {
      id: "03",
      title: "GİZLİLİK VE KİŞİSEL VERİLER",
      description: "Başka üyelerin kişisel bilgilerini (isim, adres, telefon, fotoğraf vb.) onların açık rızası olmadan paylaşmak kesinlikle yasaktır. Topluluk içindeki güven ortamı en büyük önceliğimizdir."
    },
    {
      id: "04",
      title: "KALİTELİ VE VİZYONER İÇERİK",
      description: "TrChads, modern ve gelişime açık bir topluluktur. Paylaşılan içeriklerin topluluğa değer katmasına, estetik ve bilgi açısından belirli bir standardın üzerinde olmasına özen gösterilmelidir."
    },
    {
      id: "05",
      title: "YÖNETİM KARARLARINA UYUM",
      description: "Moderatörler ve yöneticiler, topluluğun düzenini sağlamakla görevlidir. Yönetim ekibinin uyarıları dikkate alınmalı ve kural ihlallerinde alınacak kararlara saygı gösterilmelidir."
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