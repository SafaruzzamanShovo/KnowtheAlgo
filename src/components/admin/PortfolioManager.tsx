import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown, Palette } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PortfolioItem, PortfolioSection } from '../../types';
import { generateId } from '../../lib/utils';
import { DualModeEditor } from '../DualModeEditor';

interface PortfolioManagerProps {
  items: PortfolioItem[];
  onRefresh: () => void;
}

const SECTIONS: { id: PortfolioSection; label: string }[] = [
  { id: 'news', label: 'News & Updates' },
  { id: 'research', label: 'Research Experience' },
  { id: 'project', label: 'Projects' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'honor', label: 'Honors & Awards' },
  { id: 'leadership', label: 'Leadership' },
];

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({ items, onRefresh }) => {
  const [activeSection, setActiveSection] = useState<PortfolioSection>('news');
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Sort items by display_order
  const filteredItems = items
    .filter(i => i.section === activeSection)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const handleSave = async () => {
    if (!supabase || !editingItem) return;
    
    // Determine order if new
    let order = editingItem.display_order;
    if (order === undefined) {
      const maxOrder = Math.max(...filteredItems.map(i => i.display_order || 0), 0);
      order = maxOrder + 1;
    }

    const payload = {
      section: activeSection,
      title: editingItem.title || 'Untitled',
      subtitle: editingItem.subtitle || '',
      organization: editingItem.organization || '',
      period: editingItem.period || '',
      description: editingItem.description || '',
      details: editingItem.details || {},
      display_order: order
    };

    let error;
    if (editingItem.id) {
      const res = await supabase.from('portfolio_items').update(payload).eq('id', editingItem.id);
      error = res.error;
    } else {
      const res = await supabase.from('portfolio_items').insert([{
        ...payload,
        id: generateId()
      }]);
      error = res.error;
    }

    if (error) {
      alert(`Error saving item: ${error.message}`);
    } else {
      setEditingItem(null);
      setIsAdding(false);
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this item?')) return;
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (error) {
      alert(`Error deleting item: ${error.message}`);
    } else {
      onRefresh();
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!supabase) return;
    
    const newItems = [...filteredItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap items in array
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const updates = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    for (const update of updates) {
      await supabase.from('portfolio_items').update({ display_order: update.display_order }).eq('id', update.id);
    }

    onRefresh();
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const startAdd = () => {
    setEditingItem({
      section: activeSection,
      details: {},
      display_order: filteredItems.length + 1
    });
    setIsAdding(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Sections</h3>
        <div className="space-y-1">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => { setActiveSection(sec.id); setIsAdding(false); setEditingItem(null); }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === sec.id 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage {SECTIONS.find(s => s.id === activeSection)?.label}</h2>
          {!isAdding && (
            <button onClick={startAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus size={16} /> Add Item
            </button>
          )}
        </div>

        {isAdding && editingItem ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                <input 
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  value={editingItem.title || ''}
                  onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                  placeholder="e.g., Project Name, Article Title"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {activeSection === 'news' ? 'Category' : activeSection === 'education' ? 'Degree' : 'Subtitle / Role'}
                </label>
                <input 
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  value={editingItem.subtitle || ''}
                  onChange={e => setEditingItem({...editingItem, subtitle: e.target.value})}
                />
              </div>
              
              {activeSection !== 'news' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Organization / Lab / School</label>
                  <input 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                    value={editingItem.organization || ''}
                    onChange={e => setEditingItem({...editingItem, organization: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Period / Date</label>
                <input 
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  value={editingItem.period || ''}
                  onChange={e => setEditingItem({...editingItem, period: e.target.value})}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
              <DualModeEditor 
                content={editingItem.description || ''}
                onChange={val => setEditingItem({...editingItem, description: typeof val === 'string' ? val : ''})}
                minHeight="200px"
              />
            </div>

            {/* Dynamic Details Fields based on Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <h4 className="text-sm font-bold mb-3 text-indigo-600">Advanced Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {(activeSection === 'research' || activeSection === 'experience') && (
                   <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Image / Logo URL</label>
                    <input 
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                      value={editingItem.details?.image || ''}
                      onChange={e => setEditingItem({
                        ...editingItem, 
                        details: { ...editingItem.details, image: e.target.value }
                      })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {(activeSection === 'research' || activeSection === 'project') && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Tags / Tech Stack (comma sep)</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.tags?.join(', ') || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { ...editingItem.details, tags: e.target.value.split(',').map(s => s.trim()) }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Github Link</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.links?.github || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { 
                            ...editingItem.details, 
                            links: { ...editingItem.details?.links, github: e.target.value } 
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                        <Palette size={12} /> Color Theme
                      </label>
                      <select 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.color || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { ...editingItem.details, color: e.target.value }
                        })}
                      >
                        <option value="">Auto (Cycle)</option>
                        <option value="nebula">Nebula (Purple/Blue)</option>
                        <option value="ocean">Ocean (Blue/Cyan)</option>
                        <option value="sunset">Sunset (Orange/Rose)</option>
                        <option value="forest">Forest (Emerald/Teal)</option>
                      </select>
                    </div>
                  </>
                )}

                {activeSection === 'research' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Advisor</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.advisor || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { ...editingItem.details, advisor: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Team (comma sep)</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.team?.join(', ') || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { ...editingItem.details, team: e.target.value.split(',').map(s => s.trim()) }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                      <select 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.status || 'ongoing'}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { ...editingItem.details, status: e.target.value as any }
                        })}
                      >
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Scholar Link</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.links?.scholar || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { 
                            ...editingItem.details, 
                            links: { ...editingItem.details?.links, scholar: e.target.value } 
                          }
                        })}
                      />
                    </div>
                  </>
                )}

                {activeSection === 'project' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                      <select 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.type || 'Industry'}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { ...editingItem.details, type: e.target.value as any }
                        })}
                      >
                        <option value="Industry">Industry / Competition</option>
                        <option value="Course">Course Project</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Demo Link</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.links?.demo || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { 
                            ...editingItem.details, 
                            links: { ...editingItem.details?.links, demo: e.target.value } 
                          }
                        })}
                      />
                    </div>
                  </>
                )}
                
                {(activeSection === 'honor' || activeSection === 'leadership') && (
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Icon Name (Lucide)</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        value={editingItem.details?.icon || ''}
                        onChange={e => setEditingItem({
                          ...editingItem, 
                          details: { ...editingItem.details, icon: e.target.value }
                        })}
                        placeholder="Award, Star, Trophy..."
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Leave empty for default icon.</p>
                   </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={() => { setIsAdding(false); setEditingItem(null); }} className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center gap-2">
                <Save size={16} /> Save Item
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.length === 0 && <div className="text-gray-500 text-center py-10">No items in this section yet.</div>}
            {filteredItems.map((item, index) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex justify-between items-start group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === filteredItems.length - 1}
                      className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.subtitle} {item.organization && `• ${item.organization}`}</p>
                    {item.period && <p className="text-xs text-gray-400 mt-1">{item.period}</p>}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
