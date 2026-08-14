"use client";

import { useState, useEffect } from "react";
import { HardDrive, X, Trash2, CheckCircle2, CloudDownload, RefreshCw } from "lucide-react";

export default function StorageModal({ triggerText = "Kelola Penyimpanan Offline", className = "" }: { triggerText?: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>("12.4 MB");
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Estimate Cache Storage API if available
    if (typeof window !== "undefined" && "storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage.estimate().then(({ usage }) => {
        if (usage) {
          const mb = (usage / (1024 * 1024)).toFixed(1);
          setCacheSize(`${mb} MB`);
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleClearCache = async () => {
    setClearing(true);
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      setCacheSize("0.0 MB");
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm"}
      >
        <HardDrive className="w-5 h-5" />
        <span>{triggerText}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container w-full max-w-md rounded-3xl p-6 shadow-2xl border border-outline-variant/30 animate-fade-in-up">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline-lg-mobile text-base font-bold text-on-surface">
                    Penyimpanan Offline
                  </h3>
                  <p className="font-label-md text-xs text-on-surface-variant">Cache PWA & Data Buku</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Total Ruang Digunakan</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">{cacheSize}</p>
                </div>
                <div className="p-3 bg-primary-container/20 text-primary rounded-xl">
                  <CloudDownload className="w-6 h-6" />
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Data offline menyimpan halaman buku, gambar sampul, dan modul yang telah Anda buka agar dapat dibaca kembali saat tidak ada jaringan internet.
              </p>

              {cleared && (
                <div className="p-3 bg-primary-container/30 text-primary rounded-xl text-xs flex items-center gap-2 font-medium animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cache berhasil dibersihkan!</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClearCache}
                disabled={clearing}
                className="flex-1 py-3 bg-error-container/30 hover:bg-error-container/50 text-error rounded-xl font-title-md text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{clearing ? "Membersihkan..." : "Bersihkan Cache"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
