"use client";

import { Home, BookOpen, Library, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/explore", icon: BookOpen, label: "Katalog" },
    { path: "/shelf", icon: Library, label: "Rak Buku" },
    { path: "/profile", icon: User, label: "Profil" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 mb-4 mx-margin rounded-full backdrop-blur-2xl border border-outline-variant/10 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] bg-surface/85 dark:bg-surface-dim/85">
      <ul className="flex justify-around items-center h-16 w-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex flex-col items-center justify-center px-5 py-2 rounded-full active:scale-90 transition-all duration-300 ease-out group ${
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "text-secondary dark:text-secondary-fixed-dim hover:bg-secondary-container/30"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "" : "group-hover:text-primary transition-colors"
                  }`}
                />
                <span
                  className={`font-label-md text-[10px] mt-1 ${
                    isActive ? "font-bold" : "group-hover:text-primary transition-colors"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
