"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageCarousel({ images, altText = "Property Image" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] bg-slate-100 dark:bg-slate-800">
        <Image 
          src="https://placehold.co/1200x600/1e293b/ffffff?text=No+Image" 
          alt={altText} 
          fill
          unoptimized
          className="object-cover" 
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] bg-slate-100 dark:bg-slate-800 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image 
            src={images[currentIndex].url} 
            alt={`${altText} - ${currentIndex + 1}`} 
            fill
            quality={100}
            unoptimized
            priority={currentIndex === 0}
            className="object-cover" 
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          {/* Controls */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 shadow-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex 
                    ? "bg-white scale-125 shadow-sm" 
                    : "bg-white/50 hover:bg-white/80 shadow-sm"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
