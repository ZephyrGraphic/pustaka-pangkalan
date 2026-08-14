"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, X, Copy, Check, MessageSquare, QrCode } from "lucide-react";

interface ShareModalProps {
  bookTitle: string;
  bookAuthor: string;
  bookId: string;
}

export default function ShareModal({ bookTitle, bookAuthor, bookId }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/books/${bookId}`;
    }
    return `/books/${bookId}`;
  };

  const handleCopy = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(
      `Baca buku "${bookTitle}" karya ${bookAuthor} secara gratis di Perpustakaan Digital Desa Pangkalan:\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(getShareUrl())}`;

  const modalContent = isOpen && mounted ? (
    <div 
      className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative w-full max-w-sm bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 flex flex-col items-center text-center animate-fade-in-up my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <h3 className="font-title-md text-base text-on-surface font-bold">Bagikan Buku</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="font-body-md text-xs text-on-surface-variant mb-4 line-clamp-1">
          {bookTitle}
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-inner mb-4">
          <img 
            src={qrUrl} 
            alt="QR Code Buku" 
            className="w-44 h-44 object-contain rounded-lg"
          />
        </div>
        <p className="font-label-md text-[11px] text-on-surface-variant mb-6">
          Pindai QR ini untuk membuka buku di HP
        </p>

        {/* Share Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-title-md text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Bagikan ke WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface rounded-xl font-title-md text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Tautan Tersalin!" : "Salin Tautan"}</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-2xl text-on-surface font-title-md text-sm transition-all"
        title="Bagikan Buku"
      >
        <Share2 className="w-4 h-4 text-primary" />
        <span>Bagikan</span>
      </button>

      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
