"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, BookmarkPlus, BookmarkCheck, ChevronLeft, Star, Users, Download, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BookReviews from "@/components/BookReviews";
import BookDiscussion from "@/components/BookDiscussion";
import ShareModal from "@/components/ShareModal";
import BookCover from "@/components/BookCover";
import { saveBookOffline, removeBookOffline, isBookDownloaded, OfflineBook } from "@/lib/offlineStorage";
import { useToast } from "@/components/ToastProvider";

interface Chapter {
  id: string;
  title: string;
  order: number;
  content?: string;
}

interface BookDetail {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string | null;
  category: string;
  rating: number;
  chapters: Chapter[];
  isBookmarked: boolean;
  _count: {
    readers: number;
  };
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { data: session } = useSession();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarking, setBookmarking] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      fetchBook();
      isBookDownloaded(params.id as string).then(setIsDownloaded);
    }
  }, [params.id]);

  const handleBookmark = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    setBookmarking(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book?.id }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setBook(prev => prev ? { ...prev, isBookmarked: data.bookmarked } : prev);
        toast.success(data.bookmarked ? "Disimpan ke rak buku Anda!" : "Dihapus dari rak buku.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setBookmarking(false);
    }
  };

  const handleToggleOfflineDownload = async () => {
    if (!book) return;

    if (isDownloaded) {
      await removeBookOffline(book.id);
      setIsDownloaded(false);
      toast.info(`Buku "${book.title}" dihapus dari memori offline perangkat.`);
      return;
    }

    setDownloading(true);
    try {
      // Fetch full book with all chapter contents for offline storage
      const res = await fetch(`/api/books/${book.id}`);
      const fullData = await res.json();
      const bookData = fullData.book || fullData;

      const offlinePayload: OfflineBook = {
        id: bookData.id,
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        description: bookData.description,
        coverUrl: bookData.coverUrl,
        downloadedAt: Date.now(),
        chapters: (bookData.chapters || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          content: c.content || "",
          order: c.order,
        })),
      };

      await saveBookOffline(offlinePayload);
      setIsDownloaded(true);
      toast.success(`Buku "${book.title}" berhasil diunduh! Siap dibaca tanpa internet.`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunduh isi buku.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-16 bg-surface-container rounded-3xl border border-outline-variant/20 p-8 space-y-3">
        <h2 className="text-lg font-bold text-error">Buku tidak ditemukan</h2>
        <p className="text-xs text-on-surface-variant">Buku mungkin telah dihapus atau URL tidak valid.</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pb-16 space-y-8 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors border border-outline-variant/20 shadow-sm"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5 text-on-surface" />
          </button>
          <span className="font-title-md text-sm font-bold text-on-surface truncate">
            Detail Buku
          </span>
        </div>

        {/* Offline Download Status Badge */}
        {isDownloaded && (
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Tersimpan Offline</span>
          </span>
        )}
      </div>

      {/* Book Cover and Info */}
      <section className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start bg-surface-container rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-sm">
        <div className="w-48 h-64 md:w-60 md:h-80 shrink-0 relative rounded-2xl overflow-hidden shadow-md">
          <BookCover 
            src={book.coverUrl} 
            alt={book.title} 
            title={book.title} 
            category={book.category} 
          />
        </div>
        
        <div className="flex flex-col justify-center text-center md:text-left flex-1 space-y-4">
          <div>
            <span className="inline-block px-3 py-1 bg-primary text-on-primary font-bold text-[10px] uppercase tracking-wider rounded-lg mb-2">
              {book.category}
            </span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-on-surface font-bold leading-tight">
              {book.title}
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
              Karya {book.author}
            </p>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 py-2 border-y border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-title-md text-sm font-bold text-on-surface">
                {book.rating ? Number(book.rating).toFixed(1) : "0.0"}
              </span>
            </div>
            <div className="w-px h-5 bg-outline-variant/30"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-body-md text-xs font-semibold text-on-surface">{book._count?.readers || 0} Pembaca</span>
            </div>
            <div className="w-px h-5 bg-outline-variant/30"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-body-md text-xs font-semibold text-on-surface">{book.chapters.length} Bab</span>
            </div>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full pt-1">
            {book.chapters.length > 0 ? (
              <Link 
                href={`/read/${book.chapters[0].id}`}
                className="flex-1 bg-primary hover:bg-primary/90 text-on-primary py-3 rounded-2xl font-title-md text-sm font-bold text-center transition-all shadow-md shadow-primary/20 flex items-center justify-center"
              >
                Mulai Membaca
              </Link>
            ) : (
              <button disabled className="flex-1 bg-surface-container-high text-on-surface-variant/50 py-3 rounded-2xl font-title-md text-sm font-bold text-center cursor-not-allowed">
                Belum Ada Isi Bab
              </button>
            )}

            {/* Offline Download Button */}
            <button
              onClick={handleToggleOfflineDownload}
              disabled={downloading}
              title={isDownloaded ? "Hapus dari Penyimpanan Offline" : "Unduh untuk Dibaca Tanpa Internet"}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shrink-0 ${
                isDownloaded
                  ? "bg-emerald-700 text-white border-emerald-700 hover:bg-red-600 hover:border-red-600"
                  : "bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high"
              }`}
              aria-label="Unduh Offline"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : isDownloaded ? (
                <Check className="w-5 h-5" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            {/* Bookmark Button */}
            <button 
              onClick={handleBookmark}
              disabled={bookmarking}
              title={book.isBookmarked ? "Hapus dari Simpanan" : "Simpan ke Rak Buku"}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shrink-0 ${
                book.isBookmarked 
                  ? "bg-primary text-on-primary border-primary" 
                  : "bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high"
              }`}
              aria-label="Bookmark Buku"
            >
              {book.isBookmarked ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <BookmarkPlus className="w-5 h-5" />
              )}
            </button>
            <ShareModal bookTitle={book.title} bookAuthor={book.author} bookId={book.id} />
          </div>
        </div>
      </section>

      {/* Synopsis */}
      <section className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/20 space-y-2">
        <h3 className="font-title-md text-base font-bold text-on-surface">Sinopsis & Ringkasan</h3>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {book.description}
        </p>
      </section>

      {/* Chapters List */}
      <section className="space-y-3">
        <h3 className="font-title-md text-base font-bold text-on-surface">Daftar Isi & Bab ({book.chapters.length})</h3>
        <div className="bg-surface-container border border-outline-variant/20 rounded-3xl overflow-hidden divide-y divide-outline-variant/15 shadow-sm">
          {book.chapters.length > 0 ? (
            book.chapters.map((chapter) => (
              <Link 
                key={chapter.id} 
                href={`/read/${chapter.id}`}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-surface-container-high transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {chapter.order}
                  </div>
                  <span className="font-body-md text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {chapter.title}
                  </span>
                </div>
                <BookOpen className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-on-surface-variant">
              Isi bab belum ditambahkan oleh pustakawan desa.
            </div>
          )}
        </div>
      </section>

      {/* Community Discussions & Practical Tips */}
      <BookDiscussion bookId={book.id} />

      {/* Reviews Section */}
      <section className="space-y-3">
        <h3 className="font-title-md text-base font-bold text-on-surface">Ulasan & Resensi Warga</h3>
        <BookReviews bookId={book.id} />
      </section>
    </div>
  );
}
