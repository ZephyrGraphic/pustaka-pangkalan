"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, Send, User, Award, Flame, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ToastProvider";

interface DiscussionItem {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
    address: string | null;
    badge: string | null;
  };
}

export default function BookDiscussion({ bookId }: { bookId: string }) {
  const { data: session } = useSession();
  const toast = useToast();
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDiscussions = async () => {
    try {
      const res = await fetch(`/api/discussions?bookId=${bookId}`);
      const data = await res.json();
      if (data.discussions) {
        setDiscussions(data.discussions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.warning("Silakan masuk terlebih dahulu untuk ikut curah gagasan.");
      return;
    }

    if (!comment.trim()) {
      toast.warning("Tulis tanggapan atau tips Anda terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, comment: comment.trim(), rating }),
      });

      if (res.ok) {
        toast.success("Gagasan Anda berhasil dibagikan (+15 Poin Literasi)!");
        setComment("");
        fetchDiscussions();
      } else {
        toast.error("Gagal mengirim tanggapan.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-surface-container rounded-3xl p-6 sm:p-7 border border-outline-variant/20 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Ruang Curah Gagasan & Tips Warga ({discussions.length})
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Bagikan pengalaman praktis, hasil penerapan di ladang/usaha, atau ulasan buku ini.
          </p>
        </div>

        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-300 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/20">
          🎁 +15 Poin Tiap Gagasan
        </span>
      </div>

      {/* Input Form */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="bg-surface-container-high/60 p-4 rounded-2xl border border-outline-variant/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Beri Penilaian & Tanggapan:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating ? "fill-amber-500 text-amber-500" : "text-outline-variant/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bagikan tips atau pengalaman Anda setelah membaca buku ini (misal: teknik di bab 2 sangat cocok untuk tanah basah)..."
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="bg-primary hover:bg-primary/90 text-on-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {submitting ? "Mengirim..." : <><Send className="w-3.5 h-3.5" /> Bagikan Gagasan</>}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-surface-container-high/50 p-4 rounded-2xl border border-outline-variant/20 text-center text-xs text-on-surface-variant">
          Silakan masuk terlebih dahulu untuk ikut berbagi pengalaman dan mendapatkan Poin Literasi.
        </div>
      )}

      {/* Discussions List */}
      {loading ? (
        <div className="text-center py-6 text-xs text-on-surface-variant">Memuat tanggapan warga...</div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-8 text-xs text-on-surface-variant space-y-1">
          <p className="font-bold text-on-surface">Belum ada curah gagasan untuk buku ini.</p>
          <p>Jadilah warga pertama yang membagikan tips atau pengalaman membaca!</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {discussions.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-surface-container-high/40 border border-outline-variant/20 hover:bg-surface-container-high transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative bg-surface-container shrink-0 border border-outline-variant/20">
                      {item.user?.image ? (
                        <Image src={item.user.image} alt={item.user.name} fill className="object-cover" />
                      ) : (
                        <User className="w-4 h-4 m-auto text-on-surface-variant mt-2" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-on-surface">{item.user?.name || "Warga"}</span>
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.2 rounded-full">
                          {item.user?.badge || "Warga Pembelajar"}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        {item.user?.address ? item.user.address.split("(")[0] : "Desa Pangkalan"} • {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-bold">{item.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-on-surface leading-relaxed pl-1">
                  &quot;{item.comment}&quot;
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
