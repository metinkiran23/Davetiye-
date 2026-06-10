import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryProps {
  items: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  const [filter, setFilter] = useState<'all' | 'journey' | 'engagement' | 'portraits'>('all');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);

  const openLightbox = (id: string) => {
    const idx = filteredItems.findIndex(item => item.id === id);
    if (idx !== -1) {
      setActiveIdx(idx);
    }
  };

  const closeLightbox = () => {
    setActiveIdx(null);
  };

  const showPrev = () => {
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const showNext = () => {
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % filteredItems.length);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 space-y-6">
      {/* Category filter pills */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-6">
        {[
          { label: 'Tümü', value: 'all' },
          { label: 'Yolculuğumuz', value: 'journey' },
          { label: 'Nişan Günü', value: 'engagement' },
          { label: 'Portreler', value: 'portraits' },
        ].map(btn => (
          <button
            key={btn.value}
            id={`gallery-filter-${btn.value}`}
            onClick={() => {
              setFilter(btn.value as any);
              closeLightbox();
            }}
            className={`px-4 sm:px-5 py-2 rounded-full font-serif text-xs tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
              filter === btn.value
                ? 'bg-stone-800 text-white border-stone-800 shadow-sm'
                : 'glass-panel text-stone-600 border-white/40 hover:border-stone-300 hover:bg-white/50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grid of gallery assets */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5 }}
              onClick={() => openLightbox(item.id)}
              className="group relative cursor-pointer overflow-hidden rounded-[24px] bg-stone-100 border border-white/40 aspect-3/4 sm:aspect-square shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={item.url}
                alt={item.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-stone-700 bg-white/85 px-2 py-0.5 rounded-full inline-block backdrop-blur-sm">
                    {item.category === 'journey' ? 'Yolculuk' : item.category === 'engagement' ? 'Nişan' : 'Portre'}
                  </span>
                  <p className="font-serif text-sm font-light italic leading-tight text-white/95">{item.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox fullscreen Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-4"
          >
            {/* Topbar inside lightbox */}
            <div className="flex justify-between items-center w-full max-w-6xl mx-auto pt-2 text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-stone-400" />
                <span className="font-serif text-sm font-light tracking-wide italic">Selin & Metin</span>
              </div>
              <button
                id="gallery-close-lightbox"
                onClick={closeLightbox}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Stage with Image and controls */}
            <div className="relative flex items-center justify-center flex-grow max-w-5xl mx-auto w-full">
              {/* Prev Button */}
              <button
                _id="gallery-btn-prev"
                onClick={showPrev}
                className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 h-6" />
              </button>

              <div className="relative max-h-[70vh] sm:max-h-[80vh] flex flex-col items-center select-none">
                <img
                  src={filteredItems[activeIdx].url}
                  alt={filteredItems[activeIdx].caption}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] sm:max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl border border-white/5"
                />
              </div>

              {/* Next Button */}
              <button
                _id="gallery-btn-next"
                onClick={showNext}
                className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-colors cursor-pointer"
              >
                <ArrowRight className="w-5 h-5 sm:w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption information */}
            <div className="w-full max-w-2xl mx-auto pb-4 text-center text-white space-y-1">
              <h5 className="font-serif italic text-base sm:text-lg text-stone-200 font-light">
                {filteredItems[activeIdx].caption}
              </h5>
              <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">
                GÖRSEL {activeIdx + 1} / {filteredItems.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
