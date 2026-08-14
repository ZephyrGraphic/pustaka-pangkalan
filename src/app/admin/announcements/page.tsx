"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Bell, Trash2, Edit2, Check, X } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Warta Desa");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("Warta Desa");
    setActive(true);
    setShowModal(true);
  };

  const openEditModal = (item: Announcement) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category);
    setActive(item.active);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        // Edit
        await fetch(`/api/announcements/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, category, active }),
        });
      } else {
        // Create
        await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, category, active }),
        });
      }

      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      console.error("Gagal menyimpan warta:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;

    try {
      await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });
      fetchAnnouncements();
    } catch (err) {
      console.error("Gagal menghapus warta:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Warta & Kabar Desa</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Kelola pengumuman, sosialisasi, dan kabar kegiatan literasi desa.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Warta Baru</span>
        </button>
      </div>

      {/* Announcements Table / List */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant">Memuat data warta...</div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            Belum ada warta desa yang diterbitkan.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {announcements.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-high/50 transition-colors">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary-container/30 text-primary">
                      {item.category}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                    {item.active ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Aktif
                      </span>
                    ) : (
                      <span className="text-xs text-on-surface-variant">Nonaktif</span>
                    )}
                  </div>
                  <h3 className="font-title-md text-base text-on-surface font-semibold">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-on-surface transition-colors"
                    title="Edit Warta"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-error-container/30 hover:bg-error-container/60 text-error transition-colors"
                    title="Hapus Warta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 animate-fade-in-up my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-title-md text-lg text-on-surface font-bold">
                {editingId ? "Edit Warta Desa" : "Terbitkan Warta Baru"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1.5">
                  Judul Warta
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Pembagian Bibit Padi Unggul..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Warta Desa">Warta Desa</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Bansos & Layanan">Bansos & Layanan</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span className="text-xs font-medium text-on-surface">Publikasikan</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1.5">
                  Isi Pengumuman
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan detail pengumuman untuk warga di sini..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-surface-container-highest text-on-surface rounded-xl font-title-md text-sm hover:bg-surface-variant transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Warta"}
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
