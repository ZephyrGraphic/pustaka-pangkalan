"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star, Trash2, Search, ArrowUpDown, X, BookOpen, User, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookCover from "@/components/BookCover";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterRating, search]);

  const handleDeleteReview = async (reviewId: string, bookTitle: string) => {
    if (!confirm(`Hapus ulasan ini untuk buku "${bookTitle}"? Tindakan ini akan memperbarui rata-rata rating buku secara otomatis.`)) {
      return;
    }

    setDeletingId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setToastMessage("Ulasan berhasil dihapus.");
        setTimeout(() => setToastMessage(null), 4000);
        fetchReviews();
      } else {
        alert(data.error || "Gagal menghapus ulasan.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const totalReviewsCount = reviews.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

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
            Pantau dan bersihkan ulasan/komentar warga untuk menjaga etika ruang baca digital Desa Pangkalan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30 text-center px-4">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Ulasan</span>
            <span className="text-lg font-bold text-primary">{totalReviewsCount}</span>
          </div>
          <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30 text-center px-4">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Rata-rata Rating</span>
            <span className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-500" />
              {avgRating}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center bg-surface-container-high rounded-2xl px-4 py-2.5 border border-outline-variant/30 focus-within:border-primary">
            <Search className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Cari komentar, nama warga, atau judul buku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs sm:text-sm text-on-surface w-full placeholder:text-on-surface-variant/70"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-on-surface-variant hover:text-on-surface p-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Rating Filter Pills */}
          <div className="flex overflow-x-auto hide-scroll gap-1.5 shrink-0">
            {["ALL", "5", "4", "3", "2", "1"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  filterRating === r
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest"
                }`}
              >
                {r === "ALL" ? "Semua Bintang" : `${r} ⭐`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-surface-container rounded-3xl p-12 text-center border border-outline-variant/20 space-y-3">
          <MessageSquare className="w-10 h-10 text-outline-variant mx-auto mb-2" />
          <h3 className="text-base font-bold text-on-surface">Tidak ada ulasan yang sesuai</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Belum ada ulasan dari pembaca untuk filter atau kata kunci pencarian saat ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const formattedDate = new Date(review.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={review.id}
                className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start justify-between gap-4"
              >
                {/* Book & User Information */}
                <div className="flex items-start gap-4 flex-1">
                  <Link href={`/books/${review.book.id}`} className="relative w-16 h-22 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-outline-variant/20 block">
                    <BookCover
                      src={review.book.coverUrl}
                      alt={review.book.title}
                      title={review.book.title}
                      category={review.book.category}
                    />
                  </Link>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link 
                        href={`/books/${review.book.id}`}
                        className="text-xs sm:text-sm font-bold text-on-surface hover:text-primary transition-colors line-clamp-1"
                      >
                        {review.book.title}
                      </Link>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container font-bold uppercase">
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
                    onClick={() => handleDeleteReview(review.id, review.book.title)}
                    disabled={deletingId === review.id}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-error/10 hover:bg-error/20 text-error text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === review.id ? "Menghapus..." : "Hapus Ulasan"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
