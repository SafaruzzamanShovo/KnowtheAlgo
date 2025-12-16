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

      // 1. Fetch Subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*');

      if (subjectsError) throw subjectsError;

      // If DB is empty, fall back to mock data
      if (!subjectsData || subjectsData.length === 0) {
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
              .map(topic => {
                let parsedContent = topic.content;
                // Safely try to parse content if it's a string that looks like JSON
                if (typeof topic.content === 'string') {
                  try {
                    const parsed = JSON.parse(topic.content);
                    // Only use parsed if it's an object/array (Legacy Blocks), otherwise keep as string (Rich Text HTML)
                    if (typeof parsed === 'object' && parsed !== null) {
                      parsedContent = parsed;
                    }
                  } catch (e) {
                    // Content is likely plain HTML string, keep as is
                  }
                }
                
                return {
                  ...topic,
                  content: parsedContent
                };
              })
          }))
      }));

      setSubjects(fullCurriculum);

    } catch (err) {
      console.error('Error fetching curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch curriculum');
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
