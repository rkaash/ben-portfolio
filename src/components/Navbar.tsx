import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderGit2,
  Layers,
  Award,
  Menu,
  X,
  Users
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenCommandPalette: () => void;
  onOpenResumeModal: () => void;
  onRequestEdit: () => void;
}

const NAV_LINKS = [
  { name: 'Capabilities', href: '#skills', icon: Layers },
  { name: 'Timeline', href: '#experience', icon: Award },
  { name: 'Projects', href: '#projects', icon: FolderGit2 },
  { name: 'Ref', href: '#testimonials', icon: Users },
];

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onOpenResumeModal,
  onRequestEdit,
}) => {
  const { data } = usePortfolioData();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoErrored, setLogoErrored] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setScrolled(scrollY > 20);

      // If at or near the top of the page (hero & introduction area), do not highlight any navbar link
      if (scrollY < 280) {
        setActiveSection('');
        return;
      }

      // If user reaches near the bottom of the page, accurately highlight the last section
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 70) {
        setActiveSection('testimonials');
        return;
      }

      const sections = ['skills', 'experience', 'projects', 'testimonials'];
      let currentSection = '';
      const triggerPoint = window.innerHeight * 0.35; // 35% viewport threshold

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
            currentSection = section;
            break;
          }
        }
      }

      // If between margins, find section closest above trigger
      if (!currentSection) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= triggerPoint) {
              currentSection = sections[i];
              break;
            }
          }
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // A single click scrolls to the top; a double click opens the editor WITHOUT
  // scrolling. The scroll is therefore deferred until the double-click window
  // has passed, so the second click can cancel it.
  const DOUBLE_TAP_MS = 400;
  const pendingScrollRef = useRef<number | null>(null);

  const cancelPendingScroll = () => {
    if (pendingScrollRef.current !== null) {
      window.clearTimeout(pendingScrollRef.current);
      pendingScrollRef.current = null;
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    cancelPendingScroll();
    pendingScrollRef.current = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      pendingScrollRef.current = null;
    }, DOUBLE_TAP_MS);
  };

  const handleBrandDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    cancelPendingScroll();
    onRequestEdit();
  };

  // Touch devices fire `dblclick` inconsistently (and often swallow it behind
  // double-tap-to-zoom), so detect the double-tap manually. A single tap still
  // scrolls to the top after the window for a second tap has passed.
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef<number | null>(null);

  const handleBrandTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // stop the synthetic click / zoom gesture
    const now = Date.now();

    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      if (singleTapTimerRef.current !== null) {
        window.clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapRef.current = 0;
      onRequestEdit();
      return;
    }

    lastTapRef.current = now;
    singleTapTimerRef.current = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      singleTapTimerRef.current = null;
    }, DOUBLE_TAP_MS);
  };

  useEffect(() => () => {
    if (singleTapTimerRef.current !== null) window.clearTimeout(singleTapTimerRef.current);
    if (pendingScrollRef.current !== null) window.clearTimeout(pendingScrollRef.current);
  }, []);

  const isDark = theme !== 'light';

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled 
          ? 'py-3.5 bg-black/30 border-b border-white/10 shadow-xl shadow-black/20 backdrop-blur-xl' 
          : 'py-5 bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Picture & Name - Click takes user to top of the page, double-click opens the owner editor */}
        <a
          href="#"
          onClick={handleBrandClick}
          onDoubleClick={handleBrandDoubleClick}
          onTouchEnd={handleBrandTouchEnd}
          id="nav-brand-logo"
          title="Back to top — double-click / double-tap to edit"
          style={{ touchAction: 'manipulation' }}
          className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3E00] rounded-xl cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden skew-item shadow-lg shadow-[#FF3E00]/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1 border border-white/10">
            {!logoErrored && data.personalInfo.avatarUrl ? (
              <img
                src={data.personalInfo.avatarUrl}
                alt={data.personalInfo.headerName}
                referrerPolicy="no-referrer"
                onError={() => setLogoErrored(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full accent-gradient flex items-center justify-center font-extrabold text-black">
                <span className="font-mono text-sm tracking-tighter">RP</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className={`text-base font-extrabold tracking-tighter uppercase transition-colors duration-200 ${
              isDark ? 'text-white group-hover:text-[#FF9E00]' : 'text-slate-900 group-hover:text-[#FF3E00]'
            }`}>
              {data.personalInfo.headerName}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 bg-white/[0.03] px-6 py-2 rounded-full border border-white/10 backdrop-blur-xl">
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                id={`nav-link-${link.name.toLowerCase()}`}
                className={`relative text-xs uppercase tracking-widest font-semibold transition-all duration-200 py-1 ${
                  isActive
                    ? 'text-[#FF3E00] font-bold'
                    : isDark
                      ? 'text-neutral-300 hover:text-white hover:text-[#FF3E00]'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF3E00] to-[#FF9E00] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Resume Modal Trigger with theme-highlight hover */}
          <button
            type="button"
            id="nav-resume-button"
            onClick={onOpenResumeModal}
            className="px-5 py-3 sm:py-2.5 border border-[#FF3E00]/40 rounded-full text-xs uppercase tracking-widest text-white hover:text-[#FF9E00] hover:border-[#FF9E00] hover:bg-[#FF3E00]/10 hover:shadow-[0_0_15px_rgba(255,62,0,0.3)] transition-all duration-200 font-semibold skew-item hover:skew-x-0 glass-card cursor-pointer"
          >
            <span>Resume</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            id="nav-mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-full border transition-colors ${
              isDark 
                ? 'bg-white/5 border-white/10 text-neutral-300 hover:text-white' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            // Frosted glass: low-opacity tint over a heavy blur, so the page
            // shows through instead of being covered by a solid panel.
            className={`lg:hidden border-b transition-colors px-4 py-5 backdrop-blur-2xl backdrop-saturate-150 ${
              isDark
                ? 'bg-black/30 border-white/10'
                : 'bg-white/40 border-slate-200/60'
            }`}
          >
            <div className="flex flex-col gap-1.5 max-w-lg mx-auto">
              {NAV_LINKS.map(link => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FF3E00]/15 text-[#FF9E00] font-bold border border-[#FF3E00]/30'
                        : isDark
                          ? 'text-neutral-300 hover:bg-white/5 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <link.icon className="w-4 h-4 text-[#FF3E00]" />
                    <span>{link.name}</span>
                  </a>
                );
              })}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
