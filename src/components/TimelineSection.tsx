import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface TimelineSectionProps {
  theme: ThemeMode;
}

const TABS = [
  { id: 'all', label: 'All Milestones' },
  { id: 'education', label: 'Academic Education', icon: GraduationCap },
  { id: 'experience', label: 'Work Experience', icon: Briefcase }
];

export const TimelineSection: React.FC<TimelineSectionProps> = ({ theme }) => {
  const { data } = usePortfolioData();
  const [activeTab, setActiveTab] = useState('all');

  const isDark = theme !== 'light';

  const filteredItems = data.timeline.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'education': return GraduationCap;
      default: return Briefcase;
    }
  };

  return (
    <section
      id="experience"
      aria-label="Experience and Achievements Timeline"
      className="py-14 relative overflow-hidden"
    >
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#FF9E00]">
              03 / EDUCATION & EXPERIENCE
            </span>
            <div className="w-8 h-[1px] bg-[#FF3E00]" />
          </div>

          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>MY </span>
            <span className="text-outline hover:text-[#FF3E00] transition-colors cursor-default">
              JOURNEY
            </span>
          </h2>

          <p className={`max-w-2xl text-sm sm:text-base font-light ${
            isDark ? 'text-neutral-400' : 'text-slate-600'
          }`}>
            My academic path through Data Science and the industry roles that shaped how I work.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 sm:py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 skew-item hover:skew-x-0 ${
                activeTab === tab.id
                  ? 'accent-gradient text-black font-bold shadow-lg shadow-[#FF3E00]/30'
                  : isDark
                    ? 'glass-card border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Timeline Flow */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Central spine line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#FF3E00] via-[#FF9E00] to-[#3B82F6] opacity-40" />

          <div className="space-y-8 relative">
            {filteredItems.map((item, idx) => {
              const Icon = getIcon(item.type);
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-6 sm:gap-12 relative`}
                >
                  
                  {/* Timeline Badge Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-4 w-9 h-9 rounded-full bg-black border-2 border-[#FF3E00] flex items-center justify-center text-[#FF9E00] shadow-lg shadow-[#FF3E00]/40 z-10 skew-item">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Spacer for 2-column alternating layout */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Card Body */}
                  <div className="pl-12 sm:pl-0 w-full sm:w-1/2">
                    <div className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 hover:shadow-2xl backdrop-blur-xl skew-item ${
                      isDark
                        ? 'glass-card border-white/10 hover:border-white/25'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold glass-card border-white/15 text-[#FF9E00]">
                          <Calendar className="w-3 h-3 text-[#FF3E00]" />
                          {item.period}
                        </span>
                        {item.badge && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold accent-gradient text-black shadow-md shadow-[#FF3E00]/20">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold uppercase tracking-wide text-white mb-1">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mb-4">
                        <span className="text-[#FF9E00] font-semibold">{item.organization}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF3E00]" />
                          {item.location}
                        </span>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed mb-4 font-light ${
                        isDark ? 'text-neutral-300' : 'text-slate-700'
                      }`}>
                        {item.description}
                      </p>

                      {/* Key Achievements Bullet list */}
                      <div className="space-y-2 mb-5">
                        {item.achievements.map((ach, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-neutral-300 font-light' : 'text-slate-700'}>{ach}</span>
                          </div>
                        ))}
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[9px] font-mono uppercase tracking-widest border ${
                              isDark ? 'glass-card border-white/10 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
