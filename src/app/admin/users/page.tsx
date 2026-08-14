"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Activity, 
  Bookmark, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  KeyRound, 
  Edit3, 
  X, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  Phone, 
  Lock,
  Users
} from "lucide-react";
import Image from "next/image";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [filterDusun, setFilterDusun] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset PIN modal state
  const [resetPinModalUser, setResetPinModalUser] = useState<any | null>(null);
  const [newPin, setNewPin] = useState("");
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [pinError, setPinError] = useState("");

  // Edit User modal state
  const [editModalUser, setEditModalUser] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editOccupation, setEditOccupation] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = "/api/admin/users?";
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (filterRole !== "ALL") url += `role=${filterRole}&`;
      if (filterDusun !== "ALL") url += `dusun=${encodeURIComponent(filterDusun)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterDusun, search]);

  const handleToggleRole = async (user: any) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg = user.role === "ADMIN"
      ? `Cabut hak akses Admin dari "${user.name}"? Pengguna akan menjadi Warga biasa.`
      : `Jadikan "${user.name}" sebagai Administrator Pustaka?`;

    if (!confirm(confirmMsg)) return;

    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: nextRole }),
      });

      if (res.ok) {
        setToastMessage(`Hak akses ${user.name} berhasil diubah menjadi ${nextRole}`);
        setTimeout(() => setToastMessage(null), 4000);
        fetchUsers();
      } else {
        alert("Gagal mengubah peran pengguna.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenResetPin = (user: any) => {
    setResetPinModalUser(user);
    setNewPin("");
    setPinError("");
  };

  const handleConfirmResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPinModalUser) return;

    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      setPinError("PIN baru harus tepat 6 digit angka.");
      return;
    }

    setPinSubmitting(true);
    setPinError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resetPinModalUser.id,
          newPin: newPin,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMessage(`PIN untuk ${resetPinModalUser.name} berhasil di-reset menjadi "${newPin}"!`);
        setTimeout(() => setToastMessage(null), 5000);
        setResetPinModalUser(null);
      } else {
        setPinError(data.error || "Gagal mereset PIN.");
      }
    } catch (err) {
      setPinError("Terjadi kesalahan jaringan.");
    } finally {
      setPinSubmitting(false);
    }
  };

  const handleOpenEditUser = (user: any) => {
    setEditModalUser(user);
    setEditName(user.name || "");
    setEditPhone(user.phone || "");
    setEditAddress(user.address || "Dusun I (Krajan Barat)");
    setEditOccupation(user.occupation || "Wirausaha / UMKM Desa");
  };

  const handleConfirmEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;

    setEditSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editModalUser.id,
          name: editName,
          phone: editPhone,
          address: editAddress,
          occupation: editOccupation,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMessage(`Data profil ${editName} berhasil diperbarui.`);
        setTimeout(() => setToastMessage(null), 4000);
        setEditModalUser(null);
        fetchUsers();
      } else {
        alert(data.error || "Gagal memperbarui data pengguna.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const dusunOptions = [
    "ALL",
    "Dusun I (Krajan Barat)",
    "Dusun II (Krajan Timur)",
    "Dusun III (Sukamaju)",
    "Luar Wilayah / Tamu Desa",
  ];

  const totalUsersCount = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const regularCount = users.filter((u) => u.role === "USER").length;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-container text-on-primary-container">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Manajemen Pengguna & Warga</h1>
          </div>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
            Kelola data akun warga Desa Pangkalan, reset PIN 6-digit, dan atur peran hak akses administrator.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30 text-center px-4">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Warga</span>
            <span className="text-lg font-bold text-primary">{totalUsersCount}</span>
          </div>
          <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30 text-center px-4">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Admin</span>
            <span className="text-lg font-bold text-on-surface">{adminCount}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1 relative flex items-center bg-surface-container-high rounded-2xl px-4 py-2.5 border border-outline-variant/30 focus-within:border-primary">
            <Search className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Cari NIK, nama warga, atau nomor WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs sm:text-sm text-on-surface w-full placeholder:text-on-surface-variant/70"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-on-surface-variant hover:text-on-surface p-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex gap-1.5 shrink-0">
            {(["ALL", "USER", "ADMIN"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  filterRole === r
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest"
                }`}
              >
                {r === "ALL" ? "Semua Peran" : r === "USER" ? "Warga" : "Administrator"}
              </button>
            ))}
          </div>
        </div>

        {/* Dusun / Wilayah Filter */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scroll pt-1 border-t border-outline-variant/15">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase shrink-0">Dusun:</span>
          {dusunOptions.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDusun(d)}
              className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all border ${
                filterDusun === d
                  ? "bg-primary-container text-on-primary-container border-primary/30 font-bold"
                  : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest"
              }`}
            >
              {d === "ALL" ? "Semua Wilayah" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / Card Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-surface-container rounded-3xl p-12 text-center border border-outline-variant/20 space-y-2">
          <Users className="w-10 h-10 text-outline-variant mx-auto mb-2" />
          <h3 className="text-base font-bold text-on-surface">Tidak ada pengguna yang sesuai</h3>
          <p className="text-xs text-on-surface-variant">Coba gunakan kata kunci pencarian atau filter wilayah lainnya.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden relative border-2 border-primary/20 bg-surface-container-high shrink-0 shadow-sm">
                  {user.image ? (
                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                  ) : (
                    <User className="w-6 h-6 m-auto text-on-surface-variant mt-3" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-title-md text-sm sm:text-base font-bold text-on-surface">
                      {user.name}
                    </h3>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        user.role === "ADMIN"
                          ? "bg-primary-container text-on-primary-container border border-primary/30"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Administrator" : "Warga"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-on-surface-variant">
                    <span className="font-mono font-semibold text-on-surface">NIK: {user.email}</span>
                    {user.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-primary" />
                        {user.phone}
                      </span>
                    )}
                    {user.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {user.address}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-1 text-[11px] text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-primary" />
                      {user._count?.readers || 0} Aktivitas Baca
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-primary" />
                      {user._count?.bookmarks || 0} Buku di Rak
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                {/* Reset PIN Button */}
                <button
                  onClick={() => handleOpenResetPin(user)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-xs font-semibold text-on-surface transition-colors"
                  title="Reset PIN Akun Warga"
                >
                  <KeyRound className="w-3.5 h-3.5 text-primary" />
                  <span>Reset PIN</span>
                </button>

                {/* Edit Profile Button */}
                <button
                  onClick={() => handleOpenEditUser(user)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-xs font-semibold text-on-surface transition-colors"
                  title="Edit Data Warga"
                >
                  <Edit3 className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span>Edit Data</span>
                </button>

                {/* Role Switcher */}
                <button
                  onClick={() => handleToggleRole(user)}
                  disabled={updatingId === user.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    user.role === "ADMIN"
                      ? "bg-error/10 hover:bg-error/20 text-error"
                      : "bg-primary text-on-primary hover:bg-primary/90 shadow-sm"
                  }`}
                >
                  {user.role === "ADMIN" ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Cabut Admin</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Jadikan Admin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: RESET PIN 6-DIGIT */}
      {resetPinModalUser && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setResetPinModalUser(null)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 animate-fade-in-up"
            style={{ width: "min(92vw, 460px)", maxWidth: "460px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-title-md text-lg font-bold text-on-surface">Reset PIN Warga</h3>
                  <p className="font-body-md text-xs text-on-surface-variant">{resetPinModalUser.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setResetPinModalUser(null)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResetPin} className="space-y-4">
              <div className="bg-surface-container-high p-3 rounded-2xl border border-outline-variant/20 text-xs text-on-surface-variant space-y-1">
                <p><strong>NIK:</strong> {resetPinModalUser.email}</p>
                <p>Masukkan 6-digit angka baru untuk PIN login akun warga ini.</p>
              </div>

              {pinError && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-2xl text-xs text-error font-semibold">
                  {pinError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">PIN Baru (6 Digit)</label>
                <div className="relative flex items-center bg-surface-container-high rounded-2xl px-4 py-3 border border-outline-variant/30 focus-within:border-primary">
                  <Lock className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Contoh: 123456"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                    className="bg-transparent border-none outline-none text-base font-mono tracking-widest text-on-surface w-full placeholder:text-on-surface-variant/50"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPinModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={pinSubmitting || newPin.length !== 6}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
                >
                  {pinSubmitting ? "Menyimpan..." : "Reset PIN Sekarang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER DATA */}
      {editModalUser && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setEditModalUser(null)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 animate-fade-in-up"
            style={{ width: "min(92vw, 480px)", maxWidth: "480px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-title-md text-lg font-bold text-on-surface">Edit Data Warga</h3>
                  <p className="font-body-md text-xs text-on-surface-variant">NIK: {editModalUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditModalUser(null)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-container-high rounded-2xl px-4 py-2.5 text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="0812..."
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-surface-container-high rounded-2xl px-4 py-2.5 text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Dusun / Wilayah</label>
                <select
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-surface-container-high rounded-2xl px-4 py-2.5 text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                >
                  {dusunOptions.filter((d) => d !== "ALL").map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Minat Baca / Bidang</label>
                <input
                  type="text"
                  value={editOccupation}
                  onChange={(e) => setEditOccupation(e.target.value)}
                  className="w-full bg-surface-container-high rounded-2xl px-4 py-2.5 text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors shadow-md"
                >
                  {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
