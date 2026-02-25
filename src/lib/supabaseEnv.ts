/** Env-only check so AuthContext can avoid loading the Supabase SDK until needed. */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const hasValidSupabase = Boolean(supabaseUrl && supabaseAnonKey);
