"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Category, Topic } from "@/types";

interface ExtendedTopic extends Topic {
  commentCount: number;
}

type RawSupabaseTopic = Topic & {
  forum_comments: { count: number }[];
};

export default function KategoriSayfasi() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<ExtendedTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndTopics = async () => {
      const { data: categoryData } = await supabase
        .from("forum_categories")
        .select("*")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (categoryData) {
        setCategory(categoryData);

        const { data: topicsData } = await supabase
          .from("forum_topics")
          .select(`
            *,
            profiles!user_id(id, full_name, is_admin),
            forum_comments(count)
          `)
          .eq("category_id", categoryData.id)
          .order("created_at", { ascending: false });

        if (topicsData && topicsData.length > 0) {
          const enrichedTopics: ExtendedTopic[] = (topicsData as unknown as RawSupabaseTopic[]).map((t) => ({
            ...t,
            profiles: t.profiles,
            commentCount: t.forum_comments?.[0]?.count || 0
          }));
          
          setTopics(enrichedTopics);
        } else {
          setTopics([]);
        }
      }
      setLoading(false);
    };

    fetchCategoryAndTopics();
  }, [categorySlug]);

  if (loading) return (
    <div className="w-full min-h-[50vh] flex items-center justify-center dergi-kicker">
      ARŞİV ALANI YÜKLENİYOR...
    </div>
  );
  
  if (!category) return (
    <div className="w-full min-h-[50vh] flex items-center justify-center dergi-kicker text-white/40">
      Kategori bulunamadı veya arşiv dışı bırakılmış.
    </div>
  );

  return (
    <main className="w-full max-w-5xl mx-auto px-6 py-24 overflow-x-hidden">
      
      <div className="mb-16 border-b dergi-border pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <Link 
            href="/forum" 
            className="dergi-kicker hover:text-white transition-colors duration-500 mb-6 inline-block"
          >
            ← FORUMA DÖN
          </Link>
          <span className="dergi-kicker mb-3">
            Kürsü Bölümü
          </span>
          <h1 className="dergi-title mb-4">
            {category.name}
          </h1>
          <p className="dergi-body text-xs md:text-sm">
            Bu kulvarda yürütülen tüm açık arşiv tartışmaları.
          </p>
        </div>
        
        <Link 
          href={`/forum/${category.slug}/yeni-konu`}
          className="dergi-btn text-center whitespace-nowrap shrink-0"
        >
          YENİ KONU AÇ
        </Link>
      </div>

      {topics.length === 0 ? (
        <div className="py-16 p-8 text-left dergi-kicker border dergi-border bg-black">
          BU KATEGORİDE HENÜZ HİÇBİR KAYIT BULUNMUYOR. İLK ADIMI SEN AT.
        </div>
      ) : (
        <div className="flex flex-col border-t dergi-border">
          {topics.map((topic) => {
            const author = topic.profiles;

            return (
              <Link 
                href={`/forum/konu/${topic.id}`} 
                key={topic.id}
                className="group border-b dergi-border hover:bg-[#080808] hover:border-white/40 transition-all duration-500 px-6 py-8 -mx-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="max-w-3xl">
                  <h2 className="dergi-subtitle text-xl text-white/80 group-hover:text-white transition-colors duration-500 mb-3">
                    {topic.title}
                  </h2>
                  <div className="flex items-center gap-4 dergi-kicker mb-0">
                    <span className={author?.is_admin ? "text-white/90 font-bold" : ""}>
                      {author?.full_name || "Bilinmeyen"}
                    </span>
                    <span className="opacity-30">•</span>
                    <span>
                      {new Date(topic.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0 self-start sm:self-center dergi-kicker mb-0 bg-transparent border dergi-border group-hover:border-white/40 group-hover:text-white px-4 py-2 transition-all duration-500">
                  {topic.commentCount} Yanıt
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  );
}