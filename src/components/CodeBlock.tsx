import React from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8 rounded-xl overflow-hidden bg-[#0f1117] shadow-2xl border border-gray-800">
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-gray-500" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <pre className="text-sm font-mono leading-relaxed text-gray-300 font-ligatures">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
