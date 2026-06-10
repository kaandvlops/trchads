import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // Kendi Supabase resimlerine izin vermek için
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profil fotoğrafları için
      }
    ],
  },
};

export default nextConfig;