// ============================================================================
// SPAM, KÜFÜR VE GÜVENLİK FİLTRESİ (GELİŞMİŞ TÜRKÇE & REDOS KORUMALI)
// ============================================================================

const MAX_MESSAGE_LENGTH = 5000;

const LEET_MAP: Record<string, string> = {
  'a': '[a@4]', 'i': '[i1!ı]', 'o': '[o0ö]', 'e': '[e3]', 
  's': '[s5ş]', 'c': '[cç]', 'u': '[uü]', 'g': '[gğ]',
  'b': '[b8]', 't': '[t7]'
};

// YAMA: ReDoS (Regex çökertme) saldırılarına karşı sınır {0,3} olarak belirlendi.
// Ayrıca /i bayrağı kaldırıldı, tüm kelimeler saf küçük harf (tr-TR) ile test edilecek.
const buildSpamRegex = (words: string[]) => {
  const patterns = words.map(word => {
    return word.split('').map(char => LEET_MAP[char] || char).join('[\\s\\W_]{0,3}');
  });
  return new RegExp(`(?:^|[\\s.,!?_\\-])(?:${patterns.join('|')})(?=[\\s.,!?_\\-]|$)`);
};

// YAMA: Türkçe sondan eklemeli olduğu için \b (kelime sınırı) kaldırıldı.
// 'exact' parametresi ile tam eşleşme veya ek (suffix) kabul etme özelliği eklendi.
const buildSwearRegex = (words: string[], exact: boolean = false) => {
  const patterns = words.map(word => {
    const charPattern = word.split('').map(char => {
      const mapped = LEET_MAP[char] || char;
      return mapped.replace(/\[|\]/g, '').split('').join('');
    }).join('[\\s\\W_]{0,2}');
    return charPattern;
  });
  
  const endBoundary = exact ? `(?=[\\s.,!?_\\-]|$)` : ``;
  return new RegExp(`(?:^|[\\s.,!?_\\-])(?:${patterns.join('|')})${endBoundary}`);
};

const BAN_ROOT_REGEX = buildSpamRegex([
  "casino", "bet", "bahis", "slot", "rulet", "bonus", "kumar", 
  "deneme bonusu", "freespin", "çevrimsiz", "iddaa", "illegal",
  "kaçak maç", "poker", "blackjack", "aviator", "sweet bonanza",
  "papara kiralama", "hesap kiralama", "kolay para", "yasadışı",
  "kripto sinyal", "vip grup", "forex", "canlı bahis", "yatırımsız",
  "şikesi", "hilesi", "escort", "eskort", "mutlu son", "masaj", 
  "jigolo", "şugardadi", "sugar daddy", "onlyfans"
]);

const STRICT_PHRASE_REGEX = /(denemebonusu|vipbahis|kaçakmaç|ccsatışı|çalıntıkart|şifrekırma|kolaypara|garantigelir|evdençalışkazan)/;

const SWEAR_WORDS = [
  "amk", "aq", "mk", "mq", "amq", "amg", "sik", "siktir",
  "sikik", "sikeyim", "sokarım", "sokam", "oç",
  "orospu", "orspu", "ororpu", "piç", "yavşak", 
  "yavsak", "yvsak", "sürtük", "kahpe", "göt", "yarrak", 
  "yarak", "yarram", "yaram", "amcık", "amcik", "amına", "amina", 
  "ibne", "ipne", "gavat", "kavat", "puşt", "pust", "pezevenk", 
  "fahişe", "kaltak", "döl", "sıç", "sic", "sıçayım"
];

const EXACT_SWEAR_WORDS = [
  "mal", "seks", "oç", "oc"
];

// exact=false: kelime sonuna ek gelebilir (örn: amk'ya, piçler)
const SWEAR_ROOT_REGEX = buildSwearRegex(SWEAR_WORDS, false);
// exact=true: sadece kendisi (örn: "normal" kelimesini yakalamamak için "mal" kelimesini daraltır)
const EXACT_SWEAR_REGEX = buildSwearRegex(EXACT_SWEAR_WORDS, true);

const MOD_QUEUE_REGEX = /\b(forex|hack|kripto sinyal|iptv|sanal seks|sugar daddy|hitler|nazizm|satılık|ucuz|kampanya)\b/;
const SOCIAL_AD_REGEX = /(discord\s*(?:gg|app|com))|(t\s*me)|(wa\s*me)|(telegram\s*(?:kanal|grup|gel))|(linktr\.ee)/;

