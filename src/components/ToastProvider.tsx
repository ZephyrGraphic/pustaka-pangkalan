"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg: string, dur?: number) => showToast(msg, "success", dur), [showToast]);
  const error = useCallback((msg: string, dur?: number) => showToast(msg, "error", dur), [showToast]);
  const warning = useCallback((msg: string, dur?: number) => showToast(msg, "warning", dur), [showToast]);
  const info = useCallback((msg: string, dur?: number) => showToast(msg, "info", dur), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Render Container */}
      <div 
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-[9999999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          let bg = "bg-surface-container border-outline-variant/30 text-on-surface";
          let icon = <Info className="w-5 h-5 text-primary shrink-0" />;

          if (toast.type === "success") {
            bg = "bg-green-500/15 border-green-500/30 text-green-900 dark:text-green-100";
            icon = <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />;
          } else if (toast.type === "error") {
            bg = "bg-red-500/15 border-red-500/30 text-red-900 dark:text-red-100";
            icon = <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
          } else if (toast.type === "warning") {
            bg = "bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-100";
            icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-xl border ${bg} animate-fade-in-up transition-all duration-300`}
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-full opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
