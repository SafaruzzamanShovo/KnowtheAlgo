import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  // Can accept content blocks (legacy) or HTML string (rich)
  content: any; 
  isRichContent: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content, isRichContent }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse headings
    const items: TOCItem[] = [];
    
    if (isRichContent && typeof content === 'string') {
      // Parse HTML string for h2, h3
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const elements = doc.querySelectorAll('h2, h3');
      
      elements.forEach((el, index) => {
        const id = `heading-${index}`; // We need to ensure IDs match what is rendered
        items.push({
          id,
          text: el.textContent || '',
          level: parseInt(el.tagName.substring(1))
        });
      });
    } else if (Array.isArray(content)) {
      // Parse ContentBlock[]
      let hIndex = 0;
      content.forEach((block) => {
        if (block.type === 'heading') {
          items.push({
            id: `heading-${hIndex}`, // Matches the render logic in Documentation.tsx
            text: block.value,
            level: 2 // Assuming all blocks are H2 for now based on legacy logic
          });
          hIndex++;
        }
      });
    }

    setHeadings(items);
  }, [content, isRichContent]);

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="hidden xl:block w-64 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4"
    >
      <div className="flex items-center gap-2 mb-4 text-gray-400">
        <List size={14} />
        <span className="text-xs font-bold uppercase tracking-wider">On this page</span>
      </div>
      
      <div className="relative border-l border-gray-200 dark:border-gray-800 ml-1.5">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`block w-full text-left py-1.5 pl-4 text-sm transition-all relative ${
              activeId === heading.id
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            style={{ marginLeft: heading.level === 3 ? '12px' : '0px' }}
          >
            {activeId === heading.id && (
              <motion.div
                layoutId="toc-indicator"
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600 -ml-[1px]"
              />
            )}
            {heading.text}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
