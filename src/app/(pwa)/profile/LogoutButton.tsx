"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors">
      <LogOut size={20} />
      Keluar
    </button>
  );
}
