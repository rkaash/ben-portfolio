import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL as string) || '';

// When env vars are missing the app still renders from bundled defaults instead of
// crashing on a null client - isSupabaseConfigured gates every network call.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const CONTENT_TABLE = 'portfolio_content';
export const MEDIA_BUCKET = 'portfolio-media';
