"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Plus, Trash2, Edit2, AlertCircle, Search, X, BookOpen, Cloud, Star, Eye } from "lucide-react";
import BookCover from "@/components/BookCover";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string | null;
  isOffline: boolean;
  rating: number;
  _count?: {
    chapters: number;
    readers: number;
    bookmarks: number;
  };
}

export default function AdminBooksPage() {
  const toast = useToast();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Edit modal states
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editIsOffline, setEditIsOffline] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<BookItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/books");
      const data = await res.json();
      if (res.ok) {
        setBooks(data.books || []);
      } else {
        toast.error(data.error || "Gagal memuat data buku");
      }
    } catch (err) {
      toast.error("Gagal memuat data buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openEditModal = (book: BookItem) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditDescription(book.description || "");
    setEditCoverUrl(book.coverUrl || "");
    setEditIsOffline(book.isOffline || false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/books/${editingBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          author: editAuthor.trim(),
          category: editCategory,
          description: editDescription.trim(),
          coverUrl: editCoverUrl.trim() || null,
          isOffline: editIsOffline,
        }),
      });

      if (res.ok) {
        toast.success("Informasi buku berhasil diperbarui!");
        setEditingBook(null);
        fetchBooks();
      } else {
        toast.error("Gagal memperbarui buku.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteBook = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/books/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== deleteTarget.id));
        toast.success(`Buku "${deleteTarget.title}" berhasil dihapus.`);
        setDeleteTarget(null);
      } else {
        toast.error("Gagal menghapus buku");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghapus buku");
    } finally {
      setDeleting(false);
    }
  };

  const categories = ["ALL", "Pertanian", "Sejarah", "Ekonomi", "Kesehatan"];

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Kelola Koleksi Buku</h1>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">Daftar semua koleksi buku dan bab bacaan perpustakaan.</p>
        </div>
        <Link 
          href="/admin/books/new" 
          className="bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Buku Baru</span>
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari judul buku atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex overflow-x-auto hide-scroll gap-1.5 pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterCategory === c
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/20"
              }`}
            >
              {c === "ALL" ? "Semua" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface-variant font-medium text-xs uppercase tracking-wider">
                <th className="p-4 w-16">Cover</th>
                <th className="p-4">Judul & Penulis</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Statistik</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant text-sm">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Memuat data buku...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant text-sm">
                    Tidak ada koleksi buku yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="p-4">
                      <div className="w-11 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 border border-outline-variant/20">
                        <BookCover src={book.coverUrl} alt={book.title} title={book.title} category={book.category} />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-on-surface text-sm line-clamp-1">{book.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {book.rating ? Number(book.rating).toFixed(1) : "0.0"}
                        </span>
                        {book.isOffline && (
                          <span className="text-[10px] bg-primary-container/20 text-primary px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1">
                            <Cloud className="w-3 h-3" /> Offline
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface border border-outline-variant/20">
                        {book.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-on-surface space-y-0.5">
                        <p className="font-medium">{book._count?.chapters || 0} Bab</p>
                        <p className="text-on-surface-variant">{book._count?.readers || 0} Pembaca</p>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/books/${book.id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
                          title="Lihat Pratinjau Buku"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/books/${book.id}/chapters`}
                          className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Kelola Bab ({book._count?.chapters || 0})</span>
                        </Link>
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-2 rounded-xl bg-surface-container-high hover:bg-secondary-container/50 text-on-surface transition-colors"
                          title="Edit Informasi Buku"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(book)}
                          className="p-2 rounded-xl bg-surface-container-high hover:bg-error/15 text-on-surface-variant hover:text-error transition-colors"
                          title="Hapus Buku"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Book Modal */}
      {editingBook && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
          onClick={() => setEditingBook(null)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto animate-fade-in-up my-auto"
            style={{ width: "min(92vw, 560px)", maxWidth: "560px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 border-b border-outline-variant/20 pb-3">
              <h3 className="font-title-md text-lg text-on-surface font-bold">Edit Informasi Buku</h3>
              <button 
                onClick={() => setEditingBook(null)} 
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Judul Buku</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Penulis</label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  >
                    <option value="Pertanian">Pertanian</option>
                    <option value="Sejarah">Sejarah</option>
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">URL Sampul (Cover)</label>
                <input
                  type="url"
                  value={editCoverUrl}
                  onChange={(e) => setEditCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Deskripsi Singkat</label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editOffline"
                  checked={editIsOffline}
                  onChange={(e) => setEditIsOffline(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <label htmlFor="editOffline" className="text-xs font-medium text-on-surface cursor-pointer">
                  Tersedia untuk pembacaan offline di desa
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Koleksi Buku?"
        message={`Apakah Anda yakin ingin menghapus buku "${deleteTarget?.title}"? Seluruh bab bacaan, ulasan, dan progres pembaca terkait buku ini akan dihapus secara permanen.`}
        confirmLabel="Hapus Buku"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDeleteBook}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
