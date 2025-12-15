import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PortfolioItem, PortfolioSection } from '../types';
import { portfolioMockItems } from '../data/portfolioMockData';

export const usePortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setItems(portfolioMockItems);
        return;
      }

      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fallback to mock data if DB is empty so the user sees the design immediately
      if (!data || data.length === 0) {
        console.log("Database empty, using mock portfolio data.");
        setItems(portfolioMockItems);
      } else {
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setItems(portfolioMockItems); // Fallback on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const getSection = (section: PortfolioSection) => items.filter(i => i.section === section);

  return { 
    items, 
    loading, 
    refresh: fetchPortfolio,
    getSection 
  };
};
