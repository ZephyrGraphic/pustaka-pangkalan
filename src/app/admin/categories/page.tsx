"use client";

import { useState } from "react";
import useSWR from "swr";
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  BookOpen, 
  Sprout, 
  Landmark, 
  TrendingUp, 
  HeartPulse, 
  Cpu, 
  GraduationCap, 
  Palette, 
  Sparkles, 
  Globe, 
  ShieldCheck,
  X,
  ArrowUpDown,
  BookMarked
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  bookCount: number;
  createdAt?: string;
  updatedAt?: string;
}

const ICON_MAP: Record<string, any> = {
  Sprout,
  Landmark,
  TrendingUp,
  HeartPulse,
  Cpu,
  GraduationCap,
  Palette,
  BookOpen,
  Sparkles,
  Globe,
  ShieldCheck,
  Layers,
  BookMarked,
};

const PRESET_ICONS = [
  { name: "Sprout", label: "Pertanian & Alam" },
  { name: "Landmark", label: "Sejarah & Budaya" },
  { name: "TrendingUp", label: "Bisnis & UMKM" },
  { name: "HeartPulse", label: "Kesehatan" },
  { name: "Cpu", label: "Teknologi & AI" },
  { name: "GraduationCap", label: "Pendidikan" },
  { name: "Palette", label: "Kreativitas & Seni" },
  { name: "BookOpen", label: "Buku & Umum" },
  { name: "Sparkles", label: "Inovasi" },
  { name: "Globe", label: "Wawasan Dunia" },
  { name: "ShieldCheck", label: "Keamanan & Hukum" },
];

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Gagal memuat data");
  }
  return res.json();
};

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"order" | "name" | "books">("order");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIcon, setFormIcon] = useState("BookOpen");
  const [formOrder, setFormOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // SWR: Fetch categories
  const { 
    data, 
    isLoading: loading, 
    mutate: mutateCategories 
  } = useSWR("/api/admin/categories", fetcher, { revalidateOnFocus: true });

  const categories: CategoryItem[] = data?.categories || [];

  const handleOpenAdd = () => {
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1;
    setFormName("");
    setFormDescription("");
    setFormIcon("BookOpen");
    setFormOrder(nextOrder);
    setShowAddModal(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description || "");
    setFormIcon(category.icon || "BookOpen");
    setFormOrder(category.order);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.warning("Nama kategori wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim(),
          icon: formIcon,
          order: Number(formOrder) || 1,
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success(resData.message || `Kategori "${formName}" berhasil ditambahkan.`);
        setShowAddModal(false);
        mutateCategories();
      } else {
        toast.error(resData.error || "Gagal menambah kategori.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim(),
          icon: formIcon,
          order: Number(formOrder) || 1,
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success(resData.message || `Kategori "${formName}" berhasil diperbarui.`);
        setEditingCategory(null);
        mutateCategories();
      } else {
        toast.error(resData.error || "Gagal memperbarui kategori.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success(resData.message || `Kategori "${deleteTarget.name}" berhasil dihapus.`);
        setDeleteTarget(null);
        mutateCategories();
      } else {
        toast.error(resData.error || "Gagal menghapus kategori.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "books") return b.bookCount - a.bookCount;
      return a.order - b.order;
    });

  const totalBooksAssigned = categories.reduce((sum, c) => sum + (c.bookCount || 0), 0);
  const mostPopularCat = [...categories].sort((a, b) => b.bookCount - a.bookCount)[0];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-container text-on-primary-container">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
              Manajemen Kategori Buku
            </h1>
          </div>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
            Kelola kategori tematik perpustakaan digital untuk memudahkan penelusuran buku bagi warga Desa Pangkalan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 text-center">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Kategori</span>
          <span className="text-xl font-bold text-primary">{categories.length} Topik</span>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 text-center">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Buku Terkategori</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalBooksAssigned} Judul</span>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Kategori Teraktif</span>
          <span className="text-sm font-bold text-on-surface truncate block" title={mostPopularCat?.name}>
            {mostPopularCat?.name || "-"} ({mostPopularCat?.bookCount || 0})
          </span>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari nama kategori atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-high rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary shadow-inner"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto shrink-0">
          <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">Urutkan:</span>
          {[
            { id: "order", label: "Urutan" },
            { id: "name", label: "Nama A-Z" },
            { id: "books", label: "Buku Terbanyak" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                sortBy === s.id
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="p-12 text-center text-on-surface-variant text-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Memuat data kategori buku...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-surface-container rounded-3xl p-12 text-center border border-outline-variant/20 space-y-3">
          <Layers className="w-12 h-12 text-outline-variant mx-auto opacity-50" />
          <h3 className="text-base font-bold text-on-surface">Tidak ada kategori ditemukan</h3>
          <p className="text-xs text-on-surface-variant">Klik tombol &quot;Tambah Kategori Baru&quot; untuk menambahkan topik kategori buku.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon || "BookOpen"] || BookOpen;

            return (
              <div
                key={cat.id}
                className="bg-surface-container rounded-3xl p-5 border border-outline-variant/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          /{cat.slug}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-surface-container-high border border-outline-variant/30 text-on-surface-variant">
                      #{cat.order}
                    </span>
                  </div>

                  {cat.description && (
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15 text-xs">
                  <span className="font-semibold text-primary">
                    {cat.bookCount} Buku Terdaftar
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      title="Edit kategori"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                      title="Hapus kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto w-full max-w-md my-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-title-md text-lg text-on-surface font-bold">Tambah Kategori Baru</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Kesenian & Musik Tradisional"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Deskripsi Kategori (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Penjelasan singkat ruang lingkup kategori buku..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                    Ikon Kategori
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  >
                    {PRESET_ICONS.map((ico) => (
                      <option key={ico.name} value={ico.name}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
                >
                  {submitting ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setEditingCategory(null)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto w-full max-w-md my-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="font-title-md text-lg text-on-surface font-bold">Edit Kategori</h3>
              </div>
              <button 
                onClick={() => setEditingCategory(null)} 
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Deskripsi Kategori (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                    Ikon Kategori
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  >
                    {PRESET_ICONS.map((ico) => (
                      <option key={ico.name} value={ico.name}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Kategori Buku?"
        message={
          deleteTarget && deleteTarget.bookCount > 0
            ? `Peringatan: Kategori "${deleteTarget?.name}" saat ini memiliki ${deleteTarget?.bookCount} buku terdaftar. Menghapus kategori ini akan memindahkan kategori buku tersebut menjadi 'Umum'. Lanjutkan?`
            : `Apakah Anda yakin ingin menghapus kategori "${deleteTarget?.name}"?`
        }
        confirmLabel="Hapus Kategori"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
