"use client";

import { Book, Clock, CloudDownload } from "lucide-react";
import Image from "next/image";

export default function Shelf() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-gutter w-full">
      {/* Header Stats Card */}
      <section className="col-span-4 md:col-span-8 mb-xl">
        <div className="bg-surface rounded-xl border border-outline-variant/10 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-container opacity-5 pointer-events-none"></div>
          <div className="z-10 flex flex-col gap-sm">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Rak Buku Saya
            </h2>
            <div className="flex flex-col gap-xs mt-sm">
              <div className="flex items-center gap-xs text-on-surface-variant">
                <Book className="text-primary w-4 h-4" />
                <span className="font-body-md text-body-md">14 Buku Dibaca</span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant">
                <Clock className="text-primary w-4 h-4" />
                <span className="font-body-md text-body-md">28 Jam Membaca</span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant">
                <CloudDownload className="text-primary w-4 h-4" />
                <span className="font-body-md text-body-md">6 Buku Offline</span>
              </div>
            </div>
          </div>
          
          {/* Circular Progress Ring (CSS based in global or inline, here inline SVG) */}
          <div className="w-24 h-24 z-10 hidden md:block">
            <svg className="block mx-auto max-w-[80%] max-h-[250px] text-primary" viewBox="0 0 36 36">
              <path className="fill-none stroke-[#dfe4dc] stroke-[3.8]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <path className="fill-none stroke-primary stroke-[2.8] stroke-linecap-round" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <text className="fill-[#3b5836] font-[Plus Jakarta Sans] font-bold text-[0.5em]" x="18" y="20.35" textAnchor="middle">75%</text>
            </svg>
            <p className="font-label-md text-label-md text-center text-on-surface-variant mt-2">Target Bulanan</p>
          </div>
        </div>
      </section>

      {/* Segmented Navigation (TabBar) */}
      <section className="col-span-4 md:col-span-8 mb-lg border-b border-outline-variant/20">
        <div className="flex overflow-x-auto hide-scroll -mb-px">
          <button className="flex-1 whitespace-nowrap py-sm px-md border-b-2 border-primary text-primary font-title-md text-title-md">
            Sedang Dibaca
          </button>
          <button className="flex-1 whitespace-nowrap py-sm px-md border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-colors font-title-md text-title-md">
            Tersimpan Offline
          </button>
          <button className="flex-1 whitespace-nowrap py-sm px-md border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-colors font-title-md text-title-md">
            Favorit
          </button>
        </div>
      </section>

      {/* List Content (Sedang Dibaca) */}
      <section className="col-span-4 md:col-span-8 flex flex-col gap-md">
        {/* Book Card 1 */}
        <div className="bg-surface rounded-xl border border-outline-variant/10 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-md flex gap-md items-start">
          <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-variant relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBytu0Rn6l4EMfEJtl5t43Hr0IE1HRyrMvdvUJFF5Z1Ydrk8s7QsZEarM2-GBlJtKdfFBGpE7ey2o-e7_1gQyhn85NolAp_ag2ZTCPvKb52Pk-2yINxVZUasHpWKAn8XW1fU9G_ySlfnEb2gu0PCFajqkESUSvhzZKEXak9iyc7Jo5boGtBBuPbfvSJjKs8uf7lBUOYDjuR7Nb_cnXzevBg4Nk1NfeEphvkTGSYZpVjCw3GOoxIuQ10"
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between h-32">
            <div>
              <h3 className="font-title-md text-title-md text-on-surface line-clamp-1">Panduan Pertanian Modern Terpadu</h3>
              <p className="font-label-md text-label-md text-on-surface-variant line-clamp-1 mb-sm">Budi Santoso</p>
              <div className="flex items-center gap-sm mb-xs">
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[68%]"></div>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold">68%</span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant/80 text-xs">Terakhir dibaca: Kemarin, 19:30</p>
            </div>
            <div className="mt-sm flex justify-end">
              <button className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-full hover:bg-primary-container transition-colors shadow-sm">
                Lanjutkan
              </button>
            </div>
          </div>
        </div>

        {/* Book Card 2 */}
        <div className="bg-surface rounded-xl border border-outline-variant/10 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-md flex gap-md items-start">
          <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-variant relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1Jh7mlFnbxuUKmHwAIlcTmy1ZzW9Q4eXBvFHqDTIOOkFJIHTSXG_hv3ygvYTGi4tialCKKPXU5Zvt1CNq3rSkHfdInOw8TYKqYdtSIJ4DXpEgc1iC05Y1sWAHaRIhf1uh8H-l0AvPaSHH_cehUn4IzvmxHJGD8FRfGRy4IZj0GhKMOdPcWC2OC6SHlOaSAX5qZQdudXFz-PiJUOr0BAkY3N8GP-LFILStI49Qu2pjapKYyU0IndmL"
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between h-32">
            <div>
              <h3 className="font-title-md text-title-md text-on-surface line-clamp-1">Sejarah Desa Pangkalan</h3>
              <p className="font-label-md text-label-md text-on-surface-variant line-clamp-1 mb-sm">Tim Arsip Desa</p>
              <div className="flex items-center gap-sm mb-xs">
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[32%]"></div>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold">32%</span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant/80 text-xs">Terakhir dibaca: 2 Hari yang lalu</p>
            </div>
            <div className="mt-sm flex justify-end">
              <button className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-full hover:bg-primary-container transition-colors shadow-sm">
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Status */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <div className="bg-surface-container-high/90 backdrop-blur-md text-on-surface-variant font-label-md text-label-md px-md py-sm rounded-full shadow-sm border border-outline-variant/20 flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Tersinkronisasi dengan Server Desa
        </div>
      </div>
    </div>
  );
}
