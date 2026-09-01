"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { 
  KeyRound, 
  CheckCircle2, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  QrCode, 
  Check, 
  Camera, 
  BookOpen, 
  AlertCircle 
} from "lucide-react";
import Image from "next/image";

// Preset avatars curated for Desa Pangkalan (farmers, villagers, students, local entrepreneurs)
const AVATAR_PRESETS = [
  { id: "farmer", label: "Petani Maju", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80" },
  { id: "woman1", label: "Warga Desa", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" },
  { id: "entrepreneur", label: "Pelaku UMKM", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
  { id: "student", label: "Pelajar Cerdas", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" },
  { id: "elder", label: "Sesepuh Desa", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
  { id: "officer", label: "Perangkat Desa", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80" },
];

const DEFAULT_DUSUN_OPTIONS = [
  "Dusun Pangkalan",
  "Dusun Cikajang",
  "Dusun Pasir Arangan",
  "Dusun Pasir Gombong",
  "Luar Wilayah / Tamu Desa",
];

const MINAT_OPTIONS = [
  "Pertanian & Perikanan Modern",
  "Kewirausahaan & UMKM",
  "Sastra, Sejarah & Budaya Sunda",
  "Kesehatan & Gizi Keluarga",
  "Teknologi & Pengetahuan Umum",
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Basic credentials from initial registration
  const initialName = searchParams.get("name") || "";
  const initialNik = searchParams.get("nik") || "";

  // Step 1: Set PIN, Step 2: Confirm PIN, Step 3: Profile Details & Avatar, Step 4: Card Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [dusunList, setDusunList] = useState<string[]>(DEFAULT_DUSUN_OPTIONS);
  const [name, setName] = useState(initialName);
  const [nik, setNik] = useState(initialNik);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(DEFAULT_DUSUN_OPTIONS[0]);
  const [occupation, setOccupation] = useState(MINAT_OPTIONS[0]);

  // Status & errors
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dusuns")
      .then((res) => res.json())
      .then((data) => {
        if (data.dusuns && data.dusuns.length > 0) {
          const names = data.dusuns.map((d: any) => d.name);
          setDusunList([...names, "Luar Wilayah / Tamu Desa"]);
        }
      })
      .catch(() => {});
  }, []);

  // Handle PIN input with number pads
  const handlePinInput = (digit: string, isConfirm: boolean = false) => {
    setError("");
    if (isConfirm) {
      if (confirmPin.length < 6) {
        const next = confirmPin + digit;
        setConfirmPin(next);
      }
    } else {
      if (pin.length < 6) {
        const next = pin + digit;
        setPin(next);
      }
    }
  };

  const handlePinDelete = (isConfirm: boolean = false) => {
    setError("");
    if (isConfirm) {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  // Step 1 to Step 2
  const handleStep1Submit = () => {
    if (pin.length !== 6) {
      setError("PIN harus terdiri dari 6 angka");
      return;
    }
    setError("");
    setStep(2);
  };

  // Step 2 to Step 3
  const handleStep2Submit = () => {
    if (confirmPin.length !== 6) {
      setError("Masukkan 6 digit PIN konfirmasi");
      return;
    }
    if (pin !== confirmPin) {
      setError("PIN konfirmasi tidak cocok dengan PIN pertama. Silakan coba lagi.");
      setConfirmPin("");
      return;
    }
    setError("");
    setStep(3);
  };

  // Step 3: Submit Registration to API & Login
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalAvatar = showCustomAvatarInput && customAvatarUrl.trim() ? customAvatarUrl.trim() : selectedAvatar;

    try {
      // 1. Register User
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nik,
          name,
          pin,
          image: finalAvatar,
          phone,
          address,
          occupation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal melakukan pendaftaran.");
        setLoading(false);
        return;
      }

      // 2. Automatically log in user with NextAuth credentials
      const signInResult = await signIn("credentials", {
        nik,
        password: pin,
        redirect: false,
      });

      if (signInResult?.ok) {
        setStep(4); // Move to final digital card preview
      } else {
        setError("Akun berhasil dibuat. Silakan login manual.");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi saat menyimpan akun.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOnboarding = () => {
    router.push("/profile");
    router.refresh();
  };

  const finalImageToDisplay = showCustomAvatarInput && customAvatarUrl ? customAvatarUrl : selectedAvatar;

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center -mx-margin md:-mx-xl -mt-[88px] md:-mt-[104px] pt-[104px] bg-surface">
      
      {/* Progress Steps Header */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-surface-container-highest z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                s === step
                  ? "bg-primary text-on-primary ring-4 ring-primary/20 scale-110"
                  : s < step
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] font-medium text-on-surface-variant px-1">
          <span>Buat PIN</span>
          <span>Verifikasi</span>
          <span>Data Diri</span>
          <span>Selesai</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xl animate-fade-in-up">
        
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-error-container text-on-error-container text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STEP 1: SET PIN ================= */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-title-md text-xl font-bold text-on-surface">Buat PIN Akses (6 Angka)</h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1.5 max-w-xs">
                PIN ini digunakan untuk masuk ke akun perpustakaan digital Anda bersama NIK.
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex gap-3 my-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-10 h-12 rounded-2xl border flex items-center justify-center text-xl font-bold transition-all ${
                    idx < pin.length
                      ? "border-primary bg-primary-container/30 text-primary scale-105 shadow-sm"
                      : "border-outline-variant/40 bg-surface-container-lowest text-transparent"
                  }`}
                >
                  {idx < pin.length ? "•" : ""}
                </div>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) => {
                if (k === "") return <div key={i}></div>;
                if (k === "del") {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePinDelete(false)}
                      className="h-13 rounded-2xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold text-sm flex items-center justify-center transition-colors active:scale-95"
                    >
                      Hapus
                    </button>
                  );
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePinInput(k, false)}
                    className="h-13 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-title-md text-lg font-bold flex items-center justify-center transition-all border border-outline-variant/20 active:scale-95 shadow-sm"
                  >
                    {k}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleStep1Submit}
              disabled={pin.length !== 6}
              className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-title-md text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>Lanjut ke Verifikasi PIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: CONFIRM PIN ================= */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-title-md text-xl font-bold text-on-surface">Verifikasi PIN Anda</h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1.5 max-w-xs">
                Masukkan ulang 6 digit PIN yang sama untuk konfirmasi keamanan.
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex gap-3 my-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-10 h-12 rounded-2xl border flex items-center justify-center text-xl font-bold transition-all ${
                    idx < confirmPin.length
                      ? "border-primary bg-primary-container/30 text-primary scale-105 shadow-sm"
                      : "border-outline-variant/40 bg-surface-container-lowest text-transparent"
                  }`}
                >
                  {idx < confirmPin.length ? "•" : ""}
                </div>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) => {
                if (k === "") return <div key={i}></div>;
                if (k === "del") {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePinDelete(true)}
                      className="h-13 rounded-2xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold text-sm flex items-center justify-center transition-colors active:scale-95"
                    >
                      Hapus
                    </button>
                  );
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePinInput(k, true)}
                    className="h-13 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-title-md text-lg font-bold flex items-center justify-center transition-all border border-outline-variant/20 active:scale-95 shadow-sm"
                  >
                    {k}
                  </button>
                );
              })}
            </div>

            <div className="w-full flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmPin("");
                  setStep(1);
                }}
                className="flex-1 py-3.5 bg-surface-container-high text-on-surface rounded-xl font-title-md text-sm font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ubah PIN</span>
              </button>
              <button
                type="button"
                onClick={handleStep2Submit}
                disabled={confirmPin.length !== 6}
                className="flex-1 py-3.5 bg-primary text-on-primary rounded-xl font-title-md text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <span>Konfirmasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PROFILE DETAILS & AVATAR ================= */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-5">
            <div>
              <h2 className="font-title-md text-xl font-bold text-on-surface">Lengkapi Data Diri & Foto</h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Kostumisasi profil dan informasi warga untuk kartu keanggotaan digital.
              </p>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-2">
                Pilih Foto Profil / Avatar Warga
              </label>
              
              {/* Selected Avatar Preview */}
              <div className="flex items-center gap-4 p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 mb-3">
                <div className="w-16 h-16 rounded-full relative overflow-hidden border-2 border-primary shadow-sm shrink-0">
                  <Image src={finalImageToDisplay} alt="Avatar" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">{name || "Warga Desa"}</p>
                  <p className="text-xs text-on-surface-variant">NIK: {nik}</p>
                  <button
                    type="button"
                    onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                    className="text-xs text-primary font-medium hover:underline mt-0.5 inline-block"
                  >
                    {showCustomAvatarInput ? "Gunakan Avatar Karakter" : "Gunakan Link Foto Custom"}
                  </button>
                </div>
              </div>

              {showCustomAvatarInput ? (
                <div>
                  <input
                    type="url"
                    placeholder="https://link-gambar-anda.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatar(preset.url)}
                      className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === preset.url
                          ? "border-primary ring-2 ring-primary/40 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      title={preset.label}
                    >
                      <Image src={preset.url} alt={preset.label} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nama & NIK (if needed to adjust) */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Sesuai KTP"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">NIK (16 Digit)</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="320220..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Nomor WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Nomor WhatsApp / HP (Opsional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Dusun / Wilayah di Desa Pangkalan */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Dusun / Domisili Desa
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  {dusunList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Minat Baca Utama */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Minat Baca Utama
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  {MINAT_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-title-md text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Menerbitkan Kartu Anggota...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Selesaikan & Terbitkan Kartu</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 4: DIGITAL CARD PREVIEW SUCCESS ================= */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-title-md text-2xl font-bold text-on-surface">Selamat Datang!</h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1 max-w-xs">
                Kartu Anggota Digital Anda telah aktif dan tersimpan di sistem Pustaka Pangkalan.
              </p>
            </div>

            {/* Digital Membership Card Preview */}
            <div className="w-full bg-gradient-to-br from-primary to-[#182c16] rounded-3xl p-6 text-on-primary shadow-xl relative overflow-hidden text-left border border-white/10">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-label-md text-[10px] uppercase tracking-widest text-primary-fixed font-bold opacity-80">
                    Kartu Anggota Digital
                  </span>
                  <h3 className="font-title-md text-base font-bold">Pustaka Pangkalan</h3>
                </div>
                <div className="bg-white p-1.5 rounded-xl shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(nik)}`}
                    alt="QR"
                    className="w-10 h-10 object-contain rounded"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-full relative overflow-hidden border-2 border-white/30 shrink-0">
                  <Image src={finalImageToDisplay} alt={name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-title-md text-base font-bold leading-tight">{name}</h4>
                  <p className="font-mono text-xs opacity-90 tracking-wider mt-0.5">{nik}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/15 flex justify-between items-center text-[11px] opacity-80">
                <span>{address}</span>
                <span>Aktif Selamanya</span>
              </div>
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-title-md text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span>Mulai Jelajahi Pustaka</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-on-surface-variant">Memuat pendaftaran...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
