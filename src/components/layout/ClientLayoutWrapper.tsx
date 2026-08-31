"use client";

import { usePathname } from "next/navigation";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import BroadcastBanner from "@/components/BroadcastBanner";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <>
      <TopAppBar />
      <BroadcastBanner />
      <main className="flex-grow pt-[88px] md:pt-[104px] pb-[100px] md:pb-[40px] px-margin md:px-xl flex flex-col gap-xl w-full max-w-7xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
