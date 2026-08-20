"use client";

import { SessionProvider } from "next-auth/react";
import PWAProvider from "./PWAProvider";
import { ToastProvider } from "./ToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <PWAProvider>{children}</PWAProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
