import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Maximize2, Minimize2, Bold, Italic, Heading1, Heading2, 
  Code, Link as LinkIcon, Image as ImageIcon, MessageSquare 
} from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { parseMarkdownToBlocks, blocksToHtml, blocksToMarkdown } from '../lib/markdownParser';
import { cn } from '../lib/utils';

interface DualModeEditorProps {
  content: string | any[];
  onChange: (content: string | any[]) => void;
  label?: string;
  minHeight?: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved' | 'error';
}

export const DualModeEditor: React.FC<DualModeEditorProps> = ({ 
  content, 
  onChange, 
  label,
  minHeight = "300px",
  saveStatus
}) => {
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');
  const [internalContent, setInternalContent] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize content
  useEffect(() => {
    if (Array.isArray(content)) {
      setEditorMode('markdown');
      setInternalContent(blocksToMarkdown(content));
    } else {
      setEditorMode('rich');
      setInternalContent(typeof content === 'string' ? content : '');
    }
  }, []); // Only run once on mount to avoid loops, parent manages state updates via onChange

  const handleUpgradeToRich = () => {
    if (confirm("Convert to Visual Editor? Switching back to Markdown might lose some formatting.")) {
      const blocks = parseMarkdownToBlocks(internalContent);
      const html = blocksToHtml(blocks);
      setInternalContent(html);
      setEditorMode('rich');
      onChange(html);
    }
  };

  const handleChange = (newVal: string) => {
    setInternalContent(newVal);
    onChange(newVal);
  };

  // --- Markdown Helpers ---
  const insertAtCursor = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    handleChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      const finalPos = selectedText.length > 0 ? newCursorPos : start + before.length;
      textarea.setSelectionRange(finalPos, finalPos);
    }, 0);
  };

  const ToolbarButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
      title={label}
      type="button"
    >
      <Icon size={16} />
    </button>
  );

  const containerClass = isFullScreen 
    ? "fixed inset-0 z-[100] bg-white dark:bg-gray-900 p-6 flex flex-col" 
    : "relative flex flex-col border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center gap-3">
          {label && <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>}
          <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setEditorMode('rich')}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                editorMode === 'rich' 
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              Visual
            </button>
            <button
              onClick={() => setEditorMode('markdown')}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                editorMode === 'markdown' 
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              Markdown
            </button>
          </div>
          {editorMode === 'markdown' && (
            <button 
              onClick={handleUpgradeToRich}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:underline"
              title="Convert Markdown to Rich Text"
            >
              <Sparkles size={12} /> Convert
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          type="button"
        >
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: isFullScreen ? 'auto' : minHeight }}>
        {editorMode === 'rich' ? (
          <RichTextEditor 
            content={internalContent} 
            onChange={handleChange} 
            saveStatus={saveStatus}
          />
        ) : (
          <div className="flex-1 flex flex-col h-full">
            {/* Markdown Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <ToolbarButton icon={Bold} label="Bold" onClick={() => insertAtCursor('**', '**')} />
              <ToolbarButton icon={Italic} label="Italic" onClick={() => insertAtCursor('*', '*')} />
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
              <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => insertAtCursor('# ')} />
              <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => insertAtCursor('## ')} />
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
              <ToolbarButton icon={Code} label="Code Block" onClick={() => insertAtCursor('```\n', '\n```')} />
              <ToolbarButton icon={LinkIcon} label="Link" onClick={() => insertAtCursor('[', '](url)')} />
              <ToolbarButton icon={ImageIcon} label="Image" onClick={() => insertAtCursor('![alt](', ')')} />
              <ToolbarButton icon={MessageSquare} label="Note/Callout" onClick={() => insertAtCursor('> [!NOTE]\n> ')} />
            </div>

            <textarea
              ref={textareaRef}
              value={internalContent}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-full flex-1 p-4 font-mono text-sm bg-white dark:bg-gray-950 focus:outline-none resize-none leading-relaxed"
              placeholder="# Topic Title\n\nWrite your content here..."
            />
          </div>
        )}
      </div>
      
      {isFullScreen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button 
            onClick={() => setIsFullScreen(false)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};
