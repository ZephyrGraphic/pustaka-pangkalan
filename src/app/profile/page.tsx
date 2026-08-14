"use client";

import { BookOpen, WifiOff, Bell, HardDrive, Info, LogOut, ChevronRight, Bookmark } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AboutModal from "@/components/AboutModal";
import StorageModal from "@/components/StorageModal";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("/api/bookmarks")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setBookmarks(data);
          setLoadingBookmarks(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingBookmarks(false);
        });
    }
    // Check current theme
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [status, router]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (status === "loading" || !session?.user) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-[512px] mx-auto w-full">
      {/* Digital Member Card */}
      <section className="mb-xl animate-fade-in-up">
        <div className="rounded-2xl p-6 relative overflow-hidden text-white shadow-lg shadow-primary/20"
             style={{
               background: "linear-gradient(135deg, rgba(38, 58, 34, 0.95) 0%, rgba(59, 88, 54, 0.85) 100%)",
               backdropFilter: "blur(16px)"
             }}>
          <div className="absolute inset-0 opacity-50 mix-blend-overlay"
               style={{
                 backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03)), linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03))",
                 backgroundSize: "20px 20px",
                 backgroundPosition: "0 0, 10px 10px"
               }}></div>
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5" />
                <span className="font-title-md text-title-md tracking-tight font-bold">Pustaka Pangkalan</span>
              </div>
              <p className="font-label-md text-label-md text-white/80 uppercase tracking-widest text-[10px]">
                Kartu Anggota Perpustakaan Desa
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg p-1 backdrop-blur-sm border border-white/30 flex-shrink-0 relative">
              <Image 
                className="object-cover rounded shadow-inner" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJIrTVUf2C_q6P86YIuJueyPsJaUWZgiVslL3mLLsqk7pgLZ5LTZ2kD-egVAQGwgPyJck5YdGVONTpKO67hAFCHbBOOFmcJOb20NMQlrsxDL52lf8jL08uwEg26O2nju5x82sf4n6zROGAcfWf0JzSP3rYlTFY34GJPsR1UZYPec8Qjbr7fnOGP9dray2HHKFES294SaQRyvM1Lo8TFRlFGsiDmdeRq5Awk89xvZrOJxFOmRXDcp4b" 
                alt="QR" 
                fill 
              />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-white/50 p-1 bg-white/10 flex-shrink-0 shadow-inner relative">
              <Image 
                className="rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPnlcvsNlF59sn0UvCKdq_PIG0wupiF1Ut6zdxk127qawRRDqFYkPYBwKB_DEzr28_c7343ueh6bUErMf5jMllZzjeOjBmHGSi0956GhfpC6Dq5914WGFKCh-vYvhSdvupj1mbNz2wuODz8h3_KpRZDtbUNIup5keBSV6V54TrPbBWkWK0WOC2DW9Dv3ukDXBGPpgKeuHjZVSwianbZnHWmrCOtOfQ_QqHo7k9oWyi0MCNqphM7o35" 
                alt="Profile" 
                fill 
              />
            </div>
            <div>
              <h2 className="font-title-md text-title-md font-semibold mb-1">{session.user.name}</h2>
              <div className="space-y-1">
                <p className="font-label-md text-label-md text-white/90 font-mono tracking-wider">ID: {session.user.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 text-white font-label-md text-label-md text-[10px] uppercase border border-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                  Warga Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Saved Books */}
      <section className="mb-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-title-md text-lg font-bold text-on-surface">Buku Tersimpan</h3>
          <span className="bg-primary-container/30 text-primary font-bold text-xs px-2 py-1 rounded-full">{bookmarks.length}</span>
        </div>
        
        {loadingBookmarks ? (
          <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : bookmarks.length > 0 ? (
          <div className="flex overflow-x-auto hide-scroll gap-4 pb-4 -mx-margin px-margin md:mx-0 md:px-0">
            {bookmarks.map((bookmark) => (
              <Link key={bookmark.id} href={`/books/${bookmark.book.id}`} className="flex-shrink-0 w-32 group cursor-pointer">
                <div className="relative w-32 h-44 rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 mb-2 group-hover:-translate-y-1 transition-transform">
                  <Image src={bookmark.book.coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAGVw_j51tG8zPZ9tXoUo9w47FfLzHw_h_zD5yTjGz7Z9rV9O99g_x2o9Q0-wzV0YtQjZ5e0QG7Dq0h8g8_9QG7Dq0h8g8_9QG7Dq0h8g8"} alt={bookmark.book.title} fill className="object-cover" />
                </div>
                <h4 className="font-title-md text-sm text-on-surface line-clamp-2 leading-tight group-hover:text-primary transition-colors">{bookmark.book.title}</h4>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 text-center shadow-sm">
            <Bookmark className="w-8 h-8 text-outline-variant mx-auto mb-3" />
            <p className="font-body-md text-on-surface-variant">Belum ada buku yang disimpan.</p>
            <Link href="/explore" className="inline-block mt-4 text-primary font-title-md text-sm hover:underline">Jelajahi Katalog</Link>
          </div>
        )}
      </section>

      {/* Account Settings */}
      <section className="space-y-sm bg-surface-container-lowest rounded-2xl p-2 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/10">
        
        {/* Night Mode Toggle - Connected */}
        <div 
          onClick={toggleDark}
          className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ThemeToggle className="bg-transparent hover:bg-transparent text-on-surface-variant group-hover:text-primary" />
            </div>
            <span className="font-body-lg text-body-lg text-on-surface font-medium">Mode Malam</span>
          </div>
          <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isDark ? "bg-primary" : "bg-surface-variant"}`}>
            <div className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white border border-outline-variant/20 shadow-sm transition-transform duration-300 ${isDark ? "translate-x-5" : ""}`}></div>
          </div>
        </div>
        <div className="h-px bg-outline-variant/20 mx-4"></div>

        {/* Offline Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <WifiOff className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-body-lg text-body-lg text-on-surface font-medium">Mode Hemat Kuota</span>
              <span className="font-body-md text-body-md text-on-surface-variant/70 text-xs">Offline First</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input defaultChecked className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        <div className="h-px bg-outline-variant/20 mx-4"></div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
            </div>
            <span className="font-body-lg text-body-lg text-on-surface font-medium">Notifikasi & Warta Desa</span>
          </div>
          <ChevronRight className="w-5 h-5 text-on-surface-variant" />
        </div>
        <div className="h-px bg-outline-variant/20 mx-4"></div>

        {/* Storage */}
        <div className="p-2">
          <StorageModal 
            triggerText="Kelola Penyimpanan Offline" 
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container/50 transition-colors text-left group" 
          />
        </div>
        <div className="h-px bg-outline-variant/20 mx-4"></div>

        {/* About */}
        <div className="p-2">
          <AboutModal 
            triggerText="Tentang Pustaka Pangkalan" 
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container/50 transition-colors text-left group" 
          />
        </div>
        <div className="h-px bg-outline-variant/20 mx-4"></div>

        {/* Logout */}
        <div 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-between p-4 rounded-xl hover:bg-error-container/30 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-body-lg text-body-lg text-error font-medium">Keluar Akun</span>
          </div>
        </div>
      </section>

      <div className="text-center mt-6">
        <p className="font-label-md text-label-md text-on-surface-variant/50">Versi 1.2.0 (Desa Pangkalan)</p>
      </div>
    </div>
  );
}
