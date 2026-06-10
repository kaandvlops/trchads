"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE_INFO } from "@/constants";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); 
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b dergi-border transition-all duration-500">
        <div className="max-w-[85rem] mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-light text-white tracking-[0.3em] uppercase hover:text-white/70 transition-colors duration-500 z-50">
            {SITE_INFO.name}<span className="text-white/20">.</span>
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex gap-12 lg:gap-16 dergi-kicker mb-0">
            <Link href="/unluler" className="group relative hover:text-white transition-colors duration-500 py-2 inline-block">
              Sıralama
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            
            <Link href="/karakterler" className="group relative hover:text-indigo-300 transition-colors duration-500 py-2 inline-block">
              Karakterler
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-indigo-500/50 transition-all duration-500 group-hover:w-full"></span>
            </Link>
            
            <Link href="/tier-list" className="group relative hover:text-red-300 transition-colors duration-500 py-2 inline-block">
              Tier List
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-500/50 transition-all duration-500 group-hover:w-full"></span>
            </Link>

            <Link href="/forum" className="group relative hover:text-white transition-colors duration-500 py-2 inline-block">
              Forum
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Kullanıcı Paneli (Masaüstü) */}
          <div className="hidden md:flex items-center gap-8 dergi-kicker mb-0">
            {user ? (
              <>
                {profile?.is_admin && (
                  <Link href="/admin" className="text-white/50 hover:text-white transition-colors duration-300 inline-block">Yönetici</Link>
                )}
                <Link href="/profil" className="text-white/70 hover:text-white transition-colors duration-300 inline-block">
                  {profile?.full_name?.split(" ")[0] || "Profil"}
                </Link>
                <button onClick={handleLogout} className="text-white/30 hover:text-white transition-colors duration-300 cursor-pointer">
                  Çıkış
                </button>
              </>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                className="dergi-btn hover:text-black hover:bg-white cursor-pointer py-3 px-8"
              >
                Giriş Yap
              </button>
            )}
          </div>

          {/* Mobil Hamburger Butonu (z-index artırıldı ki menünün üstünde kalsın) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 z-[60] p-2 relative"
          >
            <span className={`block w-6 h-[1px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}></span>
            <span className={`block w-6 h-[1px] bg-white transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-[1px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}></span>
          </button>
        </div>
      </header>

      {/* Mobil Açılır Menü (Header dışına çıkarıldı) */}
      <div className={`fixed inset-0 bg-[#050505] z-[40] flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <nav className="flex flex-col items-center gap-8 dergi-kicker text-white/60">
          <Link href="/unluler" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Sıralama</Link>
          <Link href="/karakterler" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-400 transition-colors">Karakterler</Link>
          <Link href="/tier-list" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-400 transition-colors">Tier List</Link>
          <Link href="/forum" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Forum</Link>
          
          <div className="w-12 h-[1px] bg-white/10 my-4"></div>
          
          {user ? (
            <>
              {profile?.is_admin && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white">Yönetici Paneli</Link>
              )}
              <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Profilim</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-white/30 hover:text-white">Çıkış Yap</button>
            </>
          ) : (
            <button onClick={() => { setIsMobileMenuOpen(false); handleGoogleLogin(); }} className="dergi-btn hover:bg-white hover:text-black">
              Giriş Yap
            </button>
          )}
        </nav>
      </div>
    </>
  );
}