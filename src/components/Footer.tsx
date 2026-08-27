import React from 'react';
import { 
  ArrowUp, 
  Mail, 
  Heart, 
  Code2, 
  Award 
} from 'lucide-react';
import { 
  FacebookIcon, 
  WhatsAppIcon, 
  InstagramIcon, 
  LinkedInIcon, 
  JobStreetIcon, 
  IndeedIcon 
} from './SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeMode } from '../types';

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = theme !== 'light';

  return (
    <footer
      id="main-footer"
      className={`border-t transition-colors relative z-10 ${
        isDark 
          ? 'bg-[#080808] border-white/10 text-neutral-400' 
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10 items-center justify-between">
          
          {/* Brand Monogram & Info */}
          <div className="md:col-span-6 flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl accent-gradient flex items-center justify-center font-mono font-black text-black shadow-lg shadow-[#FF3E00]/30 skew-item">
                RP
              </div>
              <div>
                <h3 className={`text-base font-bold uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {PERSONAL_INFO.name}
                </h3>
                <p className="text-xs font-mono uppercase text-[#FF9E00]">{PERSONAL_INFO.role}</p>
              </div>
            </div>
            <p className="text-xs max-w-md leading-relaxed text-neutral-400 font-light">
              {PERSONAL_INFO.tagline}
            </p>
          </div>

          {/* Social Channels & Back to top button */}
          <div className="md:col-span-6 flex flex-col sm:flex-row sm:items-center md:justify-end gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={PERSONAL_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className={`p-2.5 rounded-xl border transition-all skew-item ${
                  isDark ? 'glass-card border-white/10 text-neutral-400 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10' : 'border-slate-200 bg-white text-slate-600 hover:text-[#1877F2] shadow-sm'
                }`}
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className={`p-2.5 rounded-xl border transition-all skew-item ${
                  isDark ? 'glass-card border-white/10 text-neutral-400 hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10' : 'border-slate-200 bg-white text-slate-600 hover:text-[#25D366] shadow-sm'
                }`}
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className={`p-2.5 rounded-xl border transition-all skew-item ${
                  isDark ? 'glass-card border-white/10 text-neutral-400 hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10' : 'border-slate-200 bg-white text-slate-600 hover:text-[#E4405F] shadow-sm'
                }`}
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className={`p-2.5 rounded-xl border transition-all skew-item ${
                  isDark ? 'glass-card border-white/10 text-neutral-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10' : 'border-slate-200 bg-white text-slate-600 hover:text-[#0A66C2] shadow-sm'
                }`}
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.socials.jobstreet}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JobStreet"
                title="JobStreet"
                className={`p-2.5 rounded-xl border transition-all skew-item ${
                  isDark ? 'glass-card border-white/10 text-neutral-400 hover:text-[#FF9E00] hover:border-[#FF9E00]/50 hover:bg-[#FF9E00]/10' : 'border-slate-200 bg-white text-slate-600 hover:text-amber-600 shadow-sm'
                }`}
              >
                <JobStreetIcon className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.socials.indeed}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Indeed"
                title="Indeed"
                className={`p-2.5 rounded-xl border transition-all skew-item ${
                  isDark ? 'glass-card border-white/10 text-neutral-400 hover:text-[#2164f3] hover:border-[#2164f3]/50 hover:bg-[#2164f3]/10' : 'border-slate-200 bg-white text-slate-600 hover:text-blue-600 shadow-sm'
                }`}
              >
                <IndeedIcon className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                aria-label="Email"
                title="Email"
                className={`p-2.5 rounded-xl border transition-all skew-item ${
                  isDark ? 'glass-card border-white/10 text-neutral-400 hover:text-[#FF3E00] hover:border-[#FF3E00]/50 hover:bg-[#FF3E00]/10' : 'border-slate-200 bg-white text-slate-600 hover:text-amber-600 shadow-sm'
                }`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <button
              type="button"
              id="footer-back-to-top-btn"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold glass-card border-white/15 text-neutral-300 hover:text-white hover:border-[#FF3E00] transition-colors shadow-sm skew-item hover:skew-x-0"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#FF3E00]" />
            </button>
          </div>

        </div>

        {/* Bottom Tier */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-neutral-500">
          <p>© {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-neutral-500">
            <span>Built with React 19, Tailwind CSS & Motion</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
