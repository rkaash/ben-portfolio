/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TimelineSection } from './components/TimelineSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CommandPalette } from './components/CommandPalette';
import { ResumeModal } from './components/ResumeModal';
import { SplashScreen } from './components/SplashScreen';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { OtpVerifyModal } from './components/OtpVerifyModal';
import { EditPortfolioModal } from './components/EditPortfolioModal';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import { supabase, OWNER_EMAIL } from './lib/supabaseClient';
import { ThemeMode } from './types';

// Staggered Fade in variant for sections across the entire website
const sectionFadeVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.85, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const pageContainerFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      when: 'beforeChildren'
    }
  }
};

export default function App() {
  return (
    <PortfolioDataProvider>
      <AppShell />
    </PortfolioDataProvider>
  );
}

function AppShell() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('rp-theme-preference');
    return (saved as ThemeMode) || 'artistic';
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditUnlocked, setIsEditUnlocked] = useState(false);

  useEffect(() => {
    localStorage.setItem('rp-theme-preference', theme);
    const root = document.documentElement;
    root.classList.remove('artistic', 'dark', 'light', 'midnight', 'cyberpunk');

    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
      root.classList.add(theme);
    }
  }, [theme]);

  // Global Keyboard listener for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Restore an existing Supabase session so a verified owner stays unlocked
  // across reloads until they sign out or the session expires.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: sessionData }) => {
      setIsEditUnlocked(!!sessionData.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsEditUnlocked(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Double-clicking the header brand name requests owner access to the live editor
  const handleRequestEdit = () => {
    if (isEditUnlocked) {
      setIsEditModalOpen(true);
    } else {
      setIsOtpModalOpen(true);
    }
  };

  const handleOtpVerified = () => {
    setIsEditUnlocked(true);
    setIsOtpModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsEditUnlocked(false);
    setIsEditModalOpen(false);
  };

  const getThemeBackground = () => {
    switch (theme) {
      case 'light':
        return 'bg-slate-50 text-slate-900';
      case 'midnight':
        return 'bg-[#030712] text-slate-100';
      case 'cyberpunk':
        return 'bg-[#0a0518] text-slate-100';
      case 'dark':
        return 'bg-slate-950 text-slate-100';
      case 'artistic':
      default:
        return 'bg-[#080808] text-white';
    }
  };

  const isDark = theme !== 'light';

  return (
    <div className={`min-h-screen relative transition-colors duration-500 selection:bg-[#FF3E00]/30 selection:text-[#FF9E00] ${getThemeBackground()}`}>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Noise Texture Overlay for Artistic Tactile Feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] noise-overlay z-40" />

      {/* Artistic Glowing Ambient Light Orbs */}
      {theme === 'artistic' && (
        <>
          <div className="fixed top-[-10%] right-[-10%] w-[550px] h-[550px] bg-[#FF3E00] rounded-full blur-[170px] opacity-15 pointer-events-none z-0" />
          <div className="fixed bottom-[-10%] left-[-10%] w-[480px] h-[480px] bg-[#3B82F6] rounded-full blur-[170px] opacity-15 pointer-events-none z-0" />
        </>
      )}

      {/* Global Centered 3D Neural Animation Background that Follows Scrolling */}
      <Hero3DCanvas theme={theme} />

      {/* Whole Website Animated Container */}
      <motion.div
        variants={pageContainerFade}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full"
      >
        {/* Navigation */}
        <Navbar
          theme={theme}
          setTheme={setTheme}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
          onRequestEdit={handleRequestEdit}
        />

        {/* Main Content Sections with Fade Animations */}
        <main id="main-content" className="relative z-10">
          {/* 1. Hero Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionFadeVariant}
          >
            <Hero theme={theme} />
          </motion.div>

          {/* 2. About & Philosophy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-70px' }}
            variants={sectionFadeVariant}
          >
            <AboutSection
              theme={theme}
            />
          </motion.div>

          {/* 3. Technical Skills & Proficiency Matrix */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-70px' }}
            variants={sectionFadeVariant}
          >
            <SkillsSection
              theme={theme}
            />
          </motion.div>

          {/* 4. Experience, Honours & iCE-CInno Silver Medalist Timeline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-70px' }}
            variants={sectionFadeVariant}
          >
            <TimelineSection
              theme={theme}
            />
          </motion.div>

          {/* 5. Featured Projects Showcase (placed after the timeline for a longer, natural scroll) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-70px' }}
            variants={sectionFadeVariant}
          >
            <ProjectsSection
              theme={theme}
            />
          </motion.div>

          {/* 6. Endorsements & Frequently Asked Inquiries */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-70px' }}
            variants={sectionFadeVariant}
          >
            <TestimonialsSection
              theme={theme}
            />
          </motion.div>
        </main>
      </motion.div>

      {/* Modals & Overlays */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setTheme={setTheme}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        theme={theme}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        theme={theme}
      />

      <OtpVerifyModal
        isOpen={isOtpModalOpen}
        email={OWNER_EMAIL}
        theme={theme}
        onClose={() => setIsOtpModalOpen(false)}
        onVerified={handleOtpVerified}
      />

      <EditPortfolioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
