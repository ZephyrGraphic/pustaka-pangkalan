"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Type, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  X, 
  Check,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import ChapterQuiz from "@/components/ChapterQuiz";

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
    category?: string;
    chapters: ChapterMeta[];
  };
}

type ReaderTheme = "default" | "sepia" | "dark" | "oled";
type ReaderFont = "sans" | "serif" | "mono";

export default function ReadChapterPage() {
  const params = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<ChapterRead | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Controls & Customization
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showChapterList, setShowChapterList] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("default");
  const [readerFont, setReaderFont] = useState<ReaderFont>("sans");
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Text-to-Speech (TTS) Audio Reader State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(-1);
  const [showAudioBar, setShowAudioBar] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  useEffect(() => {
    // Load saved reader preferences
    const savedTheme = localStorage.getItem("reader_theme") as ReaderTheme;
    const savedFont = localStorage.getItem("reader_font") as ReaderFont;
    const savedFontSize = localStorage.getItem("reader_font_size");
    if (savedTheme) setReaderTheme(savedTheme);
    if (savedFont) setReaderFont(savedFont);
    if (savedFontSize) setFontSize(Number(savedFontSize));

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const [isOfflineLoaded, setIsOfflineLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      try {
        const res = await fetch(`/api/read/${params.chapterId}`);
        if (res.ok) {
          const data = await res.json();
          setChapter(data);
          setIsOfflineLoaded(false);
          setLoading(false);
          
          // Save reading progress to server
          fetch("/api/reading-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              bookId: data.book.id, 
              chapterId: data.id 
            }),
          }).catch(console.error);
          return;
        }
      } catch (err) {
        console.warn("Jaringan offline, mencoba memuat dari penyimpanan lokal IndexedDB...", err);
      }

      // Offline IndexedDB Fallback
      try {
        const { getOfflineChapter } = await import("@/lib/offlineStorage");
        const cached = await getOfflineChapter(params.chapterId as string);
        if (cached) {
          setChapter({
            id: cached.chapter.id,
            title: cached.chapter.title,
            content: cached.chapter.content,
            order: cached.chapter.order,
            book: {
              id: cached.book.id,
              title: cached.book.title,
              category: cached.book.category,
              chapters: cached.book.chapters.map(c => ({ id: c.id, title: c.title, order: c.order })),
            },
          });
          setIsOfflineLoaded(true);
        }
      } catch (storageErr) {
        console.error("Gagal memuat dari penyimpanan offline:", storageErr);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.chapterId) {
      fetchChapter();
    }
  }, [params.chapterId]);

  // Scroll Progress and hide controls
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      if (window.scrollY > lastScrollY && window.scrollY > 120) {
        setShowControls(false);
      } else if (window.scrollY < lastScrollY) {
        setShowControls(true);
      }
      lastScrollY = window.scrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text to Speech logic
  const paragraphs = chapter?.content ? chapter.content.split('\n\n').filter(p => p.trim()) : [];

  const handleStartSpeech = () => {
    if (!synthRef.current || paragraphs.length === 0) return;

    synthRef.current.cancel();
    utterancesRef.current = [];

    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.lang.includes("id") || v.lang.includes("ID")) || null;

    paragraphs.forEach((text, idx) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.lang = "id-ID";
      if (idVoice) utterance.voice = idVoice;

      utterance.onstart = () => {
        setCurrentParagraphIndex(idx);
      };

      utterance.onend = () => {
        if (idx === paragraphs.length - 1) {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentParagraphIndex(-1);
        }
      };

      utterancesRef.current.push(utterance);
    });

    setIsSpeaking(true);
    setIsPaused(false);
    setShowAudioBar(true);

    utterancesRef.current.forEach(u => synthRef.current?.speak(u));
  };

  const handlePauseSpeech = () => {
    if (synthRef.current) {
      if (isPaused) {
        synthRef.current.resume();
        setIsPaused(false);
      } else {
        synthRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handleStopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentParagraphIndex(-1);
      setShowAudioBar(false);
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isSpeaking) {
      handleStopSpeech();
    }
  };

  const handleThemeChange = (theme: ReaderTheme) => {
    setReaderTheme(theme);
    localStorage.setItem("reader_theme", theme);
  };

  const handleFontChange = (font: ReaderFont) => {
    setReaderFont(font);
    localStorage.setItem("reader_font", font);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    localStorage.setItem("reader_font_size", String(size));
  };

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

  // Reader styling based on custom theme
  const getThemeClasses = () => {
    switch (readerTheme) {
      case "sepia":
        return "bg-[#fbf0d9] text-[#332415] border-[#ecdcc2] shadow-sm";
      case "dark":
        return "bg-[#171e17] text-[#f5f7f3] border-[#2c372b] shadow-md";
      case "oled":
        return "bg-[#000000] text-[#ffffff] border-[#282828] shadow-md";
      default:
        return "bg-surface-container text-on-surface border-outline-variant/30 shadow-sm";
    }
  };

  const getFontFamily = () => {
    switch (readerFont) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  return (
    <div className={`min-h-screen -mx-margin md:-mx-xl -mt-[88px] md:-mt-[104px] pt-[88px] md:pt-[104px] transition-colors duration-300 ${
      readerTheme === "sepia" 
        ? "bg-[#f4ebd0] text-[#332415]" 
        : readerTheme === "oled" 
        ? "bg-black text-white" 
        : readerTheme === "dark" 
        ? "bg-[#101510] text-[#f5f7f3]" 
        : "bg-background text-on-surface"
    }`}>
      
      {/* Reading Progress Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-surface-container">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Top Reader Controls */}
      <header className={`fixed top-1 left-0 right-0 z-40 backdrop-blur-md border-b transition-transform duration-300 ${
        readerTheme === "sepia"
          ? "bg-[#fbf0d9]/95 text-[#332415] border-[#ecdcc2]"
          : readerTheme === "oled"
          ? "bg-black/95 text-white border-[#282828]"
          : readerTheme === "dark"
          ? "bg-[#171e17]/95 text-[#f5f7f3] border-[#2c372b]"
          : "bg-surface/90 text-on-surface border-outline-variant/20"
      } ${showControls ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/books/${chapter.book.id}`} className="p-2 -ml-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Kembali ke Buku">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <div className="text-center max-w-[200px] sm:max-w-xs md:max-w-sm truncate">
            <p className="font-label-md text-xs opacity-75 truncate uppercase tracking-widest">{chapter.book.title}</p>
            <h1 className="font-title-md text-sm font-semibold truncate">{chapter.title}</h1>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Audio Reader Trigger */}
            <button 
              onClick={() => {
                if (isSpeaking) {
                  handlePauseSpeech();
                } else {
                  handleStartSpeech();
                }
              }}
              className={`p-2 rounded-full transition-colors ${
                isSpeaking ? "bg-primary text-on-primary" : "hover:bg-black/10 dark:hover:bg-white/10"
              }`}
              title="Dengarkan Buku (Audio Reader)"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Customizer */}
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Pengaturan Tampilan"
            >
              <Type className="w-5 h-5" />
            </button>

            {/* Chapter List */}
            <button 
              onClick={() => setShowChapterList(true)}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Daftar Bab"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Audio Bar (when active) */}
      {showAudioBar && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-8 md:w-80 z-40 bg-surface-container/95 border border-outline-variant/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-title-md text-xs text-on-surface font-semibold">Audio Reader (TTS)</span>
            </div>
            <button onClick={handleStopSpeech} className="text-on-surface-variant hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={handlePauseSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-medium"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? "Lanjutkan" : "Jeda"}</span>
            </button>
            <div className="flex items-center gap-1 bg-surface-container-high rounded-xl p-1">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                    speechRate === rate ? "bg-primary text-on-primary" : "text-on-surface-variant"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chapter Reader Container */}
      <div 
        className={`max-w-3xl mx-auto px-6 py-12 md:py-16 min-h-[70vh] shadow-sm rounded-2xl md:my-6 transition-all duration-300 border ${getThemeClasses()} ${getFontFamily()}`}
        style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        onClick={() => setShowControls(prev => !prev)}
      >
        <div className="mb-10 text-center">
          <span className="font-label-md text-xs opacity-70 uppercase tracking-widest">
            Bab {chapter.order}
          </span>
          <h1 className="font-headline-lg font-bold mt-2 leading-snug" style={{ fontSize: `${fontSize * 1.45}px` }}>
            {chapter.title}
          </h1>
          <div className="w-12 h-1 bg-primary/40 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="space-y-6 md:space-y-8" style={{ fontSize: `${fontSize}px` }}>
          {paragraphs.map((paragraph, index) => {
            const isHighlight = currentParagraphIndex === index;
            return (
              <p 
                key={index} 
                className={`text-justify indent-8 transition-colors duration-300 rounded-lg p-1.5 ${
                  isHighlight ? "bg-primary/15 font-medium ring-1 ring-primary/30" : ""
                }`}
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Interactive Comprehension Quiz & Gamification Reward */}
        <ChapterQuiz
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          category={chapter.book.category}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-3xl mx-auto px-6 pb-28 pt-8 flex items-center justify-between gap-4">
        {prevChapter ? (
          <Link 
            href={`/read/${prevChapter.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-surface-container hover:bg-surface-container-high rounded-2xl text-on-surface font-title-md transition-colors border border-outline-variant/20 shadow-sm"
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
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 rounded-2xl text-on-primary font-title-md transition-colors shadow-md shadow-primary/20"
          >
            <span className="hidden sm:inline">Bab Selanjutnya</span>
            <span className="sm:hidden">Lanjut</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <Link 
            href={`/books/${chapter.book.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 rounded-2xl text-on-primary font-title-md transition-colors shadow-md shadow-primary/20"
          >
            Selesai Membaca
          </Link>
        )}
      </div>

      {/* Reader Customizer Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div 
            className="relative w-full max-w-md min-w-[300px] sm:min-w-[380px] bg-surface-container rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 animate-fade-in-up my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-title-md text-lg text-on-surface font-bold">Pengaturan Tampilan</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-title-md text-sm text-on-surface">Ukuran Tulisan</span>
                <span className="font-label-md text-xs text-primary font-bold">{fontSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleFontSizeChange(Math.max(14, fontSize - 2))}
                  className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface font-bold flex items-center justify-center hover:bg-primary/20"
                >
                  A-
                </button>
                <input 
                  type="range" 
                  min="14" 
                  max="28" 
                  step="2"
                  value={fontSize} 
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <button 
                  onClick={() => handleFontSizeChange(Math.min(28, fontSize + 2))}
                  className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface font-bold flex items-center justify-center hover:bg-primary/20"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div className="mb-6">
              <span className="font-title-md text-sm text-on-surface block mb-2">Gaya Huruf</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "sans", label: "Sans Serif", sample: "Modern" },
                  { key: "serif", label: "Serif", sample: "Klasik" },
                  { key: "mono", label: "Monospace", sample: "Kode" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => handleFontChange(f.key as ReaderFont)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      readerFont === f.key
                        ? "border-primary bg-primary-container/30 text-primary font-bold"
                        : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <span className="block text-sm">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Background */}
            <div className="mb-4">
              <span className="font-title-md text-sm text-on-surface block mb-2">Warna Latar Membaca</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "default", label: "Standar", bg: "bg-surface-container text-on-surface border-outline-variant/30" },
                  { key: "sepia", label: "Sepia", bg: "bg-[#fbf0d9] text-[#433422] border-[#d8caa8]" },
                  { key: "dark", label: "Gelap", bg: "bg-[#171e17] text-[#f5f7f3] border-[#2c372b]" },
                  { key: "oled", label: "OLED", bg: "bg-black text-white border-zinc-800" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => handleThemeChange(t.key as ReaderTheme)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${t.bg} ${
                      readerTheme === t.key ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : ""
                    }`}
                  >
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-4 py-3 bg-primary text-on-primary rounded-xl font-title-md text-sm hover:bg-primary/90 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

      {/* Chapter List Modal */}
      {showChapterList && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div 
            className="relative w-full max-w-md min-w-[300px] sm:min-w-[380px] bg-surface-container rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[80vh] flex flex-col animate-fade-in-up my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title-md text-lg text-on-surface font-bold">Daftar Bab</h3>
              <button onClick={() => setShowChapterList(false)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {chapter.book.chapters.map((c) => {
                const isCurrent = c.id === chapter.id;
                return (
                  <Link
                    key={c.id}
                    href={`/read/${c.id}`}
                    onClick={() => setShowChapterList(false)}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all ${
                      isCurrent
                        ? "bg-primary text-on-primary font-bold shadow-sm"
                        : "hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent ? "bg-white/20 text-white" : "bg-primary-container/20 text-primary"
                      }`}>
                        {c.order}
                      </span>
                      <span className="text-sm">{c.title}</span>
                    </div>
                    {isCurrent && <Check className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
