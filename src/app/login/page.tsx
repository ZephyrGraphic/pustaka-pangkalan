"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Badge, Lock, User, Info } from "lucide-react";

export default function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");
  
  const [loginNik, setLoginNik] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regNik, setRegNik] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        nik: loginNik,
        password: loginPassword,
      });

      if (res?.error) {
        setLoginError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setLoginError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: regName,
          nik: regNik,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegError(data.message || "Gagal mendaftar");
      } else {
        setRegSuccess("Berhasil mendaftar! PIN/Password Anda adalah NIK Anda.");
        setTimeout(() => {
          setTab("login");
          setLoginNik(regNik);
          setRegName("");
          setRegNik("");
          setRegSuccess("");
        }, 3000);
      }
    } catch (err) {
      setRegError("Terjadi kesalahan jaringan.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-180px)] flex flex-col justify-center w-full -mt-[80px]">
      {/* Ambient Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2RgjnnkOIty9EHC7n0O3AjIYJjGmenwmh-fIlplTyxXRp2oCcttosrqpK65N4h3JHuCEq30_vugrxQ9WW5cSz9pXLU_BLGBEVYBvRMihlLCnZEEWqb2vFvy8Bec_8p4Pvta8KO8d8JgzZnOEqzpIUtirDN-OMQsoFZ9SJuCuytUBEdP35VEwRCSa4D3GN2UAKKYQ4sYc_dPheuU8sp9DBcwAwr1OXTFYzS1CHO-LsAWIDkpi_HADP')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-surface-variant/40"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row gap-8 lg:gap-xl items-center lg:items-stretch pt-8 md:pt-0">
        
        {/* Hero / Branding Section */}
        <div className="flex-1 w-full flex flex-col justify-center items-center lg:items-start pb-8 lg:py-0 text-center lg:text-left">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-primary-container rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-primary-container/20 mx-auto lg:mx-0">
            <BookOpen className="text-on-primary-container w-10 h-10 md:w-14 md:h-14" />
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-3">
            Pustaka Pangkalan
          </h1>
          <p className="font-body-lg text-on-surface-variant/90 mb-8 max-w-[448px] mx-auto lg:mx-0 leading-relaxed">
            Gerbang Ilmu Pengetahuan Desa. Akses ribuan koleksi buku digital untuk membangun potensi Pangkalan.
          </p>
          <div className="hidden md:flex gap-4 flex-wrap justify-center lg:justify-start">
            <div className="flex items-center gap-2 bg-surface px-5 py-2.5 rounded-full border border-outline-variant/30 shadow-sm">
              <BookOpen className="text-primary-container w-5 h-5" />
              <span className="font-title-md text-sm text-on-surface">5,000+ Buku</span>
            </div>
            <div className="flex items-center gap-2 bg-surface px-5 py-2.5 rounded-full border border-outline-variant/30 shadow-sm">
              <Users className="text-primary-container w-5 h-5" />
              <span className="font-title-md text-sm text-on-surface">Komunitas Warga</span>
            </div>
          </div>
        </div>

        {/* Auth Card Section */}
        <div className="w-full max-w-[448px] mx-auto relative perspective lg:shrink-0 lg:w-[448px] self-center">
          <div className="absolute -inset-4 bg-primary-fixed/30 rounded-[3rem] blur-2xl opacity-60 hidden md:block"></div>
          
          <div className="rounded-[2rem] p-6 md:p-8 relative overflow-hidden flex flex-col shadow-[0px_8px_32px_rgba(0,0,0,0.08)] bg-surface/85 backdrop-blur-xl border border-outline-variant/40">
            
            {/* Segmented Tab Bar */}
            <div className="relative flex p-1.5 bg-surface-variant/50 rounded-2xl mb-8">
              <div 
                className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-surface rounded-xl shadow-sm transition-transform duration-300 border border-outline-variant/20"
                style={{ transform: tab === "login" ? "translateX(0)" : "translateX(100%)" }}
              ></div>
              <button 
                onClick={() => setTab("login")}
                className={`flex-1 py-2.5 px-4 rounded-xl font-title-md text-sm text-center z-10 transition-colors duration-200 ${tab === "login" ? "text-primary" : "text-on-surface-variant"}`}
              >
                Masuk
              </button>
              <button 
                onClick={() => setTab("register")}
                className={`flex-1 py-2.5 px-4 rounded-xl font-title-md text-sm text-center z-10 transition-colors duration-200 ${tab === "register" ? "text-primary" : "text-on-surface-variant"}`}
              >
                Daftar
              </button>
            </div>

            {/* Login Form */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4 animate-fade-in">
                {loginError && <div className="text-error bg-error-container/50 p-3 rounded-lg text-sm text-center">{loginError}</div>}
                <div className="relative bg-surface-container-low border border-outline-variant/60 hover:border-outline focus-within:border-primary rounded-2xl transition-all duration-200 flex items-center px-4 h-16 group">
                  <Badge className="text-outline group-focus-within:text-primary mr-3 w-5 h-5" />
                  <div className="flex flex-col justify-center w-full h-full relative pt-3">
                    <label className="absolute top-2 left-0 font-label-md text-outline-variant text-[11px] uppercase tracking-wider group-focus-within:text-primary">NIK / ID Anggota</label>
                    <input 
                      value={loginNik}
                      onChange={(e) => setLoginNik(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-body-lg text-on-surface p-0 pb-1" 
                      placeholder="16 digit NIK" 
                      type="text" 
                      required
                    />
                  </div>
                </div>

                <div className="relative bg-surface-container-low border border-outline-variant/60 hover:border-outline focus-within:border-primary rounded-2xl transition-all duration-200 flex items-center px-4 h-16 group">
                  <Lock className="text-outline group-focus-within:text-primary mr-3 w-5 h-5" />
                  <div className="flex flex-col justify-center w-full h-full relative pt-3">
                    <label className="absolute top-2 left-0 font-label-md text-outline-variant text-[11px] uppercase tracking-wider group-focus-within:text-primary">Password / PIN</label>
                    <input 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-body-lg text-on-surface p-0 pb-1" 
                      placeholder="••••••••" 
                      type="password" 
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-[-4px]">
                  <a href="#" className="font-body-md text-sm text-primary hover:text-primary-container">Lupa PIN/Password?</a>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <button disabled={loginLoading} type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-on-primary font-title-md rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group">
                    <span>{loginLoading ? "Memproses..." : "Masuk Ke Perpustakaan"}</span>
                  </button>
                  <div className="relative flex items-center py-2 opacity-70">
                    <div className="flex-grow border-t border-outline-variant/50"></div>
                    <span className="mx-4 font-label-md text-outline">ATAU</span>
                    <div className="flex-grow border-t border-outline-variant/50"></div>
                  </div>
                  <button type="button" className="w-full h-14 bg-surface-container-lowest border border-outline-variant text-on-surface font-title-md rounded-2xl flex items-center justify-center gap-3">
                    <span>Masuk dengan Akun Desa</span>
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4 animate-fade-in">
                {regError && <div className="text-error bg-error-container/50 p-3 rounded-lg text-sm text-center">{regError}</div>}
                {regSuccess && <div className="text-primary bg-primary-container/30 p-3 rounded-lg text-sm text-center">{regSuccess}</div>}

                <div className="relative bg-surface-container-low border border-outline-variant/60 hover:border-outline focus-within:border-primary rounded-2xl transition-all duration-200 flex items-center px-4 h-16 group">
                  <User className="text-outline group-focus-within:text-primary mr-3 w-5 h-5" />
                  <div className="flex flex-col justify-center w-full h-full relative pt-3">
                    <label className="absolute top-2 left-0 font-label-md text-outline-variant text-[11px] uppercase tracking-wider group-focus-within:text-primary">Nama Lengkap</label>
                    <input 
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-body-lg text-on-surface p-0 pb-1" 
                      placeholder="Nama Lengkap" 
                      type="text" 
                      required
                    />
                  </div>
                </div>

                <div className="relative bg-surface-container-low border border-outline-variant/60 hover:border-outline focus-within:border-primary rounded-2xl transition-all duration-200 flex items-center px-4 h-16 group">
                  <Badge className="text-outline group-focus-within:text-primary mr-3 w-5 h-5" />
                  <div className="flex flex-col justify-center w-full h-full relative pt-3">
                    <label className="absolute top-2 left-0 font-label-md text-outline-variant text-[11px] uppercase tracking-wider group-focus-within:text-primary">NIK (16 Digit)</label>
                    <input 
                      value={regNik}
                      onChange={(e) => setRegNik(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-body-lg text-on-surface p-0 pb-1" 
                      placeholder="16 digit NIK" 
                      type="text" 
                      required
                    />
                  </div>
                </div>

                <button disabled={regLoading} type="submit" className="w-full h-14 mt-6 bg-primary hover:bg-primary/90 text-on-primary font-title-md rounded-2xl shadow-md flex items-center justify-center gap-2">
                  <span>{regLoading ? "Mendaftarkan..." : "Daftar Akun Baru"}</span>
                </button>
                <p className="text-center font-body-md text-xs text-on-surface-variant/80 mt-3">
                  Dengan mendaftar, Anda menyetujui Syarat & Ketentuan.
                </p>
              </form>
            )}

          </div>

          <div className="mt-8 text-center flex flex-col items-center justify-center gap-1.5 relative z-10">
            <p className="font-body-md text-on-surface-variant flex items-center justify-center gap-1.5">
              <Info className="w-4 h-4" /> Belum punya kartu anggota?
            </p>
            <p className="font-title-md text-primary hover:text-primary-container cursor-pointer">
              Hubungi Balai Desa Pangkalan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
