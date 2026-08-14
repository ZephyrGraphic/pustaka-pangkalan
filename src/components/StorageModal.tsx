"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HardDrive, X, Trash2, CheckCircle2, CloudDownload, ChevronRight } from "lucide-react";

export default function StorageModal({ triggerText = "Kelola Penyimpanan Offline", className = "" }: { triggerText?: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>("12.4 MB");
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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

  const modalContent = isOpen && mounted ? (
    <div 
      className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 animate-fade-in-up my-auto"
        style={{ width: "min(92vw, 480px)", maxWidth: "480px", minWidth: "300px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-title-md text-lg font-bold text-on-surface">
                Penyimpanan Offline
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant">Cache PWA & Data Bacaan</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-5">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Total Ruang Digunakan</p>
              <p className="text-3xl font-bold text-on-surface mt-1">{cacheSize}</p>
            </div>
            <div className="p-3.5 bg-primary-container/20 text-primary rounded-2xl">
              <CloudDownload className="w-7 h-7" />
            </div>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Data offline menyimpan halaman buku, modul, dan sampul yang telah Anda buka agar dapat dibaca kembali saat tidak ada jaringan internet di desa.
          </p>

          {cleared && (
            <div className="p-3.5 bg-primary-container/30 text-primary rounded-xl text-xs flex items-center gap-2 font-medium animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Cache penyimpanan berhasil dibersihkan!</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClearCache}
            disabled={clearing}
            className="flex-1 py-3.5 px-4 bg-error-container/30 hover:bg-error-container/50 text-error rounded-xl font-title-md text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 border border-error/20"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>{clearing ? "Membersihkan..." : "Bersihkan Cache"}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 py-3.5 px-4 bg-primary text-on-primary rounded-xl font-title-md text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 text-center font-bold"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "w-full flex items-center justify-between p-4 rounded-xl hover:bg-surface-container/50 transition-colors text-left group"}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <span className="font-body-lg text-sm text-on-surface font-semibold">{triggerText}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary bg-primary-container/20 px-2.5 py-1 rounded-full text-xs font-bold">{cacheSize}</span>
          <ChevronRight className="w-5 h-5 text-on-surface-variant" />
        </div>
      </button>

      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
