import { Search, SlidersHorizontal, MapPin, ArrowRight, Play, Flame, Wheat, BookOpen, Briefcase, HeartPulse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import AnnouncementCarousel from "@/components/AnnouncementCarousel";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Fetch latest books
  const featuredBooks = await prisma.book.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  // Fetch user's reading progress
  let activeReading = null;
  if (session?.user) {
    activeReading = await prisma.readingProgress.findFirst({
      where: { userId: (session.user as any).id },
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

  return (
    <>
      {/* Header Section: Greeting & Streak */}
      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="text-primary w-4 h-4" />
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                Desa Pangkalan
              </span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary">
              Wilujeng Sumping,<br />{session?.user?.name ? session.user.name.split(" ")[0] : "Warga"}
            </h2>
          </div>
          <div className="relative">
            <Link href={session ? "/profile" : "/login"}>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-surface-container-highest shadow-sm relative cursor-pointer hover:border-primary transition-colors">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTq0Cti8bDeirOJoUQ1pERXmvyOKucM_2H_jL4lNw8r3YO9I3AAP6mZns5BF481njT0AIahD3W-PPH-AtQX8j0MYKTVX4KGNqHSVXhQqEt_CNNdPJ-URoirYv9syH7D2FiPQZ2zsKZe2fKfPY0X7HFoqqJjdyYi96FJA0OZXZ-tOlmlKYAXiRgZd4OkhCVauv5u1upFyYHSfWIFeFxe8LkywgGOYH6Low9L22cllsUADHzoXa4-7SM" 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              </div>
            </Link>
            {session && <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface"></div>}
          </div>
        </div>

        {/* Streak Card (Glassmorphic) */}
        {session && (
          <div className="bg-surface-container/60 backdrop-blur-lg rounded-xl p-md border border-outline-variant/20 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-md animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
              <Flame className="w-6 h-6 text-on-primary-container" />
            </div>
            <div className="flex-grow">
              <p className="font-title-md text-title-md text-primary mb-1">5 Hari Beruntun</p>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%] rounded-full"></div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-label-md text-label-md text-secondary">Target: 7 Hari</p>
            </div>
          </div>
        )}
      </section>

      {/* Search Bar */}
      <section>
        <SearchBar />
      </section>

      {/* Categories */}
      <section>
        <h3 className="font-title-md text-title-md text-on-surface mb-md">Kategori Pengetahuan Desa</h3>
        <div className="flex overflow-x-auto hide-scroll gap-sm pb-2 -mx-margin px-margin md:mx-0 md:px-0">
          <Link href="/explore?category=Pertanian" className="flex-shrink-0 flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2 transition-colors">
            <Wheat className="w-5 h-5 text-primary" />
            <span className="font-label-md text-label-md text-on-surface">Pertanian & Peternakan</span>
          </Link>
          <Link href="/explore?category=Sejarah" className="flex-shrink-0 flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2 transition-colors">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-label-md text-label-md text-on-surface">Sastra & Budaya Sunda</span>
          </Link>
          <Link href="/explore?category=Ekonomi" className="flex-shrink-0 flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2 transition-colors">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="font-label-md text-label-md text-on-surface">Wirausaha UMKM</span>
          </Link>
          <Link href="/explore?category=Kesehatan" className="flex-shrink-0 flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2 transition-colors">
            <HeartPulse className="w-5 h-5 text-primary" />
            <span className="font-label-md text-label-md text-on-surface">Kesehatan Desa</span>
          </Link>
        </div>
      </section>

      {/* Warta & Kabar Desa Announcements */}
      <AnnouncementCarousel />

      {/* Continue Reading */}
      {session && activeReading && activeReading.book && (
        <section>
          <h3 className="font-title-md text-title-md text-on-surface mb-md">Sedang Dibaca</h3>
          <div className="bg-surface border border-outline-variant/20 rounded-xl p-md flex gap-md shadow-[0px_4px_20px_rgba(0,0,0,0.03)] items-center hover:shadow-md transition-shadow">
            <Link href={`/books/${activeReading.book.id}`} className="relative w-20 h-28 rounded-md shadow-sm overflow-hidden shrink-0 block">
              <Image
                src={activeReading.book.coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuASpiQfv-vrouyW_CZ0I8VvxZ7kRSGjPfTgTqZaw78giT-aH9jqxl2pZds8xKn2nC_1K1AttCo-HJx0c6JcNdWgDzj7oqujfvyZOtIP9FkAABc34oB1jJgQGR6vwmmfN4EqLwSSMPB_aaCvswIta4K-PNsIAvagB2eI-EtwgoSUlI8n1JWxPTMo00PCDvO4iQJhbsGTUXelAtKN1LYnEEMSPW5DEwsCP4X679k-OjpnA0Zbag98nPKJ"}
                alt="Cover"
                fill
                className="object-cover"
              />
            </Link>
            <div className="flex-grow flex flex-col justify-between h-full py-1">
              <div>
                <span className="inline-block px-2 py-1 bg-secondary-container/50 text-on-secondary-container rounded font-label-md text-[10px] uppercase mb-1">
                  {activeReading.book.category}
                </span>
                <Link href={`/books/${activeReading.book.id}`}>
                  <h4 className="font-title-md text-title-md text-on-surface leading-tight mb-2 hover:text-primary transition-colors">
                    {activeReading.book.title}
                  </h4>
                </Link>
                <p className="font-body-md text-body-md text-secondary text-sm">Bab {activeReading.page} dari {activeReading.book.chapters.length}</p>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex-grow h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.max(5, (activeReading.page / Math.max(1, activeReading.book.chapters.length)) * 100)}%` }}
                  ></div>
                </div>
                <Link 
                  href={`/read/${activeReading.book.chapters[Math.min(activeReading.page - 1, activeReading.book.chapters.length - 1)]?.id || ''}`}
                  className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm block text-center"
                >
                  Lanjutkan
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Carousel */}
      <section>
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-title-md text-title-md text-on-surface">Unggulan Minggu Ini</h3>
          <Link href="/explore" className="text-primary font-label-md text-label-md flex items-center hover:bg-surface-container px-2 py-1 rounded transition-colors">
            Lihat Semua
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="flex overflow-x-auto hide-scroll gap-md pb-4 -mx-margin px-margin md:mx-0 md:px-0 snap-x snap-mandatory">
          {featuredBooks.length > 0 ? (
            featuredBooks.map((book: { id: string; title: string; author: string; coverUrl: string | null; category: string; rating: number; description: string; isOffline: boolean }) => (
              <Link href={`/books/${book.id}`} key={book.id} className="snap-center flex-shrink-0 w-[240px] bg-surface rounded-xl border border-outline-variant/20 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group cursor-pointer">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={book.coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDlPezszFmh9d4B75Bofkmdc68q3hc2Bkt1JtPYrjtmPD_HCLfyPdylQEb0D-fBoBG6H_G4KCEXWqrAlbuT0CXAikalh5TloNdpWvsW8aqaKH3MAIGWcfS9B4W0p8wmjK_P-Q0ddvlXFeKtOSwimmat4STLVK-N9USEYGx2_j5Q1TmqfKh8xOFDyfD-szjdLeId4LZumzw5jMWwnS5tr8YCCOue8AB5o5pbe9CxK32dn5v0BdZ4SlW_"}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-on-surface flex items-center gap-1 shadow-sm">
                    <span className="text-yellow-500">⭐</span> {book.rating || "4.5"}
                  </div>
                  {book.isOffline && (
                    <div className="absolute bottom-2 left-2 bg-primary-container text-on-primary-container px-2 py-1 rounded text-[10px] font-label-md font-bold uppercase shadow-sm">
                      Tersedia Offline
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <p className="font-label-md text-label-md text-secondary mb-1">{book.category}</p>
                  <h4 className="font-title-md text-title-md text-on-surface mb-1 line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="font-body-md text-body-md text-secondary text-sm mt-auto">Oleh: {book.author}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-secondary text-sm italic">Belum ada buku unggulan saat ini.</p>
          )}
        </div>
      </section>

      {/* Local Heritage Banner */}
      <section className="mt-4">
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary-container p-lg flex flex-col justify-end min-h-[160px] shadow-md cursor-pointer group">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
          <div className="relative z-10 w-2/3">
            <span className="inline-block px-2 py-1 bg-on-primary/20 backdrop-blur-sm text-on-primary rounded font-label-md text-[10px] uppercase mb-2 border border-on-primary/30">
              Khasanah Lokal
            </span>
            <h3 className="font-title-md text-title-md text-on-primary mb-1">Cerita Rakyat & Dongeng Sunda</h3>
            <p className="font-body-md text-body-md text-on-primary/80 text-sm">
              Lestarikan warisan leluhur kita untuk generasi mendatang.
            </p>
          </div>
          <button className="absolute bottom-lg right-lg w-10 h-10 bg-on-primary text-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg z-20">
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>
      </section>
    </>
  );
}
