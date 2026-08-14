"use client";

import { useEffect, useState } from "react";
import { Book, Clock, CloudDownload, Bookmark, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BookCover from "@/components/BookCover";

type ShelfTab = "reading" | "offline" | "bookmarks";

export default function ShelfPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<ShelfTab>("reading");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shelf")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [session]);

  const stats = data?.stats || { totalRead: 0, totalHours: 0, offlineCount: 0 };
  const readingList = data?.readingList || [];
  const bookmarks = data?.bookmarks || [];
  const offlineBooks = data?.offlineBooks || [];

  // Monthly target percentage (e.g. 5 books goal)
  const monthlyGoal = 5;
  const progressPercent = Math.min(100, Math.round((stats.totalRead / monthlyGoal) * 100));

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fade-in pb-12">
      
      {/* Header Stats Card */}
      <section className="bg-surface-container rounded-3xl border border-outline-variant/20 shadow-sm p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="z-10 flex flex-col gap-2 text-center md:text-left">
          <span className="font-label-md text-xs uppercase tracking-widest text-primary font-bold">
            Pustaka Pribadi
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
            Rak Buku Saya
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md">
            Pantau progres membaca, simpanan favorit, dan buku yang siap dibaca tanpa jaringan internet di Desa Pangkalan.
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface shadow-sm">
              <Book className="text-primary w-4 h-4" />
              <span>{stats.totalRead} Buku Dibaca</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface shadow-sm">
              <Clock className="text-primary w-4 h-4" />
              <span>{stats.totalHours} Jam Membaca</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface shadow-sm">
              <CloudDownload className="text-primary w-4 h-4" />
              <span>{stats.offlineCount} Buku Offline</span>
            </div>
          </div>
        </div>
        
        {/* Circular Progress Indicator */}
        <div className="z-10 flex flex-col items-center shrink-0">
          <div className="w-24 h-24 relative flex items-center justify-center">
            <svg className="w-full h-full text-primary -rotate-90" viewBox="0 0 36 36">
              <path 
                className="fill-none stroke-surface-container-highest stroke-[3.5]" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path 
                className="fill-none stroke-primary stroke-[3.5] stroke-linecap-round transition-all duration-700" 
                strokeDasharray={`${progressPercent}, 100`} 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-title-md font-bold text-lg text-primary">{progressPercent}%</span>
            </div>
          </div>
          <p className="font-label-md text-xs text-on-surface-variant mt-2 font-medium">Target 5 Buku</p>
        </div>
      </section>

      {/* Segmented Navigation Tab */}
      <section className="border-b border-outline-variant/20">
        <div className="flex overflow-x-auto hide-scroll gap-2">
          <button 
            onClick={() => setActiveTab("reading")}
            className={`py-3 px-5 border-b-2 font-title-md text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "reading"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            Sedang Dibaca ({readingList.length})
          </button>
          <button 
            onClick={() => setActiveTab("offline")}
            className={`py-3 px-5 border-b-2 font-title-md text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "offline"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            Tersimpan Offline ({offlineBooks.length})
          </button>
          <button 
            onClick={() => setActiveTab("bookmarks")}
            className={`py-3 px-5 border-b-2 font-title-md text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "bookmarks"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            Favorit ({bookmarks.length})
          </button>
        </div>
      </section>

      {/* Tab Content */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <section className="space-y-4">
          
          {/* 1. Sedang Dibaca Tab */}
          {activeTab === "reading" && (
            <>
              {readingList.length === 0 ? (
                <div className="bg-surface-container rounded-3xl p-10 text-center border border-outline-variant/20 space-y-3">
                  <BookOpen className="w-10 h-10 text-outline-variant mx-auto mb-2" />
                  <h3 className="font-title-md text-base font-bold text-on-surface">Belum ada buku yang sedang dibaca</h3>
                  <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto">
                    Jelajahi katalog dan pilih buku untuk mulai membaca artikel atau modul belajar.
                  </p>
                  <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-title-md text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <span>Jelajahi Katalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {readingList.map((item: any) => {
                    const totalChapters = item.book?.chapters?.length || 1;
                    const currentPage = item.page || 1;
                    const percent = Math.min(100, Math.round((currentPage / totalChapters) * 100));
                    const nextChapter = item.book?.chapters?.[currentPage - 1] || item.book?.chapters?.[0];

                    return (
                      <div key={item.id} className="bg-surface-container rounded-3xl border border-outline-variant/20 p-4 sm:p-5 flex gap-4 items-center shadow-sm hover:shadow-md transition-all">
                        <Link href={`/books/${item.book.id}`} className="relative w-20 h-28 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-outline-variant/20 block">
                          <BookCover 
                            src={item.book.coverUrl} 
                            alt={item.book.title} 
                            title={item.book.title} 
                            category={item.book.category} 
                          />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between h-full py-0.5">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                              {item.book.category}
                            </span>
                            <Link href={`/books/${item.book.id}`}>
                              <h3 className="font-title-md text-sm font-bold text-on-surface line-clamp-1 mt-1 hover:text-primary transition-colors">
                                {item.book.title}
                              </h3>
                            </Link>
                            <p className="font-label-md text-xs text-on-surface-variant line-clamp-1">
                              {item.book.author}
                            </p>
                          </div>

                          <div className="mt-2 space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-on-surface-variant font-medium">Bab {currentPage} dari {totalChapters}</span>
                              <span className="text-primary font-bold">{percent}%</span>
                            </div>
                            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>

                          <div className="mt-3 flex justify-end">
                            {nextChapter ? (
                              <Link 
                                href={`/read/${nextChapter.id}`} 
                                className="px-4 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                              >
                                Lanjutkan
                              </Link>
                            ) : (
                              <Link 
                                href={`/books/${item.book.id}`} 
                                className="px-4 py-1.5 bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold"
                              >
                                Buka Detail
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* 2. Tersimpan Offline Tab */}
          {activeTab === "offline" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {offlineBooks.map((book: any) => (
                <Link key={book.id} href={`/books/${book.id}`} className="group">
                  <div className="bg-surface-container rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm hover:-translate-y-1.5 transition-all p-3 flex flex-col h-full">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2.5">
                      <BookCover 
                        src={book.coverUrl} 
                        alt={book.title} 
                        title={book.title} 
                        category={book.category} 
                      />
                      <div className="absolute top-2 right-2 bg-primary text-on-primary rounded-full p-1 shadow-sm">
                        <CloudDownload className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h4 className="font-title-md text-xs sm:text-sm font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {book.title}
                    </h4>
                    <p className="font-label-md text-[11px] text-on-surface-variant mt-1 line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 3. Favorit / Bookmarks Tab */}
          {activeTab === "bookmarks" && (
            <>
              {bookmarks.length === 0 ? (
                <div className="bg-surface-container rounded-3xl p-10 text-center border border-outline-variant/20 space-y-3">
                  <Bookmark className="w-10 h-10 text-outline-variant mx-auto mb-2" />
                  <h3 className="font-title-md text-base font-bold text-on-surface">Belum ada buku favorit</h3>
                  <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto">
                    Tandai buku favorit Anda dengan tombol bookmark di halaman detail buku.
                  </p>
                  <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-title-md text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <span>Jelajahi Buku</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {bookmarks.map((b: any) => (
                    <Link key={b.id} href={`/books/${b.book.id}`} className="group">
                      <div className="bg-surface-container rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm hover:-translate-y-1.5 transition-all p-3 flex flex-col h-full">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2.5">
                          <BookCover 
                            src={b.book.coverUrl} 
                            alt={b.book.title} 
                            title={b.book.title} 
                            category={b.book.category} 
                          />
                        </div>
                        <h4 className="font-title-md text-xs sm:text-sm font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {b.book.title}
                        </h4>
                        <p className="font-label-md text-[11px] text-on-surface-variant mt-1 line-clamp-1">
                          {b.book.author}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

        </section>
      )}

    </div>
  );
}
