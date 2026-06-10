import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanıcı Sözleşmesi | TrChads",
  description: "TrChads platformunun kullanım koşulları, yasal uyarılar ve kullanıcı sözleşmesi.",
};

export default function SozlesmePage() {
  const sections = [
    {
      id: "01",
      title: "TARAFLAR VE SÖZLEŞMENİN KONUSU",
      content: "Bu sözleşme, TrChads ('Platform', 'Site', 'Biz', 'Yayıncı') ile Site'ye erişen, ziyaret eden, Google OAuth altyapısı üzerinden giriş yapan veya herhangi bir şekilde Site'yi kullanan gerçek kişi ('Kullanıcı', 'Siz', 'Üye') arasında, elektronik ortamda akdedilmiştir. Sözleşmenin konusu; Platform'un sağladığı forum hizmetleri, içerik paylaşımı, sıralama sistemi, medya yükleme ve sosyal etkileşim özelliklerinin kullanımına ilişkin tarafların hak ve yükümlülüklerini düzenlemektedir."
    },
    {
      id: "02",
      title: "SÖZLEŞMENİN KABULÜ VE YÜRÜRLÜĞÜ",
      content: "Site'ye giriş yaparak, üye olarak kaydolmak suretiyle Google hesabınızı bağlayarak, forumda konu açarak, yorum yazarak, fotoğraf yükleyerek, dış bağlantı paylaşarak veya Site'yi herhangi bir şekilde kullanarak; bu sözleşmedeki tüm hükümleri, eklerini ve atıfta bulunulan politikaları (Gizlilik Politikası, Çerez Politikası, Topluluk Kuralları) okuduğunuzu, anladığınızı ve gayrikabili rücu olarak kabul ettiğinizi beyan ve taahhüt etmiş sayılırsınız. Bu kabul, elektronik ortamda gerçekleştiğinden, 6098 sayılı Türk Borçlar Kanunu'nun elektronik sözleşmeler hakkındaki hükümleri uyarınca yazılı şekle eşdeğer delil teşkil eder. Sözleşme, Kullanıcı'nın ilk erişim tarihinde yürürlüğe girer ve hesabın silinmesine veya Platform'un kapatılmasına kadar geçerli kalır."
    },
    {
      id: "03",
      title: "YAŞ SINIRI VE REŞİTLİK ŞARTI",
      content: "TrChads, 18 (on sekiz) yaşından küçük kişilerin kullanımına uygun olmayan içerikler barındırabilir. Platforma kaydolmak ve kullanmak için 18 yaşını doldurmuş olmanız zorunludur. 18 yaş altı kişilerin Platform'a erişimi, üyeliği ve içerik paylaşımı yasaktır. Ebeveynler veya yasal vasiler, reşit olmayan kişilerin internet kullanımından ve bu Platform'a erişiminden sorumludur. 18 yaş altı bir kullanıcının tespit edilmesi halinde hesabı önceden haber verilmeksizin kalıcı olarak silinir ve Platform'a erişimi engellenir. Yaş bilgisi konusunda yanlış beyanda bulunan Kullanıcı, bu durumdan doğan tüm hukuki ve cezai sorumluluğu kabul eder."
    },
    {
      id: "04",
      title: "GOOGLE İLE GİRİŞ, HESAP GÜVENLİĞİ VE KİMLİK DOĞRULAMA",
      content: "Platform, kullanıcı kimlik doğrulaması için Google OAuth 2.0 protokolünü ve Supabase Auth altyapısını kullanmaktadır. Platformumuz doğrudan herhangi bir şifre talep etmez, saklamaz veya işlemez. Sisteme giriş yaptığınızda yalnızca Google tarafından sağlanan temel profil bilgileriniz (ad, soyad, e-posta adresi, profil fotoğrafı URL'si, Google ID) alınır ve veritabanımızda saklanır. Google hesabınızın, bağlı cihazlarınızın ve kimlik bilgilerinizin güvenliğinden tamamen siz sorumlusunuz. Hesabınız üzerinden gerçekleştirilen her türlü forum paylaşımı, yorum, medya yüklemesi, oy kullanımı ve etkileşimin bizzat sizin tarafınızdan yapıldığı, 6100 sayılı Hukuk Muhakemeleri Kanunu (HMK) md. 193 anlamında kesin karine olarak kabul edilir. Hesabınızın izinsiz kullanıldığını fark etmeniz halinde derhal support@trchads.com adresine bildirmekle yükümlüsünüz."
    },
    {
      id: "05",
      title: "FORUM KULLANIMI, KULLANICI İÇERİKLERİ VE SORUMLULUK",
      content: "TrChads özgür ve açık bir topluluk forumudur. Kullanıcılar yeni konular açabilir, mevcut konulara yorum yazabilir, oylama yapabilir, fotoğraf yükleyebilir ve üçüncü taraf platformlara ait bağlantılar paylaşabilir. Platformda paylaşılan tüm başlıklar, mesajlar, fikirler, yorumlar, görseller, videolar, bağlantılar ve diğer materyaller ('Kullanıcı Tarafından Oluşturulan İçerik' veya 'Kİ') tamamen ilgili kullanıcının şahsi görüşünü yansıtır; hukuki, cezai ve mali sorumluluğu münhasıran kendisine aittir. TrChads Yönetimi, Kİ'lerin doğruluğunu, yasallığını, güvenilirliğini, eksiksizliğini veya güncelliğini garanti etmez, önceden denetleme (ön sansür) yükümlülüğü taşımaz. Hakaret, tehdit, şantaj, nefret söylemi, ayrımcılık, terör propagandası, çocuk istismarı içeriği, müstehcenlik, şiddet övgüsü, yasa dışı yönlendirme, dolandırıcılık veya Türkiye Cumhuriyeti yasalarına aykırı herhangi bir içerik paylaşımı kesinlikle yasaktır ve cezai yaptırıma tabidir."
    },
    {
      id: "06",
      title: "FOTOĞRAF, MEDYA, EMBED VE DIŞ BAĞLANTI PAYLAŞIMI",
      content: "Kullanıcılar platform üzerinde kendi cihazlarından fotoğraf ve görsel yükleyebilir; TikTok video bağlantıları, Pinterest pinleri/panoları, YouTube videoları veya diğer üçüncü taraf platformlara ait bağlantıları forum içerisinde metin veya gömülü (embed) olarak paylaşabilir. Paylaşılan tüm dış bağlantıların, yüklenen görsellerin, videoların ve medyaların telif hakkı ihlali içermediği, müstehcenlik, şiddet, nefret söylemi, yasa dışı unsurlar veya üçüncü şahıs haklarını ihlal edici içerik barındırmadığı; Kullanıcı'nın beyanı, taahhüdü ve münhasır sorumluluğu altındadır. TrChads, üçüncü taraf platformların (TikTok, Pinterest, YouTube, Google, vb.) gizlilik politikalarından, kullanım koşullarından, içeriklerinden veya teknik erişilebilirliğinden sorumlu tutulamaz. Harici bağlantılara tıklamak tamamen Kullanıcı'nın kendi riski ve sorumluluğundadır."
    },
    {
      id: "07",
      title: "ÜÇÜNCÜ TARAF SORUMLULUK REDDİ, TAZMİNAT VE ZARAR GÖRME",
      content: "Platformda Kullanıcılar tarafından paylaşılan linkler, görseller, videolar ve metinler üzerinden erişilen harici web sitelerinin, uygulamaların ve içeriklerin doğruluğu, güvenliği ve yasallığı TrChads'in kontrolünde değildir. Kullanıcı; Site'ye yüklediği, paylaştığı, gömdüğü veya herhangi bir şekilde yayınladığı içerik sebebiyle üçüncü şahısların, kurumların, kamu kuruluşlarının veya telif hakkı sahiplerinin TrChads'e, yöneticilerine, çalışanlarına ve iş ortaklarına yöneltebileceği her türlü idari para cezası, tazminat talebi, dava masrafı, vekalet ücreti, yargılama gideri ve diğer yasal yükümlülükleri ilk talepte, nakden ve defaten tazmin etmekle mükelleftir. TrChads, Kullanıcı içeriklerinden doğan dolaylı, arızi, neticede oluşan veya öngörülemeyen zararlardan (kâr kaybı, veri kaybı, itibar zedelenmesi, iş kaybı dahil) hiçbir şekilde sorumlu tutulamaz. Platformun Kullanıcı'ya karşı maksimum sorumluluğu, son 12 ay içinde Kullanıcı tarafından ödenmiş herhangi bir bedelin bulunmaması nedeniyle sıfır (0) TL ile sınırlıdır."
    },
    {
      id: "08",
      title: "FİKRİ MÜLKİYET, TELİF HAKLARI VE İÇERİK LİSANSI",
      content: "Platformda yer alan TrChads'e ait logo, tasarım, kullanıcı arayüzü (UI), CSS/HTML/JS yapıları, marka kimliği, alan adı, metinler, grafikler, yazılım kodları ve diğer tüm fikri mülkiyet hakları TrChads yayıncısına aittir; izinsiz kopyalanamaz, çoğaltılamaz, dağıtılamaz, değiştirilemez veya ticari amaçla kullanılamaz. Kullanıcılar, Site'ye yükledikleri, paylaştıkları veya gönderdikleri her türlü içerik, fotoğraf, video, metin ve materyal için TrChads'e; bu içerikleri platformda sergileme, çoğaltma, dağıtma, yayma, alt lisans verme, arşivleme ve yedekleme konusunda dünya çapında, münhasır olmayan, telifsiz, ücretsiz, sürekli ve geri alınamaz bir lisans vermiş sayılırlar. Bu lisans, Kullanıcı'nın hesabını silmesi durumunda bile; topluluk bütünlüğü, yasal yükümlülükler ve arşivleme amacıyla anonimleştirilmiş olarak devam edebilir. Telif hakkı ihlali durumlarında yürürlükteki mevzuat gereği 'Uyar-Kaldır' (Notice and Takedown) prensibi işletilir."
    },
    {
      id: "09",
      title: "TELİF HAKKI İHLALİ BİLDİRİM SÜRECİ (UYAR-KALDIR)",
      content: "Fikri mülkiyet haklarınızın ihlal edildiğini düşünüyorsanız, ihlal edilen içeriğin tam URL'si, size ait olduğunu kanıtlayan belgeler (tescil belgesi, yayın tarihi, orijinal dosya vb.), yetkili temsilci olduğunuzu gösteren vekaletname (tüzel kişiler için), iletişim bilgileriniz (ad, soyad, adres, telefon, e-posta) ve ihlalin doğru olduğuna dair yeminli beyanınızı içeren bir bildirimi legal@trchads.com adresine gönderebilirsiniz. Bildiriminizin usulüne uygun olması ve haklı temele dayanması halinde, en geç 48 (kırk sekiz) saat içinde ilgili içerik incelenerek kaldırılacak veya erişime kapatılacaktır. Kasıtlı veya kötü niyetli olarak asılsız bildirimde bulunan kişilerin hesapları kalıcı olarak askıya alınabilir ve hukuki yaptırıma maruz kalabilir."
    },
    {
      id: "10",
      title: "KİŞİSEL VERİLERİN KORUNMASI (KVKK)",
      content: "Kullanıcıların Site'yi kullanımı sırasında elde edilen kişisel veriler (Google profil bilgileri, IP adresleri, cihaz bilgileri, erişim zamanları, coğrafi konum (yaklaşık), tarayıcı bilgileri, log kayıtları, forum paylaşımları ve yüklenen medyalar), 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenmektedir. Veri işleme faaliyetleri hakkında detaylı bilgi için Gizlilik Politikamızı (trchads.com/gizlilik) inceleyebilirsiniz. Platform, adli veya idari makamlardan (mahkemeler, savcılıklar, emniyet müdürlükleri, siber suçlarla mücadele birimleri, BTK) usulüne uygun bir talep gelmesi halinde, yasal yükümlülükleri gereği kullanıcılara ait IP adreslerini, erişim loglarını ve hesap bilgilerini ilgili resmi makamlarla paylaşmakla yükümlüdür. Bu paylaşım, KVKK md. 5/2-ç (yasal yükümlülük) ve md. 5/2-e (hukuki uyuşmazlık) uyarınca gerçekleşir."
    },
    {
      id: "11",
      title: "ÇEREZ POLİTİKASI VE İZİN",
      content: "Platform, oturum yönetimi (Supabase Auth), güvenlik doğrulamaları (CSRF koruması), kullanıcı tercihleri ve analitik amaçlarla çerezler kullanmaktadır. Çerez türleri, amaçları, saklama süreleri ve yönetim seçenekleri hakkında detaylı bilgi için Çerez Politikamızı (trchads.com/cerezler) inceleyebilirsiniz. Zorunlu çerezler (kimlik doğrulama, güvenlik) hariç; analitik, fonksiyonel ve pazarlama çerezleri yalnızca açık rızanız ile aktifleştirilir. Tarayıcı ayarlarınızdan çerezleri engelleyebilir, daha önce verdiğiniz izni istediğiniz zaman geri çekebilir veya Çerez Politikası sayfamızdan tercihlerinizi güncelleyebilirsiniz. Çerezleri reddetmeniz durumunda Platform'un bazı özellikleri kısıtlı çalışabilir veya kullanılamayabilir."
    },
    {
      id: "12",
      title: "HİZMETİN KESİNTİSİ, DEĞİŞİKLİKLER VE 'OLDUĞU GİBİ' SUNUM",
      content: "TrChads, platformu ve sunduğu tüm özellikleri 'OLDUĞU GİBİ' ('AS IS') ve 'MEVCUT OLDUĞU KADARIYLA' ('AS AVAILABLE') esasına göre sunar. Sitenin 7/24 kesintisiz, virüssüz, hatasız, güvenli veya her zaman erişilebilir olacağını; verilerinizin (kullanıcıların açtığı konular, yüklediği fotoğraflar, gönderdiği bağlantılar, yorumlar, oylar) kaybolmayacağını, bozulmayacağını veya üçüncü taraflarca ele geçirilmeyeceğini garanti etmez, taahhüt etmez veya teminat vermez. Yönetim, platformun tamamını, bir kısmını, veritabanını, kullanıcı içeriklerini veya herhangi bir özelliği; önceden haber vermeksizin, herhangi bir sebep göstermeksizin ve herhangi bir zamanda silme, kapatma, askıya alma, değiştirme veya sınırlama hakkını saklı tutar. Platformda yapılan güncellemeler, bakım çalışmaları veya teknik arızalar nedeniyle oluşabilecek veri kayıplarından TrChads sorumlu tutulamaz."
    },
    {
      id: "13",
      title: "KULLANICI İÇERİĞİNİN KALDIRILMASI, HESAP SİLME VE VERİ TALEPLERİ",
      content: "Kullanıcı, istediği zaman hesabını veya platformda paylaştığı herhangi bir içeriği (konu, yorum, görsel, video) kaldırma talebinde bulunabilir. Hesap silme talebiniz, support@trchads.com adresine gönderdiğiniz e-posta ile veya profil sayfanızdaki 'Hesabı Sil' seçeneği üzerinden gerçekleştirilebilir. Hesap silme işlemi geri alınamaz. Hesap silindiğinde; profil bilgileriniz, kimlik verileriniz ve kişisel tanımlayıcı bilgileriniz 30 (otuz) gün içinde sistemden silinir. Ancak forumda açtığınız konular, yaptığınız yorumlar ve paylaştığınız içerikler, topluluk bütünlüğü, tartışma akışının korunması ve yasal yükümlülükler gereği anonimleştirilerek (kullanıcı adı ve profil bilgileri kaldırılarak) saklanabilir veya tamamen silinebilir. IP adresleri ve erişim logları güvenlik amacıyla 1 (bir) yıl boyunca saklanır. KVKK md. 11 kapsamındaki haklarınızı kullanmak için privacy@trchads.com adresine başvuruda bulunabilirsiniz."
    },
    {
      id: "14",
      title: "MODERASYON, HESAP İPTALİ VE UZAKLAŞTIRMA (BAN)",
      content: "Topluluk Kurallarına, ahlaka, kamu düzenine, Türkiye Cumhuriyeti yasalarına veya bu sözleşmeye aykırı davranan; spam yapan, platformun işleyişini bozucu yazılımlar (bot, script, crawler) kullanan, diğer kullanıcıları rahatsız eden, trol davranışları sergileyen veya topluluk huzurunu bozan kişilerin hesapları, açtıkları konular, yorumları, medyaları ve oyları TrChads Yönetimi tarafından önceden haber verilmeksizin, tek taraflı olarak ve herhangi bir gerekçe göstermeksizin kalıcı veya geçici olarak silinebilir, düzenlenebilir, askıya alınabilir veya erişime kapatılabilir. Yönetimin verdiği ban, susturma, içerik kaldırma veya hesap askıya alma kararları nihai olup; itiraz, temyiz veya iptal taleplerine kapalıdır. Yönetim, moderasyon kararlarını gerekçelendirmek veya açıklama yapmakla yükümlü değildir."
    },
    {
      id: "15",
      title: "SÖZLEŞMENİN DEVREDİLMESİ VE ŞİRKET DEĞİŞİKLİĞİ",
      content: "TrChads, platformun tamamını, bir kısmını, markasını, alan adını, kullanıcı veritabanını veya işletme haklarını başka bir gerçek veya tüzel kişiye devretmesi, satması, birleşmesi veya devralınması durumunda; bu sözleşme ve altında doğan tüm haklar, yükümlülükler ve lisanslar devralan tarafa otomatik olarak geçer. Kullanıcı, bu tür bir devir durumunda en az 30 (otuz) gün önceden e-posta yoluyla bilgilendirilecektir. Devir sonrasında Platform'un kullanımına devam etmeniz, yeni veri sorumlusunun politikalarını kabul ettiğiniz anlamına gelir. Devirden önce silinen hesaplar ve içerikler devralan tarafa aktarılmaz."
    },
    {
      id: "16",
      title: "SÖZLEŞME DEĞİŞİKLİKLERİ VE GÜNCELLEME",
      content: "TrChads, bu sözleşmeyi, eklerini ve atıfta bulunulan politikaları herhangi bir zamanda, önceden haber vermeksizin, tek taraflı olarak değiştirme, güncelleme veya yeni hükümler ekleme hakkını saklı tutar. Sözleşme değişiklikleri, Platform'da yayınlandığı tarihte yürürlüğe girer. Kullanıcı'ya e-posta yoluyla veya Platform üzerinden bildirim yapılabilir; ancak bildirim yapılmaması değişikliğin geçersizliği anlamına gelmez. Değişikliklerin yayınlanmasını takip eden ilk erişiminizde, güncellenmiş sözleşmeyi kabul etmiş sayılırsınız. Sözleşme değişikliklerini düzenli olarak takip etme yükümlülüğü Kullanıcı'ya aittir. Değişikliklere itiraz etmeniz durumunda Platform'u kullanmayı derhal bırakmanız gerekir."
    },
    {
      id: "17",
      title: "KISIMLARIN AYRILABİLİRLİĞİ (SEVERABILITY)",
      content: "Bu sözleşmenin herhangi bir maddesi, hükmü veya kısmının; herhangi bir mahkeme, hakem heyeti veya yetkili idari merci tarafından geçersiz, uygulanamaz, yasaya aykırı veya hukuka aykırı olduğunun tespit edilmesi durumunda; söz konusu hüküm, mümkün olan en geniş ölçüde ve amacına uygun şekilde uygulanır; geri kalan hükümlerin, maddelerin ve kısımların geçerliliği, bağlayıcılığı ve yürürlüğü etkilenmez. Geçersiz hüküm, tarafların orijinal iradesine en yakın, hukuken geçerli bir hüküm ile değiştirilir."
    },
    {
      id: "18",
      title: "UYUŞMAZLIKLARIN ÇÖZÜMÜ, YETKİLİ MAHKEME VE HUKUK",
      content: "Bu sözleşmeden veya Platform kullanımından doğabilecek her türlü ihtilafın çözümünde Türkiye Cumhuriyeti kanunları esas alınır; özellikle 6098 sayılı Türk Borçlar Kanunu, 6100 sayılı Hukuk Muhakemeleri Kanunu, 5846 sayılı Fikir ve Sanat Eserleri Kanunu, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uygulanır. Hukuki uyuşmazlıklarda TrChads'in sunucu kayıtları, veritabanı logları, IP adresleri, zaman damgaları ve dijital delilleri HMK md. 193 anlamında kesin delil teşkil eder. İhtilafların çözümünde İstanbul Anadolu veya İstanbul Avrupa Mahkemeleri ve İcra Daireleri yetkilidir. Taraflar, uyuşmazlıkların çözümünde öncelikle dostane görüşmeler yoluyla anlaşmaya çalışmayı kabul eder."
    },
    {
      id: "19",
      title: "İLETİŞİM, BİLDİRİM VE YASAL ADRES",
      content: "Bu sözleşme ile ilgili sorularınız, şikayetleriniz, ihtarname, mahkeme celbi, savcılık talebi veya diğer hukuki bildirimleriniz için aşağıdaki iletişim kanallarını kullanabilirsiniz. Resmi hukuki bildirimler yalnızca legal@trchads.com adresine gönderilen e-postalar aracılığıyla kabul edilir. Diğer kanallardan (sosyal medya, forum, Discord) yapılan başvurular hukuki bildirim olarak değerlendirilmez. Platform üzerinden yapılan bildirimler, Kullanıcı'nın kayıtlı e-posta adresine gönderilecektir. Kullanıcı, e-posta adresinin güncel ve erişilebilir olmasını sağlamakla yükümlüdür. İletişim bilgilerindeki değişiklikler Platform'da duyurulur."
    }
  ];

  return (
    <main className="w-full flex flex-col items-center pt-24 pb-32 px-6 md:px-12 relative z-10">
      
      {/* Başlık Alanı */}
      <div className="max-w-[85rem] w-full flex flex-col gap-6 mb-20 animate-title text-center md:text-left">
        <span className="dergi-kicker text-[#EAEAEA]">YASAL BİLDİRİM VE ŞARTLAR</span>
        <h1 className="dergi-title text-4xl md:text-6xl">Kullanıcı Sözleşmesi.</h1>
        <p className="dergi-body max-w-3xl mt-4">
          Lütfen TrChads platformunu kullanmadan önce aşağıdaki yasal metni dikkatlice okuyunuz. Siteyi kullanmanız, içerik üretmeniz, Google hesabınız ile giriş yapmanız veya herhangi bir şekilde Platform'a erişmeniz, bu şartları gayrikabili rücu olarak kabul ettiğiniz anlamına gelir. Bu sözleşme, Gizlilik Politikası, Çerez Politikası ve Topluluk Kuralları ile bir bütündür.
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

        {/* İletişim Özeti */}
        <div className="mt-4 pt-8 border-t border-white/10 md:pl-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <span className="dergi-kicker text-white/30 mb-0 text-[10px]">TEKNİK DESTEK</span>
              <span className="text-white/50 text-sm font-light">support@trchads.com</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="dergi-kicker text-white/30 mb-0 text-[10px]">HUKUKİ BİLDİRİMLER</span>
              <span className="text-white/50 text-sm font-light">legal@trchads.com</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="dergi-kicker text-white/30 mb-0 text-[10px]">VERİ GÜVENLİĞİ</span>
              <span className="text-white/50 text-sm font-light">privacy@trchads.com</span>
            </div>
          </div>
        </div>

        {/* Son Güncelleme Tarihi */}
        <div className="pt-6 border-t border-white/5 md:pl-10">
          <p className="dergi-kicker text-white/20">
            SON GÜNCELLEME: {new Date().toLocaleDateString('tr-TR')} — BU SÖZLEŞME TÜRKİYE CUMHURİYETİ KANUNLARINA UYGUN OLARAK HAZIRLANMIŞTIR.
          </p>
        </div>
      </div>

    </main>
  );
}