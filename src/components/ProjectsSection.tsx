import React from 'react';
import { motion } from 'motion/react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';
import { ProjectCover } from './ProjectCover';

interface ProjectsSectionProps {
  theme: ThemeMode;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ theme }) => {
  const { data } = usePortfolioData();

  const isDark = theme !== 'light';

  return (
    <section
      id="projects"
      aria-label="Project Work"
      className="py-14 relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#FF9E00]">
              04 / SELECTED PROJECT WORK
            </span>
            <div className="w-8 h-[1px] bg-[#FF3E00]" />
          </div>

          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>PROJECT </span>
            <span className="text-outline hover:text-[#FF3E00] transition-colors cursor-default">
              WORK
            </span>
          </h2>

          <p className={`max-w-2xl text-sm sm:text-base font-light ${
            isDark ? 'text-neutral-400' : 'text-slate-600'
          }`}>
            Production applications delivered for real clients and businesses — AI platforms, cross-platform apps, retail systems, and commercial websites.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {data.projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`group relative rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl skew-item ${
                isDark 
                  ? 'glass-card border-white/10 hover:border-[#FF3E00]/60 hover:shadow-[#FF3E00]/15' 
                  : 'bg-white border-slate-200 hover:border-[#FF3E00] hover:shadow-slate-200/80'
              }`}
            >
              {/* Image Container with Hover Zoom - falls back to generated cover art */}
              <div className="relative h-48 w-full overflow-hidden bg-black">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ProjectCover project={project} />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold glass-card border-white/20 text-[#FF9E00]">
                    {project.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide group-hover:text-[#FF9E00] transition-colors line-clamp-1 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-[#FF3E00] mb-3 uppercase tracking-wider">
                    {project.subtitle}
                  </p>
                  <p className={`text-xs leading-relaxed line-clamp-3 mb-4 font-light ${
                    isDark ? 'text-neutral-300' : 'text-slate-600'
                  }`}>
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[9px] font-mono uppercase tracking-widest border ${
                          isDark ? 'glass-card border-white/10 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links — only rendered once a URL is filled in, so cards with
                    no links look exactly as they did before. */}
                {(project.demoUrl || project.githubUrl) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full text-[10px] sm:text-[9px] font-mono uppercase tracking-widest border border-[#FF3E00]/50 text-[#FF9E00] hover:bg-[#FF3E00]/10 transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1.5 rounded-full text-[10px] sm:text-[9px] font-mono uppercase tracking-widest border transition-colors ${
                          isDark
                            ? 'glass-card border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400'
                        }`}
                      >
                        Source
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
