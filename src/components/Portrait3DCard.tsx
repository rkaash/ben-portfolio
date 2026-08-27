import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Award, Brain } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface Portrait3DCardProps {
  theme: ThemeMode;
}

// Matches the same page backgrounds used in App.tsx's getThemeBackground(),
// so the portrait's frame blends seamlessly into the active theme.
const THEME_SURFACE: Record<ThemeMode, string> = {
  artistic: '#080808',
  dark: '#020617',
  midnight: '#030712',
  cyberpunk: '#0a0518',
  light: '#f8fafc',
};

export const Portrait3DCard: React.FC<Portrait3DCardProps> = ({ theme }) => {
  const { data } = usePortfolioData();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 220,
    damping: 22,
  });
  const brightness = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.1, 0.95]), {
    stiffness: 200,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const isDark = theme !== 'light';

  // Portrait is set through the owner editor; until one is uploaded (or if the
  // stored URL fails to load) the RP monogram stands in, matching the header.
  const portraitUrl = data.personalInfo.portraitUrl;
  const showMonogram = !portraitUrl || imageFailed;
  const surfaceColor = THEME_SURFACE[theme];

  return (
    <div
      className="relative w-full max-w-md mx-auto perspective-1000 select-none py-4"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient background glow */}
      <div 
        className={`absolute inset-0 -m-6 rounded-full blur-3xl opacity-50 transition-all duration-700 pointer-events-none ${
          isHovered 
            ? 'opacity-80 scale-105 bg-gradient-to-tr from-[#FF3E00]/40 via-[#FF9E00]/30 to-[#3B82F6]/25' 
            : 'bg-gradient-to-tr from-[#FF3E00]/25 via-[#FF9E00]/15 to-transparent'
        }`} 
      />

      {/* 3D Animated Card Frame */}
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative rounded-3xl border p-3.5 transition-all duration-300 shadow-2xl backdrop-blur-2xl ${
          isDark 
            ? 'glass-card border-white/20 shadow-black/80' 
            : 'bg-white/90 border-slate-200 shadow-xl'
        }`}
      >
        {/* Holographic light sheen reflection */}
        <motion.div
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 45%, transparent 60%)',
          }}
          className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
        />

        {/* Image Container with Rounded Border - background matches the active site theme */}
        <div
          style={{ backgroundColor: surfaceColor }}
          className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10 shadow-inner group"
        >
          {showMonogram ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-24 h-24 rounded-3xl accent-gradient flex items-center justify-center shadow-2xl shadow-[#FF3E00]/40">
                <span className="font-mono text-3xl font-black tracking-tighter text-black">RP</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                No portrait uploaded
              </span>
            </div>
          ) : (
            <img
              src={portraitUrl}
              alt={`${data.personalInfo.name} - ${data.personalInfo.role}`}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}

          {/* Vignette & Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Status Badge */}
          <div 
            style={{ transform: 'translateZ(35px)' }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-white/20 backdrop-blur-md text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                {data.personalInfo.role}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center text-black shadow-lg shadow-[#FF3E00]/40 font-bold">
              <Brain className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Floating Info Pill (Deep 3D Popout) */}
          <motion.div
            style={{ transform: 'translateZ(45px)' }}
            className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-card border-white/20 backdrop-blur-xl text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg accent-gradient flex items-center justify-center text-black font-bold">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wide text-[#FF9E00]">
                  {data.personalInfo.role}
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Available
              </span>
            </div>

            <div className="text-sm font-bold tracking-tight uppercase">
              {data.personalInfo.name}
            </div>
            <p className="text-[11px] font-mono text-neutral-300 font-light mt-0.5">
              {data.personalInfo.tagline}
            </p>
          </motion.div>

        </div>

        {/* Bottom subtle accent line */}
        <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
            {data.personalInfo.location}
          </span>
          <span className="text-[#FF9E00]">{data.personalInfo.stats[3]?.value || ''}</span>
        </div>
      </motion.div>
    </div>
  );
};
