import type { Metadata } from "next";
import "./globals.css";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Pustaka Pangkalan - Perpustakaan Digital Desa",
  description: "Temukan ribuan koleksi buku digital untuk menunjang aktivitas membaca dan belajarmu.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `}} />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-body-md overflow-x-hidden pb-24 md:pb-0" suppressHydrationWarning>
        <Providers>
          <TopAppBar />
          <main className="flex-grow pt-[88px] md:pt-[104px] pb-[100px] md:pb-[40px] px-margin md:px-xl flex flex-col gap-xl w-full max-w-7xl mx-auto">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
