"use client";

import { useEffect, useState } from "react";
import { 
  BookMarked, 
  Plus, 
  Search, 
  QrCode, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  X, 
  BookOpen,
  ArrowRight,
  Phone
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";
import BookCover from "@/components/BookCover";

interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  notes: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    coverUrl?: string | null;
  };
}

export default function AdminCirculationPage() {
  const toast = useToast();
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // New Borrowing Modal
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [userNik, setUserNik] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [borrowDays, setBorrowDays] = useState("7");
  const [borrowNotes, setBorrowNotes] = useState("");
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Return Confirm Modal
  const [returnTarget, setReturnTarget] = useState<BorrowRecord | null>(null);
  const [returning, setReturning] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/circulation");
      const data = await res.json();
      if (data.records) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data sirkulasi buku");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      if (data.books) {
        setAllBooks(data.books);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchBooks();
  }, []);

  const handleCreateBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNik.trim() || !selectedBookId) {
      toast.warning("NIK Warga dan Buku wajib dipilih.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/circulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNikOrId: userNik.trim(),
          bookId: selectedBookId,
          days: borrowDays,
          notes: borrowNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Peminjaman buku fisik berhasil dicatat!");
        setShowBorrowModal(false);
        setUserNik("");
        setSelectedBookId("");
        setBorrowNotes("");
        fetchRecords();
      } else {
        toast.error(data.error || "Gagal mencatat peminjaman.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmReturn = async () => {
    if (!returnTarget) return;

    setReturning(true);
    try {
      const res = await fetch("/api/admin/circulation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId: returnTarget.id,
          action: "RETURN",
        }),
      });

      if (res.ok) {
        toast.success(`Buku "${returnTarget.book.title}" telah ditandai dikembalikan.`);
        setReturnTarget(null);
        fetchRecords();
      } else {
        toast.error("Gagal memperbarui status pengembalian.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setReturning(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.user.name.toLowerCase().includes(search.toLowerCase()) ||
      r.user.email.includes(search) ||
      r.book.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeBorrowedCount = records.filter((r) => r.status === "BORROWED").length;
  const returnedCount = records.filter((r) => r.status === "RETURNED").length;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-container text-on-primary-container">
              <BookMarked className="w-5 h-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
              Sirkulasi Buku Fisik & QR Code
            </h1>
          </div>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
            Pencatatan peminjaman buku fisik perpustakaan Balai Desa Pangkalan secara hybrid.
          </p>
        </div>

        <button
          onClick={() => setShowBorrowModal(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Peminjaman Baru</span>
        </button>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 text-center">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Sedang Dipinjam</span>
          <span className="text-xl font-bold text-primary">{activeBorrowedCount} Buku</span>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 text-center">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Sudah Dikembalikan</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{returnedCount} Buku</span>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Transaksi</span>
          <span className="text-xl font-bold text-on-surface">{records.length} Kali</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari nama warga, NIK, atau judul buku..."
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

        <div className="flex items-center gap-1.5 overflow-x-auto hide-scroll w-full md:w-auto">
          {[
            { id: "ALL", label: "Semua" },
            { id: "BORROWED", label: "Sedang Dipinjam" },
            { id: "RETURNED", label: "Dikembalikan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterStatus === tab.id
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Circulation List */}
      {loading ? (
        <div className="p-12 text-center text-on-surface-variant text-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Memuat data sirkulasi buku...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-surface-container rounded-3xl p-12 text-center border border-outline-variant/20 space-y-2">
          <BookMarked className="w-10 h-10 text-outline-variant mx-auto mb-2" />
          <h3 className="text-base font-bold text-on-surface">Belum ada riwayat peminjaman</h3>
          <p className="text-xs text-on-surface-variant">Klik "Catat Peminjaman Baru" untuk mencatat peminjaman fisik buku pertama.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredRecords.map((item) => {
            const borrowDateStr = new Date(item.borrowDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const dueDateStr = new Date(item.dueDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const isReturned = item.status === "RETURNED";
            const isOverdue = !isReturned && new Date(item.dueDate) < new Date();

            return (
              <div
                key={item.id}
                className="bg-surface-container rounded-3xl p-5 border border-outline-variant/20 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-16 rounded-xl bg-primary-container/20 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                    <BookOpen className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-on-surface">{item.book.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isReturned
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : isOverdue
                          ? "bg-error/15 text-error"
                          : "bg-amber-400/20 text-amber-700 dark:text-amber-300"
                      }`}>
                        {isReturned ? "Sudah Dikembalikan" : isOverdue ? "Terlambat / Jatuh Tempo" : "Sedang Dipinjam"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-primary" />
                        <strong className="text-on-surface">{item.user.name}</strong> ({item.user.email})
                      </span>
                      {item.user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-primary" />
                          {item.user.phone}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-on-surface-variant pt-1">
                      <span>Pinjam: <strong>{borrowDateStr}</strong></span>
                      <span>•</span>
                      <span>Jatuh Tempo: <strong>{dueDateStr}</strong></span>
                      {item.notes && <span>• <em>{item.notes}</em></span>}
                    </div>
                  </div>
                </div>

                <div className="self-end md:self-center shrink-0 flex items-center gap-2">
                  {!isReturned && (
                    <button
                      onClick={() => setReturnTarget(item)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Kembali</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Borrow Record Modal */}
      {showBorrowModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setShowBorrowModal(false)}
        >
          <div 
            className="relative bg-surface-container text-on-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto w-full max-w-lg my-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-title-md text-lg text-on-surface font-bold">Catat Peminjaman Buku Fisik</h3>
              </div>
              <button 
                onClick={() => setShowBorrowModal(false)} 
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBorrow} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  NIK Warga / ID Anggota Digital
                </label>
                <input
                  type="text"
                  required
                  value={userNik}
                  onChange={(e) => setUserNik(e.target.value)}
                  placeholder="Contoh: 3204123456780001 atau Nama Warga"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Pilih Buku Fisik yang Dipinjam
                </label>
                <select
                  required
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                >
                  <option value="">-- Pilih Judul Buku --</option>
                  {allBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.author})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                    Durasi Peminjaman
                  </label>
                  <select
                    value={borrowDays}
                    onChange={(e) => setBorrowDays(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  >
                    <option value="3">3 Hari</option>
                    <option value="7">7 Hari (1 Minggu)</option>
                    <option value="14">14 Hari (2 Minggu)</option>
                    <option value="30">30 Hari (1 Bulan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={borrowNotes}
                    onChange={(e) => setBorrowNotes(e.target.value)}
                    placeholder="Contoh: Rak Pertanian No. 2"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowBorrowModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  {submitting ? "Menyimpan..." : "Catat Peminjaman"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      <ConfirmModal
        isOpen={!!returnTarget}
        title="Konfirmasi Pengembalian Buku?"
        message={`Apakah warga telah mengembalikan buku fisik "${returnTarget?.book.title}" ke rak perpustakaan Balai Desa?`}
        confirmLabel="Ya, Buku Sudah Kembali"
        cancelLabel="Batal"
        isDestructive={false}
        isLoading={returning}
        onConfirm={confirmReturn}
        onCancel={() => setReturnTarget(null)}
      />
    </div>
  );
}
