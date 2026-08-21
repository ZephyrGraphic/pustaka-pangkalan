"use client";

import { useState } from "react";
import { Gift, Award, Printer, CheckCircle2, Sparkles, X, Sprout, Coffee, FileCheck } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  icon: any;
  type: "physical" | "certificate";
}

interface RewardRedemptionProps {
  userPoints: number;
  userName: string;
  userNik: string;
  userAddress: string;
  userBadge: string;
}

export default function RewardRedemption({
  userPoints,
  userName,
  userNik,
  userAddress,
  userBadge,
}: RewardRedemptionProps) {
  const toast = useToast();
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const rewards: RewardItem[] = [
    {
      id: "bibit",
      title: "Paket Bibit Sayur & Pupuk Hayati",
      pointsCost: 200,
      description: "Ambil paket benih cabai/tomat dan kompos di Balai Desa Pangkalan.",
      icon: Sprout,
      type: "physical",
    },
    {
      id: "umkm",
      title: "Voucher Produk UMKM Desa Pangkalan",
      pointsCost: 400,
      description: "Voucher belanja olahan pangan & keripik singkong khas warga.",
      icon: Coffee,
      type: "physical",
    },
    {
      id: "certificate",
      title: "Piagam Penghargaan Warga Teladan Literasi",
      pointsCost: 600,
      description: "Sertifikat resmi penghargaan dari Pemerintah Desa Pangkalan.",
      icon: FileCheck,
      type: "certificate",
    },
  ];

  const handleClaim = (reward: RewardItem) => {
    if (userPoints < reward.pointsCost) {
      toast.warning(`Poin Anda (${userPoints}) belum mencukupi untuk klaim hadiah ini (${reward.pointsCost} Poin). Ayo baca lebih banyak bab!`);
      return;
    }

    if (reward.type === "certificate") {
      setShowCertificateModal(true);
      return;
    }

    setClaimedRewards((prev) => [...prev, reward.id]);
    toast.success(`Selamat! Kode klaim hadiah "${reward.title}" telah aktif. Tunjukkan profil ini kepada petugas di Balai Desa.`);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <section className="bg-surface-container rounded-3xl p-6 sm:p-7 border border-outline-variant/20 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Penukaran Poin & Apresiasi Literasi Desa
            </h3>
            <p className="text-xs text-on-surface-variant">
              Tukarkan Poin Literasi yang Anda kumpulkan dari membaca dan kuis dengan cinderamata desa.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/20 shrink-0">
          ⭐ {userPoints} Poin Tersedia
        </span>
      </div>

      {/* Rewards Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {rewards.map((r) => {
          const Icon = r.icon;
          const isAffordable = userPoints >= r.pointsCost;
          const isClaimed = claimedRewards.includes(r.id);

          return (
            <div
              key={r.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                isAffordable
                  ? "bg-surface-container-high/60 border-primary/30 hover:border-primary shadow-sm"
                  : "bg-surface-container-high/30 border-outline-variant/20 opacity-75"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-500">
                    {r.pointsCost} Poin
                  </span>
                </div>
                <h4 className="font-title-md text-xs sm:text-sm font-bold text-on-surface leading-snug">
                  {r.title}
                </h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleClaim(r)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isClaimed
                      ? "bg-emerald-700 text-white"
                      : isAffordable
                      ? "bg-primary hover:bg-primary/90 text-on-primary"
                      : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  {isClaimed
                    ? "✓ Siap Diambil di Balai Desa"
                    : r.type === "certificate"
                    ? "Buka & Cetak Piagam"
                    : isAffordable
                    ? "Tukarkan Poin"
                    : `Kurang ${r.pointsCost - userPoints} Poin`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setShowCertificateModal(false)}
        >
          <div 
            className="relative bg-white text-slate-900 rounded-3xl p-6 sm:p-12 shadow-2xl border-4 border-amber-500 max-h-[92vh] overflow-y-auto w-full max-w-2xl my-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Pratinjau Piagam Penghargaan Resmi Desa</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Piagam</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Decorative Border & Design */}
            <div className="border-2 border-dashed border-amber-600/40 p-6 sm:p-8 rounded-2xl text-center space-y-5 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest font-bold text-slate-600">Pemerintah Desa Pangkalan</p>
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-amber-900 tracking-wider font-serif">
                  Piagam Penghargaan
                </h1>
                <p className="text-xs text-amber-700 font-semibold uppercase tracking-widest">
                  Nomor: 421.1 / LIT-DESA / {new Date().getFullYear()}
                </p>
              </div>

              <p className="text-xs text-slate-600">Diberikan dengan penuh hormat dan apresiasi kepada:</p>

              <div className="py-2 border-b-2 border-slate-900 max-w-md mx-auto">
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-serif">{userName}</h2>
                <p className="text-xs text-slate-600 font-mono mt-0.5">NIK: {userNik} • {userAddress}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto">
                Atas dedikasi, semangat belajar, dan keteladanan dalam menggiatkan budaya literasi membaca di <strong>Pustaka Digital Desa Pangkalan</strong> dengan pencapaian gelar <strong>&quot;{userBadge}&quot;</strong> ({userPoints} Poin).
              </p>

              <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-slate-800">
                <div>
                  <p>Ketua Pengelola Pustaka,</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline">( Tim Literasi Pangkalan )</p>
                </div>
                <div>
                  <p>Kepala Desa Pangkalan,</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline">( Kepala Desa Pangkalan )</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
