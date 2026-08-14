"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Plus, Trash2, Edit2, AlertCircle, Search, X, BookOpen, Cloud, Star } from "lucide-react";
import BookCover from "@/components/BookCover";

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
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/books");
      const data = await res.json();
      if (res.ok) {
        setBooks(data.books);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Gagal memuat data buku");
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
          title: editTitle,
          author: editAuthor,
          category: editCategory,
          description: editDescription,
          coverUrl: editCoverUrl || null,
          isOffline: editIsOffline,
        }),
      });

      if (res.ok) {
        setEditingBook(null);
        fetchBooks();
      } else {
        alert("Gagal memperbarui buku.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus buku "${title}" secara permanen? Semua bab dan progres pembaca akan terhapus.`)) return;

    try {
      const res = await fetch(`/api/admin/books/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== id));
      } else {
        alert("Gagal menghapus buku");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Kelola Koleksi Buku</h1>
          <p className="text-on-surface-variant text-sm mt-1">Daftar semua koleksi buku dan bab bacaan perpustakaan.</p>
        </div>
        <Link 
          href="/admin/books/new" 
          className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-title-md text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Buku Baru</span>
        </Link>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul buku atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex overflow-x-auto hide-scroll gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                filterCategory === cat
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
              }`}
            >
              {cat === "ALL" ? "Semua" : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-on-surface-variant">Memuat data buku...</div>
      ) : (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface-variant font-medium text-xs uppercase tracking-wider">
                  <th className="p-4 w-16">Cover</th>
                  <th className="p-4">Judul & Penulis</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Statistik</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                      Tidak ada buku yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-16 relative rounded-xl overflow-hidden shadow-sm">
                          <BookCover
                            src={book.coverUrl}
                            alt={book.title}
                            title={book.title}
                            category={book.category}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-on-surface text-sm line-clamp-1">{book.title}</p>
                        <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{book.author}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                            <Star className="w-3 h-3 fill-current" /> {book.rating ? Number(book.rating).toFixed(1) : "0.0"}
                          </span>
                          {book.isOffline && (
                            <span className="flex items-center gap-0.5 text-[10px] text-primary bg-primary-container/20 px-1.5 py-0.5 rounded">
                              <Cloud className="w-3 h-3" /> Offline
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-secondary-container text-on-secondary-container text-xs px-2.5 py-1 rounded-full font-medium">
                          {book.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-xs text-on-surface-variant gap-1">
                          <span className="font-medium text-on-surface">{book._count?.chapters || 0} Bab</span>
                          <span>{book._count?.readers || 0} Pembaca</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/books/${book.id}/chapters`} 
                            className="px-3 py-1.5 bg-primary-container text-on-primary-container rounded-xl text-xs font-semibold hover:bg-primary-container/80 transition-colors shadow-sm"
                          >
                            Kelola Bab ({book._count?.chapters || 0})
                          </Link>
                          <button 
                            onClick={() => openEditModal(book)}
                            className="p-2 rounded-xl bg-surface-container-highest hover:bg-surface-variant text-on-surface transition-colors"
                            title="Edit Buku"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(book.id, book.title)} 
                            className="p-2 rounded-xl bg-error-container/30 hover:bg-error-container/60 text-error transition-colors"
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
      )}

      {/* Edit Book Modal */}
      {editingBook && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
          onClick={() => setEditingBook(null)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto animate-fade-in-up my-auto"
            style={{ width: "min(92vw, 520px)", maxWidth: "520px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title-md text-lg text-on-surface font-bold">Edit Informasi Buku</h3>
              <button onClick={() => setEditingBook(null)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface" aria-label="Tutup">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Judul Buku</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Penulis</label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Pertanian">Pertanian</option>
                    <option value="Sejarah & Budaya">Sejarah & Budaya</option>
                    <option value="Kewirausahaan">Kewirausahaan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">URL Gambar Sampul (Opsional)</label>
                <input
                  type="url"
                  value={editCoverUrl}
                  onChange={(e) => setEditCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsOffline"
                  checked={editIsOffline}
                  onChange={(e) => setEditIsOffline(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <label htmlFor="editIsOffline" className="text-sm font-medium text-on-surface">
                  Tersedia untuk Dibaca Offline
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 py-3 bg-surface-container-highest text-on-surface rounded-xl font-title-md text-sm hover:bg-surface-variant transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
