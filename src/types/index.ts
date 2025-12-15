export interface ContentBlock {
  type: 'text' | 'code' | 'heading' | 'image' | 'note';
  value: string;
  language?: string;
}

export interface Topic {
  id: string;
  title: string;
  readTime?: string; // e.g., "5 min"
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
  color: string; // Tailwind color class for gradients/accents
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

// Supabase Database Types
export interface DatabasePost {
  id: string;
  created_at: string;
  title: string;
  content: string; // Markdown content
  subject_id: string;
  module_id: string;
  author_id: string;
  status: 'draft' | 'published';
}
