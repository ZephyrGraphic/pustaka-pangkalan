"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Bell, Trash2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const toast = useToast();
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

  // Confirm delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      toast.error("Gagal memuat warta desa");
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
        const res = await fetch(`/api/announcements/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, category, active }),
        });
        if (res.ok) {
          toast.success("Warta desa berhasil diperbarui!");
        } else {
          toast.error("Gagal memperbarui warta.");
        }
      } else {
        // Create
        const res = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, category, active }),
        });
        if (res.ok) {
          toast.success("Warta desa baru berhasil diterbitkan!");
        } else {
          toast.error("Gagal menerbitkan warta.");
        }
      }

      setShowModal(false);
      fetchAnnouncements();
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
      const res = await fetch(`/api/announcements/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`Warta "${deleteTarget.title}" berhasil dihapus.`);
        setDeleteTarget(null);
        fetchAnnouncements();
      } else {
        toast.error("Gagal menghapus warta.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Warta & Kabar Desa</h1>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
            Kelola pengumuman, sosialisasi, dan kabar kegiatan literasi desa.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Warta Baru</span>
        </button>
      </div>

      {/* Announcements Table / List */}
      <div className="bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Memuat data warta...
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant space-y-2">
            <Bell className="w-10 h-10 text-outline-variant mx-auto mb-2" />
            <p className="text-sm font-bold text-on-surface">Belum ada warta desa yang diterbitkan.</p>
            <p className="text-xs">Klik tombol "Tambah Warta Baru" untuk membuat pengumuman pertama.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {announcements.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-high/40 transition-colors">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary border border-primary/20">
                      {item.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      item.active ? "bg-green-500/10 text-green-700 dark:text-green-300" : "bg-surface-container-high text-on-surface-variant"
                    }`}>
                      {item.active ? "Aktif / Ditampilkan" : "Diarsipkan"}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{item.content}</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl bg-surface-container-high hover:bg-secondary-container/50 text-on-surface transition-colors"
                    title="Edit Warta"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-xl bg-surface-container-high hover:bg-error/15 text-on-surface-variant hover:text-error transition-colors"
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
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto animate-fade-in-up my-auto"
            style={{ width: "min(92vw, 560px)", maxWidth: "560px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 border-b border-outline-variant/20 pb-3">
              <h3 className="font-title-md text-lg text-on-surface font-bold">
                {editingId ? "Edit Warta Desa" : "Tambah Warta Baru"}
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
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Judul Warta</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Sosialisasi Literasi Digital Desa Pangkalan"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                >
                  <option value="Warta Desa">Warta Desa</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Perpustakaan">Perpustakaan</option>
                  <option value="Ekonomi">Ekonomi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">Isi Warta / Pengumuman</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis detail informasi pengumuman di sini..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="annActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <label htmlFor="annActive" className="text-xs font-medium text-on-surface cursor-pointer">
                  Tampilkan di beranda (Status Aktif)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  {submitting ? "Menyimpan..." : "Simpan Warta"}
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
        title="Hapus Warta Desa?"
        message={`Apakah Anda yakin ingin menghapus warta "${deleteTarget?.title}"? Pengumuman ini tidak akan ditampilkan lagi kepada warga.`}
        confirmLabel="Hapus Warta"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
