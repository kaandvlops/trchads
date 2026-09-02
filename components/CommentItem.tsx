"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserProfile } from "@/types";

interface CommentItemProps {
  comment: { id: string; content: string; created_at: string; user_id: string; parent_id?: string | null; };
  author?: Pick<UserProfile, "id" | "full_name" | "avatar_url" | "is_admin" | "is_verified">;
  currentUserId?: string;
  isAdmin?: boolean;
  isBanned?: boolean; // GÜVENLİK: Ban kontrolü eklendi
  onReport?: (commentId: string, reportedUserId: string) => void;
  onWarn?: (userId: string) => void;
  onDelete?: (commentId: string) => void;
  isReply?: boolean;
  replies?: any[];
  // DÜZELTME: Parametre sırası standartlaştırıldı (content, parentId)
  onReplySubmit?: (content: string, parentId: string) => Promise<boolean>;
}

// TIKTOK KALKANI
const TikTokSafeFacade = ({ videoId }: { videoId: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Video ID sadece rakamlardan oluşmalıdır (XSS koruması)
  if (!/^\d+$/.test(videoId)) return null;

  if (!isLoaded) {
    return (
      <div 
        onClick={() => setIsLoaded(true)}
        className="my-6 w-full max-w-[325px] aspect-[9/16] bg-[#050505] rounded-lg border border-white/10 shadow-2xl flex flex-col items-center justify-center cursor-pointer group hover:border-white/30 transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all z-10 border border-white/10">
          <svg className="w-8 h-8 text-white/60 group-hover:text-white ml-1 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <span className="mt-6 text-[10px] font-mono text-white/40 group-hover:text-white/80 uppercase tracking-[0.2em] z-10 transition-colors">
          TikTok Videosunu Yükle
        </span>
      </div>
    );
  }

  return (
    <div className="my-6 w-full max-w-[325px]">
      <iframe 
        src={`https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=1&autoplay=1`} 
        className="w-full aspect-[9/16] rounded-lg border border-white/10 shadow-2xl bg-black"
        allow="fullscreen; encrypted-media; autoplay;"
        allowFullScreen
        sandbox="allow-scripts allow-popups allow-same-origin allow-presentation"
      />
    </div>
  );
};

// UZUN LINK İÇİN PINTEREST KUTUSU (EMBED)
const PinterestSafeEmbed = ({ pinId }: { pinId: string }) => {
  if (!/^\d+$/.test(pinId)) return null;

  return (
    <div className="my-6 w-full max-w-[250px] overflow-hidden rounded-2xl shadow-xl bg-transparent border border-white/10 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center -z-10 text-[10px] font-mono text-white/20">Yükleniyor...</div>
      <iframe 
        src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}`} 
        height="400" 
        width="250" 
        frameBorder="0" 
        scrolling="no"
        className="relative z-10"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

// METİN VE MEDYA AYRIŞTIRICI (Güvenli Regex ve Sanitization)
const renderParsedContent = (text: string) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let mediaCount = 0;
  
  const combinedRegex = /(https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)(?:\?[^\s]*)?)|(https?:\/\/(?:media\d?\.tenor\.com|media\d?\.giphy\.com|[a-zA-Z0-9.\-_]+\.supabase\.co)\/[^\s]+\.gif)|(https?:\/\/(?:www\.|[a-z]{2}\.)?pinterest\.com\/pin\/(\d+)\/?)|(https?:\/\/pin\.it\/([a-zA-Z0-9]+))/gi;
  
  let match;
  let keyIndex = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${keyIndex++}`}>{text.substring(lastIndex, match.index)}</span>);
    }
    
    if (mediaCount < 1) {
      if (match[2]) {
        parts.push(<TikTokSafeFacade key={`media-${keyIndex++}`} videoId={match[2]} />);
        mediaCount++;
      } else if (match[3]) {
        parts.push(
          <div key={`media-${keyIndex++}`} className="my-6 w-full max-w-xl md:ml-[-10px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={match[3]} 
              alt="Medya" 
              className="rounded-lg border border-white/10 shadow-xl object-contain bg-[#050505] w-full max-h-[380px]" 
              loading="lazy"
            />
          </div>
        );
        mediaCount++;
      } else if (match[5]) {
        parts.push(<PinterestSafeEmbed key={`media-${keyIndex++}`} pinId={match[5]} />);
        mediaCount++;
      } else if (match[6]) {
        const safePinUrl = `https://pin.it/${encodeURIComponent(match[7])}`;
        parts.push(
          <div key={`media-${keyIndex++}`} className="my-6">
            <a 
              href={safePinUrl} 
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              className="inline-flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-4 rounded-2xl transition-all font-mono text-xs uppercase tracking-widest group shadow-lg w-fit"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/></svg>
              Pinterest&apos;te Görüntüle
            </a>
          </div>
        );
        mediaCount++;
      }
    } else {
      parts.push(<span key={`text-${keyIndex++}`}>{match[0]}</span>);
    }
    
    lastIndex = combinedRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${keyIndex++}`}>{text.substring(lastIndex)}</span>);
  }
  
  return parts;
};

export default function CommentItem({ 
  comment, author, currentUserId, isAdmin, isBanned, onReport, onWarn, onDelete, 
  isReply = false, replies = [], onReplySubmit 
}: CommentItemProps) {
  
  const getAvatar = (url?: string | null, name?: string) => {
    if (url && (url.startsWith("https://") || url.startsWith("/"))) {
      return url;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "U")}&backgroundColor=050505&textColor=ffffff`;
  };

  const isOwnComment = currentUserId === comment.user_id;

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const handleReplyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onReplySubmit || !replyText.trim() || isSubmittingReply) return;
    
    setReplyError(null);
    setIsSubmittingReply(true);

    try {
      // DÜZELTME: content ilk parametre, parentId ikinci parametre
      const success = await onReplySubmit(replyText.trim(), comment.id);
      
      if (success) {
        setReplyText("");
        setIsReplying(false);
        setShowReplies(true); 
      }
    } catch {
      setReplyError("Yanıt gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className={`w-full bg-transparent group relative transition-colors max-w-4xl ${isReply ? 'mt-6' : 'border-b dergi-border py-8'}`}>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href={`/profil/${comment.user_id}`} className="shrink-0">
            <Image 
              src={getAvatar(author?.avatar_url, author?.full_name || comment.user_id)} 
              alt="Avatar" 
              width={isReply ? 40 : 56} 
              height={isReply ? 40 : 56} 
              unoptimized
              className={`${isReply ? 'w-10 h-10' : 'w-14 h-14'} object-cover border dergi-border scale hover:scale-110 transition-all duration-500 cursor-pointer rounded-none`} 
            />
          </Link>
          
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <Link href={`/profil/${comment.user_id}`} className={`font-light text-white hover:text-white/60 uppercase tracking-widest transition-colors whitespace-nowrap ${isReply ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>
                {author?.full_name || "BİLİNMEYEN"}
              </Link>
              
              {author?.is_admin && (
                <span className="border dergi-border text-white/60 text-[8px] md:text-[10px] font-mono px-2 py-1 tracking-[0.3em] uppercase shrink-0 whitespace-nowrap">
                  Yönetici
                </span>
              )}
            </div>
            <div className="dergi-kicker mt-1">
              {new Date(comment.created_at).toLocaleString('tr-TR')}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-2 md:mt-0 shrink-0 items-center">
          {/* GÜVENLİK: Banlı kullanıcı yanıt butonunu göremez */}
          {!isReply && currentUserId && !isBanned && (
            <button 
              onClick={() => { setIsReplying(!isReplying); setReplyError(null); }}
              className="text-xs font-mono text-indigo-300/80 border border-indigo-500/20 px-4 py-2 uppercase tracking-[0.2em] hover:bg-indigo-500/10 hover:text-indigo-300 transition-all rounded-none"
            >
              Yanıtla
            </button>
          )}

          {currentUserId && !isOwnComment && onReport && (
            <button 
              onClick={() => onReport(comment.id, comment.user_id)} 
              className="text-xs font-mono text-white/50 border dergi-border px-4 py-2 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all rounded-none"
            >
              Şikayet
            </button>
          )}

          {isAdmin && (
            <>
              {!isOwnComment && onWarn && (
                <button 
                  onClick={() => onWarn(comment.user_id)} 
                  className="text-xs font-mono text-white/50 border dergi-border px-4 py-2 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all rounded-none"
                >
                  Uyar
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => onDelete(comment.id)} 
                  className="text-xs font-mono text-white/50 border dergi-border px-4 py-2 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-red-400 hover:border-red-500/30 transition-all rounded-none"
                >
                  Sil
                </button>
              )}
            </>
          )}
          {!isAdmin && isOwnComment && onDelete && (
            <button 
              onClick={() => onDelete(comment.id)} 
              className="text-xs font-mono text-white/50 border dergi-border px-4 py-2 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-red-400 hover:border-red-500/30 transition-all rounded-none"
            >
              Sil
            </button>
          )}
        </div>
      </div>
      
      <div className={`dergi-body text-white/80 whitespace-pre-wrap mt-2 ${isReply ? 'text-sm md:text-base md:ml-[64px]' : 'text-base md:text-lg md:ml-[88px]'}`}>
        {renderParsedContent(comment.content)}
      </div>

      {isReplying && (
        <form onSubmit={handleReplyClick} className={`mt-6 p-4 border dergi-border bg-[#020202] ${isReply ? 'md:ml-[64px]' : 'md:ml-[88px]'}`}>
          {replyError && (
            <div className="bg-black border border-red-500/30 text-red-500 p-3 dergi-kicker text-left mb-3 text-xs">
              {replyError}
            </div>
          )}
          
          <textarea 
            rows={2} 
            required 
            maxLength={1000}
            value={replyText} 
            onChange={(e) => setReplyText(e.target.value)} 
            disabled={isSubmittingReply} 
            placeholder="Yanıtınızı buraya yazın veya bir medya linki (GIF/TikTok/Pinterest) yapıştırın..." 
            className="w-full bg-[#050505] border dergi-border px-4 py-3 text-white font-light text-sm focus:outline-none focus:border-indigo-500/50 resize-none transition-colors disabled:opacity-30 mb-3" 
          />
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => { setIsReplying(false); setReplyError(null); }} 
              className="text-[10px] font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={isSubmittingReply || !replyText.trim()} 
              className="dergi-btn py-2 px-6 disabled:opacity-20 text-[10px]"
            >
              {isSubmittingReply ? "Taranıyor..." : "Yanıtı Gönder"}
            </button>
          </div>
        </form>
      )}

      {!isReply && replies.length > 0 && (
        <div className="md:ml-[88px] mt-6">
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-xs font-mono text-white/40 hover:text-indigo-300 transition-colors uppercase tracking-[0.2em]"
          >
            <div className="w-6 h-[1px] bg-white/20"></div>
            {showReplies ? "Yanıtları Gizle" : `${replies.length} Yanıtı Gör`}
          </button>
          
          {showReplies && (
            <div className="border-l border-white/5 pl-4 md:pl-6 mt-4 flex flex-col gap-4">
              {replies.map(reply => (
                <CommentItem 
                  key={reply.id}
                  comment={reply}
                  author={reply.profiles} 
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  isBanned={isBanned}
                  onReport={onReport}
                  onWarn={onWarn}
                  onDelete={onDelete}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}