import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, X, RefreshCw, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ThemeMode } from '../types';

interface OtpVerifyModalProps {
  isOpen: boolean;
  email: string;
  theme: ThemeMode;
  onClose: () => void;
  onVerified: () => void;
}

type Stage = 'sending' | 'awaiting-code' | 'verifying' | 'verified' | 'send-failed';

// Supabase's "Email OTP Length" is configurable (6-10 digits), so accept the
// whole range rather than hard-coding one length that a settings change breaks.
const MIN_OTP_LENGTH = 6;
const MAX_OTP_LENGTH = 10;

/** Supabase auth errors are terse; translate the ones an owner can actually hit. */
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('signups not allowed')) {
    return 'No owner account exists for this email yet. In Supabase, go to Authentication → Users → Add user, create this address with "Auto Confirm User" ticked, then try again.';
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Too many code requests. Supabase\'s built-in mailer is rate-limited — wait a few minutes and try again.';
  }
  if (m.includes('invalid') && m.includes('token')) {
    return 'That code is not valid. Check the digits, or request a new code.';
  }
  if (m.includes('expired')) {
    return 'That code has expired. Request a new one.';
  }
  if (m.includes('failed to fetch') || m.includes('network')) {
    return 'Could not reach the server. Check your internet connection.';
  }
  return message;
}

export const OtpVerifyModal: React.FC<OtpVerifyModalProps> = ({ isOpen, email, theme, onClose, onVerified }) => {
  const [stage, setStage] = useState<Stage>('sending');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDark = theme !== 'light';

  const sendCode = useCallback(async () => {
    setStage('sending');
    setError(null);

    if (!supabase) {
      setError('Supabase is not configured. Check your .env file.');
      setStage('send-failed');
      return;
    }

    // shouldCreateUser:false means only the pre-created owner account can ever
    // request a code - nobody can self-register their way into edit access.
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (sendError) {
      setError(friendlyAuthError(sendError.message));
      setStage('send-failed');
      return;
    }

    setStage('awaiting-code');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [email]);

  // React StrictMode runs effects twice in development. Without this guard the
  // modal requests two codes back-to-back and the second invalidates the first,
  // so the code in the email you just opened would always be rejected.
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      hasRequestedRef.current = false;
      return;
    }
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    setCode('');
    setError(null);
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < MIN_OTP_LENGTH) {
      setError(`Enter the full code from your email (at least ${MIN_OTP_LENGTH} digits).`);
      return;
    }
    if (!supabase) return;

    setStage('verifying');
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'email',
    });

    if (verifyError) {
      setError(friendlyAuthError(verifyError.message));
      setStage('awaiting-code');
      return;
    }

    setStage('verified');
    setTimeout(() => onVerified(), 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" id="otp-verify-modal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full max-w-sm rounded-3xl border shadow-2xl z-10 p-6 sm:p-7 ${
            isDark ? 'glass-card border-white/15 text-white bg-black/90' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close verification modal"
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center text-black shadow-lg shadow-[#FF3E00]/30 mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1.5">Owner Verification</h3>
          <p className={`text-xs leading-relaxed mb-6 font-light ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
            To edit this portfolio, confirm it's you. A one-time code is sent to{' '}
            <span className="text-[#FF9E00] font-semibold font-mono break-all">{email}</span>.
          </p>

          {stage === 'sending' && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm font-mono text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF9E00]" />
              <span>Sending verification code...</span>
            </div>
          )}

          {stage === 'send-failed' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-xs text-rose-400 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={sendCode}
                className="w-full py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold accent-gradient text-black flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          )}

          {(stage === 'awaiting-code' || stage === 'verifying') && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex items-start gap-2 px-3 py-2 rounded-xl text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Code sent — check your inbox and spam folder.</span>
              </div>

              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={MAX_OTP_LENGTH}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, MAX_OTP_LENGTH));
                  if (error) setError(null);
                }}
                placeholder="Enter code"
                className={`w-full text-center text-xl sm:text-2xl tracking-[0.25em] font-mono py-3 px-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#FF3E00] transition-colors placeholder:tracking-normal placeholder:text-sm ${
                  isDark ? 'glass-card border-white/10 text-white placeholder-neutral-600' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />

              {error && (
                <div className="flex items-start gap-2 text-xs text-rose-400 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={stage === 'verifying' || code.length < MIN_OTP_LENGTH}
                className="w-full py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold accent-gradient text-black flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {stage === 'verifying' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verify &amp; Unlock Editing
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setCode(''); sendCode(); }}
                className="w-full text-center text-[11px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Resend Code
              </button>

              <p className="text-center text-[10px] font-mono text-neutral-600 leading-relaxed">
                Requesting a new code cancels the previous one — always use the
                most recent email.
              </p>
            </form>
          )}

          {stage === 'verified' && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
              <span className="text-xs font-mono uppercase tracking-widest">Verified — Unlocking Editor...</span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
