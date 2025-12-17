import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, ChevronRight, ChevronDown, 
  Save, X, Layers, FileText, FolderPlus,
  Maximize2, Minimize2, ArrowUp, ArrowDown, ExternalLink,
  Users, MoreVertical, Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Subject, Module, Topic } from '../../types';
import { DualModeEditor } from '../DualModeEditor';
import { cn, slugify } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useAutoSave } from '../../hooks/useAutoSave';

interface CurriculumManagerProps {
  subjects: Subject[];
  onRefresh: () => void;
}

export const CurriculumManager: React.FC<CurriculumManagerProps> = ({ subjects, onRefresh }) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
  // Editing States
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicContent, setTopicContent] = useState<string | any[]>('');
  const [topicTitle, setTopicTitle] = useState(''); // New: State for editing topic title
  
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  
  const [isFullScreen, setIsFullScreen] = useState(false);

  // New Item States
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [addingModuleTo, setAddingModuleTo] = useState<string | null>(null);
  const [addingTopicTo, setAddingTopicTo] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemIcon, setNewItemIcon] = useState('Code2'); // Default icon

  // Real-time Presence
  const [activeUsers, setActiveUsers] = useState<number>(0);

  // Sort subjects by display_order
  const sortedSubjects = [...subjects].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  // --- Auto Save Logic ---
  const saveTopicToDb = async (content: string | any[]) => {
    if (!editingTopic || !supabase) return;

    let readTime = '5 min';
    if (typeof content === 'string') {
       readTime = `${Math.max(1, Math.ceil(content.length / 500))} min`;
    } else if (Array.isArray(content)) {
       const text = content.map(b => b.value).join(' ');
       readTime = `${Math.max(1, Math.ceil(text.length / 500))} min`;
    }

    await supabase
      .from('topics')
      .update({ 
        title: topicTitle, // Save title as well
        content: content,
        read_time: readTime
      })
      .eq('id', editingTopic.id);
  };

  const saveStatus = useAutoSave(topicContent, saveTopicToDb, 3000);

  // Manual save handler
  const handleManualSave = async () => {
    await saveTopicToDb(topicContent);
    alert('Topic saved successfully!');
    onRefresh(); // Refresh list to update titles if changed
  };

  // --- Real-time Presence ---
  useEffect(() => {
    if (!supabase || !editingTopic) return;

    const channel = supabase.channel(`topic:${editingTopic.id}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveUsers(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: 'admin', online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [editingTopic]);

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

  const handleMove = async (
    table: 'subjects' | 'modules' | 'topics', 
    items: any[], 
    index: number, 
    direction: 'up' | 'down'
  ) => {
    if (!supabase) return;
    
    const newItems = [...items].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap items in the array first
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update DB with new indices
    const updates = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    for (const update of updates) {
      await supabase.from(table).update({ display_order: update.display_order }).eq('id', update.id);
    }

    onRefresh();
  };

  const handleAddSubject = async () => {
    if (!newItemTitle.trim() || !supabase) return;
    
    const id = slugify(newItemTitle);
    const maxOrder = Math.max(...subjects.map(s => s.display_order || 0), 0);
    
    const { error } = await supabase.from('subjects').insert({
      id,
      title: newItemTitle,
      description: newItemDesc || 'New Subject Description',
      icon: newItemIcon || 'Code2',
      color: 'from-gray-500 to-gray-700',
      level: 'Beginner',
      display_order: maxOrder + 1
    });

    if (!error) {
      setNewItemTitle('');
      setNewItemDesc('');
      setNewItemIcon('Code2');
      setIsAddingSubject(false);
      onRefresh();
    } else {
      alert(`Error creating subject: ${error.message}`);
    }
  };

  const handleSaveSubject = async () => {
    if (!editingSubject || !supabase) return;
    
    const { error } = await supabase
      .from('subjects')
      .update({ 
        title: editingSubject.title,
        description: editingSubject.description,
        icon: editingSubject.icon
      })
      .eq('id', editingSubject.id);

    if (!error) {
      setEditingSubject(null);
      onRefresh();
    } else {
      alert(`Error updating subject: ${error.message}`);
    }
  };

  const handleSaveModule = async () => {
    if (!editingModule || !supabase) return;

    const { error } = await supabase
      .from('modules')
      .update({
        title: editingModule.title
      })
      .eq('id', editingModule.id);

    if (!error) {
      setEditingModule(null);
      onRefresh();
    } else {
      alert(`Error updating module: ${error.message}`);
    }
  };

  const handleAddModule = async (subjectId: string) => {
    if (!newItemTitle.trim() || !supabase) return;
    
    const id = slugify(newItemTitle);
    const subject = subjects.find(s => s.id === subjectId);
    const maxOrder = Math.max(...(subject?.modules.map(m => m.display_order || 0) || []), 0);
    
    const { error } = await supabase.from('modules').insert({
      id,
      title: newItemTitle,
      subject_id: subjectId,
      description: 'New module',
      display_order: maxOrder + 1
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
    let maxOrder = 0;
    subjects.forEach(s => {
      const m = s.modules.find(mod => mod.id === moduleId);
      if (m) {
        maxOrder = Math.max(...m.topics.map(t => t.display_order || 0), 0);
      }
    });

    const { error } = await supabase.from('topics').insert({
      id,
      title: newItemTitle,
      module_id: moduleId,
      read_time: '5 min',
      content: '',
      display_order: maxOrder + 1
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
    setTopicContent(topic.content);
    setTopicTitle(topic.title);
  };

  // --- Render ---

  if (editingTopic) {
    return (
      <div className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300",
        isFullScreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen p-6" : "p-6 h-[85vh]"
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 flex-shrink-0 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Editing Topic</span>
               {activeUsers > 1 && (
                <span className="flex items-center gap-1 text-xs text-indigo-600 font-bold animate-pulse ml-2">
                  <Users size={12} /> {activeUsers} viewing
                </span>
              )}
            </div>
            <input 
              type="text" 
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-indigo-500 focus:outline-none w-full transition-colors"
              placeholder="Topic Title"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleManualSave}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Save size={16} /> Save
            </button>
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
              onClick={() => { setEditingTopic(null); setIsFullScreen(false); onRefresh(); }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col shadow-inner bg-gray-50 dark:bg-gray-950/50">
          <DualModeEditor 
            key={editingTopic.id} // CRITICAL: Force remount when switching topics
            content={topicContent} 
            onChange={setTopicContent} 
            saveStatus={saveStatus}
          />
        </div>
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
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1">Icon (Lucide Name)</label>
            <input 
              type="text" 
              placeholder="e.g., Code2, Database, Server, Globe" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
              value={newItemIcon}
              onChange={e => setNewItemIcon(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsAddingSubject(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleAddSubject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Create Subject</button>
          </div>
        </div>
      )}

      {sortedSubjects.map((subject, sIdx) => (
        <div key={subject.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          
          {/* Subject Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50">
            {editingSubject?.id === subject.id ? (
              <div className="flex-1 flex gap-2 items-center mr-4">
                <div className="flex-1 grid gap-2">
                  <input 
                    type="text" 
                    value={editingSubject.title}
                    onChange={e => setEditingSubject({...editingSubject, title: e.target.value})}
                    className="px-3 py-1.5 rounded border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-800 text-sm font-bold"
                    placeholder="Subject Title"
                  />
                  <input 
                    type="text" 
                    value={editingSubject.description}
                    onChange={e => setEditingSubject({...editingSubject, description: e.target.value})}
                    className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    placeholder="Description"
                  />
                  <input 
                    type="text" 
                    value={editingSubject.icon}
                    onChange={e => setEditingSubject({...editingSubject, icon: e.target.value})}
                    className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    placeholder="Icon Name (e.g. Code2)"
                  />
                </div>
                <button 
                  onClick={handleSaveSubject}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button 
                  onClick={() => setEditingSubject(null)}
                  className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 {/* Reorder Controls */}
                 <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleMove('subjects', sortedSubjects, sIdx, 'up')}
                      disabled={sIdx === 0}
                      className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      onClick={() => handleMove('subjects', sortedSubjects, sIdx, 'down')}
                      disabled={sIdx === sortedSubjects.length - 1}
                      className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                 </div>

                 <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}>
                  {expandedSubject === subject.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center text-white font-bold`}>
                    {/* Simple rendering for admin view */}
                    {subject.icon && subject.icon.length < 10 ? subject.icon : <Layers size={16} />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {subject.title}
                      <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 font-normal">
                        {subject.modules.length} Modules
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{subject.description}</p>
                  </div>
                 </div>
              </div>
            )}

            {!editingSubject && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setAddingModuleTo(subject.id)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  title="Add Module"
                >
                  <Plus size={16} />
                </button>
                <button 
                  onClick={() => setEditingSubject(subject)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Edit Subject"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete('subjects', subject.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
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

              {subject.modules
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((module, mIdx, sortedModules) => (
                <div key={module.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center justify-between p-3 pl-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Module Reorder */}
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => handleMove('modules', sortedModules, mIdx, 'up')}
                          disabled={mIdx === 0}
                          className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          onClick={() => handleMove('modules', sortedModules, mIdx, 'down')}
                          disabled={mIdx === sortedModules.length - 1}
                          className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      {/* Module Edit Mode */}
                      {editingModule?.id === module.id ? (
                        <div className="flex-1 flex gap-2 items-center">
                          <input 
                            type="text"
                            value={editingModule.title}
                            onChange={e => setEditingModule({...editingModule, title: e.target.value})}
                            className="flex-1 px-2 py-1 rounded border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-900 text-sm font-bold"
                            autoFocus
                          />
                          <button onClick={handleSaveModule} className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"><Save size={14} /></button>
                          <button onClick={() => setEditingModule(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><X size={14} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}>
                          <Layers size={14} className="text-gray-400" />
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{module.title}</span>
                        </div>
                      )}
                    </div>

                    {!editingModule && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setAddingTopicTo(module.id)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
                          title="Add Topic"
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={() => setEditingModule(module)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          title="Rename Module"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                           onClick={() => handleDelete('modules', module.id)}
                           className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                           title="Delete Module"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
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

                      {module.topics
                        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                        .map((topic, tIdx, sortedTopics) => (
                        <div key={topic.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 group transition-all">
                          <div className="flex items-center gap-2">
                             {/* Topic Reorder */}
                             <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleMove('topics', sortedTopics, tIdx, 'up')}
                                  disabled={tIdx === 0}
                                  className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                                >
                                  <ArrowUp size={10} />
                                </button>
                                <button 
                                  onClick={() => handleMove('topics', sortedTopics, tIdx, 'down')}
                                  disabled={tIdx === sortedTopics.length - 1}
                                  className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                                >
                                  <ArrowDown size={10} />
                                </button>
                             </div>

                            <FileText size={12} className="text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{topic.title}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                              to={`/learn/${subject.id}/${topic.id}`}
                              target="_blank"
                              className="text-gray-400 hover:text-indigo-600 p-1"
                              title="View Live"
                            >
                              <ExternalLink size={12} />
                            </Link>
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
