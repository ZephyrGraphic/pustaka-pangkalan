"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, Download, X } from "lucide-react";

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered successfully:", reg.scope);
        })
        .catch((err) => {
          console.warn("Service Worker registration failed:", err);
        });
    }

    // 2. Online / Offline status
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 3. Before Install Prompt (PWA)
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        const hasDismissed = localStorage.getItem("pwa_dismissed");
        if (!hasDismissed) {
          setShowInstallBanner(true);
        }
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted PWA installation");
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("pwa_dismissed", "true");
  };

  return (
    <>
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>Anda sedang dalam Mode Offline. Halaman dan buku yang telah dibuka tetap dapat dibaca.</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-surface-container border border-outline-variant/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl animate-fade-in-up">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-title-md text-sm text-on-surface">Pasang Pustaka Pangkalan</h4>
                <p className="font-body-md text-xs text-on-surface-variant">Akses buku lebih cepat & hemat kuota di perangkat Anda.</p>
              </div>
            </div>
            <button 
              onClick={handleDismissBanner}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 mt-3 justify-end">
            <button
              onClick={handleDismissBanner}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-highest"
            >
              Nanti Saja
            </button>
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-on-primary hover:bg-primary/90 shadow-sm"
            >
              Pasang Sekarang
            </button>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
