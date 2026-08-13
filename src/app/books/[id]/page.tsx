"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpen, BookmarkPlus, BookmarkCheck, ChevronLeft, Star, Users } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Chapter {
  id: string;
  title: string;
  order: number;
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
  const { data: session } = useSession();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarking, setBookmarking] = useState(false);

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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBookmarking(false);
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
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-error">Buku tidak ditemukan</h2>
        <button onClick={() => router.back()} className="mt-4 text-primary underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-on-surface" />
        </button>
        <span className="font-title-md text-title-md font-semibold text-on-surface truncate">
          Detail Buku
        </span>
      </div>

      {/* Book Cover and Info */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10">
        <div className="w-48 h-64 md:w-64 md:h-80 flex-shrink-0 mx-auto md:mx-0 relative rounded-xl overflow-hidden shadow-lg shadow-primary-container/20">
          <Image 
            src={book.coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAGVw_j51tG8zPZ9tXoUo9w47FfLzHw_h_zD5yTjGz7Z9rV9O99g_x2o9Q0-wzV0YtQjZ5e0QG7Dq0h8g8_9QG7Dq0h8g8_9QG7Dq0h8g8"} 
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col justify-center text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-primary-container/20 text-primary font-label-md text-xs rounded-full mb-3 self-center md:self-start">
            {book.category}
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary font-bold mb-2 leading-tight">
            {book.title}
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-4">
            Karya {book.author}
          </p>
          
          <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-title-md font-bold text-on-surface">{book.rating.toFixed(1)}</span>
            </div>
            <div className="w-px h-6 bg-outline-variant/40"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Users className="w-5 h-5" />
              <span className="font-body-md">{book._count.readers} Pembaca</span>
            </div>
            <div className="w-px h-6 bg-outline-variant/40"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <BookOpen className="w-5 h-5" />
              <span className="font-body-md">{book.chapters.length} Bab</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto md:mx-0">
            {book.chapters.length > 0 ? (
              <Link 
                href={`/read/${book.chapters[0].id}`}
                className="flex-1 bg-primary hover:bg-primary/90 text-on-primary py-3.5 rounded-xl font-title-md text-center transition-colors shadow-md shadow-primary/20 flex items-center justify-center"
              >
                Mulai Membaca
              </Link>
            ) : (
              <button disabled className="flex-1 bg-surface-variant text-on-surface-variant/50 py-3.5 rounded-xl font-title-md text-center cursor-not-allowed">
                Belum Ada Isi
              </button>
            )}
            <button 
              onClick={handleBookmark}
              disabled={bookmarking}
              className={`w-full sm:w-14 h-14 border rounded-xl flex items-center justify-center transition-colors ${
                book.isBookmarked 
                  ? "bg-primary-container border-primary-container text-on-primary-container" 
                  : "border-outline-variant text-on-surface hover:bg-surface-variant/30"
              }`}
            >
              {book.isBookmarked ? (
                <BookmarkCheck className="w-6 h-6" />
              ) : (
                <BookmarkPlus className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="mb-10">
        <h3 className="font-title-md text-lg font-bold mb-3 text-on-surface">Sinopsis</h3>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          {book.description}
        </p>
      </div>

      {/* Chapters List */}
      <div>
        <h3 className="font-title-md text-lg font-bold mb-4 text-on-surface">Daftar Isi ({book.chapters.length})</h3>
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden divide-y divide-outline-variant/20 shadow-sm">
          {book.chapters.length > 0 ? (
            book.chapters.map((chapter) => (
              <Link 
                key={chapter.id} 
                href={`/read/${chapter.id}`}
                className="flex items-center justify-between p-4 hover:bg-surface-variant/20 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-sm">
                    {chapter.order}
                  </div>
                  <span className="font-body-lg font-medium text-on-surface group-hover:text-primary transition-colors">
                    {chapter.title}
                  </span>
                </div>
                <BookOpen className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-on-surface-variant">
              Isi buku belum tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
