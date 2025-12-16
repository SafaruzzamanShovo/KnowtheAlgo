import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HomeSettings, AboutSettings, Category, CommunityPageSettings, ContributePageSettings } from '../types';

const DEFAULT_HOME: HomeSettings = {
  title: "Decode the Algorithm of Success.",
  subtitle: "A structured path to mastering Computer Science.",
  cta_text: "Start Learning",
  community_title: "Learn better, together.",
  community_desc: "Join our community of developers. Share your knowledge, ask questions about algorithms, and get feedback on your system designs.",
  collab_title: "Let's Build Something Amazing",
  collab_desc: "I'm always open to discussing new projects, research opportunities, or just geeking out over system design."
};

const DEFAULT_ABOUT: AboutSettings = {
  name: "Alex Dev",
  role: "Senior Software Engineer & Researcher",
  bio: "I bridge the gap between theoretical computer science and practical software engineering. My work focuses on distributed systems, AI infrastructure, and making complex algorithms accessible to everyone.",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  skills: [
    "React", "TypeScript", "Node.js", "Python", "Go", "Rust", 
    "System Design", "Distributed Systems", "Kubernetes", "Docker", "AWS",
    "TensorFlow", "PyTorch", "GraphQL", "PostgreSQL", "Redis"
  ],
  resume_link: "#",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    scholar: "https://scholar.google.com",
    email: "mailto:alex@example.com"
  }
};

const DEFAULT_COMMUNITY: CommunityPageSettings = {
  title: "Community Hub",
  subtitle: "Select a topic to explore discussions, tutorials, and insights shared by the community."
};

const DEFAULT_CONTRIBUTE: ContributePageSettings = {
  title: "Contribute to the Knowledge Base",
  subtitle: "Share your knowledge with the community. Whether it's a new algorithm, a system design case study, or a web dev tutorial."
};

export const useSiteSettings = () => {
  const [homeSettings, setHomeSettings] = useState<HomeSettings>(DEFAULT_HOME);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings>(DEFAULT_ABOUT);
  const [communitySettings, setCommunitySettings] = useState<CommunityPageSettings>(DEFAULT_COMMUNITY);
  const [contributeSettings, setContributeSettings] = useState<ContributePageSettings>(DEFAULT_CONTRIBUTE);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      // Fetch Settings
      const { data: settingsData } = await supabase.from('site_settings').select('*');
      
      if (settingsData) {
        const home = settingsData.find(s => s.key === 'home_hero');
        if (home) setHomeSettings({ ...DEFAULT_HOME, ...home.value });

        const about = settingsData.find(s => s.key === 'about_profile');
        if (about) setAboutSettings({ ...DEFAULT_ABOUT, ...about.value });

        const community = settingsData.find(s => s.key === 'community_page');
        if (community) setCommunitySettings({ ...DEFAULT_COMMUNITY, ...community.value });

        const contribute = settingsData.find(s => s.key === 'contribute_page');
        if (contribute) setContributeSettings({ ...DEFAULT_CONTRIBUTE, ...contribute.value });
      }

      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

    } catch (error) {
      console.error("Error fetching site settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { 
    homeSettings, 
    aboutSettings, 
    communitySettings,
    contributeSettings,
    categories, 
    loading, 
    refresh: fetchData 
  };
};
