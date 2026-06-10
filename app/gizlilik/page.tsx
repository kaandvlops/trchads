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
      content: "Bu sözleşme, TrChads ('Platform', 'Site', 'Biz') ile Site'ye Google altyapısı üzerinden giriş yapan veya Site'yi ziyaret eden kullanıcı ('Kullanıcı', 'Siz') arasında akdedilmiştir. Site'ye giriş yaparak, Site'yi kullanarak, forumda içerik üreterek veya medya paylaşımında bulunarak bu sözleşmedeki tüm şartları gayrikabili rücu olarak okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş sayılırsınız."
    },
    {
      id: "02",
      title: "GOOGLE İLE GİRİŞ VE HESAP GÜVENLİĞİ",
      content: "TrChads, kullanıcı hesaplarını yönetmek için Supabase ve Google OAuth altyapısını kullanmaktadır. Platformumuz doğrudan herhangi bir şifre talep etmez veya saklamaz. Sistemimize giriş yaptığınızda yalnızca Google tarafından sağlanan temel profil bilgileriniz alınır. Google hesabınızın ve bağlı cihazlarınızın güvenliğinden tamamen siz sorumlusunuz. Hesabınız üzerinden gerçekleştirilen her türlü forum paylaşımı, yorum ve medya yüklemesinin bizzat sizin tarafınızdan yapıldığı hukuken karine olarak kabul edilir."
    },
    {
      id: "03",
      title: "FORUM KULLANIMI VE KULLANICI İÇERİKLERİ (ÖNEMLİ)",
      content: "TrChads özgür ve açık bir topluluk forumudur. Kullanıcılar forum içerisinde yeni konular açabilir, mevcut konulara yorum yazabilir ve tartışmalara katılabilir. Platformda paylaşılan tüm başlıklar, mesajlar, fikirler ve yorumlar (Kullanıcı Tarafından Oluşturulan İçerik) tamamen ilgili kullanıcının şahsi görüşünü yansıtır ve hukuki/cezai sorumluluğu münhasıran kendisine aittir. TrChads yönetimi, paylaşılan içeriklerin doğruluğunu, yasallığını veya güvenilirliğini garanti etmez, önceden denetleme (sansür) yükümlülüğü taşımaz. Hakaret, tehdit, şantaj, nefret söylemi, yasa dışı yönlendirme veya Türkiye Cumhuriyeti yasalarına aykırı herhangi bir içerik paylaşımı kesinlikle yasaktır."
    },
    {
      id: "04",
      title: "FOTOĞRAF, MEDYA VE DIŞ BAĞLANTI PAYLAŞIMI",
      content: "Kullanıcılar platform üzerinde kendi cihazlarından fotoğraf/görsel yükleyebilir; TikTok video bağlantıları, Pinterest pinleri/panoları veya diğer üçüncü taraf platformlara ait bağlantıları forum içerisinde metin veya gömülü (embed) olarak paylaşabilirler. Paylaşılan tüm TikTok, Pinterest veya benzeri dış bağlantıların ve yüklenen görsellerin telif hakkı ihlali içermediği, müstehcenlik, şiddet veya yasa dışı unsurlar barındırmadığı kullanıcının beyanı ve sorumluluğu altındadır. TrChads, üçüncü taraf platformların (TikTok, Pinterest vb.) gizlilik politikalarından veya içeriklerinden sorumlu tutulamaz."
    },
    {
      id: "05",
      title: "ÜÇÜNCÜ TARAF SORUMLULUK REDDİ VE TAZMİNAT",
      content: "Platformda kullanıcılar tarafından paylaşılan linkler (TikTok, Pinterest, YouTube vb.) üzerinden erişilen harici web sitelerinin içeriği TrChads'in kontrolünde değildir. Bu linklere tıklamak kullanıcının kendi riskindedir. Ayrıca kullanıcı; siteye yüklediği, paylaştığı veya gömdüğü herhangi bir görsel, video veya metin sebebiyle üçüncü şahısların veya kurumların TrChads'e yöneltebileceği her türlü yasal talebi, cezayı ve mahkeme masrafını ilk talepte, nakden ve defaten tazmin etmekle mükelleftir."
    },
    {
      id: "06",
      title: "FİKRİ MÜLKİYET VE TELİF HAKLARI",
      content: "Platformda yer alan TrChads'e ait logo, tasarım (CSS/HTML/JS yapıları), marka kimliği, metinler ve kodların tüm fikri mülkiyet hakları TrChads yayıncısına aittir ve izinsiz kopyalanamaz. Kullanıcılar, Site'ye yükledikleri her türlü içerik ve fotoğraf için TrChads'e bu içerikleri platformda sergileme, çoğaltma ve dağıtma konusunda dünya çapında, ücretsiz ve sürekli bir lisans vermiş sayılırlar. Telif hakkı ihlali durumlarında yürürlükteki mevzuat gereği 'Uyar-Kaldır' prensibi işletilir."
    },
    {
      id: "07",
      title: "KİŞİSEL VERİLERİN KORUNMASI (KVKK)",
      content: "Kullanıcıların siteyi kullanımı sırasında elde edilen kişisel veriler (Google profil bilgileri, IP adresleri, log kayıtları), 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenmektedir. Platform, adli veya idari makamlardan (mahkemeler, savcılıklar, siber suçlarla mücadele birimleri) usulüne uygun bir talep gelmesi halinde, yasal yükümlülükleri gereği kullanıcılara ait IP adreslerini ve erişim loglarını ilgili resmi makamlarla paylaşmakla yükümlüdür."
    },
    {
      id: "08",
      title: "HİZMETİN KESİNTİSİ VE DEĞİŞİKLİKLER",
      content: "TrChads, platformu ve sunduğu özellikleri 'olduğu gibi' ve 'mevcut olduğu kadarıyla' sunar. Sitenin 7/24 kesintisiz, virüssüz veya hatasız çalışacağını, verilerin (kullanıcıların açtığı konular, yüklediği fotoğraflar veya gönderdiği TikTok/Pinterest linkleri) kaybolmayacağını garanti etmez. Yönetim, platformun tamamını, bir kısmını veya veritabanını önceden haber vermeksizin silme, kapatma veya değiştirme hakkını saklı tutar."
    },
    {
      id: "09",
      title: "MODERASYON, HESAP İPTALİ VE UZAKLAŞTIRMA (BAN)",
      content: "Topluluk kurallarına, ahlaka, yasalara veya bu sözleşmeye aykırı davranan, spam yapan, platformun işleyişini bozucu yazılımlar kullanan veya diğer kullanıcıları rahatsız eden kişilerin hesapları, açtıkları konular, yorumları ve medyaları TrChads yönetimi tarafından hiçbir uyarı yapılmaksızın kalıcı veya geçici olarak silinebilir/askıya alınabilir. Yönetimin verdiği ban kararları nihaidir ve itiraza kapalıdır."
    },
    {
      id: "10",
      title: "UYUŞMAZLIKLARIN ÇÖZÜMÜ",
      content: "Bu sözleşmeden doğabilecek her türlü ihtilafın çözümünde Türkiye Cumhuriyeti kanunları esastır. Hukuki uyuşmazlıklarda TrChads'in sunucu kayıtları, veritabanı logları ve dijital delilleri HMK madde 193 anlamında kesin delil teşkil eder. İhtilafların çözümünde İstanbul Mahkemeleri ve İcra Daireleri yetkilidir."
    }
  ];

  return (
    <main className="w-full flex flex-col items-center pt-24 pb-32 px-6 md:px-12 relative z-10">
      
      {/* Başlık Alanı */}
      <div className="max-w-[85rem] w-full flex flex-col gap-6 mb-20 animate-title text-center md:text-left">
        <span className="dergi-kicker text-[#EAEAEA]">YASAL BİLDİRİM VE ŞARTLAR</span>
        <h1 className="dergi-title text-4xl md:text-6xl">Kullanıcı Sözleşmesi.</h1>
        <p className="dergi-body max-w-3xl mt-4">
          Lütfen TrChads platformunu kullanmadan önce aşağıdaki yasal metni dikkatlice okuyunuz. Siteyi kullanmanız, içerik üretmeniz veya Google hesabınız ile giriş yapmanız, bu şartları gayrikabili rücu olarak kabul ettiğiniz anlamına gelir.
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
            <p className="dergi-body md:pl-10 text-justify leading-relaxed">
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