"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star, Trash2, Search, X, BookOpen, User, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<string>("ALL");

  // Confirm delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; bookTitle: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let url = "/api/admin/reviews?";
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (filterRating !== "ALL") url += `rating=${filterRating}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
      } else {
        toast.error("Gagal memuat daftar ulasan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat ulasan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterRating, search]);

  const confirmDeleteReview = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Ulasan untuk buku "${deleteTarget.bookTitle}" berhasil dihapus.`);
        setDeleteTarget(null);
        fetchReviews();
      } else {
        toast.error(data.error || "Gagal menghapus ulasan.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setDeleting(false);
    }
  };

  const totalReviewsCount = reviews.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      {/* Page Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-container text-on-primary-container">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Moderasi Ulasan Pembaca</h1>
          </div>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
            Pantau dan kelola ulasan warga untuk menjaga etika ruang baca digital Desa Pangkalan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30 text-center px-4">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Ulasan</span>
            <span className="text-lg font-bold text-primary">{totalReviewsCount}</span>
          </div>
          <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30 text-center px-4">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Rata-Rata</span>
            <span className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-500" />
              {avgRating}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari komentar, judul buku, atau nama warga..."
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

        {/* Rating Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scroll w-full md:w-auto">
          {["ALL", "5", "4", "3", "2", "1"].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterRating === star
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest"
              }`}
            >
              {star === "ALL" ? "Semua Bintang" : `⭐ ${star}`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="p-12 text-center text-on-surface-variant text-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Memuat data ulasan pembaca...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-surface-container rounded-3xl p-12 text-center border border-outline-variant/20 space-y-2">
          <MessageSquare className="w-10 h-10 text-outline-variant mx-auto mb-2" />
          <h3 className="text-base font-bold text-on-surface">Tidak ada ulasan yang ditemukan</h3>
          <p className="text-xs text-on-surface-variant">Belum ada ulasan atau tidak ada yang sesuai dengan filter saat ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const formattedDate = new Date(review.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={review.id}
                className="bg-surface-container rounded-3xl p-5 border border-outline-variant/20 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Book Cover Thumbnail */}
                  <Link href={`/books/${review.book.id}`} className="shrink-0 group">
                    <div className="w-12 h-16 rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 group-hover:scale-105 transition-transform">
                      <BookCover
                        src={review.book.coverUrl}
                        alt={review.book.title}
                        title={review.book.title}
                        category={review.book.category}
                      />
                    </div>
                  </Link>

                  {/* Review Detail */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/books/${review.book.id}`} className="font-bold text-sm text-on-surface hover:text-primary transition-colors">
                        {review.book.title}
                      </Link>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-semibold">
                        {review.book.category}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= review.rating ? "fill-amber-500 text-amber-500" : "text-outline-variant/40"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-on-surface">{review.rating}.0</span>
                      <span className="text-[11px] text-on-surface-variant">• {formattedDate}</span>
                    </div>

                    {/* Review Comment Content */}
                    <p className="text-xs sm:text-sm text-on-surface bg-surface-container-lowest/60 p-3 rounded-2xl border border-outline-variant/15 leading-relaxed mt-1">
                      &quot;{review.comment}&quot;
                    </p>

                    {/* Author/User info */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-on-surface-variant">
                      <div className="w-5 h-5 rounded-full overflow-hidden relative bg-surface-container-high shrink-0">
                        {review.user?.image ? (
                          <Image src={review.user.image} alt={review.user.name} fill className="object-cover" />
                        ) : (
                          <User className="w-3.5 h-3.5 m-auto text-on-surface-variant" />
                        )}
                      </div>
                      <span className="font-semibold text-on-surface">{review.user?.name || "Warga Anonim"}</span>
                      <span className="text-[11px] text-on-surface-variant font-mono">({review.user?.email || "NIK Tidak Tersedia"})</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="self-end md:self-center shrink-0">
                  <button
                    onClick={() => setDeleteTarget({ id: review.id, bookTitle: review.book.title })}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-error/10 hover:bg-error/20 text-error text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Ulasan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Ulasan Pembaca?"
        message={`Apakah Anda yakin ingin menghapus ulasan untuk buku "${deleteTarget?.bookTitle}"? Tindakan ini akan menghitung ulang rata-rata rating buku secara otomatis.`}
        confirmLabel="Hapus Ulasan"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDeleteReview}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
