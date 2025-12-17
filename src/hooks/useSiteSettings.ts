import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  HomeSettings, AboutSettings, Category, CommunityPageSettings, ContributePageSettings,
  BrandingSettings, FooterSettings, ValuePropItem, QuickNavItem, NavigationItem
} from '../types';

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
    "Machine Learning", "Distributed Systems", "Computer Vision", "Deep Learning", "System Design"
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

const DEFAULT_BRANDING: BrandingSettings = {
  siteName: "Knowthe",
  logoText: "Algo"
};

const DEFAULT_FOOTER: FooterSettings = {
  text: "Made with Heart by Safaruzzaman Shovo",
  copyright: "All rights reserved."
};

const DEFAULT_NAV: NavigationItem[] = [
  { label: 'Learning Paths', path: '/courses', visible: true },
  { label: 'Community', path: '/community', visible: true },
  { label: "Let's Collaborate", path: '/collaborate', visible: true },
];

const DEFAULT_VALUE_PROPS: ValuePropItem[] = [
  { icon: "Layers", title: "Structured Learning", desc: "Curated paths from basics to advanced engineering concepts." },
  { icon: "BookOpen", title: "Research-Driven", desc: "Content backed by academic rigor and industry standards." },
  { icon: "Users", title: "Community Support", desc: "Learn together with a network of passionate developers." },
  { icon: "Briefcase", title: "Career Focused", desc: "Build a portfolio that stands out to top tech recruiters." }
];

const DEFAULT_QUICK_NAV: QuickNavItem[] = [
  { icon: "Code2", title: "Browse All Courses", desc: "Explore Full Curriculum", link: "/courses", color: "bg-blue-500" },
  { icon: "MessageSquare", title: "Join Community", desc: "Read Discussions", link: "/community", color: "bg-purple-500" },
  { icon: "PenTool", title: "Let's Collaborate", desc: "Work Together", link: "/collaborate", color: "bg-rose-500" }
];

export const useSiteSettings = () => {
  const [homeSettings, setHomeSettings] = useState<HomeSettings>(DEFAULT_HOME);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings>(DEFAULT_ABOUT);
  const [communitySettings, setCommunitySettings] = useState<CommunityPageSettings>(DEFAULT_COMMUNITY);
  const [contributeSettings, setContributeSettings] = useState<ContributePageSettings>(DEFAULT_CONTRIBUTE);
  
  // Global Settings
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);
  const [footer, setFooter] = useState<FooterSettings>(DEFAULT_FOOTER);
  const [navigation, setNavigation] = useState<NavigationItem[]>(DEFAULT_NAV);
  
  // Home Components
  const [valueProps, setValueProps] = useState<ValuePropItem[]>(DEFAULT_VALUE_PROPS);
  const [quickNav, setQuickNav] = useState<QuickNavItem[]>(DEFAULT_QUICK_NAV);

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

        // Global
        const brand = settingsData.find(s => s.key === 'site_branding');
        if (brand) setBranding({ ...DEFAULT_BRANDING, ...brand.value });

        const foot = settingsData.find(s => s.key === 'site_footer');
        if (foot) setFooter({ ...DEFAULT_FOOTER, ...foot.value });

        const nav = settingsData.find(s => s.key === 'site_navigation');
        if (nav) setNavigation(nav.value);

        // Components
        const vProps = settingsData.find(s => s.key === 'home_value_props');
        if (vProps) setValueProps(vProps.value);

        const qNav = settingsData.find(s => s.key === 'home_quick_nav');
        if (qNav) setQuickNav(qNav.value);
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
    branding,
    footer,
    navigation,
    valueProps,
    quickNav,
    categories, 
    loading, 
    refresh: fetchData 
  };
};
