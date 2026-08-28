import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured, CONTENT_TABLE } from '../lib/supabaseClient';
import { PortfolioContent } from '../types';

/**
 * Supabase is the ONLY source of portfolio content at runtime.
 *
 * There is deliberately no bundled fallback: if the database cannot be reached,
 * the site shows an error instead of quietly serving a stale snapshot that was
 * frozen into the bundle at build time. Silently-wrong content is worse than a
 * visible failure — it hides the outage and misrepresents the owner.
 *
 * `src/data/portfolioData.ts` still exists, but ONLY as the seed that
 * `npm run gen:content` compiles into supabase/update-content.sql. It is never
 * imported by anything that renders.
 */

interface PortfolioDataContextValue {
  data: PortfolioContent;
  error: string | null;
  /** Persists to Supabase. Resolves true on success, false (with `error` set) on failure. */
  setData: (next: PortfolioContent) => Promise<boolean>;
  /** Throws away unsaved edits by re-reading the saved content from Supabase. */
  discardChanges: () => Promise<void>;
  refresh: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null);

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; content: PortfolioContent }
  | { status: 'error'; message: string };

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LoadState>(
    isSupabaseConfigured
      ? { status: 'loading' }
      : { status: 'error', message: 'Supabase is not configured, so there is no content to load.' }
  );
  // Holds the last successfully saved content so a failed write can be rolled back.
  const lastGoodRef = useRef<PortfolioContent | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setState({ status: 'loading' });

    const { data: row, error: fetchError } = await supabase
      .from(CONTENT_TABLE)
      .select('content')
      .eq('id', 1)
      .maybeSingle();

    if (fetchError) {
      setState({ status: 'error', message: `Could not load portfolio content: ${fetchError.message}` });
      return;
    }
    if (!row?.content) {
      setState({
        status: 'error',
        message:
          'No portfolio content found in the database. Run supabase/update-content.sql in the Supabase SQL Editor to seed it.',
      });
      return;
    }

    const content = row.content as PortfolioContent;
    lastGoodRef.current = content;
    setState({ status: 'ready', content });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [writeError, setWriteError] = useState<string | null>(null);

  const persist = useCallback(async (next: PortfolioContent): Promise<boolean> => {
    const previous = lastGoodRef.current;
    setState({ status: 'ready', content: next });

    if (!supabase) {
      setWriteError('Supabase is not configured, so changes cannot be saved.');
      return false;
    }

    const { error: err } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ id: 1, content: next }, { onConflict: 'id' });

    if (err) {
      if (previous) setState({ status: 'ready', content: previous });
      setWriteError(
        err.message.toLowerCase().includes('row-level security')
          ? 'Not authorised to save. Please verify your email again.'
          : `Save failed: ${err.message}`
      );
      return false;
    }

    lastGoodRef.current = next;
    setWriteError(null);
    return true;
  }, []);

  const discardChanges = useCallback(async () => {
    setWriteError(null);
    await load();
  }, [load]);

  const value = useMemo(
    () =>
      state.status === 'ready'
        ? {
            data: state.content,
            error: writeError,
            setData: persist,
            discardChanges,
            refresh: load,
          }
        : null,
    [state, writeError, persist, discardChanges, load]
  );

  if (state.status === 'loading' || !value) {
    return <StatusScreen kind="loading" />;
  }
  if (state.status === 'error') {
    return <StatusScreen kind="error" message={state.message} onRetry={load} />;
  }

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
};

/**
 * Full-page loading / failure state. Rendered in place of the site, because
 * without content from the database there is genuinely nothing to show.
 */
const StatusScreen: React.FC<{ kind: 'loading' | 'error'; message?: string; onRetry?: () => void }> = ({
  kind,
  message,
  onRetry,
}) => (
  <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 flex items-center justify-center px-6">
    <div className="max-w-md text-center">
      {kind === 'loading' ? (
        <>
          <Loader2 className="w-7 h-7 mx-auto animate-spin text-[#FF9E00]" />
          <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
            Loading portfolio…
          </p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <h1 className="mt-5 text-lg font-bold text-white">Portfolio unavailable</h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-bold accent-gradient text-black hover:scale-105 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </button>
          )}
        </>
      )}
    </div>
  </div>
);

export function usePortfolioData(): PortfolioDataContextValue {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return ctx;
}
