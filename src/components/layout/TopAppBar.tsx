"use client";

import { Signal, Home, BookOpen, Library, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function TopAppBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  if (pathname === "/login") return null;

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/explore", icon: BookOpen, label: "Katalog" },
    { path: "/shelf", icon: Library, label: "Rak Buku" },
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
                <span className="font-title-md text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-2.5">
          {/* Admin 1-Click Switcher Button */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-md shadow-primary/20 hover:scale-105 transition-all"
              title="Beralih ke Dashboard Admin"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Admin</span>
            </Link>
          )}

          <Link href="/profile" className="flex items-center gap-2">
            {session?.user ? (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-variant/30 flex items-center justify-center relative border border-outline-variant/20 hover:border-primary transition-colors">
                <Image 
                  src={session.user.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"} 
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
