"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, X, Mic, SlidersHorizontal, Cloud, Star, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("q") || "";

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = "/api/books?";
        if (category && category !== "Semua") url += `category=${category}&`;
        if (search) url += `search=${search}`;

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

  const categories = ["Semua", "Pertanian", "Sejarah", "Ekonomi", "Kesehatan"];

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
            <div className="w-px h-6 bg-outline-variant/30 mx-sm"></div>
            <button className="text-primary hover:text-primary-container transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button className="p-2 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-secondary-container/30 transition-all active:scale-95 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="pb-sm flex overflow-x-auto hide-scroll gap-sm max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategory(cat === "Semua" ? "" : cat)}
              className={`px-md py-sm rounded-xl font-label-md text-label-md whitespace-nowrap transition-colors border shadow-sm ${
                (category === cat || (cat === "Semua" && !category)) 
                  ? "bg-primary-container text-on-primary-container border-primary/20"
                  : "bg-surface-container text-on-surface-variant hover:bg-secondary-container/30 border-outline-variant/20"
              }`}
            >
              {cat}
            </button>
          ))}
          <button className="px-md py-sm rounded-xl font-label-md text-label-md whitespace-nowrap bg-surface-container text-on-surface-variant hover:bg-secondary-container/30 transition-colors border border-outline-variant/20 flex items-center gap-1">
            <Cloud className="w-4 h-4" /> Tersedia Offline
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="flex justify-between items-center py-md">
        <p className="font-body-md text-body-md text-on-surface-variant">
          {loading ? "Memuat..." : <><span className="font-title-md text-title-md text-on-surface">{books.length}</span> Koleksi Ditemukan</>}
        </p>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-1 text-on-surface-variant cursor-pointer hover:bg-surface-container rounded-lg px-2 py-1 transition-colors">
            <span className="font-label-md text-label-md">Terbaru</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      {!loading && books.length === 0 ? (
        <div className="text-center py-10 text-on-surface-variant">Tidak ada buku yang ditemukan.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md pb-xl">
          {books.map((book) => (
            <Link href={`/books/${book.id}`} key={book.id}>
              <article className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/10 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300 h-full">
                <div className="relative w-full p-sm pb-0 aspect-[3/4]">
                  <Image
                    src={book.coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6hj057i0fwYl3EGb2BLnSblxWu4ZG3GsRrxqr6Vr6AhTp_qTyjmgo4imyp2z_DlHCQUxOw3kRSzSalRSjHt9yL7jj1a8A0krkXafj7hBbFyG73tJCKfSh91Wgg2eU3kbxcH6GTtrNZchgmp3T7Bm0cjTS0ZmazTA19cc40-7t-5Y_CcS2cczY3vbgusmiAcUEEADU4WJdPQv6Wpw0laChMTzX2XnevXn-DdfunR7Mjn-r25Q5WGPC"}
                    alt={book.title}
                    fill
                    className="object-cover rounded-lg shadow-sm border border-outline-variant/10"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container font-label-md text-label-md px-2 py-0.5 rounded-full shadow-sm text-[10px]">{book.category}</span>
                  </div>
                  {book.isOffline && (
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full p-1 shadow-sm text-primary">
                      <Cloud className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="p-sm flex flex-col flex-1 gap-1">
                  <h3 className="font-title-md text-title-md text-on-surface line-clamp-2 leading-tight mt-1 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="font-label-md text-label-md text-on-surface-variant line-clamp-1">{book.author}</p>
                  <div className="flex justify-between items-end mt-auto pt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-on-surface-variant">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span className="font-label-md text-[11px] ml-0.5">{book.rating || "4.5"}</span>
                      </div>
                    </div>
                    <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-90" onClick={(e) => e.preventDefault()}>
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant">Memuat...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
