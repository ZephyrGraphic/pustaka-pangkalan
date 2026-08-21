"use client";

import { SessionProvider } from "next-auth/react";
import PWAProvider from "./PWAProvider";
import { ToastProvider } from "./ToastProvider";
import { LanguageProvider } from "./LanguageProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ToastProvider>
          <PWAProvider>{children}</PWAProvider>
        </ToastProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
