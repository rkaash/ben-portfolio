import React from 'react';
import { motion } from 'motion/react';
import { Star, UserRound, Phone } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface TestimonialsSectionProps {
  theme: ThemeMode;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ theme }) => {
  const { data } = usePortfolioData();

  const isDark = theme !== 'light';

  return (
    <section
      id="testimonials"
      aria-label="Professional References"
      className="py-14 relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Testimonials Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#FF9E00]">
              05 / PROFESSIONAL REFERENCES
            </span>
            <div className="w-8 h-[1px] bg-[#FF3E00]" />
          </div>

          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>PROFESSIONAL </span>
            <span className="text-outline hover:text-[#FF3E00] transition-colors cursor-default">
              REFERENCES
            </span>
          </h2>

          <p className={`max-w-2xl text-sm sm:text-base font-light ${
            isDark ? 'text-neutral-400' : 'text-slate-600'
          }`}>
            Supervisors and employers from my previous roles, available to speak about my work.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        {/* 2-up at tablet: 3 columns at 768px leaves each card too narrow for
            the name, company and phone button to sit comfortably. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-2xl backdrop-blur-xl skew-item ${
                isDark 
                  ? 'glass-card border-white/10 text-white hover:border-[#FF3E00]/40' 
                  : 'bg-white/90 border-slate-200 text-slate-900'
              }`}
            >
              <div>
                {/* Referees are shown only when a rating was actually given */}
                {t.rating > 0 && (
                  <div className="flex items-center gap-1 text-[#FF9E00] mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF9E00] text-[#FF9E00]" />
                    ))}
                  </div>
                )}

                <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-light ${
                  isDark ? 'text-neutral-300' : 'text-slate-700'
                }`}>
                  {t.content}
                </p>
              </div>

              {/* Referee identity */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0 border border-[#FF3E00]/40 overflow-hidden bg-white/5 flex items-center justify-center">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserRound className="w-5 h-5 text-[#FF9E00]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold uppercase tracking-wide">{t.name}</h4>
                    <p className="text-[10px] font-mono uppercase text-[#FF9E00]">{t.role}</p>
                    <p className="text-[10px] text-neutral-400 font-light">{t.company}</p>
                  </div>
                </div>

                {t.phone && (
                  <a
                    href={`tel:${t.phone.replace(/[^\d+]/g, '')}`}
                    className={`mt-3 inline-flex items-center gap-2 px-4 py-3 sm:py-2 rounded-full text-[11px] font-mono border transition-colors ${
                      isDark
                        ? 'glass-card border-white/15 text-neutral-300 hover:text-[#FF9E00] hover:border-[#FF9E00]/60'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-[#FF3E00]'
                    }`}
                  >
                    <Phone className="w-3 h-3 text-[#FF3E00]" />
                    <span>{t.phone}</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};
