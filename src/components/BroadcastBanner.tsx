"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bell, X, Volume2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
}

export default function BroadcastBanner() {
  const [broadcast, setBroadcast] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && data.announcements.length > 0) {
          // Find the most recent active announcement
          const activeItem = data.announcements.find((a: Announcement) => a.active);
          if (activeItem) {
            const dismissedId = sessionStorage.getItem("dismissed_broadcast_id");
            if (dismissedId !== activeItem.id) {
              setBroadcast(activeItem);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleDismiss = () => {
    if (broadcast) {
      sessionStorage.setItem("dismissed_broadcast_id", broadcast.id);
    }
    setDismissed(true);
  };

  if (!broadcast || dismissed) return null;

  const isEmergency = broadcast.category.toLowerCase().includes("darurat") || broadcast.title.toLowerCase().includes("peringatan") || broadcast.title.toLowerCase().includes("hama");

  return (
    <div className="w-full pt-16 animate-fade-in">
      <div className={`w-full py-2.5 px-4 sm:px-6 flex items-center justify-between gap-3 text-xs sm:text-sm border-b shadow-sm ${
        isEmergency
          ? "bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200"
          : "bg-primary-container/30 border-primary/20 text-on-surface"
      }`}>
        <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1 overflow-hidden">
          <span className={`p-1 rounded-lg shrink-0 ${
            isEmergency ? "bg-amber-500 text-slate-950 animate-pulse" : "bg-primary text-on-primary"
          }`}>
            {isEmergency ? <AlertCircle className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          </span>
          <span className="font-bold shrink-0 uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
            {broadcast.category}
          </span>
          <p className="truncate font-medium text-xs sm:text-sm">
            <strong className="font-bold">{broadcast.title}:</strong> {broadcast.content}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
          aria-label="Tutup Pengumuman"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
