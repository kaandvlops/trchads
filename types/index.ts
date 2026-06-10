export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  spotify_url: string | null;
  total_comments: number;
  total_topics: number;
  score: number;
  is_verified: boolean;
  is_admin: boolean;
  banned_until: string | null;
}

export interface Celebrity {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  
  // Fiziksel Özellikler ve Estetik Pano (Galeri)
  country?: string | null;
  birth_year?: string | null;
  height?: number | null;
  weight?: number | null;
  gallery_1?: string | null;
  gallery_2?: string | null;
  gallery_3?: string | null;

  total_votes: number;
  avg_appearance: number;
  avg_symmetry: number;
  avg_jawline: number;
  avg_eyes: number;
  avg_style: number;
  avg_charisma: number;
  overall_avg?: number; // Client tarafında sıralama için hesaplanacak
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Topic {
  id: string;
  category_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  // İlişkisel alanlar
  profiles?: Pick<UserProfile, 'full_name' | 'avatar_url' | 'is_admin' | 'is_verified'>;
  forum_comments?: [{ count: number }]; 
}

export interface Comment {
  id: string;
  topic_id?: string;
  celebrity_id?: string;
  character_id?: string; // YENİ: Karakter yorumları için
  user_id: string;
  content: string;
  parent_id?: string | null; // YENİ: Yanıt sistemi (iç içe yorumlar) için
  created_at: string;
}

export interface UserWarning {
  id: string;
  user_id: string;
  admin_id: string;
  reason: string;
  created_at: string;
  // İlişkisel (Relational) sorgular için ek tipler
  warned_user?: Pick<UserProfile, 'full_name' | 'banned_until'>;
  admin_user?: Pick<UserProfile, 'full_name'>;
}

export interface UserReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  topic_id: string | null;
  forum_comment_id: string | null; // YENİ: Vercel hatasını çözen kısım
  celeb_comment_id: string | null; // YENİ: Vercel hatasını çözen kısım
  character_comment_id: string | null; // YENİ: Vercel hatasını çözen kısım
  reason: string;
  status: 'pending' | 'resolved';
  created_at: string;
  
  // İlişkisel (Relational) sorgular için ek tipler
  reporter?: Pick<UserProfile, 'full_name'>;
  reported_user?: Pick<UserProfile, 'full_name'>;
  topic?: Pick<Topic, 'id' | 'title' | 'content'>;
  forum_comment?: Pick<Comment, 'id' | 'content' | 'topic_id'>;
  celeb_comment?: Pick<Comment, 'id' | 'content' | 'celebrity_id'>;
  character_comment?: Pick<Comment, 'id' | 'content' | 'character_id'>;
}

// =========================================
// TIER LIST (SIRALAMA PANOSU) TİPLERİ
// =========================================

export type TierRank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface TierRow {
  rank: TierRank;
  color: string;
  items: Celebrity[]; 
}