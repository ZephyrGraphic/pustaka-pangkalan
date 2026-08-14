"use client";

import { Star, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string };
}

export default function BookReviews({ bookId }: { bookId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?bookId=${bookId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
        setAvgRating(data.averageRating);
        setTotalReviews(data.totalReviews);

        // Check if user already reviewed
        if (session?.user) {
          const myReview = data.reviews.find(
            (r: Review) => r.user.name === session.user?.name
          );
          if (myReview) {
            setMyRating(myReview.rating);
            setComment(myReview.comment || "");
            setSubmitted(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId, session]);

  const handleSubmit = async () => {
    if (myRating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, rating: myRating, comment: comment || null }),
      });
      if (res.ok) {
        setSubmitted(true);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate star distribution
  const starCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-6">
      
      {/* Rating Breakdown & Average */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex flex-col md:flex-row gap-6 items-center">
        <div className="text-center md:text-left shrink-0 md:pr-6 md:border-r border-outline-variant/20">
          <p className="text-5xl font-bold text-on-surface">{avgRating ? avgRating.toFixed(1) : "-"}</p>
          <div className="flex justify-center md:justify-start gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= Math.round(avgRating) ? "text-amber-500 fill-amber-500" : "text-outline-variant"}`}
              />
            ))}
          </div>
          <p className="text-xs text-on-surface-variant font-medium">Berdasarkan {totalReviews} ulasan pembaca</p>
        </div>

        {/* Star Progress Bars */}
        <div className="flex-1 w-full space-y-1.5">
          {starCounts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-3 font-semibold text-on-surface text-right">{star}</span>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-on-surface-variant text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Review Form */}
      {session?.user ? (
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/20">
          <p className="font-title-md text-sm font-bold text-on-surface mb-2">
            {submitted ? "Ulasan Anda untuk Buku Ini" : "Beri Nilai & Ulasan"}
          </p>
          <div className="flex gap-1.5 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => { setMyRating(star); setSubmitted(false); }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 p-1"
                aria-label={`Beri bintang ${star}`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoverRating || myRating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-outline-variant hover:text-amber-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {!submitted ? (
            <div className="space-y-3">
              <textarea
                rows={3}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                placeholder="Tuliskan pengalaman atau ringkasan manfaat membaca buku ini..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting || myRating === 0}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-title-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-primary font-medium">Ulasan Anda telah tersimpan.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs text-on-surface-variant hover:text-primary underline"
              >
                Ubah Ulasan
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 text-center text-xs text-on-surface-variant">
          Silakan masuk ke akun warga untuk memberikan penilaian dan ulasan pada buku ini.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => {
          const initials = review.user.name
            ? review.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
            : "W";

          return (
            <div key={review.id} className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center">
                    {initials}
                  </div>
                  <div>
                    <p className="font-title-md text-sm font-semibold text-on-surface">{review.user.name}</p>
                    <p className="text-[11px] text-on-surface-variant">
                      {new Date(review.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= review.rating ? "text-amber-500 fill-amber-500" : "text-outline-variant"}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-on-surface-variant leading-relaxed pl-10">
                  {review.comment}
                </p>
              )}
            </div>
          );
        })}
        {reviews.length === 0 && (
          <div className="text-center py-8 bg-surface-container rounded-2xl border border-outline-variant/20">
            <MessageSquare className="w-8 h-8 text-outline-variant mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant">Belum ada ulasan untuk buku ini. Jadilah pembaca pertama yang mengulas!</p>
          </div>
        )}
      </div>
    </div>
  );
}
