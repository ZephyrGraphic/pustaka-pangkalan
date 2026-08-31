"use client";

import { Home, BookOpen, Library, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname === "/login" || pathname?.startsWith("/admin")) return null;

  const navItems = [
    { path: "/", icon: Home, labelKey: "nav_home" },
    { path: "/explore", icon: BookOpen, labelKey: "nav_catalog" },
    { path: "/shelf", icon: Library, labelKey: "nav_shelf" },
    { path: "/profile", icon: User, labelKey: "nav_profile" },
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
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-full active:scale-90 transition-all duration-300 ease-out group ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
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
                  {t(item.labelKey)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
