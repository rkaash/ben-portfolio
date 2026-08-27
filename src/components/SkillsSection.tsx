import React from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Cpu,
  Code2,
  FileCode2,
  Server,
  Database,
  Palette,
  GitBranch,
  Box,
  Cloud,
  Monitor,
  Radio,
  Zap,
  Layers,
  Sparkles,
  BarChart3,
  PieChart,
  Terminal
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface SkillsSectionProps {
  theme: ThemeMode;
}

// Helper to resolve icon by string name
const getSkillIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain': return Brain;
    case 'Cpu': return Cpu;
    case 'Code2': return Code2;
    case 'FileCode2': return FileCode2;
    case 'Server': return Server;
    case 'Database': return Database;
    case 'Palette': return Palette;
    case 'GitBranch': return GitBranch;
    case 'Box': return Box;
    case 'Cloud': return Cloud;
    case 'Monitor': return Monitor;
    case 'Radio': return Radio;
    case 'Zap': return Zap;
    case 'Layers': return Layers;
    case 'Sparkles': return Sparkles;
    case 'BarChart3': return BarChart3;
    case 'PieChart': return PieChart;
    case 'Terminal': return Terminal;
    default: return Code2;
  }
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ theme }) => {
  const { data } = usePortfolioData();

  const isDark = theme !== 'light';

  return (
    <section
      id="skills"
      aria-label="Technical Skills Matrix"
      className="py-14 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#FF9E00]">
              02 / CAPABILITIES & DOMAIN MASTERY
            </span>
            <div className="w-8 h-[1px] bg-[#FF3E00]" />
          </div>

          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>TECHNICAL </span>
            <span className="text-outline hover:text-[#FF3E00] transition-colors cursor-default">
              TOOL MASTERY
            </span>
          </h2>

          <p className={`max-w-2xl text-sm sm:text-base font-light ${
            isDark ? 'text-neutral-400' : 'text-slate-600'
          }`}>
            Leveraging industry-grade machine learning pipelines, statistical computing, distributed cloud engines, and responsive modern frontend frameworks.
          </p>
        </div>

        {/* Skills Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.skills.map((skill, index) => {
            const IconComponent = getSkillIcon(skill.iconName);
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.03 }}
                className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl skew-item ${
                  isDark
                    ? 'glass-card border-white/10 hover:border-[#FF3E00]/50 hover:shadow-[#FF3E00]/10'
                    : 'bg-white/80 border-slate-200 hover:border-[#FF3E00] hover:shadow-slate-200'
                }`}
              >
                {skill.highlighted && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest bg-[#FF3E00]/15 border border-[#FF3E00]/30 text-[#FF9E00]">
                    Primary
                  </span>
                )}

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF3E00] group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-12">
                    <h3 className="text-sm font-bold truncate group-hover:text-[#FF9E00] transition-colors uppercase tracking-wide">
                      {skill.name}
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 truncate">
                      {skill.category}
                    </p>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed mb-4 min-h-[36px] line-clamp-2 font-light ${
                  isDark ? 'text-neutral-400' : 'text-slate-600'
                }`}>
                  {skill.description}
                </p>

                {/* Progress Level */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>Proficiency</span>
                    <span className="font-bold text-[#FF9E00]">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#FF3E00] to-[#FF9E00]"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
