"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
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

  // YENİ: Agresif Yoklama (Polling) Mekanizması
  // Google ile ilk kayıtta veritabanının profili oluşturması 1-2 saniye sürebilir.
  // Bu yüzden pes etmeyip 5 kere şans veriyoruz.
  const fetchProfile = useCallback(async (userId: string) => {
    for (let i = 0; i < 5; i++) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data) {
        setProfile(data as UserProfile);
        return true; // Bulduk, döngüyü bitir
      }
      
      // Bulunamadıysa 1 saniye bekle ve tekrar dene
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 5 saniyenin sonunda hala yoksa boş bırak
    setProfile(null);
    return false;
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) return;
      
      setUser(session?.user || null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      if (mounted) setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Oturum açıldığında yükleme ekranını zorla aktif et ve profili bekle
        setLoading(true);
        await fetchProfile(session.user.id);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const isBanned = profile?.banned_until ? new Date(profile.banned_until) > new Date() : false;

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