"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  isBanned: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchedUserRef = useRef<string | null>(null);

  const fetchProfileSafely = async (userId: string, attempt = 1): Promise<UserProfile | null> => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data) return data as UserProfile;

      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return fetchProfileSafely(userId, attempt + 1);
      }
    } catch (error) {
      console.error("Profil arama hatası:", error);
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;

    // Timeout sigortası: 3 saniye içinde ne olursa olsun loading'i zorla kapat
    const fallbackTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          if (fetchedUserRef.current !== currentUser.id) {
            fetchedUserRef.current = currentUser.id;
            const userProfile = await fetchProfileSafely(currentUser.id);
            if (mounted) {
              setProfile(userProfile);
              setLoading(false); // KRİTİK: Profil geldikten sonra loading'i bitir!
            }
          } else {
            if (mounted) setLoading(false);
          }
        } else {
          fetchedUserRef.current = null;
          setProfile(null);
          if (mounted) setLoading(false);
        }

        // Oturum değiştiğinde Next.js Server Component'lerini senkronize et
        if (event === "SIGNED_IN") {
          router.refresh();
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, [router]);

  const isBanned =
    !!profile?.banned_until && new Date(profile.banned_until).getTime() > Date.now();

  return (
    <AuthContext.Provider value={{ user, profile, loading, setProfile, isBanned }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}