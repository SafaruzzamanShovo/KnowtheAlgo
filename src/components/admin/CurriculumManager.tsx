import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Edit2, ChevronRight, ChevronDown, 
  Save, X, Layers, FileText, FolderPlus,
  Bold, Italic, Heading1, Heading2, Code, Link as LinkIcon, Image as ImageIcon, MessageSquare,
  Sparkles, Maximize2, Minimize2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Subject, Module, Topic } from '../../types';
import { parseMarkdownToBlocks, blocksToMarkdown, blocksToHtml } from '../../lib/markdownParser';
import { RichTextEditor } from '../RichTextEditor';
import { cn, slugify } from '../../lib/utils';

interface CurriculumManagerProps {
  subjects: Subject[];
  onRefresh: () => void;
}

export const CurriculumManager: React.FC<CurriculumManagerProps> = ({ subjects, onRefresh }) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
  // Editing States
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicContent, setTopicContent] = useState('');
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');
  const [isSaving, setIsSaving] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // New Item States
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [addingModuleTo, setAddingModuleTo] = useState<string | null>(null);
  const [addingTopicTo, setAddingTopicTo] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  // --- Actions ---

  const handleDelete = async (table: 'subjects' | 'modules' | 'topics', id: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    
    if (supabase) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) {
        onRefresh();
      } else {
        alert(`Error deleting item: ${error.message}`);
      }
    }
  };

  const handleAddSubject = async () => {
    if (!newItemTitle.trim() || !supabase) return;
    
    const id = slugify(newItemTitle);
    
    const { error } = await supabase.from('subjects').insert({
      id,
      title: newItemTitle,
      description: newItemDesc || 'New Subject Description',
      icon: 'Code2',
      color: 'from-gray-500 to-gray-700',
      level: 'Beginner'
    });

    if (!error) {
      setNewItemTitle('');
      setNewItemDesc('');
      setIsAddingSubject(false);
      onRefresh();
    } else {
      alert(`Error creating subject: ${error.message}`);
    }
  };

  const handleAddModule = async (subjectId: string) => {
    if (!newItemTitle.trim() || !supabase) return;
    
    const id = slugify(newItemTitle);
    
    const { error } = await supabase.from('modules').insert({
      id,
      title: newItemTitle,
      subject_id: subjectId,
      description: 'New module'
    });

    if (!error) {
      setNewItemTitle('');
      setAddingModuleTo(null);
      onRefresh();
    } else {
      alert(`Error creating module: ${error.message}`);
    }
  };

  const handleAddTopic = async (moduleId: string) => {
    if (!newItemTitle.trim() || !supabase) return;

    const id = slugify(newItemTitle);
    
    const { error } = await supabase.from('topics').insert({
      id,
      title: newItemTitle,
      module_id: moduleId,
      read_time: '5 min',
      content: '' // Default to empty string for Rich Editor
    });

    if (!error) {
      setNewItemTitle('');
      setAddingTopicTo(null);
      onRefresh();
    } else {
      alert(`Error creating topic: ${error.message}`);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    
    // Check if content is Legacy Blocks (Array) or Rich Text (String)
    if (Array.isArray(topic.content)) {
      setEditorMode('markdown');
      setTopicContent(blocksToMarkdown(topic.content));
    } else {
      setEditorMode('rich');
      setTopicContent(typeof topic.content === 'string' ? topic.content : '');
    }
  };

  const handleUpgradeToRich = () => {
    if (confirm("Convert this topic to Rich Text? You won't be able to switch back to the Markdown block editor easily.")) {
      // Parse current markdown to blocks, then to HTML
      const blocks = parseMarkdownToBlocks(topicContent);
      const html = blocksToHtml(blocks);
      setTopicContent(html);
      setEditorMode('rich');
    }
  };

  const handleSaveTopic = async () => {
    if (!editingTopic || !supabase) return;
    setIsSaving(true);

    let finalContent: any = topicContent;

    // If in Markdown mode, parse back to blocks
    if (editorMode === 'markdown') {
      finalContent = parseMarkdownToBlocks(topicContent);
    }
    // If in Rich mode, save as HTML string (topicContent is already HTML)

    const { error } = await supabase
      .from('topics')
      .update({ 
        content: finalContent,
        read_time: `${Math.max(1, Math.ceil(topicContent.length / 500))} min`
      })
      .eq('id', editingTopic.id);

    setIsSaving(false);
    if (!error) {
      setEditingTopic(null);
      setIsFullScreen(false);
      onRefresh();
    } else {
      alert(`Failed to save topic: ${error.message}`);
    }
  };

  // --- Editor Helpers (Markdown Mode) ---
  const insertAtCursor = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setTopicContent(newText);

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
    >
      <Icon size={16} />
    </button>
  );

  // --- Render ---

  if (editingTopic) {
    return (
      <div className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300",
        isFullScreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen p-6" : "p-6 h-[85vh]"
      )}>
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Editing: {editingTopic.title}
              {isFullScreen && <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Full Screen Mode</span>}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${editorMode === 'rich' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                {editorMode === 'rich' ? 'Visual Editor' : 'Markdown Editor'}
              </span>
              {editorMode === 'markdown' && (
                <button 
                  onClick={handleUpgradeToRich}
                  className="text-xs flex items-center gap-1 text-indigo-600 hover:underline"
                  title="Convert to Visual Editor"
                >
                  <Sparkles size={12} /> Upgrade to Rich Text
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
              onClick={() => { setEditingTopic(null); setIsFullScreen(false); }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveTopic}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {editorMode === 'rich' ? (
          <div className="flex-1 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col shadow-inner bg-gray-50 dark:bg-gray-950/50">
            <RichTextEditor 
              content={topicContent} 
              onChange={setTopicContent} 
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-inner">
            {/* Markdown Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
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
              value={topicContent}
              onChange={(e) => setTopicContent(e.target.value)}
              className="w-full flex-1 p-4 font-mono text-sm bg-white dark:bg-gray-950 focus:outline-none resize-none leading-relaxed"
              placeholder="# Topic Title\n\nWrite your content here..."
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Subject Button */}
      {!isAddingSubject ? (
        <button 
          onClick={() => setIsAddingSubject(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <FolderPlus size={20} /> Add New Subject
        </button>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-3">
          <h4 className="font-bold text-gray-900 dark:text-white">Create New Subject</h4>
          <input 
            type="text" 
            placeholder="Subject Title (e.g., Advanced Python)" 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
            value={newItemTitle}
            onChange={e => setNewItemTitle(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Short Description" 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
            value={newItemDesc}
            onChange={e => setNewItemDesc(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsAddingSubject(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleAddSubject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Create Subject</button>
          </div>
        </div>
      )}

      {subjects.map((subject) => (
        <div key={subject.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          
          {/* Subject Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}>
              {expandedSubject === subject.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color}`}></div>
              <span className="font-bold text-gray-900 dark:text-white">{subject.title}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                {subject.modules.length} Modules
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAddingModuleTo(subject.id)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                title="Add Module"
              >
                <Plus size={16} />
              </button>
              <button 
                onClick={() => handleDelete('subjects', subject.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Modules List */}
          {expandedSubject === subject.id && (
            <div className="border-t border-gray-100 dark:border-gray-800">
              {/* Add Module Form */}
              {addingModuleTo === subject.id && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="New Module Title..." 
                    className="flex-1 px-3 py-2 rounded-md border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900"
                    value={newItemTitle}
                    onChange={e => setNewItemTitle(e.target.value)}
                  />
                  <button onClick={() => handleAddModule(subject.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">Add</button>
                  <button onClick={() => setAddingModuleTo(null)} className="p-2 text-gray-500"><X size={18} /></button>
                </div>
              )}

              {subject.modules.length === 0 && !addingModuleTo && (
                <div className="p-8 text-center text-gray-400 text-sm">No modules yet. Click + to add one.</div>
              )}

              {subject.modules.map(module => (
                <div key={module.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center justify-between p-3 pl-10 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}>
                      <Layers size={14} className="text-gray-400" />
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{module.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setAddingTopicTo(module.id)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
                        title="Add Topic"
                      >
                        <Plus size={14} />
                      </button>
                      <button 
                         onClick={() => handleDelete('modules', module.id)}
                         className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Topics List */}
                  {expandedModule === module.id && (
                    <div className="bg-gray-50 dark:bg-gray-950/50 pl-14 pr-4 py-2 space-y-1">
                      {/* Add Topic Form */}
                      {addingTopicTo === module.id && (
                        <div className="py-2 flex gap-2">
                          <input 
                            autoFocus
                            type="text" 
                            placeholder="New Topic Title..." 
                            className="flex-1 px-3 py-1.5 text-sm rounded border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900"
                            value={newItemTitle}
                            onChange={e => setNewItemTitle(e.target.value)}
                          />
                          <button onClick={() => handleAddTopic(module.id)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Add</button>
                          <button onClick={() => setAddingTopicTo(null)} className="p-1 text-gray-500"><X size={14} /></button>
                        </div>
                      )}

                      {module.topics.map(topic => (
                        <div key={topic.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 group transition-all">
                          <div className="flex items-center gap-2">
                            <FileText size={12} className="text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{topic.title}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditTopic(topic)}
                              className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <Edit2 size={10} /> Edit Content
                            </button>
                            <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                            <button 
                              onClick={() => handleDelete('topics', topic.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {module.topics.length === 0 && !addingTopicTo && (
                        <div className="text-xs text-gray-400 italic py-2">No topics yet.</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
