import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  Code2, 
  Layers, 
  FolderGit2, 
  Award,
  FileDown,
  Moon, 
  Sun, 
  Zap, 
  Github, 
  Linkedin,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ThemeMode } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setTheme: (theme: ThemeMode) => void;
  onOpenResumeModal: () => void;
  theme: ThemeMode;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setTheme,
  onOpenResumeModal,
  theme
}) => {
  const { data } = usePortfolioData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = useMemo(() => [
    // Navigation
    { id: 'nav-home', label: 'Go to Hero / Home', category: 'Navigation', icon: Terminal, action: () => { window.location.hash = '#hero'; onClose(); } },
    { id: 'nav-about', label: 'Go to About & Foundation', category: 'Navigation', icon: Code2, action: () => { window.location.hash = '#about'; onClose(); } },
    { id: 'nav-skills', label: 'Go to Technical Skills', category: 'Navigation', icon: Layers, action: () => { window.location.hash = '#skills'; onClose(); } },
    { id: 'nav-experience', label: 'Go to Experience & Awards', category: 'Navigation', icon: Award, action: () => { window.location.hash = '#experience'; onClose(); } },
    { id: 'nav-projects', label: 'Go to Projects Showcase', category: 'Navigation', icon: FolderGit2, action: () => { window.location.hash = '#projects'; onClose(); } },

    // Quick Actions
    { id: 'act-resume', label: 'View / Download Resume (CV)', category: 'Quick Action', icon: FileDown, action: () => { onOpenResumeModal(); onClose(); } },
    { id: 'act-theme-artistic', label: 'Switch Theme: Artistic Flair (Current)', category: 'Themes', icon: Zap, action: () => { setTheme('artistic'); onClose(); } },
    { id: 'act-theme-dark', label: 'Switch Theme: Dark Slate', category: 'Themes', icon: Moon, action: () => { setTheme('dark'); onClose(); } },
    { id: 'act-theme-midnight', label: 'Switch Theme: Midnight OLED', category: 'Themes', icon: Zap, action: () => { setTheme('midnight'); onClose(); } },
    { id: 'act-theme-cyberpunk', label: 'Switch Theme: Cyberpunk Neon', category: 'Themes', icon: Zap, action: () => { setTheme('cyberpunk'); onClose(); } },
    { id: 'act-theme-light', label: 'Switch Theme: Studio Light', category: 'Themes', icon: Sun, action: () => { setTheme('light'); onClose(); } },

    // Social Links
    { id: 'soc-github', label: 'Open GitHub Profile', category: 'Social & Code', icon: Github, action: () => { window.open(data.personalInfo.socials.github, '_blank'); onClose(); } },
    { id: 'soc-linkedin', label: 'Open LinkedIn Profile', category: 'Social & Code', icon: Linkedin, action: () => { window.open(data.personalInfo.socials.linkedin, '_blank'); onClose(); } },

    // Projects
    ...data.projects.map(p => ({
      id: `proj-${p.id}`,
      label: `Project: ${p.title}`,
      category: 'Projects',
      icon: FolderGit2,
      action: () => { window.location.hash = '#projects'; onClose(); }
    }))
  ], [data, onClose, onOpenResumeModal, setTheme]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    return actions.filter(a => 
      a.label.toLowerCase().includes(query.toLowerCase()) || 
      a.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [actions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filtered, selectedIndex]);

  if (!isOpen) return null;

  const isDark = theme !== 'light';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6"
        id="command-palette-modal"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden z-10 skew-item ${
            isDark 
              ? 'glass-card border-white/15 text-white shadow-black/80' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <Search className="w-5 h-5 text-[#FF9E00] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, projects, links, or jump to section..."
              className={`w-full bg-transparent text-sm font-mono focus:outline-none placeholder-neutral-500 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            />
            <kbd className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold glass-card border-white/15 text-neutral-400">
              ESC
            </kbd>
          </div>

          {/* List of Results */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-wider transition-all text-left ${
                      isSelected
                        ? isDark
                          ? 'accent-gradient text-black font-bold shadow-md shadow-[#FF3E00]/20'
                          : 'bg-orange-100 text-orange-950 font-semibold'
                        : isDark
                          ? 'text-neutral-300 hover:bg-white/5'
                          : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`p-1.5 rounded-xl border ${
                        isSelected 
                          ? 'bg-black/20 border-black/30 text-black' 
                          : 'glass-card border-white/10 text-neutral-400'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <span className={`text-[9px] font-mono shrink-0 ml-2 ${
                      isSelected ? 'text-black/70 font-bold' : 'text-neutral-500'
                    }`}>
                      {item.category}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs font-mono text-neutral-500">
                No matching results for "{query}".
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-5 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
