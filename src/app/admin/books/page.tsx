"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini? Semua bab, progres baca, dan bookmark warga terkait buku ini akan ikut terhapus secara permanen.")) return;

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Kelola Buku</h1>
          <p className="text-on-surface-variant mt-1">Daftar semua koleksi buku yang tersedia di perpustakaan.</p>
        </div>
        <Link 
          href="/admin/books/new" 
          className="bg-primary text-on-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Buku
        </Link>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-on-surface-variant">Memuat data buku...</div>
      ) : (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface-variant font-medium text-sm">
                  <th className="p-4 w-16">Cover</th>
                  <th className="p-4">Judul & Penulis</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Statistik</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                      Belum ada koleksi buku.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-16 relative bg-surface-container-highest rounded border border-outline-variant/20 overflow-hidden">
                          {book.coverUrl ? (
                            <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">No Cover</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-on-surface line-clamp-1">{book.title}</p>
                        <p className="text-sm text-on-surface-variant line-clamp-1">{book.author}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-secondary-container text-on-secondary-container text-xs px-2 py-1 rounded-full font-medium">
                          {book.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-xs text-on-surface-variant gap-1">
                          <span>{book._count?.chapters || 0} Bab</span>
                          <span>{book._count?.readers || 0} Pembaca</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/books/${book.id}/chapters`} className="px-3 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-lg text-sm font-medium hover:bg-tertiary-container/80 transition-colors">
                            Kelola Bab
                          </Link>
                          {/* <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                            <Edit className="w-4 h-4" />
                          </button> */}
                          <button onClick={() => handleDelete(book.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
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
    </div>
  );
}
