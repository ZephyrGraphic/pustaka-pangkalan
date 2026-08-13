"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, List, Settings, Type } from "lucide-react";
import Link from "next/link";

interface ChapterMeta {
  id: string;
  order: number;
  title: string;
}

interface ChapterRead {
  id: string;
  title: string;
  content: string;
  order: number;
  book: {
    id: string;
    title: string;
    chapters: ChapterMeta[];
  };
}

export default function ReadChapterPage() {
  const params = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<ChapterRead | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Reader preferences
  const [fontSize, setFontSize] = useState<number>(18); // px
  const [showControls, setShowControls] = useState<boolean>(true);

  useEffect(() => {
    async function fetchChapter() {
      try {
        const res = await fetch(`/api/read/${params.chapterId}`);
        if (res.ok) {
          const data = await res.json();
          setChapter(data);
          
          // Save reading progress in background
          fetch("/api/reading-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              bookId: data.book.id, 
              chapterId: data.id 
            }),
          }).catch(console.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.chapterId) {
      fetchChapter();
    }
  }, [params.chapterId]);

  // Hide controls when scrolling down
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowControls(false);
      } else if (window.scrollY < lastScrollY) {
        setShowControls(true);
      }
      lastScrollY = window.scrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] w-full">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-error">Bab tidak ditemukan</h2>
        <button onClick={() => router.push("/explore")} className="mt-4 text-primary underline">Kembali ke Katalog</button>
      </div>
    );
  }

  const currentIndex = chapter.book.chapters.findIndex(c => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? chapter.book.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapter.book.chapters.length - 1 ? chapter.book.chapters[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-surface md:bg-surface-container-lowest -mx-margin md:-mx-xl -mt-[88px] md:-mt-[104px] pt-[88px] md:pt-[104px] relative">
      
      {/* Top Reader Controls */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 transition-transform duration-300 ${showControls ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/books/${chapter.book.id}`} className="p-2 -ml-2 rounded-full hover:bg-surface-variant/50 text-on-surface transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <div className="text-center max-w-[200px] sm:max-w-xs md:max-w-sm truncate">
            <p className="font-label-md text-xs text-on-surface-variant truncate uppercase tracking-widest">{chapter.book.title}</p>
            <h1 className="font-title-md text-sm font-semibold truncate">{chapter.title}</h1>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setFontSize(prev => Math.min(prev + 2, 28))}
              className="p-2 rounded-full hover:bg-surface-variant/50 text-on-surface transition-colors"
            >
              <Type className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-surface-variant/50 text-on-surface transition-colors">
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div 
        className="max-w-3xl mx-auto px-6 py-12 md:py-16 min-h-[70vh] bg-surface-container-lowest shadow-sm rounded-xl md:my-6 transition-all duration-300"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        onClick={() => setShowControls(prev => !prev)}
      >
        <h1 className="font-headline-lg font-bold mb-10 text-center leading-snug text-on-surface" style={{ fontSize: `${fontSize * 1.5}px` }}>
          {chapter.title}
        </h1>
        
        <div className="font-body-lg text-on-surface-variant/90 space-y-6 md:space-y-8" style={{ fontSize: `${fontSize}px` }}>
          {chapter.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-justify indent-8">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-3xl mx-auto px-6 pb-24 pt-8 flex items-center justify-between gap-4">
        {prevChapter ? (
          <Link 
            href={`/read/${prevChapter.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-surface-variant/30 hover:bg-surface-variant/60 rounded-xl text-on-surface font-title-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Bab Sebelumnya</span>
            <span className="sm:hidden">Sblm</span>
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}
        
        {nextChapter ? (
          <Link 
            href={`/read/${nextChapter.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 rounded-xl text-on-primary font-title-md transition-colors shadow-sm shadow-primary/20"
          >
            <span className="hidden sm:inline">Bab Selanjutnya</span>
            <span className="sm:hidden">Lanjut</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <Link 
            href={`/books/${chapter.book.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 rounded-xl text-on-primary font-title-md transition-colors shadow-sm shadow-primary/20"
          >
            Selesai Membaca
          </Link>
        )}
      </div>
    </div>
  );
}
