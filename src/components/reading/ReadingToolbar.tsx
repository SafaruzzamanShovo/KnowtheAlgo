import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, Minimize2, Maximize2, AlignJustify, 
  Sun, Moon, Eye, EyeOff, Settings2, X
} from 'lucide-react';
import { useReadingPreferences } from '../../context/ReadingPreferences';

export const ReadingToolbar = () => {
  const { 
    fontSize, setFontSize, 
    lineHeight, setLineHeight, 
    focusMode, toggleFocusMode 
  } = useReadingPreferences();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 mb-2 min-w-[280px]"
          >
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-xs font-bold uppercase text-gray-400">Reading Settings</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={14} />
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Type size={14} /> Font Size
                </span>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      fontSize === size 
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {size === 'sm' ? 'A' : size === 'base' ? 'A+' : size === 'lg' ? 'A++' : 'A+++'}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <AlignJustify size={14} /> Spacing
                </span>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {(['normal', 'relaxed', 'loose'] as const).map((lh) => (
                  <button
                    key={lh}
                    onClick={() => setLineHeight(lh)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      lineHeight === lh 
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {lh.charAt(0).toUpperCase() + lh.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bar */}
      <motion.div 
        className="flex items-center gap-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 p-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <TooltipButton onClick={toggleFocusMode} label={focusMode ? "Exit Focus" : "Focus Mode"}>
          {focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </TooltipButton>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>

        <TooltipButton onClick={toggleTheme} label={isDark ? "Light Mode" : "Dark Mode"}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </TooltipButton>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>

        <TooltipButton 
          onClick={() => setIsOpen(!isOpen)} 
          label="Text Settings" 
          active={isOpen}
        >
          <Type size={18} />
        </TooltipButton>
      </motion.div>
    </div>
  );
};

const TooltipButton = ({ onClick, children, label, active }: any) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-full transition-all relative group ${
      active 
        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`}
    title={label}
  >
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-bold text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {label}
    </span>
  </button>
);
