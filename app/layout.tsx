import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// YENİ: AuthProvider import edildi
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrChads",
  description: "Modern Türkiye Chad Topluluğu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* YENİ: Tüm uygulama AuthProvider ile sarmalandı */}
        <AuthProvider>
          <Navbar />
          
          {/* Ana içerik kısmı büyüyerek Footer'ı her zaman en alta iter */}
          <div className="flex-1 w-full">
            {children}
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}