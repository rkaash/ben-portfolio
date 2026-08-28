import React from 'react';
import { motion } from 'motion/react';
import {
  Mail
} from 'lucide-react';
import { Portrait3DCard } from './Portrait3DCard';
import {
  FacebookIcon,
  WhatsAppIcon,
  InstagramIcon,
  LinkedInIcon,
  JobStreetIcon,
  IndeedIcon
} from './SocialIcons';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface HeroProps {
  theme: ThemeMode;
}

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  const { data } = usePortfolioData();
  const PERSONAL_INFO = data.personalInfo;

  const isDark = theme !== 'light';

  // The big headline is driven by the editable role, so changing it in the
  // editor updates the hero. First word solid, the rest outlined beneath it.
  //
  // One word per line, deliberately: each line is scaleY'd about its own centre,
  // so a span containing two wrapped lines would drag its first line up toward
  // the span above and the gaps would come out uneven. One line per span keeps
  // every gap identical no matter how long the role is.
  const roleWords = PERSONAL_INFO.role.trim().split(/\s+/).filter(Boolean);

  // Order here is also the order of the running neon highlight.
  const directLinks = [
    { label: 'Facebook Profile', title: 'Facebook Profile', href: PERSONAL_INFO.socials.facebook, Icon: FacebookIcon, external: true, hover: 'hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10' },
    { label: 'Chat on WhatsApp', title: 'WhatsApp', href: PERSONAL_INFO.socials.whatsapp, Icon: WhatsAppIcon, external: true, hover: 'hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10' },
    { label: 'Instagram Profile', title: 'Instagram', href: PERSONAL_INFO.socials.instagram, Icon: InstagramIcon, external: true, hover: 'hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10' },
    { label: 'LinkedIn Profile', title: 'LinkedIn', href: PERSONAL_INFO.socials.linkedin, Icon: LinkedInIcon, external: true, hover: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10' },
    { label: 'JobStreet Profile', title: 'JobStreet Profile', href: PERSONAL_INFO.socials.jobstreet, Icon: JobStreetIcon, external: true, hover: 'hover:text-[#FF9E00] hover:border-[#FF9E00]/50 hover:bg-[#FF9E00]/10' },
    { label: 'Indeed Profile', title: 'Indeed Profile', href: PERSONAL_INFO.socials.indeed, Icon: IndeedIcon, external: true, hover: 'hover:text-[#2164f3] hover:border-[#2164f3]/50 hover:bg-[#2164f3]/10' },
    { label: 'Send Direct Email', title: `Email: ${PERSONAL_INFO.email}`, href: `mailto:${PERSONAL_INFO.email}`, Icon: Mail, external: false, hover: 'hover:text-[#FF3E00] hover:border-[#FF3E00]/50 hover:bg-[#FF3E00]/10' },
  ];

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center pt-24 pb-10 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-[#FF3E00]/15 via-[#FF9E00]/15 to-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left relative z-10"
          >
            {/* Top Minimal Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-[#FF3E00]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF9E00] font-bold">
                {PERSONAL_INFO.name}
              </span>
            </div>

            {/* Display Headline - vertically stretched for a taller, editorial look */}
            <div className="mb-8 lg:mb-10 w-full">
              <h1
                style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
                className="headline-stretch font-extrabold tracking-tight uppercase"
              >
                {roleWords.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className={
                      i === 0
                        ? "text-white block font-['Syne',sans-serif]"
                        : "text-outline block font-['Syne',sans-serif] hover:text-white transition-all cursor-default"
                    }
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            {/* Bio summary */}
            <p className={`text-sm sm:text-base max-w-2xl leading-relaxed mb-6 font-light ${
              isDark ? 'text-neutral-300' : 'text-slate-600'
            }`}>
              {PERSONAL_INFO.bio}
            </p>

            {/* Social Channels and Quick Verification */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-6 border-t border-white/10 w-full">
              <span className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? 'text-neutral-400' : 'text-slate-400'
              }`}>
                Direct Links:
              </span>
              {/* gap-1 on mobile keeps all seven 44px targets on a single row */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {directLinks.map((link, index) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={link.label}
                    title={link.title}
                    // --chase-index positions this icon in the running neon sequence
                    style={{ '--chase-index': index } as React.CSSProperties}
                    className={`neon-chase w-11 h-11 sm:w-auto sm:h-auto sm:p-2 flex items-center justify-center rounded-xl border transition-all ${
                      isDark
                        ? `glass-card border-white/10 text-neutral-400 shadow-sm ${link.hover}`
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <link.Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Interactive 3D Portrait Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative z-20"
          >
            <Portrait3DCard theme={theme} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
