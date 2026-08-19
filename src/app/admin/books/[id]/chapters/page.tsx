"use client";

import { useEffect, useState, use } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Save, 
  Edit2, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Eye,
  FileText
} from "lucide-react";

interface ChapterItem {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface BookDetail {
  id: string;
  title: string;
  author: string;
  category: string;
  chapters: ChapterItem[];
}

export default function ChaptersManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = use(params);
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // New Chapter Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Chapter Modal State
  const [editingChapter, setEditingChapter] = useState<ChapterItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${bookId}`);
      if (!res.ok) {
        setError("Gagal memuat informasi buku");
        return;
      }
      const data = await res.json();
      const bookObj = data.book || data;
      setBook(bookObj);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat data buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const handleDelete = async (chapterId: string, chapterTitle: string) => {
    if (!confirm(`Hapus ${chapterTitle}? Tindakan ini tidak dapat dibatalkan.`)) return;
    
    try {
      const res = await fetch(`/api/admin/chapters/${chapterId}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMsg("Bab berhasil dihapus.");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchBook();
      } else {
        alert("Gagal menghapus bab.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus bab.");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Judul dan isi bacaan bab wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");
    
    try {
      const res = await fetch(`/api/admin/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookId, 
          title: newTitle.trim(), 
          content: newContent.trim() 
        }),
      });
      
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setSuccessMsg("Bab baru berhasil ditambahkan!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchBook();
      } else {
        const d = await res.json();
        setError(d.error || "Gagal menambah bab baru.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (chapter: ChapterItem) => {
    setEditingChapter(chapter);
    setEditTitle(chapter.title);
    setEditContent(chapter.content || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/chapters/${editingChapter.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      });

      if (res.ok) {
        setEditingChapter(null);
        setSuccessMsg("Perubahan bab berhasil disimpan!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchBook();
      } else {
        alert("Gagal memperbarui bab.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-on-surface-variant">Memuat data koleksi bab...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 text-center max-w-lg mx-auto my-12 space-y-4 shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-on-surface">Buku Tidak Ditemukan</h2>
          <p className="text-xs text-on-surface-variant mt-1">ID buku tidak terdaftar atau telah dihapus.</p>
        </div>
        <Link 
          href="/admin/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi Buku</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-5">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/books" 
            className="p-2.5 bg-surface-container hover:bg-surface-container-high rounded-2xl text-on-surface transition-colors border border-outline-variant/20 shadow-sm"
            title="Kembali ke Daftar Buku"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {book.category}
              </span>
              <span className="text-xs text-on-surface-variant">ID: {book.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">{book.title}</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">Penulis: {book.author}</p>
          </div>
        </div>

        <Link
          href={`/books/${book.id}`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs border border-outline-variant/30 transition-all"
        >
          <Eye className="w-4 h-4 text-primary" />
          <span>Lihat Preview Pembaca</span>
        </Link>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-green-500/15 border border-green-500/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Chapter List Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-title-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Daftar Bab Bacaan ({book.chapters?.length || 0})</span>
          </h2>
        </div>

        <div className="bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface-variant font-medium text-xs uppercase tracking-wider">
                <th className="p-4 w-16 text-center">Urutan</th>
                <th className="p-4">Judul & Cuplikan Materi</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {!book.chapters || book.chapters.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-on-surface-variant text-sm">
                    Belum ada bab bacaan untuk buku ini. Silakan tambahkan bab pertama di formulir bawah.
                  </td>
                </tr>
              ) : (
                book.chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="p-4 text-center">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary inline-flex items-center justify-center font-bold text-xs">
                        #{chapter.order}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-on-surface text-sm">{chapter.title}</p>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 opacity-80 leading-relaxed">
                        {chapter.content || "(Belum ada teks isi bacaan)"}
                      </p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/read/${chapter.id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-surface-container-high hover:bg-primary/15 text-on-surface-variant hover:text-primary transition-colors"
                          title="Baca Bab Ini"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => openEditModal(chapter)} 
                          className="p-2 rounded-xl bg-surface-container-high hover:bg-secondary-container/50 text-on-surface transition-colors"
                          title="Edit Bab"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(chapter.id, chapter.title)} 
                          className="p-2 rounded-xl bg-surface-container-high hover:bg-error/15 text-on-surface-variant hover:text-error transition-colors"
                          title="Hapus Bab"
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

      {/* Add New Chapter Form */}
      <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-outline-variant/20 pb-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Tambah Bab Baru</span>
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Tulis materi bacaan baru untuk melengkapi buku <span className="font-semibold text-primary">{book.title}</span>.
          </p>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
              Judul Bab
            </label>
            <input 
              type="text" 
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner"
              placeholder="Contoh: Bab 1: Pengantar dan Konsep Dasar"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Isi Bacaan Digital (Teks Lengkap)
              </label>
              <span className="text-[11px] text-on-surface-variant">
                {newContent.length} Karakter
              </span>
            </div>
            <textarea 
              required
              rows={9}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner leading-relaxed font-sans"
              placeholder="Ketik atau tempel teks materi bacaan bab di sini secara terstruktur..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-on-primary px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50 active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan & Terbitkan Bab</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Chapter Modal */}
      {editingChapter && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
          onClick={() => setEditingChapter(null)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto animate-fade-in-up my-auto"
            style={{ width: "min(92vw, 620px)", maxWidth: "620px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                  #{editingChapter.order}
                </div>
                <h3 className="font-title-md text-lg text-on-surface font-bold">Edit Bab Bacaan</h3>
              </div>
              <button 
                onClick={() => setEditingChapter(null)} 
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Judul Bab
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Isi Materi Bacaan
                </label>
                <textarea
                  required
                  rows={10}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingChapter(null)}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                >
                  {updating ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
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
