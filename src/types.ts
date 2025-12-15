export interface ContentBlock {
  type: 'text' | 'code' | 'heading' | 'image' | 'note';
  value: string;
  language?: string;
}

export interface Topic {
  id: string;
  title: string;
  readTime?: string;
  content: ContentBlock[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
}

export interface Author {
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface CommunityPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_name: string;
  author_email?: string; // Added
  author_avatar?: string; // Added
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

// --- Site Settings Types ---

export interface HomeSettings {
  title: string;
  subtitle: string;
  cta_text: string;
  community_title: string;
  community_desc: string;
  collab_title: string;
  collab_desc: string;
}

export interface AboutSettings {
  name: string;
  role: string;
  bio: string;
  image: string;
  skills: string[];
  resume_link?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    scholar?: string;
    email?: string;
  };
}

export interface CommunityPageSettings {
  title: string;
  subtitle: string;
}

export interface ContributePageSettings {
  title: string;
  subtitle: string;
}

// --- Portfolio Types ---

export type PortfolioSection = 'news' | 'research' | 'project' | 'experience' | 'education' | 'honor' | 'leadership';

export interface PortfolioItem {
  id: string;
  section: PortfolioSection;
  title: string;
  subtitle?: string; // role, degree, category
  organization?: string; // company, school, lab
  period?: string;
  description?: string;
  details: {
    team?: string[];
    advisor?: string;
    tags?: string[];
    links?: {
      github?: string;
      demo?: string;
      scholar?: string;
      paper?: string;
    };
    status?: 'ongoing' | 'completed';
    type?: 'Competition' | 'Industry' | 'Course';
    icon?: string;
    color?: string;
    bg?: string;
    image?: string; // Added for research/work logos
    imageGradient?: string;
  };
  display_order?: number;
}
