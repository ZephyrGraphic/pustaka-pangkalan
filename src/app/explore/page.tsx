"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, X, SlidersHorizontal, Cloud, Star, Bookmark, BookmarkCheck, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

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
    <>
      {/* Sticky Header & Search Area */}
      <header className="sticky top-[64px] md:top-[80px] z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm md:pt-md -mx-margin px-margin md:mx-0 md:px-0 transition-all">
        <div className="py-sm flex items-center gap-sm max-w-4xl mx-auto">
          <div className="flex-1 flex items-center bg-surface-container rounded-full px-md py-2 border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <Search className="text-on-surface-variant w-5 h-5 mr-sm" />
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-body-md placeholder:text-on-surface-variant/70 p-0 outline-none"
              placeholder="Cari buku, modul, atau penulis..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="pb-sm flex overflow-x-auto hide-scroll gap-sm max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategory(cat === "Semua" ? "" : cat)}
              className={`px-md py-sm rounded-xl font-label-md text-label-md whitespace-nowrap transition-colors border shadow-sm ${
                (category === cat || (cat === "Semua" && !category)) 
                  ? "bg-primary-container text-on-primary-container border-primary/20 font-bold"
                  : "bg-surface-container text-on-surface-variant hover:bg-secondary-container/30 border-outline-variant/20"
              }`}
            >
              {cat}
            </button>
          ))}
          <button 
            onClick={() => setOfflineOnly(!offlineOnly)}
            className={`px-md py-sm rounded-xl font-label-md text-label-md whitespace-nowrap transition-colors border flex items-center gap-1.5 shadow-sm ${
              offlineOnly
                ? "bg-primary-container text-on-primary-container border-primary/20 font-bold"
                : "bg-surface-container text-on-surface-variant hover:bg-secondary-container/30 border-outline-variant/20"
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Tersedia Offline</span>
          </button>
        </div>
      </header>

      {/* Stats & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-md">
        <p className="font-body-md text-sm text-on-surface-variant">
          {loading ? "Memuat koleksi..." : (
            <>
              Menampilkan <span className="font-title-md font-bold text-on-surface">{processedBooks.length}</span> koleksi buku
            </>
          )}
        </p>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
          <span className="text-xs text-on-surface-variant">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs text-on-surface font-medium focus:outline-none focus:border-primary"
          >
            <option value="latest">Terbaru</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="readers">Paling Populer</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      {!loading && processedBooks.length === 0 ? (
        <div className="text-center py-16 bg-surface-container rounded-3xl border border-outline-variant/20 p-8">
          <p className="font-title-md text-base text-on-surface font-bold">Tidak ada buku yang ditemukan</p>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">Coba gunakan kata kunci lain atau pilih kategori Semua.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md pb-xl">
          {processedBooks.map((book) => {
            const isSaved = bookmarkedIds.includes(book.id);

            return (
              <Link href={`/books/${book.id}`} key={book.id}>
                <article className="bg-surface-container-lowest rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300 h-full">
                  <div className="relative w-full p-sm pb-0 aspect-[3/4]">
                    <Image
                      src={book.coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6hj057i0fwYl3EGb2BLnSblxWu4ZG3GsRrxqr6Vr6AhTp_qTyjmgo4imyp2z_DlHCQUxOw3kRSzSalRSjHt9yL7jj1a8A0krkXafj7hBbFyG73tJCKfSh91Wgg2eU3kbxcH6GTtrNZchgmp3T7Bm0cjTS0ZmazTA19cc40-7t-5Y_CcS2cczY3vbgusmiAcUEEADU4WJdPQv6Wpw0laChMTzX2XnevXn-DdfunR7Mjn-r25Q5WGPC"}
                      alt={book.title}
                      fill
                      className="object-cover rounded-xl shadow-sm border border-outline-variant/10"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container font-label-md text-label-md px-2 py-0.5 rounded-md shadow-sm text-[10px] uppercase font-bold">
                        {book.category}
                      </span>
                    </div>
                    {book.isOffline && (
                      <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm text-primary">
                        <Cloud className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 gap-1">
                    <h3 className="font-title-md text-sm text-on-surface line-clamp-2 leading-tight font-bold group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="font-label-md text-xs text-on-surface-variant line-clamp-1">{book.author}</p>
                    
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-outline-variant/10">
                      <div className="flex items-center gap-1 text-on-surface">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-label-md text-xs font-bold">{book.rating ? Number(book.rating).toFixed(1) : "0.0"}</span>
                      </div>
                      <button 
                        className={`p-1.5 rounded-full transition-colors active:scale-90 ${
                          isSaved ? "text-primary bg-primary-container/30" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                        }`}
                        onClick={(e) => handleToggleBookmark(e, book.id)}
                        title={isSaved ? "Tersimpan" : "Simpan ke Rak"}
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
    </>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant">Memuat katalog...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
