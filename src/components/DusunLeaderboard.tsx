"use client";

import { useEffect, useState } from "react";
import { Trophy, Award, Users, BookOpen, Flame, Sparkles, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

interface DusunRank {
  dusun: string;
  points: number;
  members: number;
  booksRead: number;
}

interface CitizenRank {
  id: string;
  name: string;
  points: number;
  badge: string;
  image: string | null;
  dusun: string;
}

export default function DusunLeaderboard() {
  const { t } = useLanguage();
  const [dusuns, setDusuns] = useState<DusunRank[]>([]);
  const [topCitizens, setTopCitizens] = useState<CitizenRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dusun" | "citizen">("dusun");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.dusuns) setDusuns(data.dusuns);
        if (data.topCitizens) setTopCitizens(data.topCitizens);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm animate-pulse flex items-center justify-center min-h-[160px]">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-semibold">
          <Trophy className="w-4 h-4 text-primary animate-bounce" />
          <span>Memuat Papan Peringkat Liga Literasi...</span>
        </div>
      </div>
    );
  }

  const maxPoints = dusuns.length > 0 ? dusuns[0].points : 100;

  return (
    <section className="bg-surface-container rounded-3xl border border-outline-variant/20 shadow-sm p-5 sm:p-7 space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/15 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-300">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Kompetisi Positif Warga
            </span>
          </div>
          <h3 className="font-title-md text-lg sm:text-xl font-bold text-on-surface">
            {t("leaderboard_title")}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {t("leaderboard_subtitle")}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-2xl border border-outline-variant/20 shrink-0">
          <button
            onClick={() => setActiveTab("dusun")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "dusun"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Antar-Dusun
          </button>
          <button
            onClick={() => setActiveTab("citizen")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "citizen"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Warga Teladan
          </button>
        </div>
      </div>

      {/* Tab 1: Dusun Leaderboard */}
      {activeTab === "dusun" && (
        <div className="space-y-3.5">
          {dusuns.map((item, index) => {
            const percentage = Math.max(15, Math.round((item.points / maxPoints) * 100));
            const isChampion = index === 0;

            return (
              <div
                key={item.dusun}
                className={`p-4 rounded-2xl border transition-all ${
                  isChampion
                    ? "bg-primary-container/20 border-primary/40 shadow-sm"
                    : "bg-surface-container-high/60 border-outline-variant/20 hover:bg-surface-container-high"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        index === 0
                          ? "bg-amber-400 text-amber-950 shadow-sm"
                          : index === 1
                          ? "bg-slate-300 text-slate-900"
                          : index === 2
                          ? "bg-amber-700/60 text-amber-100"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-1.5">
                        <span>{item.dusun}</span>
                        {isChampion && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.2 rounded-full border border-amber-400/30">
                            Teraktif
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {item.members} Pembaca Aktif • {item.booksRead} Buku Terselesaikan
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-primary block">{item.points}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Poin Literasi</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isChampion ? "bg-primary" : "bg-primary/70"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Top Citizens */}
      {activeTab === "citizen" && (
        <div className="space-y-3">
          {topCitizens.map((user, idx) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 hover:bg-surface-container-high transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-xs text-on-surface-variant w-5 text-center">
                  #{idx + 1}
                </span>
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-primary/30 bg-surface-container shrink-0">
                  {user.image ? (
                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-primary">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface">{user.name}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant mt-0.5">
                    <span className="text-primary font-semibold">{user.badge}</span>
                    <span>•</span>
                    <span>{user.dusun.split("(")[0]}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-bold text-amber-500 flex items-center justify-end gap-1">
                  ⭐ {user.points}
                </span>
                <span className="text-[10px] text-on-surface-variant">Poin</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
