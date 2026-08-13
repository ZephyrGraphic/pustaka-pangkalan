"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Pertanian",
    description: "",
    coverUrl: "",
    isOffline: false,
  });

  const categories = ["Pertanian", "Sejarah", "Ekonomi", "Kesehatan"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin/books");
      } else {
        setError(data.error || "Gagal menambah buku");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/books" className="p-2 bg-surface-container rounded-full text-on-surface-variant hover:bg-secondary-container/50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Tambah Buku Baru</h1>
          <p className="text-on-surface-variant mt-1">Masukkan detail buku yang akan ditambahkan ke perpustakaan.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container rounded-2xl border border-outline-variant/30 p-6 shadow-sm space-y-5">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-on-surface">Judul Buku</label>
          <input 
            type="text" 
            required
            className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Contoh: Panduan Budidaya Lele"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Penulis / Penerbit</label>
            <input 
              type="text" 
              required
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Contoh: Kementerian Pertanian"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Kategori</label>
            <select 
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-on-surface">Tautan URL Sampul (Opsional)</label>
          <input 
            type="url" 
            className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
            placeholder="https://contoh.com/gambar.jpg"
            value={formData.coverUrl}
            onChange={(e) => setFormData({...formData, coverUrl: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-on-surface">Sinopsis / Deskripsi</label>
          <textarea 
            required
            rows={4}
            className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            placeholder="Tuliskan deskripsi singkat mengenai buku ini..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-3 pt-2 pb-4">
          <input 
            type="checkbox" 
            id="isOffline"
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-highest"
            checked={formData.isOffline}
            onChange={(e) => setFormData({...formData, isOffline: e.target.checked})}
          />
          <label htmlFor="isOffline" className="text-sm text-on-surface">
            Tandai sebagai tersedia Offline (Centang jika buku ini bisa diunduh)
          </label>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : (
              <>
                <Save className="w-5 h-5" />
                Simpan Buku
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
