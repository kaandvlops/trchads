"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/types";

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

  useEffect(() => {
    let mounted = true;

    // YENİ: Akıllı ve Hata Korumalı Profil Arama
    // Yeni kayıtlarda veritabanı tetikleyicisinin çalışmasını tolere etmek için 600ms arayla 4 kez şans tanır.
    const fetchProfileSafely = async (userId: string, attempt = 1): Promise<UserProfile | null> => {
      try {
        const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
        if (data) return data as UserProfile;
        
        if (attempt < 4) {
          await new Promise(resolve => setTimeout(resolve, 600));
          return fetchProfileSafely(userId, attempt + 1);
        }
      } catch (error) {
        console.error("Profil arama hatası:", error);
      }
      return null;
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        setUser(session?.user || null);

        if (session?.user) {
          const userProfile = await fetchProfileSafely(session.user.id);
          if (mounted) setProfile(userProfile);
        }
      } catch (error) {
        console.error("Kimlik doğrulama başlatılamadı:", error);
      } finally {
        // EN KRİTİK NOKTA: İşlem başarılı da olsa çökse de yükleme ekranını ZORLA kapat!
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const userProfile = await fetchProfileSafely(session.user.id);
        if (mounted) setProfile(userProfile);
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isBanned = !!profile?.banned_until && new Date(profile.banned_until).getTime() > Date.now();

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