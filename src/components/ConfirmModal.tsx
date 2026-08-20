"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
      onClick={isLoading ? undefined : onCancel}
    >
      <div
        className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-7 shadow-2xl border border-outline-variant/30 animate-fade-in-up my-auto space-y-5"
        style={{ width: "min(92vw, 440px)", maxWidth: "440px", minWidth: "280px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive ? "bg-error/15 text-error" : "bg-primary-container text-on-primary-container"
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface leading-snug">{title}</h3>
            </div>
          </div>
          {!isLoading && (
            <button
              onClick={onCancel}
              className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2.5 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 ${
              isDestructive 
                ? "bg-error hover:bg-error/90 text-on-error shadow-error/20" 
                : "bg-primary hover:bg-primary/90 text-on-primary shadow-primary/20"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
