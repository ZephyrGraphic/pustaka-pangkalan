"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [contentType, setContentType] = useState("BOOK");
  const [publicationYear, setPublicationYear] = useState(new Date().getFullYear().toString());
  const [license, setLicense] = useState("VILLAGE_OWNED");
  const [coverUrl, setCoverUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [status, setStatus] = useState("PUBLISHED");

  useEffect(() => {
    fetch("/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0) {
            setCategoryId(data.data[0].id);
          }
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId) {
      alert("Judul dan Kategori wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/admin/contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          categoryId,
          contentType,
          publicationYear: parseInt(publicationYear, 10) || null,
          license,
          coverUrl: coverUrl.trim() || null,
          pdfUrl: pdfUrl.trim() || null,
          status,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Buku/Dokumen berhasil ditambahkan!");
        router.push("/admin/contents");
      } else {
        alert("Gagal menambahkan: " + result.message);
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Unggah Koleksi Digital Baru</h1>
        <p className="text-sm text-slate-400">Isi metadata buku/modul dan cantumkan URL file digital (PDF & Cover)</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Judul */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Judul Koleksi *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Belajar Bertani Organik"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Kategori Utama *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon || "📚"} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tipe Konten */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Tipe Konten</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="BOOK">📖 Buku E-Book</option>
              <option value="MODULE">📑 Modul Keterampilan</option>
              <option value="LOCAL_HISTORY">🏛️ Sejarah Desa</option>
              <option value="DOCUMENT">📄 Arsip Dokumen</option>
              <option value="LOCAL_CULTURE">🎨 Budaya Lokal</option>
            </select>
          </div>

          {/* Tahun Terbit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Tahun Terbit</label>
            <input
              type="number"
              placeholder="2026"
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Lisensi */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Lisensi Hak Cipta</label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="VILLAGE_OWNED">Milik Desa (Village Owned)</option>
              <option value="OPEN_LICENSE">Lisensi Terbuka (Open License)</option>
              <option value="PUBLIC_DOMAIN">Domain Publik</option>
              <option value="AUTHOR_PERMISSION">Izin Penulis</option>
            </select>
          </div>

          {/* URL Cover Thumbnail */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">URL Cover Thumbnail (Gambar 300x450 px)</label>
            <input
              type="url"
              placeholder="https://storage.desa.id/covers/bertani.jpg"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* URL File PDF */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">URL File Digital PDF</label>
            <input
              type="url"
              placeholder="https://storage.desa.id/documents/bertani.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Deskripsi */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Sinopsis / Ringkasan Deskripsi</label>
            <textarea
              rows={4}
              placeholder="Tuliskan gambaran isi buku atau modul ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Status Publikasi</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="PUBLISHED">🟢 Terbitkan Langsung (PUBLISHED)</option>
              <option value="DRAFT">🟡 Simpan Draf (DRAFT)</option>
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Koleksi"}
          </button>
        </div>
      </form>
    </div>
  );
}
