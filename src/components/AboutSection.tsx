import React from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  CheckCircle2,
  Award,
  Layers,
  Cpu
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface AboutSectionProps {
  theme: ThemeMode;
}

const PILLAR_ICONS: Record<string, React.ElementType> = { Brain, Layers, Cpu };

export const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  const { data } = usePortfolioData();
  const { personalInfo: PERSONAL_INFO, about } = data;
  const isDark = theme !== 'light';

  return (
    <section
      id="about"
      aria-label={`About ${PERSONAL_INFO.name}`}
      className="py-14 relative overflow-hidden"
    >
      {/* Background Accent Grids */}
      <div className={`absolute inset-0 pointer-events-none opacity-30 ${
        isDark ? 'bg-grid-pattern' : 'bg-grid-pattern-light'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#FF9E00]">
              {about.sectionTitle}
            </span>
            <div className="w-8 h-[1px] bg-[#FF3E00]" />
          </div>

          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>{about.headlineMain} </span>
            <span className="text-outline hover:text-[#FF3E00] transition-colors cursor-default">
              {about.headlineHighlight}
            </span>
          </h2>

          <p className={`max-w-2xl text-sm sm:text-base font-light ${
            isDark ? 'text-neutral-400' : 'text-slate-600'
          }`}>
            {about.description}
          </p>
        </div>

        {/* Focused Profile Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl p-8 sm:p-10 border backdrop-blur-xl relative overflow-hidden shadow-2xl ${
            isDark 
              ? 'glass-card border-white/10 text-white' 
              : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3E00]/10 rounded-full blur-3xl pointer-events-none -z-0" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 mb-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center text-black shadow-lg shadow-[#FF3E00]/30 skew-item">
                  <Brain className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
                    {PERSONAL_INFO.formalName}
                  </h3>
                  <p className="text-xs font-mono text-[#FF9E00]">
                    {about.formalTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/15 text-xs font-mono text-[#FF9E00]">
                  <Award className="w-4 h-4 text-[#FF3E00]" />
                  <span>{about.badgeText}</span>
                </div>
              </div>
            </div>

            {/* Biography text */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-neutral-300 font-light' : 'text-slate-700'
            }`}>
              <p>{about.paragraph1}</p>
              <p>{about.paragraph2}</p>
            </div>

            {/* Core Competency Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {about.pillars.map((item, idx) => {
                const Icon = PILLAR_ICONS[item.iconName] || Brain;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border skew-item transition-all duration-300 hover:scale-[1.02] ${
                      isDark ? 'glass-card border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF3E00] mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#FF9E00] mb-1.5 uppercase tracking-wider">
                      {item.title}
                    </div>
                    <div className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400 font-light' : 'text-slate-600'}`}>
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Closing statement */}
            <div className="pt-6 mt-8 border-t border-white/10">
              <div className="flex items-start gap-2 text-xs font-mono text-neutral-400">
                <Brain className="w-4 h-4 text-[#FF3E00] shrink-0 mt-px" />
                <span>{about.quote}</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
