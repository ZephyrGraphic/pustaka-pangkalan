"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  src?: string | null;
  alt: string;
  title: string;
  category?: string;
  className?: string;
  aspectRatio?: string;
}

export default function BookCover({
  src,
  alt,
  title,
  category = "Buku",
  className = "",
}: BookCoverProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div 
        className={`w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-primary/30 via-primary-container/40 to-surface-container-high border border-primary/20 rounded-2xl select-none ${className}`}
      >
        <div className="flex items-center justify-between">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-container/20 px-2 py-0.5 rounded-md">
            {category}
          </span>
        </div>
        <div>
          <h5 className="text-xs sm:text-sm font-bold text-on-surface line-clamp-3 leading-snug">
            {title}
          </h5>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl bg-surface-container-highest ${className}`}>
      <Image
        src={src}
        alt={alt || title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setError(true)}
      />
    </div>
  );
}
