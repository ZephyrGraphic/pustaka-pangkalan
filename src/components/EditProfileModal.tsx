"use client";

import { useState } from "react";
import { 
  User, 
  X, 
  Camera, 
  Phone, 
  MapPin, 
  BookOpen, 
  KeyRound, 
  Check, 
  Sparkles,
  Edit2
} from "lucide-react";
import Image from "next/image";

const AVATAR_PRESETS = [
  { id: "farmer", label: "Petani Maju", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80" },
  { id: "woman1", label: "Warga Desa", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" },
  { id: "entrepreneur", label: "Pelaku UMKM", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
  { id: "student", label: "Pelajar Cerdas", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" },
  { id: "elder", label: "Sesepuh Desa", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
  { id: "officer", label: "Perangkat Desa", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80" },
];

const DUSUN_OPTIONS = [
  "Dusun I (Krajan Barat)",
  "Dusun II (Krajan Timur)",
  "Dusun III (Babakan Sukamaju)",
  "Dusun IV (Pasir Angin)",
  "Luar Wilayah / Tamu Desa",
];

const MINAT_OPTIONS = [
  "Pertanian & Perikanan Modern",
  "Kewirausahaan & UMKM",
  "Sastra, Sejarah & Budaya Sunda",
  "Kesehatan & Gizi Keluarga",
  "Teknologi & Pengetahuan Umum",
];

interface EditProfileModalProps {
  currentName: string;
  currentImage: string | null;
  currentPhone?: string | null;
  currentAddress?: string | null;
  currentOccupation?: string | null;
  onProfileUpdated: (updatedUser: any) => void;
}

export default function EditProfileModal({
  currentName,
  currentImage,
  currentPhone = "",
  currentAddress = "",
  currentOccupation = "",
  onProfileUpdated,
}: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Form fields
  const [name, setName] = useState(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentImage || AVATAR_PRESETS[0].url
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [showCustomAvatar, setShowCustomAvatar] = useState(false);
  const [phone, setPhone] = useState(currentPhone || "");
  const [address, setAddress] = useState(currentAddress || DUSUN_OPTIONS[0]);
  const [occupation, setOccupation] = useState(currentOccupation || MINAT_OPTIONS[0]);

  // PIN Change Section
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setName(currentName);
    setSelectedAvatar(currentImage || AVATAR_PRESETS[0].url);
    setPhone(currentPhone || "");
    setAddress(currentAddress || DUSUN_OPTIONS[0]);
    setOccupation(currentOccupation || MINAT_OPTIONS[0]);
    setShowChangePin(false);
    setNewPin("");
    setConfirmNewPin("");
    setError("");
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (showChangePin) {
      if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
        setError("PIN baru harus 6 digit angka.");
        return;
      }
      if (newPin !== confirmNewPin) {
        setError("Konfirmasi PIN baru tidak cocok.");
        return;
      }
    }

    setSaving(true);
    const finalAvatar = showCustomAvatar && customAvatarUrl.trim() ? customAvatarUrl.trim() : selectedAvatar;

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: finalAvatar,
          phone: phone.trim(),
          address,
          occupation,
          ...(showChangePin && newPin.length === 6 ? { newPin } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memperbarui profil.");
        setSaving(false);
        return;
      }

      onProfileUpdated(data.user);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar = showCustomAvatar && customAvatarUrl ? customAvatarUrl : selectedAvatar;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-semibold backdrop-blur-md transition-colors border border-white/30"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Ubah Profil</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div 
            className="relative w-full max-w-lg min-w-[300px] sm:min-w-[420px] bg-surface-container rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto animate-fade-in-up my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h3 className="font-title-md text-lg font-bold text-on-surface">
                  Kostumisasi Foto & Data Diri
                </h3>
                <p className="font-label-md text-xs text-on-surface-variant mt-0.5">
                  Perbarui informasi profil dan kartu anggota digital Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-error-container text-on-error-container text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-2">
                  Foto Profil / Avatar
                </label>

                {/* Avatar Preview */}
                <div className="flex items-center gap-4 p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 mb-3">
                  <div className="w-16 h-16 rounded-full relative overflow-hidden border-2 border-primary shadow-sm shrink-0">
                    <Image src={displayAvatar} alt="Preview" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{name || "Warga Desa"}</p>
                    <button
                      type="button"
                      onClick={() => setShowCustomAvatar(!showCustomAvatar)}
                      className="text-xs text-primary font-medium hover:underline mt-0.5 inline-block"
                    >
                      {showCustomAvatar ? "Pilih dari Karakter Avatar" : "Gunakan Link Foto Sendiri"}
                    </button>
                  </div>
                </div>

                {showCustomAvatar ? (
                  <input
                    type="url"
                    placeholder="https://link-foto-anda.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
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

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="0812..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Dusun */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                  Dusun / Wilayah Desa
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    {DUSUN_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Minat */}
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

              {/* Change PIN Toggle */}
              <div className="pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowChangePin(!showChangePin)}
                  className="flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{showChangePin ? "Batal Ubah PIN" : "Ganti PIN 6-Digit"}</span>
                </button>

                {showChangePin && (
                  <div className="grid grid-cols-2 gap-3 mt-3 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">PIN Baru (6 Angka)</label>
                      <input
                        type="password"
                        maxLength={6}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-2.5 text-center font-mono text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Konfirmasi PIN Baru</label>
                      <input
                        type="password"
                        maxLength={6}
                        value={confirmNewPin}
                        onChange={(e) => setConfirmNewPin(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-2.5 text-center font-mono text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3.5 bg-surface-container-highest text-on-surface rounded-xl font-title-md text-sm font-semibold hover:bg-surface-variant transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 bg-primary text-on-primary rounded-xl font-title-md text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
