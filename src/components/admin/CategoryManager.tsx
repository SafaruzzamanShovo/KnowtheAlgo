import React, { useState } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import { slugify } from '../../lib/utils';

interface CategoryManagerProps {
  categories: Category[];
  onRefresh: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
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

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    
    if (error) {
      alert(`Error deleting category: ${error.message}`);
    } else {
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Community Categories</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 grid gap-4">
          <input 
            type="text" 
            placeholder="Category Title" 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
            value={newCat.title}
            onChange={e => setNewCat({...newCat, title: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Description" 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
            value={newCat.description}
            onChange={e => setNewCat({...newCat, description: e.target.value})}
          />
          <select 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
            value={newCat.color}
            onChange={e => setNewCat({...newCat, color: e.target.value})}
          >
            <option value="from-blue-500 to-cyan-400">Blue/Cyan</option>
            <option value="from-purple-500 to-pink-500">Purple/Pink</option>
            <option value="from-emerald-500 to-teal-400">Emerald/Teal</option>
            <option value="from-orange-500 to-red-500">Orange/Red</option>
          </select>
          <button onClick={handleAdd} className="bg-indigo-600 text-white py-2 rounded-lg font-medium">Save Category</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white`}>
                <Layers size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{cat.title}</h4>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
