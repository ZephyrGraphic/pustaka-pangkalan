"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PWA Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-[100dvh] items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        Maaf, kami mengalami masalah saat memuat halaman ini. Silakan coba muat ulang.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-all"
      >
        <RefreshCw size={18} />
        Muat Ulang
      </button>
    </div>
  );
}
