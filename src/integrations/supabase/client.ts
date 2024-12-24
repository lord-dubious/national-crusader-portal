import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nuyliaknnbgbtrrmqyje.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eWxpYWtubmJnYnRycm1xeWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3ODQyMzIsImV4cCI6MjA1MDM2MDIzMn0.p9Ikh11Q9jCpS5yxtlXrTsYmyzoL17c89sNzQrvyEW0";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
  }
);