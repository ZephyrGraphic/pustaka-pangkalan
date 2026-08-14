"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronRight, X, Sparkles } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function AnnouncementCarousel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load announcements:", err);
        setLoading(false);
      });
  }, []);

  if (loading || announcements.length === 0) {
    return null;
  }

  return (
    <>
      <section className="w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-title-md text-title-md text-on-surface">Warta & Kabar Desa</h3>
          </div>
          <span className="font-label-md text-xs text-primary font-bold bg-primary-container/20 px-2.5 py-0.5 rounded-full">
            {announcements.length} Info
          </span>
        </div>

        <div className="flex overflow-x-auto hide-scroll gap-4 pb-2 -mx-margin px-margin md:mx-0 md:px-0 snap-x snap-mandatory">
          {announcements.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAnnouncement(item)}
              className="snap-center flex-shrink-0 w-[280px] sm:w-[320px] bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-2xl p-4 shadow-sm cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-md text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-primary-container/30 text-primary">
                    {item.category}
                  </span>
                  <span className="font-label-md text-[11px] text-on-surface-variant">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short"
                    })}
                  </span>
                </div>
                <h4 className="font-title-md text-sm text-on-surface font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/20 text-primary font-title-md text-xs">
                <span>Baca Selengkapnya</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div 
            className="relative w-full max-w-lg min-w-[300px] sm:min-w-[420px] bg-surface-container rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 animate-fade-in-up my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="font-label-md text-xs uppercase font-bold px-2.5 py-1 rounded-md bg-primary-container/30 text-primary">
                  {selectedAnnouncement.category}
                </span>
                <h3 className="font-headline-lg-mobile text-lg font-bold text-on-surface mt-2">
                  {selectedAnnouncement.title}
                </h3>
                <p className="font-label-md text-xs text-on-surface-variant mt-1">
                  Diterbitkan pada {new Date(selectedAnnouncement.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 max-h-60 overflow-y-auto mb-6">
              <p className="font-body-lg text-sm text-on-surface-variant whitespace-pre-line leading-relaxed">
                {selectedAnnouncement.content}
              </p>
            </div>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors"
            >
              Tutup Warta
            </button>
          </div>
        </div>
      )}
    </>
  );
}
