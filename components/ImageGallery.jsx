"use client";

import { useState } from 'react';
import Image from 'next/image';
import { LayoutGrid, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ images, altText = "Property Image" }) {
  const [showAll, setShowAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] bg-[#030711]">
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

  const handleOpenGallery = (index = 0) => {
    setCurrentIndex(index);
    setShowAll(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseGallery = () => {
    setShowAll(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const blurPlaceholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTI5M2IiLz48L3N2Zz4=";

  return (
    <>
      {/* Desktop Grid Layout */}
      <div className="relative hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-3xl overflow-hidden group">
        <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={() => handleOpenGallery(0)}>
          <Image 
            src={images[0]?.url} 
            alt={`${altText} 1`}
            fill
            quality={100}
            priority
            placeholder="blur"
            blurDataURL={blurPlaceholder}
            className="object-cover hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </div>
        
        {images.slice(1, 5).map((img, idx) => (
          <div 
            key={idx} 
            className={`relative cursor-pointer overflow-hidden ${images.length === 4 && idx === 2 ? 'col-span-2' : ''}`} 
            onClick={() => handleOpenGallery(idx + 1)}
          >
            <Image 
              src={img.url} 
              alt={`${altText} ${idx + 2}`}
              fill
              quality={100}
              placeholder="blur"
              blurDataURL={blurPlaceholder}
              className="object-cover hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </div>
        ))}

        <button 
          onClick={() => handleOpenGallery(0)}
          className="absolute bottom-4 right-4 bg-[#0d0f1b]/90 hover:bg-[#1c2143] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg backdrop-blur-md transition-all active:scale-95 z-10 border border-[#1c2143]"
        >
          <LayoutGrid className="w-5 h-5 text-[#802BB1]" />
          Show all photos
        </button>
      </div>

      {/* Mobile Swipe Layout */}
      <div className="relative md:hidden rounded-3xl overflow-hidden aspect-[4/3] bg-[#030711] group">
        <Image 
          src={images[0]?.url} 
          alt={`${altText} 1`}
          fill
          quality={100}
          priority
          placeholder="blur"
          blurDataURL={blurPlaceholder}
          className="object-cover" 
          onClick={() => handleOpenGallery(0)}
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-md">
            1 / {images.length}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030711]/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-[#1c2143]">
              <span className="text-white font-bold">{currentIndex + 1} / {images.length}</span>
              <button 
                onClick={handleCloseGallery}
                className="p-2 bg-[#0d0f1b] hover:bg-[#1c2143] text-white rounded-full transition-colors border border-[#1c2143]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-4">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-5xl aspect-video md:aspect-[16/9]"
              >
                <Image 
                  src={images[currentIndex]?.url} 
                  alt={`${altText} ${currentIndex + 1}`}
                  fill
                  quality={100}
                  className="object-contain" 
                />
              </motion.div>

              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-[#0d0f1b]/80 hover:bg-[#1c2143] text-white rounded-full backdrop-blur-md transition-all shadow-lg border border-[#1c2143]"
                  >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-[#802BB1]" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-[#0d0f1b]/80 hover:bg-[#1c2143] text-white rounded-full backdrop-blur-md transition-all shadow-lg border border-[#1c2143]"
                  >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-[#802BB1]" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