const SYSTEM_REGEX = {
  IP: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/,
  EMAIL: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/,
  PHONE: /(?<!\d)(?:\+90|0)?\s*\(?5\d{2}\)?[\s\-.]*\d{3}[\s\-.]*\d{2}[\s\-.]*\d{2}(?!\d)/,
  FLOOD: /(.{1,4})\1{10,}/,
  GENERAL_LINK: /(?:https?:\/\/[\w-]+)|(?:www\.[\w-]+)|(?:[a-zA-Z0-9-]+\.(?:com|net|org|tr|io|gg|me|co))\b/
};

export type SpamResult = {
  isClean: boolean;
  action: "clean" | "reject" | "mod_queue" | "ban";
  reason: string | null;
};

export function detectSpam(rawText: string): SpamResult {
  if (rawText.length > MAX_MESSAGE_LENGTH) {
    return { isClean: false, action: "reject", reason: "Mesaj çok uzun. Lütfen karakter sınırını aşmayın." };
  }

  const singleLineText = rawText.replace(/[\r\n]+/g, " ");

  if (SYSTEM_REGEX.FLOOD.test(singleLineText)) {
    return { isClean: false, action: "reject", reason: "Spam koruması: Çok fazla tekrarlayan karakter/emoji kullanılamaz." };
  }

  if (SYSTEM_REGEX.IP.test(singleLineText) || SYSTEM_REGEX.EMAIL.test(singleLineText) || SYSTEM_REGEX.PHONE.test(singleLineText)) {
    return { isClean: false, action: "mod_queue", reason: "Kişisel veri tespiti. Moderatör onayı bekleniyor." };
  }

  // YAMA: Türkçe karakter duyarlı şekilde tamamen küçük harfe çevirme (I/İ sorunu ortadan kalktı)
  let normalizedText = singleLineText.toLocaleLowerCase("tr-TR");
  normalizedText = normalizedText.replace(/(.)\1{2,}/g, '$1$1');
  normalizedText = normalizedText.replace(/[\u200B-\u200D\uFEFF]/g, "");
  
  const cyrillicMap: Record<string, string> = { 'с': 'c', 'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x' };
  normalizedText = normalizedText.replace(/[саеорх]/g, match => cyrillicMap[match] || match);

  const noSpaceText = normalizedText.replace(/[\s_]+/g, "");

  if (BAN_ROOT_REGEX.test(normalizedText) || STRICT_PHRASE_REGEX.test(noSpaceText)) {
    return { isClean: false, action: "ban", reason: "İllegal, Yetişkin İçerik veya Dolandırıcılık tespiti." };
  }

  if (SWEAR_ROOT_REGEX.test(normalizedText) || EXACT_SWEAR_REGEX.test(normalizedText)) {
    return { isClean: false, action: "reject", reason: "Topluluk kurallarına aykırı dil tespiti." };
  }

  if (MOD_QUEUE_REGEX.test(normalizedText) || SOCIAL_AD_REGEX.test(normalizedText)) {
    return { isClean: false, action: "mod_queue", reason: "Hassas içerik veya reklam potansiyeli." };
  }

  // Safe Link Test (Yedek olarak küçük harfli versiyonda yapıldı)
  if (SYSTEM_REGEX.GENERAL_LINK.test(normalizedText)) {
    const SAFE_MEDIA_REGEX = /https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+(?:\?[^\s]*)?|https?:\/\/\S+\.gif|https?:\/\/(?:www\.|[a-z]{2}\.)?pinterest\.com\/pin\/\d+\/?|https?:\/\/pin\.it\/[a-zA-Z0-9]+/g;
    
    const mediaMatches = normalizedText.match(SAFE_MEDIA_REGEX);
    if (mediaMatches && mediaMatches.length > 1) {
      return { 
        isClean: false, 
        action: "reject", 
        reason: "Spam Koruması: Bir yoruma en fazla 1 adet medya (TikTok, Pinterest veya GIF) ekleyebilirsiniz." 
      };
    }

    const textWithoutSafeLinks = normalizedText.replace(SAFE_MEDIA_REGEX, '');
    
    if (SYSTEM_REGEX.GENERAL_LINK.test(textWithoutSafeLinks)) {
      return { isClean: false, action: "mod_queue", reason: "Bağlantı içeriyor. Yalnızca 1 adet güvenli medya otomatik onaylanır." };
    }
  }

  return { isClean: true, action: "clean", reason: null };
}