import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Award, GraduationCap, Briefcase, Mail, MapPin, Phone,
  Globe, Github, Linkedin, CheckCircle2, FileDown, Download, Loader2, AlertCircle
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

const TYPE_ICON = { award: Award, education: GraduationCap, experience: Briefcase } as const;

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolioData();
  const { personalInfo: info, skills, projects, timeline, testimonials: references } = data;
  const [pdfState, setPdfState] = useState<'idle' | 'building' | 'done' | 'failed'>('idle');

  const handleDownloadPdf = async () => {
    setPdfState('building');
    try {
      // Loaded on demand: jsPDF and its optional deps are ~230 kB, which has no
      // business sitting in the initial page bundle.
      const { generateResumePdf } = await import('../lib/generateResumePdf');
      await generateResumePdf(data);
      setPdfState('done');
      setTimeout(() => setPdfState('idle'), 2500);
    } catch (err) {
      console.error('[resume] PDF generation failed:', err);
      setPdfState('failed');
      setTimeout(() => setPdfState('idle'), 4000);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group skills by their category so the CV reads as competency blocks
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  const education = timeline.filter(t => t.type === 'education');
  const experience = timeline.filter(t => t.type === 'experience');
  const awards = timeline.filter(t => t.type === 'award');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[65] flex items-center justify-center p-0 sm:p-6 print:static print:block print:p-0" id="resume-view-modal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-2xl backdrop-saturate-150 print:hidden"
        />

        {/* Card: toolbar is a fixed row, the paper scrolls inside it. Keeping the
            scroll INSIDE the rounded, overflow-hidden card means the white page
            can never bleed past the corner curve. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl h-full sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden sm:rounded-2xl shadow-2xl shadow-black/60 print:max-w-none print:h-auto print:max-h-none print:overflow-visible print:rounded-none print:shadow-none"
        >
          {/* Screen-only toolbar */}
          <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0a0a0a] border-b border-white/10 print:hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg accent-gradient text-black flex items-center justify-center shrink-0">
                <FileDown className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white truncate">Curriculum Vitae</h3>
                <p className="text-[10px] font-mono text-[#FF9E00] truncate">{info.name} — {info.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={pdfState === 'building'}
                title={`Download ${(info.name || 'Resume').trim().split(/\s+/)[0]}-Resume.pdf`}
                className={`px-4 py-2.5 sm:py-2 rounded-full text-[11px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all disabled:opacity-70 ${
                  pdfState === 'failed'
                    ? 'bg-rose-500 text-white'
                    : pdfState === 'done'
                      ? 'bg-emerald-500 text-black'
                      : 'accent-gradient text-black hover:scale-105'
                }`}
              >
                {pdfState === 'building' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {pdfState === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {pdfState === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
                {pdfState === 'idle' && <Download className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {pdfState === 'building' ? 'Building PDF…'
                    : pdfState === 'done' ? 'Downloaded'
                    : pdfState === 'failed' ? 'Failed — retry'
                    : 'Download PDF'}
                </span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button type="button" onClick={onClose} aria-label="Close resume"
                className="p-2 rounded-full border border-white/20 text-neutral-400 hover:text-white hover:border-white/40 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scroll region — the paper moves, the card's rounded frame does not */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-white print:overflow-visible print:min-h-0">

          {/* The printable document itself — always light/paper styled */}
          <article id="resume-print-area" className="resume-paper bg-white text-slate-900">

            {/* Letterhead */}
            <header className="resume-header px-8 sm:px-12 py-8 sm:py-10 border-b-4 border-[#FF3E00] flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {info.avatarUrl && (
                <img src={info.avatarUrl} alt={info.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover object-top border-2 border-slate-200 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight leading-tight text-slate-900">
                  {info.formalName || info.name}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-[#FF3E00] mt-0.5">{info.role}</p>
                <p className="text-xs text-slate-600 mt-1 italic">{info.tagline}</p>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-[11px] text-slate-700">
                  {info.email && <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#FF3E00]" />{info.email}</span>}
                  {info.phone && <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#FF3E00]" />{info.phone}</span>}
                  {info.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#FF3E00]" />{info.location}</span>}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-[11px] text-slate-700">
                  {info.socials.linkedin && <span className="inline-flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-[#FF3E00]" />{info.socials.linkedin.replace(/^https?:\/\//, '')}</span>}
                  {info.socials.github && <span className="inline-flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-[#FF3E00]" />{info.socials.github.replace(/^https?:\/\//, '')}</span>}
                  {info.socials.website && <span className="inline-flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#FF3E00]" />{info.socials.website.replace(/^https?:\/\//, '')}</span>}
                </div>
              </div>
            </header>

            <div className="px-8 sm:px-12 py-8 space-y-7">

              {/* Profile */}
              <section className="resume-block">
                <h2 className="resume-h2">Professional Profile</h2>
                <p className="text-[12.5px] leading-relaxed text-slate-700">{info.bio}</p>
              </section>

              {/* Key stats strip */}
              {info.stats.length > 0 && (
                <section className="resume-block">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {info.stats.map((s, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg px-3 py-2.5 text-center bg-slate-50">
                        <div className="text-base font-extrabold text-[#FF3E00] leading-tight">{s.value}</div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5 leading-snug">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards */}
              {awards.length > 0 && (
                <section className="resume-block">
                  <h2 className="resume-h2"><Award className="w-4 h-4 text-[#FF3E00]" />Honours &amp; Awards</h2>
                  <div className="space-y-3">
                    {awards.map(a => (
                      <div key={a.id} className="border-l-[3px] border-[#FF3E00] pl-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-[13px] font-bold text-slate-900">{a.title}</h3>
                          <span className="text-[10px] font-semibold text-slate-500 shrink-0">{a.period}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 italic">{a.organization}{a.location ? ` • ${a.location}` : ''}</p>
                        <p className="text-[11.5px] text-slate-700 mt-1 leading-relaxed">{a.description}</p>
                        {a.achievements.length > 0 && (
                          <ul className="mt-1.5 space-y-1">
                            {a.achievements.map((ach, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11.5px] text-slate-700 leading-relaxed">
                                <CheckCircle2 className="w-3 h-3 text-[#FF3E00] shrink-0 mt-[3px]" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <section className="resume-block">
                  <h2 className="resume-h2"><Briefcase className="w-4 h-4 text-[#FF3E00]" />Professional Experience</h2>
                  <div className="space-y-3.5">
                    {experience.map(e => (
                      <div key={e.id} className="border-l-[3px] border-slate-300 pl-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-[13px] font-bold text-slate-900">{e.title}</h3>
                          <span className="text-[10px] font-semibold text-slate-500 shrink-0">{e.period}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 italic">{e.organization}{e.location ? ` • ${e.location}` : ''}</p>
                        <p className="text-[11.5px] text-slate-700 mt-1 leading-relaxed">{e.description}</p>
                        {e.achievements.length > 0 && (
                          <ul className="mt-1.5 space-y-1">
                            {e.achievements.map((ach, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11.5px] text-slate-700 leading-relaxed">
                                <CheckCircle2 className="w-3 h-3 text-[#FF3E00] shrink-0 mt-[3px]" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {e.skills.length > 0 && (
                          <p className="text-[10px] text-slate-500 mt-1.5"><span className="font-semibold">Stack:</span> {e.skills.join(' • ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {education.length > 0 && (
                <section className="resume-block">
                  <h2 className="resume-h2"><GraduationCap className="w-4 h-4 text-[#FF3E00]" />Education</h2>
                  <div className="space-y-3">
                    {education.map(ed => (
                      <div key={ed.id} className="border-l-[3px] border-slate-300 pl-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-[13px] font-bold text-slate-900">{ed.title}</h3>
                          <span className="text-[10px] font-semibold text-slate-500 shrink-0">{ed.period}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 italic">{ed.organization}{ed.location ? ` • ${ed.location}` : ''}</p>
                        <p className="text-[11.5px] text-slate-700 mt-1 leading-relaxed">{ed.description}</p>
                        {ed.achievements.length > 0 && (
                          <ul className="mt-1.5 space-y-1">
                            {ed.achievements.map((ach, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11.5px] text-slate-700 leading-relaxed">
                                <CheckCircle2 className="w-3 h-3 text-[#FF3E00] shrink-0 mt-[3px]" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical skills */}
              <section className="resume-block">
                <h2 className="resume-h2">Technical Competencies</h2>
                <div className="space-y-2.5">
                  {Object.entries(skillsByCategory).map(([category, list]) => (
                    <div key={category} className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-1 sm:gap-3">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-[#FF3E00]">{category}</div>
                      <div className="text-[11.5px] text-slate-700 leading-relaxed">
                        {list.map(s => s.name).join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects */}
              {projects.length > 0 && (
                <section className="resume-block">
                  <h2 className="resume-h2">Projects</h2>
                  <div className="space-y-3.5">
                    {projects.map(p => (
                      <div key={p.id} className="break-inside-avoid">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-[13px] font-bold text-slate-900">{p.title}</h3>
                          <span className="text-[10px] font-semibold text-slate-500 shrink-0">{p.categoryLabel}</span>
                        </div>
                        {p.subtitle && <p className="text-[11px] text-slate-600 italic">{p.subtitle}</p>}
                        <p className="text-[11.5px] text-slate-700 mt-1 leading-relaxed">{p.description}</p>
                        {p.tags.length > 0 && (
                          <p className="text-[10px] text-slate-500 mt-1"><span className="font-semibold">Tech:</span> {p.tags.join(' • ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {references.length > 0 && (
                <section className="resume-block">
                  <h2 className="resume-h2">References</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {references.map(r => (
                      <div key={r.id} className="break-inside-avoid">
                        <h3 className="text-[12.5px] font-bold text-slate-900">{r.name}</h3>
                        <p className="text-[11px] text-slate-600 italic">
                          {r.role}{r.company ? ` • ${r.company}` : ''}
                        </p>
                        {r.phone && (
                          <p className="text-[11px] text-slate-700 mt-0.5 inline-flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-[#FF3E00]" />{r.phone}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <footer className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap justify-between gap-2">
                <span>Academic transcripts available upon request.</span>
                <span>{info.status}</span>
              </footer>
            </div>
          </article>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
