import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL as string) || '';

// When env vars are missing the app still renders from bundled defaults instead of
// crashing on a null client - isSupabaseConfigured gates every network call.
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // Silently serving stale bundled defaults is hard to diagnose on a deployed
  // site (it looks like "the content reverted"), so say so loudly.
  console.warn(
    '[portfolio] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set, so the ' +
    'site is rendering bundled default content instead of your live Supabase data. ' +
    'Uploaded images and any edits made in the owner editor will NOT appear. ' +
    'Set these in your hosting provider\'s environment variables and redeploy — ' +
    'VITE_ values are baked in at build time, so a rebuild is required.'
  );
}

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
