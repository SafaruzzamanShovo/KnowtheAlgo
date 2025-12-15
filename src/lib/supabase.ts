import { createClient } from '@supabase/supabase-js';

// These environment variables will be populated when you connect Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export a client if configured, otherwise null to handle "Simulation Mode"
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConnected = !!supabase;
