import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { subjects as mockSubjects } from '../data/mockData';
import { Subject } from '../types';

export const useCurriculum = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculum = async () => {
    try {
      if (!supabase) {
        setSubjects(mockSubjects);
        return;
      }

      // 1. Fetch Subjects (Removed sorting by created_at to prevent crashes if column missing)
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*');

      if (subjectsError) throw subjectsError;

      // If DB is empty, fall back to mock data
      if (!subjectsData || subjectsData.length === 0) {
        console.log('Database empty, using mock data');
        setSubjects(mockSubjects);
        return;
      }

      // 2. Fetch Modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*');

      if (modulesError) throw modulesError;

      // 3. Fetch Topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*');

      if (topicsError) throw topicsError;

      // 4. Reconstruct Hierarchy
      const fullCurriculum: Subject[] = subjectsData.map(subject => ({
        ...subject,
        modules: modulesData
          .filter(m => m.subject_id === subject.id)
          .map(module => ({
            ...module,
            topics: topicsData
              .filter(t => t.module_id === module.id)
              .map(topic => ({
                ...topic,
                // Ensure content is parsed if it comes as a string, or used as is if JSON
                content: typeof topic.content === 'string' ? JSON.parse(topic.content) : topic.content
              }))
          }))
      }));

      setSubjects(fullCurriculum);

    } catch (err) {
      console.error('Error fetching curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch curriculum');
      // Fallback on error
      setSubjects(mockSubjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  return { subjects, loading, error, refresh: fetchCurriculum };
};
