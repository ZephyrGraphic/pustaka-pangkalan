"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Save } from "lucide-react";

export default function ChaptersManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = use(params);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for new chapter form
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${bookId}`);
      const data = await res.json();
      if (data.book) setBook(data.book);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const handleDelete = async (chapterId: string) => {
    if (!confirm("Hapus bab ini?")) return;
    
    try {
      const res = await fetch(`/api/admin/chapters/${chapterId}`, { method: "DELETE" });
      if (res.ok) {
        fetchBook();
      }
    } catch (err) {
      alert("Gagal menghapus bab");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/admin/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, title: newTitle, content: newContent }),
      });
      
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        fetchBook();
      } else {
        alert("Gagal menambah bab");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat...</div>;
  if (!book) return <div className="p-8 text-center text-error">Buku tidak ditemukan</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/books" className="p-2 bg-surface-container rounded-full text-on-surface-variant hover:bg-secondary-container/50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Kelola Bab</h1>
          <p className="text-on-surface-variant mt-1">{book.title}</p>
        </div>
      </div>

      <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface-variant font-medium text-sm">
              <th className="p-4 w-16">Urutan</th>
              <th className="p-4">Judul Bab</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {book.chapters.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-on-surface-variant">Belum ada bab untuk buku ini.</td>
              </tr>
            ) : (
              book.chapters.map((chapter: any) => (
                <tr key={chapter.id} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="p-4 text-on-surface-variant font-medium">#{chapter.order}</td>
                  <td className="p-4">
                    <p className="font-bold text-on-surface">{chapter.title}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-1">{chapter.content}</p>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(chapter.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-surface-container rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Tambah Bab Baru
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Judul Bab</label>
            <input 
              type="text" 
              required
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Contoh: Bab 1: Pendahuluan"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Isi Teks Bab</label>
            <textarea 
              required
              rows={8}
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Ketik isi bacaan di sini..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : <><Save className="w-5 h-5" /> Simpan Bab</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
