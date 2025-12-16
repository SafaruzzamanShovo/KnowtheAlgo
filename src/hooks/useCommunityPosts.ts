import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CommunityPost } from '../types';

export const useCommunityPosts = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, refresh: fetchPosts };
};
