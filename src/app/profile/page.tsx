"use client";

import { BookOpen, LogOut, ChevronRight, Bookmark, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AboutModal from "@/components/AboutModal";
import StorageModal from "@/components/StorageModal";
import EditProfileModal from "@/components/EditProfileModal";
import BookCover from "@/components/BookCover";
import RewardRedemption from "@/components/RewardRedemption";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Fetch full profile
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setProfileUser(data.user);
          }
        })
        .catch(console.error);

      // Fetch bookmarks
      fetch("/api/bookmarks")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setBookmarks(data);
          setLoadingBookmarks(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingBookmarks(false);
        });
    }

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

  const handleProfileUpdated = (updated: any) => {
    setProfileUser(updated);
    if (update) {
      update({ name: updated.name, image: updated.image });
    }
  };

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentUser = profileUser || session.user;
  const isAdmin = currentUser?.role === "ADMIN" || (session?.user as any)?.role === "ADMIN";
  const userAvatar = profileUser?.image || session.user.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80";
  const userNik = profileUser?.email || session.user.email || "320220...";
  const userAddress = profileUser?.address || "Dusun I (Krajan Barat)";

  return (
    <div className="max-w-[580px] mx-auto w-full space-y-6 md:space-y-8 pb-16 animate-fade-in">
      
      {/* Digital Member Card */}
      <section className="animate-fade-in-up">
        <div 
          className="rounded-3xl p-6 sm:p-7 relative overflow-hidden text-white shadow-xl shadow-primary/20 border border-white/15"
          style={{
            background: "linear-gradient(135deg, rgba(28, 48, 25, 0.98) 0%, rgba(45, 78, 40, 0.92) 100%)",
            backdropFilter: "blur(20px)"
          }}
        >
          {/* Subtle Geometric Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1.2px, transparent 1.2px)",
              backgroundSize: "20px 20px"
            }}
          />

          <div className="relative z-10 flex flex-col justify-between min-h-[220px] gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-headline-md font-bold text-sm tracking-wide text-white">Kartu Anggota Digital</h3>
                  <p className="font-label-md text-[11px] text-white/70">Perpustakaan Desa Pangkalan</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white shadow-sm">
                {currentUser?.role === "ADMIN" ? "Administrator" : "Warga Aktif"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/40 shrink-0 bg-white/10 shadow-md">
                  <Image 
                    src={userAvatar} 
                    alt="Profile" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="space-y-0.5">
                  <h2 className="font-title-lg font-bold text-lg leading-tight text-white">{currentUser?.name || "Warga Desa"}</h2>
                  <p className="font-mono text-xs text-white/80 font-medium tracking-wider">NIK: {userNik}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] tracking-wide border border-white/25">
                      🏆 {currentUser?.badge || "Warga Pembelajar"}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 font-bold text-[10px] border border-amber-400/40">
                      ⭐ {currentUser?.points || 0} Poin
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button Modal */}
              <div className="self-end sm:self-center shrink-0">
                <EditProfileModal
                  currentName={currentUser.name || ""}
                  currentImage={profileUser?.image || null}
                  currentPhone={profileUser?.phone || null}
                  currentAddress={profileUser?.address || null}
                  currentOccupation={profileUser?.occupation || null}
                  onProfileUpdated={handleProfileUpdated}
                />
              </div>
            </div>

            <div className="flex justify-between items-end pt-3 border-t border-white/15 text-[11px] text-white/80">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-white/60">Wilayah / Dusun</span>
                <span className="font-semibold text-white">{userAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards & Certificate Redemption */}
      <RewardRedemption
        userPoints={currentUser.points || 0}
        userName={currentUser.name || "Warga Desa"}
        userNik={userNik}
        userAddress={userAddress}
        userBadge={currentUser.badge || "Warga Pembelajar"}
      />

      {/* Saved Books */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-title-md text-base font-bold text-on-surface">Buku Disimpan</h3>
          <span className="bg-primary-container text-on-primary-container font-bold text-xs px-2.5 py-0.5 rounded-full">
            {bookmarks.length} Koleksi
          </span>
        </div>
        
        {loadingBookmarks ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="flex overflow-x-auto hide-scroll gap-4 pb-2 -mx-margin px-margin md:mx-0 md:px-0">
            {bookmarks.map((bookmark) => (
              <Link key={bookmark.id} href={`/books/${bookmark.book.id}`} className="flex-shrink-0 w-32 group cursor-pointer">
                <div className="relative w-32 h-44 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 mb-2 group-hover:-translate-y-1 transition-transform bg-surface-container-high flex flex-col justify-end">
                  <BookCover
                    src={bookmark.book.coverUrl}
                    alt={bookmark.book.title}
                    title={bookmark.book.title}
                    category={bookmark.book.category}
                  />
                </div>
                <h4 className="font-title-md text-xs font-bold text-on-surface line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {bookmark.book.title}
                </h4>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 text-center shadow-sm space-y-2">
            <Bookmark className="w-8 h-8 text-outline-variant mx-auto mb-1" />
            <p className="font-body-md text-xs text-on-surface-variant">Belum ada buku yang disimpan ke rak.</p>
            <Link href="/explore" className="inline-block text-primary font-title-md text-xs font-bold hover:underline">
              Jelajahi Katalog Buku
            </Link>
          </div>
        )}
      </section>

      {/* Account & System Settings Menu */}
      <section className="bg-surface-container rounded-3xl p-2 border border-outline-variant/20 shadow-sm divide-y divide-outline-variant/20">
        
        {/* Admin Dashboard Quick Access */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-body-lg text-sm text-primary font-bold block">Dashboard Administrator</span>
                <span className="text-[11px] text-on-surface-variant">Kelola buku, warga, ulasan, dan warta desa</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </Link>
        )}

        {/* Dark Mode Toggle */}
        <div 
          onClick={toggleDark}
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
              <ThemeToggle className="bg-transparent hover:bg-transparent text-on-surface-variant group-hover:text-primary p-0" />
            </div>
            <div>
              <span className="font-body-lg text-sm text-on-surface font-semibold block">Mode Gelap (Dark Mode)</span>
              <span className="text-[11px] text-on-surface-variant">Kenyamanan membaca di malam hari</span>
            </div>
          </div>
          <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isDark ? "bg-primary" : "bg-surface-variant"}`}>
            <div className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white border border-outline-variant/20 shadow-sm transition-transform duration-300 ${isDark ? "translate-x-5" : ""}`}></div>
          </div>
        </div>

        {/* Offline Storage Modal */}
        <div>
          <StorageModal 
            triggerText="Kelola Penyimpanan Offline" 
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-high transition-colors text-left group" 
          />
        </div>

        {/* About App Modal */}
        <div>
          <AboutModal 
            triggerText="Tentang Pustaka Pangkalan" 
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-high transition-colors text-left group" 
          />
        </div>

        {/* Logout */}
        <div 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-error-container/30 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error transition-colors shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-body-lg text-sm text-error font-semibold">Keluar dari Akun</span>
          </div>
          <ChevronRight className="w-5 h-5 text-error" />
        </div>

      </section>

      <div className="text-center pt-2">
        <p className="font-label-md text-xs text-on-surface-variant/60">Pustaka Pangkalan v2.5.0 • Desa Pangkalan</p>
      </div>

    </div>
  );
}
