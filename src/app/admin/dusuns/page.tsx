"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Users, 
  ArrowUpDown, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Building2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface DusunItem {
  id: string;
  name: string;
  order: number;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDusunsPage() {
  const [dusuns, setDusuns] = useState<DusunItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [currentDusun, setCurrentDusun] = useState<DusunItem | null>(null);
  const [formData, setFormData] = useState({ name: "", order: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchDusuns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dusuns");
      const data = await res.json();
      if (data.dusuns) {
        setDusuns(data.dusuns);
      }
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat data dusun", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDusuns();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAdd = () => {
    const nextOrder = dusuns.length > 0 ? Math.max(...dusuns.map(d => d.order)) + 1 : 1;
    setFormData({ name: "", order: nextOrder });
    setShowAddModal(true);
  };

  const handleOpenEdit = (dusun: DusunItem) => {
    setCurrentDusun(dusun);
    setFormData({ name: dusun.name, order: dusun.order });
    setShowEditModal(true);
  };

  const handleOpenDelete = (dusun: DusunItem) => {
    setCurrentDusun(dusun);
    setShowDeleteModal(true);
  };

  const handleCreateDusun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/dusuns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan dusun");

      showToast(data.message || "Dusun berhasil ditambahkan!");
      setShowAddModal(false);
      fetchDusuns();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateDusun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDusun || !formData.name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/dusuns/${currentDusun.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui dusun");

      showToast(data.message || "Dusun berhasil diperbarui!");
      setShowEditModal(false);
      fetchDusuns();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDusun = async () => {
    if (!currentDusun) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/dusuns/${currentDusun.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus dusun");

      showToast(data.message || "Dusun berhasil dihapus!");
      setShowDeleteModal(false);
      fetchDusuns();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDusuns = dusuns.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCitizens = dusuns.reduce((acc, curr) => acc + (curr.userCount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`fixed top-6 right-6 z-[999999] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold text-white animate-fade-in-down border ${
            toastMessage.type === "success" 
              ? "bg-emerald-600 border-emerald-400" 
              : "bg-red-600 border-red-400"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-primary-container text-on-primary-container">
              <MapPin className="w-5 h-5 text-primary" />
            </span>
            <h1 className="font-headline-md text-2xl font-bold text-on-surface">Kelola Wilayah Dusun</h1>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Atur dan ubah nama dusun/kedusunan Desa Pangkalan secara langsung tanpa edit kode. Perubahan nama dusun otomatis menyinkronkan data profil warga.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchDusuns}
            disabled={loading}
            className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 transition-all"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dusun Baru</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-medium block">Total Wilayah Dusun</span>
            <span className="text-2xl font-bold text-on-surface">{dusuns.length} Dusun</span>
          </div>
        </div>

        <div className="bg-surface-container p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-medium block">Warga Terpetakan</span>
            <span className="text-2xl font-bold text-on-surface">{totalCitizens} Warga</span>
          </div>
        </div>

        <div className="bg-surface-container p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-medium block">Pemerintah Desa</span>
            <span className="text-sm font-bold text-on-surface">Kecamatan Cikidang</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-3 bg-surface-container rounded-2xl p-2 px-4 border border-outline-variant/20">
        <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
        <input
          type="text"
          placeholder="Cari nama dusun..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-on-surface-variant hover:text-on-surface">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dusun Table / Cards */}
      <div className="bg-surface-container rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Memuat daftar dusun dari database...</span>
          </div>
        ) : filteredDusuns.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant space-y-2">
            <p className="font-semibold text-on-surface">Tidak ada dusun yang cocok.</p>
            <p className="text-xs">Silakan tambahkan dusun baru atau ubah kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-container-high/60 text-on-surface-variant uppercase text-[11px] tracking-wider border-b border-outline-variant/20">
                <tr>
                  <th className="p-4 pl-6 font-semibold w-16">Urutan</th>
                  <th className="p-4 font-semibold">Nama Wilayah Dusun</th>
                  <th className="p-4 font-semibold">Warga Terdaftar</th>
                  <th className="p-4 font-semibold">Terakhir Diubah</th>
                  <th className="p-4 pr-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                {filteredDusuns.map((dusun) => (
                  <tr key={dusun.id} className="hover:bg-surface-container-high/40 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-primary">
                      <span className="w-7 h-7 rounded-xl bg-primary-container/40 text-primary flex items-center justify-center text-xs">
                        #{dusun.order}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold text-sm text-on-surface">{dusun.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/20">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span>{dusun.userCount || 0} Warga</span>
                      </span>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {new Date(dusun.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(dusun)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-primary/20 text-primary transition-all font-semibold text-xs border border-primary/20 hover:scale-105"
                          title="Ubah Nama Dusun"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleOpenDelete(dusun)}
                          className="p-1.5 rounded-xl text-error hover:bg-error/10 transition-colors"
                          title="Hapus Dusun"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD DUSUN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in-up space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-primary text-on-primary">
                  <Plus className="w-5 h-5" />
                </span>
                <h3 className="font-title-md text-lg font-bold">Tambah Dusun Baru</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDusun} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nama Dusun / Wilayah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dusun Pasir Gombong"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nomor Urutan Tampilan
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Dusun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DUSUN MODAL */}
      {showEditModal && currentDusun && (
        <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in-up space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500 text-slate-950">
                  <Edit3 className="w-5 h-5" />
                </span>
                <h3 className="font-title-md text-lg font-bold">Edit Nama Dusun</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDusun} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nama Dusun Saat Ini
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nomor Urutan Tampilan
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <span>
                  Mengubah nama dusun akan otomatis memperbarui data domisili pada seluruh profil warga yang terdaftar di dusun ini ({currentDusun.userCount || 0} warga).
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && currentDusun && (
        <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in-up space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-error/15 text-error flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-title-md text-lg font-bold text-on-surface">Hapus Dusun?</h3>
              <p className="text-xs text-on-surface-variant">
                Apakah Anda yakin ingin menghapus <strong className="text-on-surface">&quot;{currentDusun.name}&quot;</strong> dari daftar wilayah desa?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteDusun}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-error hover:bg-error/90 text-on-error font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Menghapus..." : "Ya, Hapus Dusun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
