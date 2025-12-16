import React, { useState } from 'react';
import { 
  Edit2, Trash2, ArrowUp, ArrowDown, CheckCircle, XCircle, 
  MessageSquare, Save, X, Eye, ExternalLink 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CommunityPost } from '../../types';
import { DualModeEditor } from '../DualModeEditor';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface CommunityManagerProps {
  posts: CommunityPost[];
  onRefresh: () => void;
}

export const CommunityManager: React.FC<CommunityManagerProps> = ({ posts, onRefresh }) => {
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!supabase) return;
    
    const newPosts = [...posts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPosts.length) return;

    // Swap items in the array first
    const temp = newPosts[index];
    newPosts[index] = newPosts[targetIndex];
    newPosts[targetIndex] = temp;

    const updates = newPosts.map((post, idx) => ({
      id: post.id,
      display_order: idx + 1
    }));

    for (const update of updates) {
      await supabase.from('community_posts').update({ display_order: update.display_order }).eq('id', update.id);
    }

    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    if (!supabase) return;

    const { error } = await supabase.from('community_posts').delete().eq('id', id);
    if (error) alert(error.message);
    else onRefresh();
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    if (!supabase) return;
    const { error } = await supabase.from('community_posts').update({ status }).eq('id', id);
    if (error) alert(error.message);
    else onRefresh();
  };

  const handleSaveEdit = async () => {
    if (!editingPost || !supabase) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('community_posts')
      .update({
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category,
        tags: editingPost.tags
      })
      .eq('id', editingPost.id);

    setIsSaving(false);
    if (error) {
      alert(`Error updating post: ${error.message}`);
    } else {
      setEditingPost(null);
      onRefresh();
    }
  };

  if (editingPost) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Post</h3>
          <button onClick={() => setEditingPost(null)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input 
              type="text" 
              value={editingPost.title}
              onChange={e => setEditingPost({...editingPost, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input 
                type="text" 
                value={editingPost.category}
                onChange={e => setEditingPost({...editingPost, category: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma sep)</label>
              <input 
                type="text" 
                value={editingPost.tags?.join(', ')}
                onChange={e => setEditingPost({...editingPost, tags: e.target.value.split(',').map(t => t.trim())})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <DualModeEditor 
              content={editingPost.content}
              onChange={val => setEditingPost({...editingPost, content: typeof val === 'string' ? val : ''})}
              minHeight="400px"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2"
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          No posts found.
        </div>
      )}

      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className={cn(
            "bg-white dark:bg-gray-900 border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center transition-all",
            post.status === 'pending' ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10" : "border-gray-200 dark:border-gray-800"
          )}
        >
          {/* Reorder Controls */}
          <div className="flex md:flex-col gap-1">
            <button 
              onClick={() => handleMove(index, 'up')}
              disabled={index === 0}
              className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
            >
              <ArrowUp size={16} />
            </button>
            <button 
              onClick={() => handleMove(index, 'down')}
              disabled={index === posts.length - 1}
              className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "px-2 py-0.5 text-[10px] uppercase font-bold rounded-full",
                post.status === 'approved' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                post.status === 'pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}>
                {post.status}
              </span>
              <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{post.title}</h4>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{post.author_name}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link 
              to={`/community/${post.id}`}
              target="_blank"
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="View Live"
            >
              <ExternalLink size={18} />
            </Link>

            {post.status === 'pending' && (
              <>
                <button 
                  onClick={() => handleStatusChange(post.id, 'approved')}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                  title="Approve"
                >
                  <CheckCircle size={18} />
                </button>
                <button 
                  onClick={() => handleStatusChange(post.id, 'rejected')}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  title="Reject"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}
            
            <button 
              onClick={() => setEditingPost(post)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
              title="Edit Content"
            >
              <Edit2 size={18} />
            </button>
            
            <button 
              onClick={() => handleDelete(post.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
