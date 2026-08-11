"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Phone, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Cookie is already set by the API
        router.push("/");
        router.refresh();
      } else {
        setError(data.message || "Gagal login, periksa nomor telepon dan kata sandi Anda.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 p-6 justify-center">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Pustaka Pangkalan</h1>
          <p className="text-slate-500 mt-2">Masuk ke akun Perpustakaan Digital Anda</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 block">Nomor Telepon</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm outline-none transition-all"
                placeholder="081234567890"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 block">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
