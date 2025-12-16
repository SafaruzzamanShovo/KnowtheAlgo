import React, { useEffect, useState } from 'react';
import { useCurriculum } from '../hooks/useCurriculum';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import { supabase } from '../lib/supabase';
import { CommunityPost } from '../types';

// Components
import { HeroSection } from '../components/home/HeroSection';
import { ValueProps } from '../components/home/ValueProps';
import { LearningPaths } from '../components/home/LearningPaths';
import { FeaturedContent } from '../components/home/FeaturedContent';
import { CollaborationCTA } from '../components/home/CollaborationCTA';
import { QuickNav } from '../components/home/QuickNav';

export const Home = () => {
  // Data Hooks
  const { subjects, loading: curriculumLoading } = useCurriculum();
  const { homeSettings } = useSiteSettings();
  const { posts: communityPosts } = useCommunityPosts();
  
  const [latestPost, setLatestPost] = useState<CommunityPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);

  // Fetch Latest Post
  useEffect(() => {
    const fetchLatestPost = async () => {
      if (!supabase) {
        setLoadingPost(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setLatestPost(data);
      }
      setLoadingPost(false);
    };

    fetchLatestPost();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      <HeroSection settings={homeSettings} />
      
      <ValueProps />
      
      <LearningPaths subjects={subjects} loading={curriculumLoading} />
      
      <FeaturedContent 
        post={latestPost} 
        loading={loadingPost}
        title={homeSettings.community_title}
        subtitle={homeSettings.community_desc}
      />

      <CollaborationCTA settings={homeSettings} />
      
      <QuickNav />

    </div>
  );
};
