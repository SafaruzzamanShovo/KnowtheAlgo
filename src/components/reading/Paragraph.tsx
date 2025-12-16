import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReadingPreferences } from '../../context/ReadingPreferences';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ children, className, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const { fontSize } = useReadingPreferences();

  // Dynamic text sizing based on preferences
  const textSize = {
    sm: 'text-base',
    base: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[fontSize];

  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLink = () => {
    if (id) {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
      setCopied(true); // Reuse copied state for visual feedback
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative group mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={id}
    >
      {/* Interaction Menu (Desktop Only) */}
      <div className={cn(
        "hidden lg:flex absolute -left-12 top-1 flex-col gap-1 transition-opacity duration-200",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <button 
          onClick={handleCopy}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
          title="Copy paragraph"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
        {id && (
          <button 
            onClick={handleLink}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
            title="Copy link to paragraph"
          >
            <Link size={14} />
          </button>
        )}
      </div>

      <p className={cn(
        "text-gray-700 dark:text-gray-300 leading-relaxed font-serif-reading transition-colors duration-300",
        textSize,
        className
      )}>
        {children}
      </p>
    </motion.div>
  );
};
