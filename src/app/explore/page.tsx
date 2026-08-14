"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, X, Cloud, Star, Bookmark, BookmarkCheck, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import BookCover from "@/components/BookCover";

type SortOption = "latest" | "rating" | "readers" | "title";

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

  const categories = ["Semua", "Pertanian", "Sejarah", "Ekonomi", "Kesehatan", "Teknologi"];

  // Filter & Sort
  const processedBooks = [...books]
    .filter((b) => !offlineOnly || b.isOffline)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "readers":
          return (b._count?.readers || 0) - (a._count?.readers || 0);
        case "title":
          return a.title.localeCompare(b.title);
        case "latest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      
      {/* Header Search & Filter Bar */}
      <section className="space-y-4 pt-1">
        
        {/* Search Input Box */}
        <div className="relative flex items-center bg-surface-container rounded-2xl px-4 py-3 border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all">
          <Search className="text-on-surface-variant w-5 h-5 mr-3 shrink-0" />
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-body-md placeholder:text-on-surface-variant/70 text-sm outline-none"
            placeholder="Cari judul buku, modul pertanian, atau penulis..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-highest transition-colors"
              aria-label="Hapus Pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills & Offline Filter */}
        <div className="flex overflow-x-auto hide-scroll gap-2 pb-1 -mx-margin px-margin md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isSelected = category === cat || (cat === "Semua" && !category);
            return (
              <button 
                key={cat}
                onClick={() => setCategory(cat === "Semua" ? "" : cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shadow-sm ${
                  isSelected 
                    ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/20 scale-105"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/20"
                }`}
              >
                {cat}
              </button>
            );
          })}
          <button 
            onClick={() => setOfflineOnly(!offlineOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 shadow-sm ${
              offlineOnly
                ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/20 scale-105"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/20"
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Tersedia Offline</span>
          </button>
        </div>
      </section>

      {/* Results Count & Sort Dropdown Bar */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 border-t border-outline-variant/15">
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
          {loading ? (
            "Memuat koleksi buku..."
          ) : (
            <>
              Menampilkan <span className="font-bold text-on-surface">{processedBooks.length}</span> koleksi buku
            </>
          )}
        </p>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
          <span className="text-xs text-on-surface-variant font-medium">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="latest">Terbaru</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="readers">Paling Populer</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>
      </section>

      {/* Grid Layout */}
      {!loading && processedBooks.length === 0 ? (
        <div className="text-center py-16 bg-surface-container rounded-3xl border border-outline-variant/20 p-8 space-y-2">
          <p className="font-title-md text-base text-on-surface font-bold">Tidak ada buku yang ditemukan</p>
          <p className="font-body-md text-xs text-on-surface-variant">Coba gunakan kata kunci lain atau pilih kategori Semua.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {processedBooks.map((book) => {
            const isSaved = bookmarkedIds.includes(book.id);

            return (
              <Link href={`/books/${book.id}`} key={book.id} className="group">
                <article className="bg-surface-container rounded-3xl shadow-sm hover:shadow-lg border border-outline-variant/20 overflow-hidden flex flex-col group-hover:-translate-y-1.5 transition-all duration-300 h-full">
                  
                  {/* Book Cover Container */}
                  <div className="relative w-full aspect-[3/4] p-3 pb-0">
                    <BookCover 
                      src={book.coverUrl} 
                      alt={book.title} 
                      title={book.title} 
                      category={book.category} 
                      className="shadow-sm"
                    />

                    <div className="absolute top-5 left-5">
                      <span className="bg-surface/90 backdrop-blur-md text-on-surface font-bold px-2 py-0.5 rounded-md shadow-sm text-[10px] uppercase border border-outline-variant/20">
                        {book.category}
                      </span>
                    </div>

                    {book.isOffline && (
                      <div className="absolute top-5 right-5 bg-primary-container text-on-primary-container rounded-full p-1 shadow-sm">
                        <Cloud className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <h3 className="font-title-md text-xs sm:text-sm text-on-surface line-clamp-2 leading-snug font-bold group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="font-body-md text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                        {book.author}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20 mt-auto">
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
                        aria-label="Simpan Buku"
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
