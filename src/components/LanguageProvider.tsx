"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "id" | "su";

interface Dictionary {
  [key: string]: {
    id: string;
    su: string;
  };
}

export const translations: Dictionary = {
  // Navigation
  nav_home: { id: "Beranda", su: "Tepas" },
  nav_catalog: { id: "Katalog", su: "Koléksi Serat" },
  nav_shelf: { id: "Rak Buku", su: "Panyimpenan" },
  nav_profile: { id: "Profil", su: "Katerangan Warga" },
  nav_admin: { id: "Portal Admin", su: "Panto Pangurus" },
  nav_citizen_mode: { id: "Mode Warga", su: "Mode Warga" },

  // Homepage
  village_name: { id: "Desa Pangkalan", su: "Désa Pangkalan" },
  welcome_greeting: { id: "Wilujeng Sumping,", su: "Wilujeng Sumping," },
  streak_title: { id: "Hari Beruntun Membaca", su: "Dinten Tuluy-tumuluy Maos" },
  points_label: { id: "Poin", su: "Poin" },
  search_placeholder: { id: "Cari modul pertanian, e-book, atau cerita rakyat...", su: "Paluruh serat tani, buku digital, atanapi dongéng..." },
  categories_title: { id: "Kategori Pengetahuan Desa", su: "Rupa-rupa Élmu Pangaweruh Désa" },
  cat_agriculture: { id: "Pertanian & Peternakan", su: "Tatanén & Ingon-ingon" },
  cat_sunda: { id: "Sastra & Budaya Sunda", su: "Sastra & Budaya Sunda" },
  cat_economy: { id: "Wirausaha UMKM", su: "Usaha Mandiri UMKM" },
  cat_health: { id: "Kesehatan Desa", su: "Kaséhatan Warga" },
  announcements_title: { id: "Warta & Kabar Desa", su: "Warta & Béja Désa" },
  continue_reading: { id: "Sedang Dibaca", su: "Nuju Dipaos" },
  continue_btn: { id: "Lanjutkan", su: "Teraskeun" },
  featured_title: { id: "Unggulan Minggu Ini", su: "Pilihan Utama Minggu Ieu" },
  see_all: { id: "Lihat Semua", su: "Tingal Sadayana" },
  local_heritage_title: { id: "Cerita Rakyat & Sastra Sunda", su: "Sasakala & Kasusastraan Sunda" },
  local_heritage_desc: { id: "Lestarikan warisan pengetahuan dan nilai luhur leluhur kita di Desa Pangkalan untuk generasi mendatang.", su: "Rumat warisan luang élmu sareng ajén luhung karuhun di Désa Pangkalan kagem para panerus." },

  // Shelf
  shelf_title: { id: "Rak Buku Saya", su: "Panyimpenan Serat Kuring" },
  shelf_desc: { id: "Pantau progres membaca, simpanan favorit, dan buku yang siap dibaca tanpa jaringan internet di Desa Pangkalan.", su: "Titénan kamajengan maos, karesep, sareng serat anu sayagi dipaos tanpa internét di Désa Pangkalan." },
  stats_books_read: { id: "Buku Dibaca", su: "Buku Dipaos" },
  stats_hours_read: { id: "Jam Membaca", su: "Jam Maos" },
  stats_offline_books: { id: "Buku Offline", su: "Buku Offline" },

  // Reader
  reader_read_chapter: { id: "Baca Bab", su: "Paos Bab" },
  reader_next_chapter: { id: "Bab Selanjutnya", su: "Bab Salajengna" },
  reader_prev_chapter: { id: "Bab Sebelumnya", su: "Bab Sateuacanna" },
  reader_listen: { id: "Dengarkan (Audio)", su: "Regepkeun (Audio)" },
  reader_quiz_title: { id: "Kuis Pemahaman Literasi", su: "Kuis Paham Maos" },

  // Leaderboard
  leaderboard_title: { id: "Liga Literasi Antar-Dusun", su: "Pasanggiri Maos Antar-Dusun" },
  leaderboard_subtitle: { id: "Peringkat keaktifan membaca warga tiap wilayah Desa Pangkalan.", su: "Runtuyan sumanget maos warga di unggal wewengkon Désa Pangkalan." },
  
  // AI Assistant
  ai_assistant_title: { id: "Tanya Pustaka AI", su: "Tanya Pustaka AI" },
  ai_assistant_desc: { id: "Asisten Cerdas Pengetahuan Tani & Budaya Desa", su: "Pangaping Pinter Élmu Tani & Budaya Désa" },
  ai_input_placeholder: { id: "Tanyakan seputar pertanian, bioflok, budaya, atau UMKM...", su: "Taroskeun perkawis tatanén, bioflok, budaya, atanapi UMKM..." },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang === "id" || savedLang === "su") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.id || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
