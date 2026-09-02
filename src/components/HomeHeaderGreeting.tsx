"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Flame, BookOpen, ArrowRight, User as UserIcon } from "lucide-react";

export default function HomeHeaderGreeting() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<{
    points: number;
    badge: string;
    image: string | null;
  } | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Fetch latest points & avatar from DB
      fetch("/api/user/profile", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setProfileData({
              points: data.user.points || 0,
              badge: data.user.badge || "Warga Pembelajar",
              image: data.user.image || session?.user?.image || null,
            });
          }
        })
        .catch(() => {});
    } else {
      setProfileData(null);
    }

    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setProfileData((prev) => ({
          points: prev?.points || 0,
          badge: prev?.badge || "Warga Pembelajar",
          image: e.detail.image || prev?.image || null,
        }));
      }
    };

    window.addEventListener("user-profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("user-profile-updated", handleProfileUpdate);
  }, [session, status]);

  const defaultAvatar = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80";

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const userName = isAuthenticated ? (session?.user?.name || "Warga") : "Warga & Tamu Desa";
  const userAvatar = profileData?.image || session?.user?.image || defaultAvatar;
  const userPoints = profileData?.points || 0;
  const userBadge = profileData?.badge || "Warga Pembelajar";

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin className="text-primary w-4 h-4 shrink-0" />
            <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Desa Pangkalan • Pustaka Digital
            </span>
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-surface leading-tight">
            Wilujeng Sumping,<br />
            <span className="text-primary">{userName}</span>
          </h2>
        </div>
        
        <div className="relative">
          <Link href={isAuthenticated ? "/profile" : "/login"}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary/30 shadow-md relative cursor-pointer hover:scale-105 transition-transform bg-surface-container flex items-center justify-center">
              {isAuthenticated ? (
                <Image 
                  src={userAvatar} 
                  alt={userName} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center text-primary group">
                  <UserIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Tamu</span>
                </div>
              )}
            </div>
          </Link>
          {isAuthenticated && (
            <div 
              className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface shadow-sm" 
              title="Akun Warga Aktif"
            />
          )}
        </div>
      </div>

      {/* Gamification Card for Logged-in Citizens */}
      {isAuthenticated && (
        <div className="bg-surface-container/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
          <div className="flex items-center gap-3.5 flex-grow">
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-6 h-6" />
            </div>
            <div className="flex-grow space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-title-md text-sm font-bold text-on-surface">Aktivitas Membaca Aktif</p>
                <span className="bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  ⭐ {userPoints} Poin
                </span>
              </div>
              <div className="w-full max-w-xs h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%] rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              🏆 {userBadge}
            </span>
          </div>
        </div>
      )}

      {/* Welcoming Card for Guest / Unauthenticated Visitors */}
      {!isAuthenticated && status !== "loading" && (
        <div className="bg-surface-container/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
          <div className="flex items-center gap-3.5 flex-grow">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/40 text-primary flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="font-title-md text-sm font-bold text-on-surface">Selamat Datang Pengunjung Perpustakaan!</p>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Jelajahi koleksi buku dan warta Desa Pangkalan secara terbuka. Masuk dengan NIK untuk menyimpan rak buku pribadi.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 self-end sm:self-center hover:scale-105 active:scale-95"
          >
            <span>Masuk / Daftar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
