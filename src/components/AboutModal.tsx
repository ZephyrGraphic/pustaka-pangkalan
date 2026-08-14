"use client";

import { useState } from "react";
import { Info, X, MapPin, Clock, ShieldCheck, Mail, Phone, BookOpen } from "lucide-react";

export default function AboutModal({ triggerText = "Tentang Aplikasi", className = "" }: { triggerText?: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm"}
      >
        <Info className="w-4 h-4" />
        <span>{triggerText}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-outline-variant/30 max-h-[85vh] overflow-y-auto animate-fade-in-up">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline-lg-mobile text-lg font-bold text-on-surface">
                    Pustaka Pangkalan
                  </h3>
                  <p className="font-label-md text-xs text-on-surface-variant">Perpustakaan Digital Terpadu Desa Pangkalan</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-on-surface-variant">
              <p className="leading-relaxed font-body-md">
                Pustaka Pangkalan adalah inisiatif digitalisasi desa yang bertujuan menyediakan akses pengetahuan, modul budidaya pertanian modern, panduan wirausaha UMKM, khasanah sastra & budaya Sunda, serta warta desa kepada seluruh warga secara gratis.
              </p>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-on-surface text-xs uppercase tracking-wider">Lokasi Balai Perpustakaan</p>
                    <p className="text-xs mt-0.5">Kompleks Balai Desa Pangkalan, Kec. Pangkalan, Jawa Barat</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-on-surface text-xs uppercase tracking-wider">Layanan Fisik & Konsultasi</p>
                    <p className="text-xs mt-0.5">Senin - Jumat: 08.00 - 16.00 WIB (Akses Digital 24 Jam)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-on-surface text-xs uppercase tracking-wider">Keanggotaan Digital</p>
                    <p className="text-xs mt-0.5">Setiap warga ber-NIK Desa Pangkalan otomatis berhak atas kartu anggota digital.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-on-surface-variant/80 border-t border-outline-variant/20">
                <span>Versi Aplikasi: v2.4.0 (PWA Ready)</span>
                <span>© 2026 Desa Pangkalan</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-5 py-3 bg-primary text-on-primary rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
