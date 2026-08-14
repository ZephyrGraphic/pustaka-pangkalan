import { MapPin, ArrowRight, Play, Flame, Wheat, BookOpen, Briefcase, HeartPulse, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import AnnouncementCarousel from "@/components/AnnouncementCarousel";
import BookCover from "@/components/BookCover";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Fetch latest books
  const featuredBooks = await prisma.book.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // Fetch user's reading progress
  let activeReading = null;
  let userAvatar = null;
  let userPoints = 0;
  let userBadge = "Warga Pembelajar";

  if (session?.user) {
    const userId = (session.user as any).id;
    const userFromDb = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true, points: true, badge: true },
    });
    userAvatar = userFromDb?.image || session.user.image;
    userPoints = userFromDb?.points || 0;
    userBadge = userFromDb?.badge || "Warga Pembelajar";

    activeReading = await prisma.readingProgress.findFirst({
      where: { userId },
      include: {
        book: {
          include: {
            chapters: {
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { lastRead: 'desc' },
    });
  }

  const defaultAvatar = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="space-y-8 md:space-y-10 animate-fade-in pb-8">
      {/* Header Section: Greeting & Streak */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <MapPin className="text-primary w-4 h-4 shrink-0" />
              <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Desa Pangkalan
              </span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-surface leading-tight">
              Wilujeng Sumping,<br />
              <span className="text-primary">{session?.user?.name ? session.user.name.split(" ")[0] : "Warga"}</span>
            </h2>
          </div>
          
          <div className="relative">
            <Link href={session ? "/profile" : "/login"}>
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary/30 shadow-md relative cursor-pointer hover:scale-105 transition-transform bg-surface-container">
                <Image 
                  src={userAvatar || defaultAvatar} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              </div>
            </Link>
            {session && (
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface shadow-sm"></div>
            )}
          </div>
        </div>

        {/* Streak & Gamification Card (Glassmorphic) */}
        {session && (
          <div className="bg-surface-container/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-3.5 flex-grow">
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
                <Flame className="w-6 h-6" />
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-title-md text-sm font-bold text-on-surface">5 Hari Beruntun Membaca</p>
                  <span className="bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                    ⭐ {userPoints} Poin
                  </span>
                </div>
                <div className="w-full max-w-xs h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[70%] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                🏆 {userBadge}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Search Bar */}
      <section>
        <SearchBar />
      </section>

      {/* Categories */}
      <section className="space-y-3">
        <h3 className="font-title-md text-base font-bold text-on-surface">Kategori Pengetahuan Desa</h3>
        <div className="flex overflow-x-auto hide-scroll gap-2.5 pb-1 -mx-margin px-margin md:mx-0 md:px-0">
          <Link href="/explore?category=Pertanian" className="flex-shrink-0 flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-2xl px-4 py-2.5 transition-all text-xs font-semibold text-on-surface shadow-sm">
            <Wheat className="w-4 h-4 text-primary" />
            <span>Pertanian & Peternakan</span>
          </Link>
          <Link href="/explore?category=Sejarah" className="flex-shrink-0 flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-2xl px-4 py-2.5 transition-all text-xs font-semibold text-on-surface shadow-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Sastra & Budaya Sunda</span>
          </Link>
          <Link href="/explore?category=Ekonomi" className="flex-shrink-0 flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-2xl px-4 py-2.5 transition-all text-xs font-semibold text-on-surface shadow-sm">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>Wirausaha UMKM</span>
          </Link>
          <Link href="/explore?category=Kesehatan" className="flex-shrink-0 flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-2xl px-4 py-2.5 transition-all text-xs font-semibold text-on-surface shadow-sm">
            <HeartPulse className="w-4 h-4 text-primary" />
            <span>Kesehatan Desa</span>
          </Link>
        </div>
      </section>

      {/* Warta & Kabar Desa Announcements */}
      <section>
        <AnnouncementCarousel />
      </section>

      {/* Continue Reading */}
      {session && activeReading && activeReading.book && (
        <section className="space-y-3">
          <h3 className="font-title-md text-base font-bold text-on-surface">Sedang Dibaca</h3>
          <div className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant/20 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/books/${activeReading.book.id}`} className="relative w-20 h-28 rounded-2xl overflow-hidden shrink-0 block border border-outline-variant/20">
              <BookCover 
                src={activeReading.book.coverUrl} 
                alt={activeReading.book.title} 
                title={activeReading.book.title} 
                category={activeReading.book.category} 
              />
            </Link>
            <div className="flex-grow flex flex-col justify-between h-full py-1">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-primary-container/20 text-primary font-bold rounded-md font-label-md text-[10px] uppercase mb-1">
                  {activeReading.book.category}
                </span>
                <Link href={`/books/${activeReading.book.id}`}>
                  <h4 className="font-title-md text-sm font-bold text-on-surface leading-snug mb-1 hover:text-primary transition-colors line-clamp-2">
                    {activeReading.book.title}
                  </h4>
                </Link>
                <p className="font-body-md text-xs text-on-surface-variant">Bab {activeReading.page} dari {activeReading.book.chapters.length}</p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-grow h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700" 
                    style={{ width: `${Math.max(5, (activeReading.page / Math.max(1, activeReading.book.chapters.length)) * 100)}%` }}
                  ></div>
                </div>
                <Link 
                  href={`/read/${activeReading.book.chapters[Math.min(activeReading.page - 1, activeReading.book.chapters.length - 1)]?.id || ''}`}
                  className="bg-primary text-on-primary px-4 py-1.5 rounded-xl font-title-md text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm block text-center shrink-0"
                >
                  Lanjutkan
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Carousel */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-base font-bold text-on-surface">Unggulan Minggu Ini</h3>
          <Link href="/explore" className="text-primary font-title-md text-xs font-semibold flex items-center hover:underline">
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
        <div className="flex overflow-x-auto hide-scroll gap-4 pb-3 -mx-margin px-margin md:mx-0 md:px-0 snap-x snap-mandatory">
          {featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <Link 
                href={`/books/${book.id}`} 
                key={book.id} 
                className="snap-start flex-shrink-0 w-[210px] sm:w-[230px] bg-surface-container rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <BookCover 
                    src={book.coverUrl} 
                    alt={book.title} 
                    title={book.title} 
                    category={book.category} 
                  />
                  <div className="absolute top-2.5 right-2.5 bg-surface/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-on-surface flex items-center gap-1 shadow-sm border border-outline-variant/20">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{book.rating ? Number(book.rating).toFixed(1) : "0.0"}</span>
                  </div>
                  {book.isOffline && (
                    <div className="absolute bottom-2.5 left-2.5 bg-primary-container text-on-primary-container px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shadow-sm">
                      Tersedia Offline
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="font-label-md text-[10px] font-bold text-primary uppercase tracking-wider">{book.category}</span>
                    <h4 className="font-title-md text-sm font-bold text-on-surface mt-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {book.title}
                    </h4>
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant mt-2 line-clamp-1">Oleh: {book.author}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-on-surface-variant text-xs italic">Belum ada buku unggulan saat ini.</p>
          )}
        </div>
      </section>

      {/* Local Heritage Banner */}
      <section className="pt-2">
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-[#1f381c] to-[#122410] p-6 sm:p-8 text-on-primary shadow-lg border border-white/10 flex flex-col justify-end min-h-[160px] group">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
          <div className="relative z-10 max-w-md">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full font-label-md text-[10px] uppercase font-bold mb-2 border border-white/20">
              Khasanah Budaya Lokal
            </span>
            <h3 className="font-title-md text-lg font-bold mb-1">Cerita Rakyat & Sastra Sunda</h3>
            <p className="font-body-md text-xs text-white/80 leading-relaxed">
              Lestarikan warisan pengetahuan dan nilai luhur leluhur kita di Desa Pangkalan untuk generasi mendatang.
            </p>
          </div>
          <Link 
            href="/explore?category=Sejarah"
            className="absolute bottom-6 right-6 w-11 h-11 bg-white text-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg z-20"
            aria-label="Jelajahi Cerita Rakyat"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
