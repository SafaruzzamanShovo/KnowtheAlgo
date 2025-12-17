import React, { useRef, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { FontSize, LineHeight } from '../lib/tiptap-extensions';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Youtube from '@tiptap/extension-youtube';
import Typography from '@tiptap/extension-typography';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Highlight } from '@tiptap/extension-highlight';

import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  List, ListOrdered, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  Code, Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, Highlighter,
  ChevronDown, Type, Eraser, CheckCircle2, Cloud, Unlink, ArrowUpDown,
  Palette, FileJson, Minus, Youtube as YoutubeIcon, Indent, Outdent,
  Superscript as SuperscriptIcon, Subscript as SubscriptIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

// Initialize lowlight for syntax highlighting
const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved' | 'error';
}

const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Mono', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Comic Sans', value: 'Comic Sans MS, Comic Sans, cursive' },
];

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title,
  className
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode; 
  title: string;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-1.5 rounded-md transition-colors flex items-center justify-center min-w-[28px]",
      isActive 
        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" 
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
      disabled && "opacity-30 cursor-not-allowed",
      className
    )}
    title={title}
    type="button"
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1 self-center"></div>;

const MenuBar = ({ editor, saveStatus }: { editor: any, saveStatus?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [customFontSize, setCustomFontSize] = useState('16');

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return; // Cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomFontSize(val);
    if (val) {
      editor.chain().focus().setFontSize(`${val}px`).run();
    }
  };

  const handleIpynbUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        let htmlContent = '';
        if (json.cells && Array.isArray(json.cells)) {
          json.cells.forEach((cell: any) => {
            if (cell.cell_type === 'markdown') {
              const text = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
              htmlContent += `<p>${text}</p>`; 
            } else if (cell.cell_type === 'code') {
              const code = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
              htmlContent += `<pre><code>${code}</code></pre>`;
            }
          });
        }
        editor.chain().focus().insertContent(htmlContent).run();
      } catch (err) {
        alert('Failed to parse IPYNB file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 sticky top-0 z-20 shadow-sm">
      {/* History */}
      <div className="flex items-center gap-0.5 mr-2">
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo size={16} />
        </MenuButton>
      </div>

      <Divider />

      {/* Font Family */}
      <div className="relative group">
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontFamily || ''}
          className="h-7 pl-2 pr-6 text-xs bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded focus:outline-none appearance-none cursor-pointer min-w-[80px] text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
        >
          <option value="">Font</option>
          {FONT_FAMILIES.map((font) => (
            <option key={font.name} value={font.value}>{font.name}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
      </div>

      {/* Font Size (1-100 Input) */}
      <div className="flex items-center gap-1 mx-1">
        <Type size={14} className="text-gray-400" />
        <input 
          type="number" 
          min="1" 
          max="100" 
          value={parseInt(editor.getAttributes('textStyle').fontSize) || customFontSize}
          onChange={handleFontSizeChange}
          className="w-12 h-7 px-1 text-xs bg-transparent border border-gray-300 dark:border-gray-700 rounded text-center focus:outline-none focus:border-indigo-500"
          title="Font Size (px)"
        />
      </div>

      {/* Text Color */}
      <div className="relative flex items-center justify-center">
        <input 
          type="color" 
          ref={colorInputRef}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="absolute opacity-0 w-full h-full cursor-pointer"
        />
        <MenuButton onClick={() => colorInputRef.current?.click()} title="Text Color">
          <div className="flex flex-col items-center">
            <Palette size={16} />
            <div className="w-4 h-1 mt-0.5 rounded-full" style={{ backgroundColor: editor.getAttributes('textStyle').color || 'currentColor' }}></div>
          </div>
        </MenuButton>
      </div>

      <Divider />

      {/* Basic Formatting */}
      <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Cmd+B)">
        <Bold size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Cmd+I)">
        <Italic size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Cmd+U)">
        <UnderlineIcon size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
        <Highlighter size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
        <Eraser size={16} />
      </MenuButton>

      <Divider />

      {/* Headings Dropdown */}
      <div className="relative group">
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
          }}
          value={editor.isActive('heading', { level: 1 }) ? '1' : 
                 editor.isActive('heading', { level: 2 }) ? '2' :
                 editor.isActive('heading', { level: 3 }) ? '3' :
                 editor.isActive('heading', { level: 4 }) ? '4' :
                 editor.isActive('heading', { level: 5 }) ? '5' :
                 editor.isActive('heading', { level: 6 }) ? '6' : 'p'}
          className="h-7 pl-2 pr-6 text-xs bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded focus:outline-none appearance-none cursor-pointer min-w-[90px] text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
        >
          <option value="p">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
        <ChevronDown size={12} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
      </div>

      {/* Lists */}
      <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
        <ListOrdered size={16} />
      </MenuButton>
      
      {/* Indentation */}
      <div className="flex items-center gap-0.5">
        <MenuButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} title="Indent">
          <Indent size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} title="Outdent">
          <Outdent size={16} />
        </MenuButton>
      </div>

      <Divider />

      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
          <AlignJustify size={16} />
        </MenuButton>
      </div>

      {/* Line Height (Gap) */}
      <div className="relative group ml-1 flex items-center">
         <ArrowUpDown size={14} className="text-gray-400 mr-1" />
         <select
          onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
          value={editor.getAttributes('paragraph').lineHeight || '1.5'}
          className="h-7 pl-1 pr-4 text-xs bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded focus:outline-none appearance-none cursor-pointer w-[50px] text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-300"
          title="Line Spacing"
        >
          <option value="1.0">1.0</option>
          <option value="1.15">1.15</option>
          <option value="1.25">1.25</option>
          <option value="1.5">1.5</option>
          <option value="1.75">1.75</option>
          <option value="2.0">2.0</option>
          <option value="2.5">2.5</option>
          <option value="3.0">3.0</option>
        </select>
      </div>

      <Divider />

      {/* Advanced Formatting */}
      <div className="flex items-center gap-0.5">
        <MenuButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} title="Subscript">
          <SubscriptIcon size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Superscript">
          <SuperscriptIcon size={16} />
        </MenuButton>
      </div>

      <Divider />

      {/* Inserts */}
      <div className="flex items-center gap-0.5">
        <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Insert/Edit Link">
          <LinkIcon size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Remove Link">
          <Unlink size={16} />
        </MenuButton>
        <MenuButton onClick={addImage} title="Insert Image">
          <ImageIcon size={16} />
        </MenuButton>
        <MenuButton onClick={addYoutube} title="Insert YouTube Video">
          <YoutubeIcon size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          isActive={editor.isActive('codeBlock')} 
          title="Code Block"
        >
          <Code size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
          <Quote size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
          <TableIcon size={16} />
        </MenuButton>
      </div>

      <div className="flex-1"></div>

      {/* Save Status Indicator */}
      {saveStatus && (
        <div className="flex items-center gap-2 mr-4 text-xs font-medium">
          {saveStatus === 'saving' && (
            <span className="text-gray-500 flex items-center gap-1">
              <Cloud size={14} className="animate-pulse" /> Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="text-amber-500 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div> Unsaved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-500 flex items-center gap-1">
              Error saving
            </span>
          )}
        </div>
      )}

      {/* File Import */}
      <div className="flex items-center gap-2">
        <input 
          type="file" 
          accept=".ipynb" 
          ref={fileInputRef}
          onChange={handleIpynbUpload}
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FileJson size={14} /> Import
        </button>
      </div>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder = "Start writing...", saveStatus }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: false, // Disable default codeBlock to use lowlight
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-indigo-600 hover:underline cursor-pointer' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] }),
      TextStyle,
      FontFamily,
      FontSize,
      LineHeight,
      Color,
      Image.configure({ inline: true, allowBase64: true }),
      Youtube.configure({
        controls: false,
      }),
      Typography,
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none editor-page',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-950 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl">
      <MenuBar editor={editor} saveStatus={saveStatus} />
      
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-4">
        {/* Bubble Menu (Contextual) */}
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="tiptap-menu">
            <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
              <Bold size={14} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
              <Italic size={14} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
              <Code size={14} />
            </MenuButton>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            {editor.isActive('link') ? (
              <>
                <MenuButton onClick={() => {
                   const url = window.prompt('Edit URL', editor.getAttributes('link').href);
                   if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }} title="Edit Link">
                  <LinkIcon size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().unsetLink().run()} title="Unlink">
                  <Unlink size={14} />
                </MenuButton>
              </>
            ) : (
              <MenuButton onClick={() => {
                const url = window.prompt('URL');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }} title="Link">
                <LinkIcon size={14} />
              </MenuButton>
            )}
          </BubbleMenu>
        )}

        {/* Floating Menu (Empty Line) */}
        {editor && (
          <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="tiptap-menu">
            <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
              <Heading1 size={14} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
              <Heading2 size={14} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="List">
              <List size={14} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
              <Code size={14} />
            </MenuButton>
            <MenuButton onClick={() => {
               const url = window.prompt('YouTube URL');
               if (url) editor.commands.setYoutubeVideo({ src: url });
            }} title="YouTube">
              <YoutubeIcon size={14} />
            </MenuButton>
          </FloatingMenu>
        )}

        <div className="flex justify-center">
          <EditorContent editor={editor} className="w-full max-w-[850px]" />
        </div>
      </div>
      
      <div className="px-4 py-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-2">
           {/* Status bar */}
        </div>
        <div>
          {editor.storage.characterCount.words()} words
        </div>
      </div>
    </div>
  );
};
