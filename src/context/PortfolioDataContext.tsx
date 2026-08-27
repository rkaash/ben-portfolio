import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  DEFAULT_PERSONAL_INFO,
  DEFAULT_ABOUT_DATA,
  PROJECTS,
  SKILLS,
  TIMELINE,
  TESTIMONIALS,
  FREQUENT_QUESTIONS,
} from '../data/portfolioData';
import { supabase, isSupabaseConfigured, CONTENT_TABLE } from '../lib/supabaseClient';
import { PortfolioContent } from '../types';

export const DEFAULT_CONTENT: PortfolioContent = {
  personalInfo: DEFAULT_PERSONAL_INFO,
  about: DEFAULT_ABOUT_DATA,
  projects: PROJECTS,
  skills: SKILLS,
  timeline: TIMELINE,
  testimonials: TESTIMONIALS,
  faqs: FREQUENT_QUESTIONS,
};

// Merges a stored payload over the bundled defaults so fields added to the
// defaults after a row was saved still appear instead of coming back undefined.
function mergeWithDefaults(parsed: Partial<PortfolioContent> | null | undefined): PortfolioContent {
  if (!parsed) return DEFAULT_CONTENT;
  return {
    personalInfo: {
      ...DEFAULT_CONTENT.personalInfo,
      ...parsed.personalInfo,
      socials: { ...DEFAULT_CONTENT.personalInfo.socials, ...parsed.personalInfo?.socials },
      stats: Array.isArray(parsed.personalInfo?.stats) ? parsed.personalInfo!.stats : DEFAULT_CONTENT.personalInfo.stats,
    },
    about: {
      ...DEFAULT_CONTENT.about,
      ...parsed.about,
      pillars: Array.isArray(parsed.about?.pillars) ? parsed.about!.pillars : DEFAULT_CONTENT.about.pillars,
    },
    projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_CONTENT.projects,
    skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_CONTENT.skills,
    timeline: Array.isArray(parsed.timeline) ? parsed.timeline : DEFAULT_CONTENT.timeline,
    testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : DEFAULT_CONTENT.testimonials,
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_CONTENT.faqs,
  };
}

interface PortfolioDataContextValue {
  data: PortfolioContent;
  isLoading: boolean;
  error: string | null;
  /** Persists to Supabase. Resolves true on success, false (with `error` set) on failure. */
  setData: (next: PortfolioContent) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const lastGoodRef = useRef<PortfolioContent>(DEFAULT_CONTENT);

  const load = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data: row, error: fetchError } = await supabase
      .from(CONTENT_TABLE)
      .select('content')
      .eq('id', 1)
      .maybeSingle();

    if (fetchError) {
      setError(`Could not load portfolio content: ${fetchError.message}`);
    } else if (row?.content) {
      const merged = mergeWithDefaults(row.content as Partial<PortfolioContent>);
      setDataState(merged);
      lastGoodRef.current = merged;
      setError(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback(async (next: PortfolioContent): Promise<boolean> => {
    const previous = lastGoodRef.current;
    setDataState(next);

    if (!supabase) {
      setError('Supabase is not configured, so changes cannot be saved.');
      return false;
    }

    const { error: writeError } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ id: 1, content: next }, { onConflict: 'id' });

    if (writeError) {
      setDataState(previous);
      setError(
        writeError.message.toLowerCase().includes('row-level security')
          ? 'Not authorised to save. Please verify your email again.'
          : `Save failed: ${writeError.message}`
      );
      return false;
    }

    lastGoodRef.current = next;
    setError(null);
    return true;
  }, []);

  const resetToDefaults = useCallback(() => persist(DEFAULT_CONTENT), [persist]);

  const value = useMemo(
    () => ({ data, isLoading, error, setData: persist, resetToDefaults, refresh: load }),
    [data, isLoading, error, persist, resetToDefaults, load]
  );

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export function usePortfolioData(): PortfolioDataContextValue {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return ctx;
}
