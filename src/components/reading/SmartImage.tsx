import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SmartImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({ src, alt, caption, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.figure
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className={cn("my-10 group relative", className)}
      >
        <div 
          className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-zoom-in"
          onClick={() => setIsOpen(true)}
        >
          <motion.img
            layoutId={`image-${src}`}
            src={src}
            alt={alt}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Maximize2 size={12} /> Click to expand
            </div>
          </div>
        </div>

        {caption && (
          <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">
            {caption}
          </figcaption>
        )}
      </motion.figure>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl p-4 md:p-10 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            >
              <X size={24} />
            </button>

            <motion.img
              layoutId={`image-${src}`}
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            {caption && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-6 left-0 right-0 text-center pointer-events-none"
              >
                <span className="inline-block bg-black/75 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
                  {caption}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
