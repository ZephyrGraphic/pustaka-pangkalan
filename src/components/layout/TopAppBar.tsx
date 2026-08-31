"use client";

import { useEffect, useState } from "react";
import { Signal, Home, BookOpen, Library, ShieldCheck, Languages } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

export default function TopAppBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  
  const [userAvatar, setUserAvatar] = useState<string | null>(
    session?.user?.image || null
  );

  useEffect(() => {
    if (session?.user?.image) {
      setUserAvatar(session.user.image);
    }

    // Always fetch latest profile data from database to ensure 100% sync
    if (session?.user) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.image) {
            setUserAvatar(data.user.image);
          }
        })
        .catch(() => {});
    }

    // Listen to real-time profile update broadcast
    const handleProfileUpdate = (e: any) => {
      if (e.detail?.image) {
        setUserAvatar(e.detail.image);
      }
    };

    window.addEventListener("user-profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("user-profile-updated", handleProfileUpdate);
  }, [session]);

  if (pathname === "/login" || pathname?.startsWith("/admin")) return null;

  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const defaultAvatar = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80";

  const navItems = [
    { path: "/", icon: Home, labelKey: "nav_home" },
    { path: "/explore", icon: BookOpen, labelKey: "nav_catalog" },
    { path: "/shelf", icon: Library, labelKey: "nav_shelf" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-surface/85 dark:bg-surface-dim/85 shadow-sm border-b border-outline-variant/10">
      <div className="flex items-center justify-between px-margin md:px-xl py-sm w-full max-w-7xl mx-auto h-16">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-primary dark:text-primary-fixed-dim bg-primary-container/20 px-3 py-1.5 rounded-full shadow-sm">
            <Signal className="w-4 h-4" />
            <span className="font-label-md text-label-md font-medium">Mode Terhubung</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 bg-surface-container-low/50 rounded-full px-2 py-1 border border-outline-variant/20">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container shadow-sm font-bold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-title-md text-sm">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher (ID / SU) */}
          <button
            onClick={() => setLanguage(language === "id" ? "su" : "id")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/20 transition-all shadow-sm"
            title={language === "id" ? "Gentos ka Basa Sunda" : "Ganti ke Bahasa Indonesia"}
          >
            <Languages className="w-3.5 h-3.5 text-primary" />
            <span>{language === "id" ? "ID" : "SU"}</span>
          </button>

          {/* Admin 1-Click Switcher Button */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-md shadow-primary/20 hover:scale-105 transition-all"
              title="Beralih ke Dashboard Admin"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("nav_admin")}</span>
            </Link>
          )}

          <Link href="/profile" className="flex items-center gap-2">
            {session?.user ? (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-variant/30 flex items-center justify-center relative border border-outline-variant/20 hover:border-primary transition-colors">
                <Image 
                  src={userAvatar || defaultAvatar} 
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full">
                Login
              </button>
            )}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
