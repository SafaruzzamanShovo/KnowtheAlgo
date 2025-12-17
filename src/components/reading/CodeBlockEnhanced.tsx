import React, { useState } from 'react';
import { Check, Copy, Terminal, Maximize2, Minimize2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard } from '../../lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  explanation?: string;
}

export const CodeBlockEnhanced: React.FC<CodeBlockProps> = ({ code, language = 'text', explanation }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.split('\n').length;
  const isLong = lines > 15;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      className="relative group my-8 rounded-xl overflow-hidden bg-[#0f1117] shadow-2xl border border-gray-800/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <div className="h-4 w-px bg-gray-700 mx-1"></div>
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-indigo-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">{language}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {explanation && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                showExplanation 
                  ? 'bg-indigo-500/20 text-indigo-300' 
                  : 'text-gray-500 hover:text-indigo-300 hover:bg-gray-800'
              }`}
              title="Explain this code"
            >
              <Lightbulb size={12} />
              {showExplanation ? 'Hide Info' : 'Explain'}
            </button>
          )}
          
          <div className="w-px h-4 bg-gray-800 mx-1"></div>

          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-md hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-gray-800 text-gray-500 hover:text-white transition-colors flex items-center gap-1"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied && <span className="text-[10px] text-green-400 font-bold">Copied!</span>}
          </button>
        </div>
      </div>

      {/* Explanation Panel */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-900/20 border-b border-indigo-500/20 overflow-hidden"
          >
            <div className="p-4 text-sm text-indigo-200 leading-relaxed font-sans">
              <strong className="text-indigo-400 block mb-1 text-xs uppercase tracking-wide">Code Explanation</strong>
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Area */}
      <motion.div 
        animate={{ height: expanded ? 'auto' : isLong ? '300px' : 'auto' }}
        className="relative overflow-hidden"
      >
        <div className="p-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <pre className="text-sm font-mono leading-relaxed text-gray-300 font-ligatures">
            <code>{code}</code>
          </pre>
        </div>
        
        {/* Fade Overlay for collapsed state */}
        {!expanded && isLong && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1117] to-transparent pointer-events-none flex items-end justify-center pb-4">
            <button 
              onClick={() => setExpanded(true)}
              className="pointer-events-auto px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-full shadow-lg transition-colors border border-gray-700"
            >
              Show all {lines} lines
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
