import React, { useState } from 'react';
import { Plus, Trash2, Layers, Edit2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import { slugify } from '../../lib/utils';

interface CategoryManagerProps {
  categories: Category[];
  onRefresh: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCat, setNewCat] = useState({ title: '', description: '', color: 'from-blue-500 to-cyan-500' });

  const handleAdd = async () => {
    if (!supabase || !newCat.title) return;
    
    // Generate a slug ID for the category
    const id = slugify(newCat.title);
    
    const { error } = await supabase.from('categories').insert([{
      id,
      ...newCat
    }]);

    if (error) {
      alert(`Error adding category: ${error.message}`);
    } else {
      setNewCat({ title: '', description: '', color: 'from-blue-500 to-cyan-500' });
      setIsAdding(false);
      onRefresh();
    }
  };

  const handleUpdate = async () => {
    if (!supabase || !editingCategory) return;

    const { error } = await supabase
      .from('categories')
      .update({
        title: editingCategory.title,
        description: editingCategory.description,
        color: editingCategory.color
      })
      .eq('id', editingCategory.id);

    if (error) {
      alert(`Error updating category: ${error.message}`);
    } else {
      setEditingCategory(null);
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this category? This might affect posts linked to it.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    
    if (error) {
      alert(`Error deleting category: ${error.message}`);
    } else {
      onRefresh();
    }
  };

  const colorOptions = [
    { label: "Blue/Cyan", value: "from-blue-500 to-cyan-400" },
    { label: "Purple/Pink", value: "from-purple-500 to-pink-500" },
    { label: "Emerald/Teal", value: "from-emerald-500 to-teal-400" },
    { label: "Orange/Red", value: "from-orange-500 to-red-500" },
    { label: "Indigo/Violet", value: "from-indigo-500 to-violet-500" },
    { label: "Rose/Amber", value: "from-rose-500 to-amber-500" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Community Categories</h3>
        {!isAdding && !editingCategory && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {/* Add New Form */}
      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 grid gap-4">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm">New Category</h4>
          <input 
            type="text" 
            placeholder="Category Title" 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={newCat.title}
            onChange={e => setNewCat({...newCat, title: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Description" 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={newCat.description}
            onChange={e => setNewCat({...newCat, description: e.target.value})}
          />
          <select 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={newCat.color}
            onChange={e => setNewCat({...newCat, color: e.target.value})}
          >
            {colorOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
            <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">Create</button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingCategory && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 grid gap-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Editing: {editingCategory.title}</h4>
            <button onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <input 
            type="text" 
            placeholder="Category Title" 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={editingCategory.title}
            onChange={e => setEditingCategory({...editingCategory, title: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Description" 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={editingCategory.description}
            onChange={e => setEditingCategory({...editingCategory, description: e.target.value})}
          />
          <select 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={editingCategory.color}
            onChange={e => setEditingCategory({...editingCategory, color: e.target.value})}
          >
            {colorOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditingCategory(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
            <button onClick={handleUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl group hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-sm`}>
                <Layers size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{cat.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingCategory(cat)} 
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(cat.id)} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
