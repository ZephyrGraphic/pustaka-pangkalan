"use client";

import { Search, X, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/books?search=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.books) {
          setSuggestions(data.books.slice(0, 4));
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form 
        onSubmit={handleSearch}
        className="relative flex items-center w-full shadow-[0px_4px_20px_rgba(0,0,0,0.04)] rounded-[20px] bg-surface border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
      >
        <Search className="absolute left-4 text-on-surface-variant w-5 h-5" />
        <input
          className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-body-lg rounded-[20px] focus:ring-0 outline-none placeholder:text-on-surface-variant/70 text-on-surface"
          placeholder="Cari modul pertanian, e-book, atau cerita rakyat..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
        />
        {query && (
          <button 
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setShowDropdown(false);
            }}
            className="absolute right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Live Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl z-50 overflow-hidden backdrop-blur-xl animate-fade-in-up">
          <div className="p-2 divide-y divide-outline-variant/20">
            {suggestions.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-high transition-colors group"
              >
                <div className="w-10 h-14 relative bg-surface-container-highest rounded-lg overflow-hidden shrink-0">
                  {book.coverUrl ? (
                    <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-outline-variant" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-label-md text-[10px] uppercase font-bold text-primary px-1.5 py-0.5 rounded bg-primary-container/20">
                    {book.category}
                  </span>
                  <h4 className="font-title-md text-sm font-semibold text-on-surface truncate mt-0.5 group-hover:text-primary transition-colors">
                    {book.title}
                  </h4>
                  <p className="font-body-md text-xs text-on-surface-variant truncate">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={handleSearch}
            className="w-full p-3 bg-surface-container-high text-primary font-title-md text-xs flex items-center justify-center gap-1.5 hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            <span>Lihat semua hasil untuk "{query}"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
