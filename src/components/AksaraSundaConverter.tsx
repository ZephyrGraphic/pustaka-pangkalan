"use client";

import { useState } from "react";
import { BookOpen, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

// Comprehensive Latin to Aksara Sunda Transliteration Engine
function transliterateToAksaraSunda(text: string): string {
  if (!text) return "";

  // Swara (Vowels)
  const swara: { [key: string]: string } = {
    a: "ᮃ",
    i: "ᮄ",
    u: "ᮅ",
    e: "ᮈ",
    o: "ᮇ",
    eu: "ᮉ",
    é: "ᮈ",
  };

  // Ngalagena (Consonants)
  const ngalagena: { [key: string]: string } = {
    k: "ᮊ",
    g: "ᮌ",
    ng: "ᮍ",
    c: "ᮎ",
    j: "ᮏ",
    ny: "ᮑ",
    t: "ᮒ",
    d: "ᮓ",
    n: "ᮔ",
    p: "ᮕ",
    b: "ᮘ",
    m: "ᮙ",
    y: "ᮚ",
    r: "ᮛ",
    l: "ᮜ",
    w: "ᮝ",
    s: "ᮞ",
    h: "ᮠ",
    f: "ᮖ",
    v: "ᮗ",
    z: "ᮐ",
    x: "ᮊ᮪ᮞ",
    q: "ᮋ",
  };

  // Rarangken (Diacritics)
  const rarangken: { [key: string]: string } = {
    i: "ᮤ",   // Panghulu
    u: "ᮥ",   // Panyuku
    e: "ᮨ",   // Pamepet
    o: "ᮧ",   // Panolong
    eu: "ᮩ",  // Paneuleung
    é: "ᮦ",   // Paneleng
  };

  const pamaeh = "᮪";     // Pamaéh (Vowel killer)
  const panyecek = "ᮀ";   // Final ng
  const panglayar = "ᮁ";  // Final r
  const pangwisad = "ᮂ";  // Final h

  let result = "";
  let i = 0;
  const lower = text.toLowerCase();

  while (i < lower.length) {
    const char = lower[i];

    // Check spaces / punctuation
    if (!/[a-z0-9é]/.test(char)) {
      result += char;
      i++;
      continue;
    }

    // Check two-char consonant (ng, ny)
    let cons = "";
    if (i + 1 < lower.length && (lower.substr(i, 2) === "ng" || lower.substr(i, 2) === "ny")) {
      cons = lower.substr(i, 2);
      i += 2;
    } else if (ngalagena[char]) {
      cons = char;
      i++;
    }

    if (cons) {
      // Check vowel following consonant
      let vowel = "";
      if (i + 1 < lower.length && lower.substr(i, 2) === "eu") {
        vowel = "eu";
        i += 2;
      } else if (i < lower.length && /[aiueoé]/.test(lower[i])) {
        vowel = lower[i];
        i++;
      }

      const baseCons = ngalagena[cons] || "";
      if (vowel === "a") {
        result += baseCons;
      } else if (vowel && rarangken[vowel]) {
        result += baseCons + rarangken[vowel];
      } else if (vowel) {
        result += baseCons;
      } else {
        // Standalone consonant at end of word/syllable
        if (cons === "ng") {
          result += panyecek;
        } else if (cons === "r") {
          result += panglayar;
        } else if (cons === "h") {
          result += pangwisad;
        } else {
          result += baseCons + pamaeh;
        }
      }
    } else {
      // Standalone initial vowel
      let vowel = "";
      if (i + 1 < lower.length && lower.substr(i, 2) === "eu") {
        vowel = "eu";
        i += 2;
      } else if (/[aiueoé]/.test(char)) {
        vowel = char;
        i++;
      }

      if (vowel && swara[vowel]) {
        result += swara[vowel];
      } else {
        result += char;
        i++;
      }
    }
  }

  return result;
}

export default function AksaraSundaConverter() {
  const toast = useToast();
  const [inputText, setInputText] = useState("sampurasun pangkalan");
  const [copied, setCopied] = useState(false);

  const convertedText = transliterateToAksaraSunda(inputText);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    toast.success("Aksara Sunda berhasil disalin ke papan klip!");
    setTimeout(() => setCopied(false), 2000);
  };

  const samplePhrases = [
    "wilujeng sumping",
    "pustaka pangkalan",
    "desa maju mandiri",
    "gotong royong",
  ];

  return (
    <section className="bg-surface-container rounded-3xl p-6 sm:p-7 border border-outline-variant/20 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            ᮞ
          </div>
          <div>
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Konverter & Edukasi Aksara Sunda
            </h3>
            <p className="text-xs text-on-surface-variant">
              Tulis aksara Latin untuk mengubah ke Aksara Sunda Baku (Kaganga) secara langsung.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
            Teks Huruf Latin
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik teks di sini (contoh: sampurasun)..."
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner leading-relaxed"
          />
        </div>

        {/* Output Box */}
        <div className="space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                Aksara Sunda Baku
              </label>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Tersalin" : "Salin Aksara"}</span>
              </button>
            </div>
            <div className="w-full min-h-[105px] bg-primary-container/10 border border-primary/20 rounded-2xl p-4 text-xl sm:text-2xl text-primary font-serif font-bold leading-loose tracking-widest break-words select-all shadow-inner">
              {convertedText || "ᮞᮙ᮪ᮕᮥᮛᮞᮥᮔ᮪"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Example Chips */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scroll pt-2">
        <span className="text-[11px] font-bold text-on-surface-variant uppercase shrink-0">
          Contoh Frasa:
        </span>
        {samplePhrases.map((phrase) => (
          <button
            key={phrase}
            onClick={() => setInputText(phrase)}
            className="px-3 py-1 rounded-xl bg-surface-container-high hover:bg-primary/10 text-xs text-on-surface font-medium whitespace-nowrap transition-colors border border-outline-variant/20"
          >
            {phrase}
          </button>
        ))}
      </div>
    </section>
  );
}
