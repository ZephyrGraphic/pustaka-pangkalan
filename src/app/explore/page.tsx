"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, X, Cloud, Star, Bookmark, BookmarkCheck, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import BookCover from "@/components/BookCover";

type SortOption = "latest" | "rating" | "readers" | "title";

import AksaraSundaConverter from "@/components/AksaraSundaConverter";

function ExploreContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("q") || "";

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = "/api/books?";
        if (category && category !== "Semua") url += `category=${encodeURIComponent(category)}&`;
        if (search) url += `search=${encodeURIComponent(search)}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.books) {
          setBooks(data.books);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, search]);

  // Fetch bookmarks if logged in
  useEffect(() => {
    if (session?.user) {
      fetch("/api/bookmarks")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setBookmarkedIds(data.map((b: any) => b.bookId));
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const handleToggleBookmark = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      alert("Silakan login terlebih dahulu untuk menyimpan buku.");
      return;
    }

    const isBookmarked = bookmarkedIds.includes(bookId);
    // Optimistic update
    setBookmarkedIds((prev) =>
      isBookmarked ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );

    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["Semua", "Pertanian", "Sejarah", "Ekonomi", "Kesehatan"];

  const filteredBooks = books.filter((book) => {
    if (offlineOnly && !book.isOffline) return false;
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "readers") return (b._count?.readers || 0) - (a._count?.readers || 0);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
          Katalog Pengetahuan Desa
        </h1>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
          Temukan e-book pertanian, wirausaha desa, kesehatan, dan sastra budaya Sunda.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari judul, penulis, atau kata kunci modul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto hide-scroll gap-2 pb-1 -mx-margin px-margin md:mx-0 md:px-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c === "Semua" ? "" : c)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                (c === "Semua" && !category) || category === c
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-on-surface-variant">Memuat koleksi buku...</div>
      ) : sortedBooks.length === 0 ? (
        <div className="bg-surface-container rounded-3xl p-10 text-center border border-outline-variant/20 space-y-2">
          <p className="font-bold text-sm text-on-surface">Tidak ada buku yang sesuai</p>
          <p className="text-xs text-on-surface-variant">Coba gunakan kata kunci pencarian atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedBooks.map((book) => {
            const isSaved = bookmarkedIds.includes(book.id);
            return (
              <Link key={book.id} href={`/books/${book.id}`} className="group">
                <article className="bg-surface-container rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm hover:-translate-y-1.5 transition-all p-3 flex flex-col h-full">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2.5">
                    <BookCover
                      src={book.coverUrl}
                      alt={book.title}
                      title={book.title}
                      category={book.category}
                    />
                    {book.isOffline && (
                      <div className="absolute top-2 left-2 bg-primary-container text-on-primary-container p-1 rounded-full shadow-sm">
                        <Cloud className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{book.category}</span>
                      <h3 className="font-title-md text-xs sm:text-sm font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors mt-0.5">
                        {book.title}
                      </h3>
                      <p className="font-body-md text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                        {book.author}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20 mt-2">
                      <div className="flex items-center gap-1 text-on-surface">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-label-md text-xs font-bold">
                          {book.rating ? Number(book.rating).toFixed(1) : "0.0"}
                        </span>
                      </div>
                      <button
                        className={`p-1.5 rounded-xl transition-all active:scale-90 ${
                          isSaved
                            ? "text-primary bg-primary-container/30"
                            : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                        }`}
                        onClick={(e) => handleToggleBookmark(e, book.id)}
                        title={isSaved ? "Tersimpan di Rak" : "Simpan ke Rak"}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {/* Aksara Sunda Converter & Educational Widget */}
      <AksaraSundaConverter />
    </div>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-on-surface-variant">Memuat katalog buku desa...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
