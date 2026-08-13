"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
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
      />
      <button 
        type="submit"
        className="absolute right-4 text-primary hover:bg-surface-container rounded-full p-2 transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
}
