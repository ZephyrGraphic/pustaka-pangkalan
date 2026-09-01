"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Info, X, MapPin, Clock, ShieldCheck, BookOpen, ChevronRight } from "lucide-react";

export default function AboutModal({ triggerText = "Tentang Pustaka Pangkalan", className = "" }: { triggerText?: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = isOpen && mounted ? (
    <div 
      className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative bg-surface-container text-on-surface border border-outline-variant/30 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in-up my-auto"
        style={{ width: "min(92vw, 500px)", maxWidth: "500px", minWidth: "300px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-title-md text-xl font-bold text-on-surface">
                Pustaka Pangkalan
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant">Perpustakaan Digital Terpadu Desa Pangkalan</p>
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

        <div className="space-y-4 text-sm text-on-surface-variant">
          <p className="leading-relaxed font-body-md text-xs sm:text-sm">
            Pustaka Pangkalan adalah inisiatif digitalisasi desa yang bertujuan menyediakan akses pengetahuan, modul budidaya pertanian modern, panduan wirausaha UMKM, khasanah sastra & budaya Sunda, serta warta desa kepada seluruh warga secara gratis.
          </p>

          <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/20 space-y-3.5">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-on-surface text-xs uppercase tracking-wider">Lokasi Balai Perpustakaan</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Kompleks Balai Desa Pangkalan, Kec. Cikidang, Kab. Sukabumi, Jawa Barat</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-on-surface text-xs uppercase tracking-wider">Layanan Fisik & Konsultasi</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Senin - Jumat: 08.00 - 16.00 WIB (Akses Digital 24 Jam)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-on-surface text-xs uppercase tracking-wider">Keanggotaan Digital</p>
                <p className="text-xs text-on-surface-variant mt-0.5">4 Dusun Resmi: Dusun Pangkalan, Dusun Cikajang, Dusun Pasir Arangan, Dusun Pasir Gombong.</p>
              </div>
            </div>
          </div>

          {/* Kepala Desa & Maskot Resmi Pustaka */}
          <div className="bg-gradient-to-r from-emerald-950/80 to-primary/80 text-white p-3.5 sm:p-4 rounded-2xl border border-primary/30 flex items-center justify-between gap-3.5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-amber-400/60 shadow-md shrink-0 bg-white">
                <Image
                  src="/images/pak_kades_mascot.jpg"
                  alt="Maskot Pak Kades Usep Saepulrohman"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">Pelindung & Pengarah</span>
                <p className="font-bold text-white text-xs sm:text-sm">Bapak Usep Saepulrohman</p>
                <p className="text-[11px] text-white/80">Kepala Desa Pangkalan</p>
              </div>
            </div>
            <a
              href="https://desapangkalan.web.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-all shrink-0 text-center shadow-sm"
              title="Kunjungi Website Resmi Desa"
            >
              Web Desa
            </a>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-on-surface-variant/80 border-t border-outline-variant/20">
            <span>Versi Aplikasi: v2.5.0 (PWA Ready)</span>
            <a 
              href="https://desapangkalan.web.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              desapangkalan.web.id ↗
            </a>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="w-full mt-6 py-3.5 bg-primary text-on-primary rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors font-bold shadow-md shadow-primary/20 text-center"
        >
          Tutup Informasi
        </button>
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
            <Info className="w-5 h-5" />
          </div>
          <span className="font-body-lg text-sm text-on-surface font-semibold">{triggerText}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-on-surface-variant" />
      </button>

      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
