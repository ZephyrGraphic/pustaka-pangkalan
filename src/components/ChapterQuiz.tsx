"use client";

import { useState } from "react";
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ChapterQuizProps {
  chapterId: string;
  chapterTitle: string;
  category?: string;
}

export default function ChapterQuiz({
  chapterId,
  chapterTitle,
  category = "Umum",
}: ChapterQuizProps) {
  const { data: session } = useSession();

  // Generate dynamic 3 questions based on chapter category
  const getQuestions = (): Question[] => {
    if (category.toLowerCase().includes("sunda") || category.toLowerCase().includes("sejarah")) {
      return [
        {
          id: 1,
          question: "Berapa jumlah Aksara Swara (vokal mandiri) dalam sistem Aksara Sunda baku?",
          options: ["5 Aksara", "7 Aksara (a, i, u, e, o, eu, e)", "10 Aksara", "12 Aksara"],
          correctIndex: 1,
          explanation: "Aksara Sunda baku memiliki 7 Aksara Swara vokal mandiri.",
        },
        {
          id: 2,
          question: "Dalam tata krama basa Sunda, kata 'dahar' berubah menjadi apa untuk menghormati lawan bicara yang lebih sepuh?",
          options: ["Neda", "Tuang", "Nyatu", "Loma"],
          correctIndex: 1,
          explanation: "'Tuang' digunakan dalam ragam basa lemes keur batur (menghormati orang lain).",
        },
        {
          id: 3,
          question: "Apa tujuan utama pelestarian kearifan lokal bagi masyarakat Desa Pangkalan?",
          options: [
            "Menjaga identitas budaya dan nilai luhur leluhur untuk generasi mendatang",
            "Sekadar formalitas acara desa",
            "Menggantikan seluruh teknologi modern",
            "Menghapus bahasa nasional"
          ],
          correctIndex: 0,
          explanation: "Pelestarian budaya bertujuan menjaga warisan nilai luhur dan identitas komunitas desa.",
        },
      ];
    }

    if (category.toLowerCase().includes("tani") || category.toLowerCase().includes("pertanian")) {
      return [
        {
          id: 1,
          question: "Apa fungsi utama bakteri heterotrof dalam kolam budidaya sistem bioflok?",
          options: [
            "Mengubah amonia berbahaya menjadi flok nutrisi tinggi",
            "Menaikkan suhu air kolam",
            "Membuat air kolam menjadi bening total",
            "Membasmi seluruh mikroba di air"
          ],
          correctIndex: 0,
          explanation: "Bakteri heterotrof memanfaatkan karbon organik untuk mengikat amonia menjadi gumpalan protein flok.",
        },
        {
          id: 2,
          question: "Kapan waktu paling ideal untuk melakukan penebaran benih ikan nila di kolam desa?",
          options: ["Tengah hari saat terik", "Pagi atau sore hari saat suhu stabil", "Tengah malam", "Saat hujan badai"],
          correctIndex: 1,
          explanation: "Penebaran dilakukan saat pagi atau sore untuk mencegah stres termal pada benih ikan.",
        },
        {
          id: 3,
          question: "Berapa persentase efisiensi penghematan air yang dapat dicapai dengan teknologi bioflok?",
          options: ["10%", "30%", "Hingga 80%", "0%"],
          correctIndex: 2,
          explanation: "Sistem bioflok mampu menghemat penggunaan air hingga 80% karena minim pergantian air.",
        },
      ];
    }

    // Default / General Questions
    return [
      {
        id: 1,
        question: `Apa gagasan atau topik utama yang dibahas pada ${chapterTitle}?`,
        options: [
          "Pengembangan keterampilan dan wawasan warga desa",
          "Hiburan semata tanpa nilai edukasi",
          "Informasi yang tidak relevan dengan desa",
          "Iklan komersial luar negeri"
        ],
        correctIndex: 0,
        explanation: "Materi ini dirancang untuk menunjang wawasan dan kemajuan masyarakat Desa Pangkalan.",
      },
      {
        id: 2,
        question: "Mengapa literasi digital penting bagi keberlanjutan kemandirian desa?",
        options: [
          "Membuka akses ilmu pengetahuan, peluang usaha, dan pengelolaan desa yang transparan",
          "Agar warga tidak perlu berinteraksi di dunia nyata",
          "Hanya untuk memenuhi syarat formalitas",
          "Mengurangi kegiatan gotong royong"
        ],
        correctIndex: 0,
        explanation: "Literasi digital mempercepat pertukaran informasi positif dan inovasi ekonomi desa.",
      },
      {
        id: 3,
        question: "Bagaimana cara menerapkan isi bacaan ini dalam kehidupan bermasyarakat?",
        options: [
          "Mempraktikkannya secara bertahap dan membagikan ilmunya kepada sesama warga",
          "Menyimpannya tanpa pernah diterapkan",
          "Menunggu instruksi dari pihak luar",
          "Melupakan materi setelah selesai membaca"
        ],
        correctIndex: 0,
        explanation: "Ilmu yang bermanfaat adalah ilmu yang dipraktikkan dan disebarluaskan bagi kebaikan bersama.",
      },
    ];
  };

  const questions = getQuestions();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [awardedData, setAwardedData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentStep] !== undefined) return; // already answered this step

    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentStep] = optionIdx;
    setSelectedAnswers(nextAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    setShowResult(true);
    const score = selectedAnswers.reduce((acc, ans, idx) => {
      return ans === questions[idx].correctIndex ? acc + 1 : acc;
    }, 0);

    if (session?.user && !submitted) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/user/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapterId,
            score,
            totalQuestions: questions.length,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setAwardedData(data);
          setSubmitted(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setSubmitted(false);
    setAwardedData(null);
  };

  const currentQ = questions[currentStep];
  const isCurrentAnswered = selectedAnswers[currentStep] !== undefined;
  const isCurrentCorrect = isCurrentAnswered && selectedAnswers[currentStep] === currentQ.correctIndex;

  const totalScore = selectedAnswers.reduce((acc, ans, idx) => {
    return ans === questions[idx]?.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="my-10 bg-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-md">
      {!showResult ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
                  Kuis Pemahaman Bab
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Uji pemahaman Anda dan dapatkan Poin Literasi Desa!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-center">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? "w-8 bg-primary"
                      : idx < currentStep
                      ? "w-4 bg-primary/40"
                      : "w-4 bg-surface-container-highest"
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-on-surface-variant ml-2">
                {currentStep + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Pertanyaan #{currentStep + 1}
            </span>
            <h4 className="font-title-md text-base sm:text-lg font-bold text-on-surface leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Option Choices */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentStep] === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;

              let optionStyle = "bg-surface-container-high border-outline-variant/30 text-on-surface hover:bg-surface-container-highest";

              if (isCurrentAnswered) {
                if (isCorrect) {
                  optionStyle = "bg-green-500/15 border-green-500/50 text-green-700 dark:text-green-300 font-bold";
                } else if (isSelected && !isCorrect) {
                  optionStyle = "bg-error/15 border-error/50 text-error font-bold";
                } else {
                  optionStyle = "bg-surface-container-high/50 border-outline-variant/15 text-on-surface-variant/50 opacity-60";
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  disabled={isCurrentAnswered}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {isCurrentAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  )}
                  {isCurrentAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-error shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isCurrentAnswered && (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm border animate-fade-in ${
              isCurrentCorrect ? "bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-200" : "bg-error/10 border-error/30 text-error"
            }`}>
              <p className="font-bold mb-0.5">{isCurrentCorrect ? "Tepat Sekali!" : "Jawaban Kurang Tepat"}</p>
              <p className="opacity-90">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isCurrentAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95"
              >
                <span>{currentStep < questions.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil Kuis"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="text-center py-6 space-y-6 animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl bg-primary-container text-on-primary-container flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-primary">Hasil Evaluasi Membaca</span>
            <h3 className="text-2xl font-bold text-on-surface">
              Skor Anda: {totalScore} dari {questions.length} Benar!
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
              {totalScore === questions.length
                ? "Luar biasa! Pemahaman Anda terhadap materi bab ini sempurna."
                : totalScore >= 2
                ? "Bagus sekali! Anda telah memahami sebagian besar poin penting bacaan."
                : "Terus semangat! Anda dapat membaca ulang bab ini untuk memperkuat pemahaman."}
            </p>
          </div>

          {/* Points Reward Banner */}
          {awardedData && (
            <div className="bg-gradient-to-r from-primary/15 via-primary-container/20 to-primary/15 border border-primary/30 p-5 rounded-3xl max-w-md mx-auto space-y-2 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-base">
                <Sparkles className="w-5 h-5" />
                <span>+{awardedData.earnedPoints} Poin Literasi Desa Diterima!</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Total Poin Anda: <strong>{awardedData.totalPoints} Poin</strong> • Lencana: <strong>{awardedData.currentBadge}</strong>
              </p>
            </div>
          )}

          {!session && (
            <p className="text-xs text-on-surface-variant italic">
              Login ke akun warga untuk menyimpan poin dan mengumpulkan lencana literasi!
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-all border border-outline-variant/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Kuis Lagi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
