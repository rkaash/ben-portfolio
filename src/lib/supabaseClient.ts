import { createClient } from '@supabase/supabase-js';

/**
 * Supabase connection.
 *
 * Environment variables win when present, otherwise these built-in values are
 * used so the site works on any host without extra configuration.
 *
 * Committing these is safe and deliberate:
 *  - Every VITE_* value is compiled into the browser bundle anyway, so none of
 *    them can be kept secret in a frontend app.
 *  - The publishable ("anon") key is designed to be public. It grants only what
 *    the Row Level Security policies in supabase/setup.sql allow: anyone may
 *    read the portfolio content, and only the OTP-verified owner may write.
 *  - The owner email is already shown publicly on the site.
 *
 * The service_role key is the one that must never appear here or anywhere in
 * the frontend - it bypasses RLS entirely.
 */
const FALLBACK_URL = 'https://oavchmjzxjhwkltiowll.supabase.co';
const FALLBACK_ANON_KEY = 'sb_publishable_Jq8Jboy1mD5IDMk0KLMEHg_9vVPbsWQ';
const FALLBACK_OWNER_EMAIL = 'r.prakaash@yahoo.com';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON_KEY;

export const OWNER_EMAIL =
  (import.meta.env.VITE_OWNER_EMAIL as string | undefined) || FALLBACK_OWNER_EMAIL;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const CONTENT_TABLE = 'portfolio_content';
export const MEDIA_BUCKET = 'portfolio-media';
