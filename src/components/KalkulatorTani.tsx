"use client";

import { useState } from "react";
import { Calculator, Sprout, Waves, DollarSign, Check, Info, Sparkles } from "lucide-react";

export default function KalkulatorTani() {
  const [activeMode, setActiveMode] = useState<"padi" | "bioflok">("padi");

  // Mode Padi: Luas Lahan
  const [landArea, setLandArea] = useState<number>(100); // dalam bata (1 bata = 14 m2)
  const [seedType, setSeedType] = useState<string>("Inpari 32");

  // Mode Bioflok: Ukuran Kolam
  const [poolDiameter, setPoolDiameter] = useState<number>(3); // meter (D3)
  const [waterHeight, setWaterHeight] = useState<number>(1); // meter

  // Perhitungan Padi (1 bata = 14 m2, 1 Ha = 700 bata)
  const totalM2 = landArea * 14;
  const ureaNeedKg = ((totalM2 / 10000) * 250).toFixed(1); // 250 kg/Ha
  const npkNeedKg = ((totalM2 / 10000) * 300).toFixed(1); // 300 kg/Ha
  const organikNeedKg = ((totalM2 / 10000) * 2000).toFixed(0); // 2 ton/Ha
  const seedNeedKg = ((totalM2 / 10000) * 25).toFixed(1); // 25 kg/Ha
  const estHarvestTon = ((totalM2 / 10000) * 6.5).toFixed(2); // 6.5 ton GKP/Ha
  const estGrossRevenueRp = (Number(estHarvestTon) * 1000 * 6500).toLocaleString("id-ID"); // Rp 6.500/kg GKP

  // Perhitungan Bioflok (Volume Tabung = PI * r^2 * t)
  const radius = poolDiameter / 2;
  const poolVolumeM3 = (Math.PI * radius * radius * waterHeight).toFixed(2);
  const fishSeedCount = Math.round(Number(poolVolumeM3) * 90); // 90-100 ekor/m3
  const molassesNeedGram = Math.round(Number(poolVolumeM3) * 50); // 50-100 ml per m3
  const saltNeedKg = (Number(poolVolumeM3) * 1.5).toFixed(1); // 1.5 kg/m3
  const probioticNeedGram = Math.round(Number(poolVolumeM3) * 10); // 10 gr/m3
  const estFishHarvestKg = Math.round((fishSeedCount * 0.85) / 8); // SR 85%, size 8 ekor/kg
  const estBioflokRevenueRp = (estFishHarvestKg * 24000).toLocaleString("id-ID"); // Rp 24.000/kg lele/nila

  return (
    <section className="bg-surface-container rounded-3xl p-6 sm:p-7 border border-outline-variant/20 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Kalkulator Tani & Bioflok Pintar Pangkalan
            </h3>
            <p className="text-xs text-on-surface-variant">
              Hitung takaran pupuk, kebutuhan benih, dan estimasi hasil panen secara presisi.
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-2xl border border-outline-variant/20 shrink-0">
          <button
            onClick={() => setActiveMode("padi")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === "padi"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Sawah Padi</span>
          </button>
          <button
            onClick={() => setActiveMode("bioflok")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === "bioflok"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Kolam Bioflok</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Sawah Padi */}
      {activeMode === "padi" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Luas Lahan Sawah (Satuan Bata / Tumbak)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={landArea}
                  onChange={(e) => setLandArea(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner font-semibold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-medium">
                  = {totalM2.toLocaleString("id-ID")} m²
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">1 bata = 14 m² (Standar ukuran sawah Desa Pangkalan)</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Varietas Bibit Unggul
              </label>
              <select
                value={seedType}
                onChange={(e) => setSeedType(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner font-semibold"
              >
                <option value="Inpari 32">Inpari 32 (Tahan Hawar & Wereng)</option>
                <option value="Ciherang">Ciherang (Nasi Pulen Favorit Pasar)</option>
                <option value="Pandan Wangi">Pandan Wangi (Aroma Wangi Premium)</option>
                <option value="Ketul">Ketan Putih Lokal Pangkalan</option>
              </select>
              <p className="text-[11px] text-on-surface-variant">Rujukan dari Modul Tani Modern Bab 1 & 2</p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-primary-container/10 p-4 rounded-2xl border border-primary/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Kebutuhan Benih</span>
              <span className="text-base sm:text-lg font-bold text-primary">{seedNeedKg} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Pupuk NPK 15-15-15</span>
              <span className="text-base sm:text-lg font-bold text-on-surface">{npkNeedKg} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Pupuk Urea</span>
              <span className="text-base sm:text-lg font-bold text-on-surface">{ureaNeedKg} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Pupuk Kandang/Kompos</span>
              <span className="text-base sm:text-lg font-bold text-on-surface">{organikNeedKg} kg</span>
            </div>
          </div>

          {/* Revenue Estimation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20">
            <div>
              <span className="text-xs font-bold text-on-surface block">Estimasi Hasil Panen Gabah (GKP):</span>
              <p className="text-xs text-on-surface-variant">Rata-rata 6.5 ton/Ha pada musim tanam normal</p>
            </div>
            <div className="text-right">
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ± {estHarvestTon} Ton (Rp {estGrossRevenueRp})
              </span>
              <span className="text-[10px] text-on-surface-variant block">Harga acuan Rp 6.500/kg GKP</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Bioflok */}
      {activeMode === "bioflok" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Diameter Kolam Terpal Bulat (Meter)
              </label>
              <select
                value={poolDiameter}
                onChange={(e) => setPoolDiameter(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner font-semibold"
              >
                <option value="2">D2 (Diameter 2 Meter)</option>
                <option value="3">D3 (Diameter 3 Meter - Standar Desa)</option>
                <option value="4">D4 (Diameter 4 Meter)</option>
                <option value="5">D5 (Diameter 5 Meter)</option>
              </select>
              <p className="text-[11px] text-on-surface-variant">Volume air efektif: ~{poolVolumeM3} m³ (Ketinggian 1.0 m)</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Ketinggian Air Kolam
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="1.5"
                value={waterHeight}
                onChange={(e) => setWaterHeight(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner font-semibold"
              />
              <p className="text-[11px] text-on-surface-variant">Ideal 0.8 - 1.1 meter untuk menjaga aerasi dasar</p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-primary-container/10 p-4 rounded-2xl border border-primary/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Kapasitas Tebar Bibit</span>
              <span className="text-base sm:text-lg font-bold text-primary">{fishSeedCount.toLocaleString("id-ID")} ekor</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Garam Krosok Awal</span>
              <span className="text-base sm:text-lg font-bold text-on-surface">{saltNeedKg} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Molase / Tetes Tebu</span>
              <span className="text-base sm:text-lg font-bold text-on-surface">{molassesNeedGram} mL</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Probiotik Bacillus</span>
              <span className="text-base sm:text-lg font-bold text-on-surface">{probioticNeedGram} gram</span>
            </div>
          </div>

          {/* Revenue Estimation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20">
            <div>
              <span className="text-xs font-bold text-on-surface block">Estimasi Hasil Panen Lele/Nila:</span>
              <p className="text-xs text-on-surface-variant">Siklus 75-90 hari dengan Survival Rate ~85%</p>
            </div>
            <div className="text-right">
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ± {estFishHarvestKg} kg (Rp {estBioflokRevenueRp})
              </span>
              <span className="text-[10px] text-on-surface-variant block">Harga pasar Rp 24.000/kg</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
