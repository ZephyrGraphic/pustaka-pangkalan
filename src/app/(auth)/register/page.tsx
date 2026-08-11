"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Phone, Lock, User, ArrowRight, Loader2, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.message || "Gagal mendaftar, silakan periksa data Anda.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 p-6 justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Akun</h1>
          <p className="text-slate-500 mt-1 text-sm">Bergabung dengan Perpustakaan Digital Pangkalan</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white text-sm outline-none transition-all"
                placeholder="Nama Anda"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Nomor Telepon</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white text-sm outline-none transition-all"
                placeholder="081234567890"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Email (Opsional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white text-sm outline-none transition-all"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white text-sm outline-none transition-all"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] mt-6 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buat Akun"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
