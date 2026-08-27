import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Cpu, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

interface SplashScreenProps {
  onComplete: () => void;
}

const SYSTEM_STAGES = [
  'Initializing Computational Neural Matrix...',
  'Connecting Embedded Telematics Pipeline...',
  'Calibrating XGBoost Predictive Engines...',
  'Compiling Interactive 3D Workflows...',
  'Data Intelligence Ready // Welcome.'
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { data } = usePortfolioData();
  const PERSONAL_INFO = data.personalInfo;
  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2200; // 2.2 seconds total load sequence
    let rafId: number;

    const tick = (now: number) => {
      if (hasFinishedRef.current) return;

      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      
      // Natural easeInOutCubic curve for smooth realistic progress feel
      const easedProgress = rawProgress < 0.5 
        ? 4 * rawProgress * rawProgress * rawProgress 
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      const currentPercent = Math.min(100, Math.round(easedProgress * 100));
      setProgress(currentPercent);

      // Determine stage index
      const stage = Math.min(
        Math.floor(rawProgress * SYSTEM_STAGES.length),
        SYSTEM_STAGES.length - 1
      );
      setStageIndex(stage);

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setIsCompleted(true);
        hasFinishedRef.current = true;
        setTimeout(() => {
          onComplete();
        }, 450);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setProgress(100);
    setIsCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070707] text-white select-none overflow-hidden"
    >
      {/* Background Ambience & Lighting Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#FF3E00]/25 via-[#FF9E00]/15 to-transparent rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#FF3E00]/15 rounded-full blur-2xl" />
        
        {/* Subtle animated grid background */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center">
        {/* Premium Emblem with Pulse Rings */}
        <div className="relative mb-8">
          {/* Animated pulsing outer rings */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-3xl border border-[#FF3E00]/40 blur-sm"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute -inset-8 rounded-full border border-[#FF9E00]/20 blur-md"
          />

          {/* Core Avatar / Monogram Box */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-24 h-24 rounded-3xl p-1 bg-gradient-to-br from-[#FF3E00] via-[#FF9E00] to-[#FF3E00] shadow-2xl shadow-[#FF3E00]/40 skew-item"
          >
            <div className="w-full h-full rounded-[22px] bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden">
              {PERSONAL_INFO.avatarUrl ? (
                <img
                  src={PERSONAL_INFO.avatarUrl}
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover object-top opacity-95 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="font-mono text-2xl font-black tracking-tighter text-[#FF9E00]">RP</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
              <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
            </div>
          </motion.div>
        </div>

        {/* Name with Typographic Stagger */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-2 mb-8 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono tracking-widest uppercase text-[#FF9E00]">
            <Brain className="w-3 h-3 text-[#FF3E00]" />
            <span>Applied Intelligence Portfolio</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {PERSONAL_INFO.name}
          </h1>

          <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-[#FF9E00] font-semibold text-center">
            {PERSONAL_INFO.role}
          </p>
        </motion.div>

        {/* Progress Bar & Telemetry Status */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1 min-h-[20px]">
            <span className="text-left truncate max-w-[260px] text-[11px] text-neutral-300 font-medium">
              {SYSTEM_STAGES[stageIndex]}
            </span>
            <span className="text-[#FF9E00] font-bold text-xs font-mono">
              {progress}%
            </span>
          </div>

          {/* Premium Loading Progress Track & Bar */}
          <div className="w-full h-2.5 bg-neutral-900/90 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF3E00] via-[#FF9E00] to-[#FBBF24] transition-all duration-75 ease-out relative"
              style={{ width: `${Math.max(3, progress)}%` }}
            >
              {/* Glowing leading head on the progress bar */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
            </div>
          </div>
        </div>

        {/* Skip button for quick convenience */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          whileHover={{ opacity: 1 }}
          onClick={handleSkip}
          className="mt-8 text-[11px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-white/5"
        >
          <span>Enter Portfolio</span>
          <ArrowRight className="w-3 h-3 text-[#FF3E00]" />
        </motion.button>
      </div>

      {/* Decorative Bottom Telemetry Bar */}
      <div className="absolute bottom-6 left-0 right-0 px-8 flex items-center justify-between text-[10px] font-mono text-neutral-600 uppercase tracking-widest pointer-events-none">
        <span>SYS // VER 2026.04</span>
        <span className="hidden sm:inline">MALAYSIA / GLOBAL TELEMETRICS</span>
        <span>STATUS: ACTIVE</span>
      </div>
    </motion.div>
  );
};
