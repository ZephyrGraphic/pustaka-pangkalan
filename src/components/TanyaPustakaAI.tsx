"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, Mic, MicOff, BookOpen, ChevronDown } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function TanyaPustakaAI() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Sampurasun! 🙏 Saya **Tanya Pustaka AI**, asisten cerdas perpustakaan Desa Pangkalan. Ada yang bisa saya bantu seputar pertanian, bioflok, usaha UMKM, atau budaya Sunda?",
      time: "Baru saja",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply || "Maaf, saya sedang mengalami kendala. Silakan coba kembali sesaat lagi.",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Voice speech-to-text
  const toggleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Browser Anda belum mendukung input suara langsung. Silakan gunakan ketikan teks.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
    }
  };

  const quickPrompts = [
    "🌾 Cara atasi hama wereng",
    "🐟 Takaran pakan bioflok",
    "📚 Tata krama basa Sunda",
    "💼 Cara catat kas UMKM",
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 bg-gradient-to-r from-primary via-emerald-600 to-green-700 text-on-primary px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all group border border-white/20"
          aria-label="Buka Tanya Pustaka AI"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          </div>
          <span>Tanya Pustaka AI</span>
        </button>
      )}

      {/* Slide-up Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-0 md:bottom-6 right-0 md:right-6 z-[99999] w-full md:w-[420px] h-[580px] max-h-[90vh] bg-surface-container text-on-surface rounded-t-3xl md:rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-primary to-emerald-800 text-on-primary p-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-title-md text-sm font-bold leading-tight">Tanya Pustaka AI</h3>
                <p className="text-[11px] text-white/80">Asisten Pengetahuan Desa Pangkalan</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Tutup Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed shadow-sm whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-primary text-on-primary rounded-tr-none"
                      : "bg-surface-container-highest/80 text-on-surface rounded-tl-none border border-outline-variant/20"
                  }`}
                >
                  {m.text}
                  <span className={`block text-[9px] mt-1.5 opacity-70 ${m.sender === "user" ? "text-right" : "text-left"}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-on-surface-variant p-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Mencari rujukan modul perpustakaan...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-surface-container-low border-t border-outline-variant/15 flex gap-1.5 overflow-x-auto hide-scroll shrink-0">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-xl bg-surface-container-high hover:bg-primary/15 text-[11px] font-semibold text-on-surface whitespace-nowrap transition-colors border border-outline-variant/20"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-surface-container border-t border-outline-variant/20 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
                }`}
                title="Tanya dengan Suara (Mikrofon)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                placeholder={isListening ? "Mendengarkan suara Anda..." : "Ketik pertanyaan di sini..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary transition-all disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
