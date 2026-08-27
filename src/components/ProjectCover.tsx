import React from 'react';
import {
  Brain, Code2, Smartphone, Database, Bot, Wallet, LineChart,
  ShoppingCart, GraduationCap, Globe, Fingerprint, FileText, Sparkles
} from 'lucide-react';
import { Project } from '../types';

/**
 * Generated cover art for a project card.
 *
 * Projects have no photography of their own, and stock imagery would be
 * misleading. Instead each card gets a deterministic branded panel — an icon,
 * a wordmark and a category-tinted gradient — so the grid reads as one set and
 * nothing depends on an external asset. A real uploaded image always wins.
 */

interface ProjectCoverProps {
  project: Project;
  className?: string;
}

// Per-category palette, all tuned to sit beside the site's orange accent.
const PALETTES: Record<Project['category'], { from: string; to: string; glow: string }> = {
  ai_ml: { from: '#3B1D5E', to: '#0B0616', glow: '#A855F7' },
  fullstack: { from: '#0B3A52', to: '#04121B', glow: '#22D3EE' },
  mobile_ui: { from: '#3D1F0B', to: '#150803', glow: '#FF9E00' },
  iot_data: { from: '#0C3B2E', to: '#04140F', glow: '#34D399' },
};

// Icon chosen per project, falling back to something sane for its category.
const ICONS: Record<string, React.ElementType> = {
  'rstar-pos-system': ShoppingCart,
  'logiclens-ai': GraduationCap,
  'conglomerate-website': Globe,
  'sun-tours-roma': Globe,
  'carousel-generator': Sparkles,
  'walletwise': Wallet,
  'xcraft-cloud': LineChart,
  'mpt-omniportal': Brain,
  'mpt-watch-sales-bot': Bot,
  'policy-snap': FileText,
  'biometric-attendance': Fingerprint,
  'ai-retail-manager': Brain,
};

const CATEGORY_FALLBACK: Record<Project['category'], React.ElementType> = {
  ai_ml: Brain,
  fullstack: Code2,
  mobile_ui: Smartphone,
  iot_data: Database,
};

export const ProjectCover: React.FC<ProjectCoverProps> = ({ project, className = '' }) => {
  const palette = PALETTES[project.category] ?? PALETTES.fullstack;
  const Icon = ICONS[project.id] || CATEGORY_FALLBACK[project.category] || Code2;

  // Unique ids keep multiple covers on one page from sharing SVG defs.
  const uid = `cover-${project.id}`;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.from} />
            <stop offset="100%" stopColor={palette.to} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="0.75" cy="0.2" r="0.8">
            <stop offset="0%" stopColor={palette.glow} stopOpacity="0.45" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
          <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="400" height="200" fill={`url(#${uid}-bg)`} />
        <rect width="400" height="200" fill={`url(#${uid}-grid)`} />
        <rect width="400" height="200" fill={`url(#${uid}-glow)`} />

        {/* Accent sweep echoing the site's diagonal skew */}
        <path d="M-20 200 L150 -20 L210 -20 L40 200 Z" fill="#ffffff" fillOpacity="0.03" />
        <path d="M60 200 L230 -20 L250 -20 L80 200 Z" fill={palette.glow} fillOpacity="0.06" />
      </svg>

      {/* Icon + wordmark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/15 backdrop-blur-sm"
          style={{ backgroundColor: `${palette.glow}22` }}
        >
          <Icon className="w-7 h-7" style={{ color: palette.glow }} />
        </div>
        <span className="text-sm font-extrabold uppercase tracking-tight text-white/90 leading-tight line-clamp-2">
          {project.title}
        </span>
      </div>
    </div>
  );
};
