import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  List, ListOrdered, Heading1, Heading2, Code, Quote, 
  Undo, Redo, Link as LinkIcon, Image as ImageIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Minus, FileJson
} from 'lucide-react';
import { cn } from '../lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode; 
  title: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-1.5 rounded-md transition-colors",
      isActive 
        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" 
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
      disabled && "opacity-30 cursor-not-allowed"
    )}
    title={title}
    type="button"
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1 self-center"></div>;

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
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
              // Simple markdown to HTML conversion (very basic)
              htmlContent += `<p>${text}</p>`; 
            } else if (cell.cell_type === 'code') {
              const code = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
              htmlContent += `<pre><code>${code}</code></pre>`;
              
              // Handle outputs (images only for now)
              if (cell.outputs && Array.isArray(cell.outputs)) {
                cell.outputs.forEach((output: any) => {
                  if (output.data && output.data['image/png']) {
                    htmlContent += `<img src="data:image/png;base64,${output.data['image/png']}" alt="Output" />`;
                  } else if (output.text) {
                     const text = Array.isArray(output.text) ? output.text.join('') : output.text;
                     htmlContent += `<blockquote>${text}</blockquote>`;
                  }
                });
              }
            }
          });
        }

        editor.chain().focus().insertContent(htmlContent).run();
      } catch (err) {
        alert('Failed to parse IPYNB file.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-t-xl sticky top-0 z-10">
      {/* Typography */}
      <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
        <Bold size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
        <Italic size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
        <UnderlineIcon size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough size={16} />
      </MenuButton>
      
      <Divider />

      {/* Headings */}
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
        <Heading1 size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
        <Heading2 size={16} />
      </MenuButton>

      <Divider />

      {/* Alignment */}
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

      <Divider />

      {/* Lists */}
      <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
        <ListOrdered size={16} />
      </MenuButton>

      <Divider />

      {/* Extras */}
      <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
        <Code size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
        <Quote size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus size={16} />
      </MenuButton>
      
      <Divider />

      {/* Media */}
      <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
        <LinkIcon size={16} />
      </MenuButton>
      <MenuButton onClick={addImage} title="Image">
        <ImageIcon size={16} />
      </MenuButton>
      
      {/* IPYNB Import */}
      <div className="relative">
        <input 
          type="file" 
          accept=".ipynb" 
          ref={fileInputRef}
          onChange={handleIpynbUpload}
          className="hidden" 
        />
        <MenuButton onClick={() => fileInputRef.current?.click()} title="Import Jupyter Notebook (.ipynb)">
          <FileJson size={16} />
        </MenuButton>
      </div>

      <div className="flex-1"></div>

      {/* History */}
      <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo size={16} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo size={16} />
      </MenuButton>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-indigo-600 hover:underline cursor-pointer' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true, allowBase64: true }),
      Subscript,
      Superscript,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[300px] px-4 py-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
