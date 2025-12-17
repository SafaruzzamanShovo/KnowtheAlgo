import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, Check } from 'lucide-react';
import { cn, copyToClipboard } from '../../lib/utils';
import { useReadingPreferences } from '../../context/ReadingPreferences';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ children, className, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const { fontSize, lineHeight } = useReadingPreferences();

  // Dynamic text sizing based on preferences
  const textSize = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }[fontSize];

  // Dynamic line height
  const leadingClass = {
    'normal': 'leading-normal',
    'relaxed': 'leading-relaxed',
    'loose': 'leading-loose'
  }[lineHeight];

  const handleCopy = async () => {
    if (typeof children === 'string') {
      const success = await copyToClipboard(children);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleLink = async () => {
    if (id) {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      const success = await copyToClipboard(url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
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
        "text-gray-700 dark:text-gray-300 font-serif-reading transition-all duration-300",
        textSize,
        leadingClass,
        // Add extra bottom margin for loose spacing to improve readability
        lineHeight === 'loose' && "mb-8",
        className
      )}>
        {children}
      </p>
    </motion.div>
  );
};
