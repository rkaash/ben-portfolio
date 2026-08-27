import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, User, BookOpen, Layers, FolderGit2, Award, MessageSquare,
  Plus, Trash2, Upload, Save, RotateCcw, ImageIcon, LogOut, Loader2,
  AlertCircle, ChevronUp, ChevronDown, Check
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { supabase, MEDIA_BUCKET } from '../lib/supabaseClient';
import { PortfolioContent, Project, Skill, TimelineItem, Testimonial } from '../types';

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const label = 'block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5 font-semibold';
const input = 'w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white/[0.04] border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF3E00] focus:border-transparent transition-colors';
const textarea = `${input} resize-y min-h-[80px]`;
const card = 'rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 space-y-3';
const addBtn = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest font-bold border border-[#FF3E00]/40 text-[#FF9E00] hover:bg-[#FF3E00]/10 hover:border-[#FF3E00] transition-colors';

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label: l, value, onChange, placeholder }) => (
  <div>
    <label className={label}>{l}</label>
    <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={input} />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; rows?: number }> = ({ label: l, value, onChange, rows = 3 }) => (
  <div>
    <label className={label}>{l}</label>
    <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className={textarea} />
  </div>
);

const toLines = (raw: string) => raw.split('\n').map(s => s.trim()).filter(Boolean);

/**
 * One item per line.
 *
 * The raw text is held locally rather than being derived from `value` on every
 * render: blank lines are stripped before they reach the parent, so a fully
 * controlled textarea would erase the newline the moment you pressed Enter.
 */
const ListField: React.FC<{ label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }> = ({ label: l, hint, value, onChange }) => {
  const [text, setText] = useState(() => value.join('\n'));

  // Re-sync only when the value changed somewhere else (switching items,
  // reordering, reset) — never from our own keystrokes.
  useEffect(() => {
    if (toLines(text).join('\n') !== value.join('\n')) setText(value.join('\n'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <label className={label}>
        {l} {hint && <span className="normal-case text-neutral-500">({hint})</span>}
      </label>
      <textarea
        rows={Math.max(3, text.split('\n').length + 1)}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(toLines(e.target.value));
        }}
        className={textarea}
      />
      <p className="mt-1 text-[10px] font-mono text-neutral-500">
        Press Enter for a new line — each line becomes its own entry.
      </p>
    </div>
  );
};

/** Comma separated. Local text for the same reason as ListField above. */
const TagsField: React.FC<{ label: string; value: string[]; onChange: (v: string[]) => void }> = ({ label: l, value, onChange }) => {
  const [text, setText] = useState(() => value.join(', '));

  const toTags = (raw: string) => raw.split(',').map(s => s.trim()).filter(Boolean);

  useEffect(() => {
    if (toTags(text).join(', ') !== value.join(', ')) setText(value.join(', '));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <label className={label}>{l} <span className="normal-case text-neutral-500">(comma separated)</span></label>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(toTags(e.target.value));
        }}
        className={input}
      />
    </div>
  );
};

/** Uploads to Supabase Storage and stores the resulting public URL (not base64). */
const ImageField: React.FC<{ label: string; value: string; pathPrefix: string; onChange: (v: string) => void }> = ({ label: l, value, pathPrefix, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!supabase) {
      setUploadError('Supabase is not configured.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${pathPrefix}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: '3600',
    });
    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className={label}>{l}</label>
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-neutral-600" />
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <input type="text" value={value} placeholder="Image URL" onChange={(e) => onChange(e.target.value)} className={input} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border border-white/15 text-neutral-300 hover:text-white hover:border-[#FF3E00] transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {uploadError && (
            <p className="text-[10px] font-mono text-rose-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />{uploadError}
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFile(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** Repeating-item wrapper: gives every array entry a title bar, reorder + delete. */
const ItemCard: React.FC<{
  title: string;
  index: number;
  total: number;
  innerRef?: (el: HTMLDivElement | null) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  children: React.ReactNode;
}> = ({ title, index, total, innerRef, onMove, onRemove, children }) => (
  <div ref={innerRef} className={card}>
    <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5">
      <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF9E00] font-bold truncate">
        {index + 1}. {title || 'Untitled'}
      </span>
      <div className="flex items-center gap-0.5 shrink-0">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:hover:bg-transparent transition-colors">
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:hover:bg-transparent transition-colors">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onRemove}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    {children}
  </div>
);

const TABS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'about', label: 'About', icon: BookOpen },
  { id: 'skills', label: 'Skills', icon: Layers },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'timeline', label: 'Timeline', icon: Award },
  { id: 'testimonials', label: 'References', icon: MessageSquare },
] as const;

type TabId = typeof TABS[number]['id'];

export const EditPortfolioModal: React.FC<EditPortfolioModalProps> = ({ isOpen, onClose, onSignOut }) => {
  const { data, setData, resetToDefaults, error } = usePortfolioData();
  const [draft, setDraft] = useState<PortfolioContent>(data);
  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');

  // New entries are appended to the end of a list while the "Add" button sits at
  // the top, so scroll the freshly created card into view instead of leaving the
  // user staring at an unchanged screen.
  const itemRefs = useRef<Record<string, (HTMLDivElement | null)[]>>({});
  const pendingScrollKey = useRef<{ key: string; index: number } | null>(null);

  const itemRef = (key: string, index: number) => (el: HTMLDivElement | null) => {
    if (!itemRefs.current[key]) itemRefs.current[key] = [];
    itemRefs.current[key][index] = el;
  };

  type ListKey = 'projects' | 'skills' | 'timeline' | 'testimonials';

  const addItem = <K extends ListKey>(key: K, item: PortfolioContent[K][number]) => {
    const next = [...(draft[key] as PortfolioContent[K]), item] as PortfolioContent[K];
    setDraft({ ...draft, [key]: next });
    pendingScrollKey.current = { key, index: next.length - 1 };
  };

  // Runs after the new card has actually rendered.
  useEffect(() => {
    const pending = pendingScrollKey.current;
    if (!pending) return;
    pendingScrollKey.current = null;
    const el = itemRefs.current[pending.key]?.[pending.index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = el.querySelector<HTMLInputElement>('input[type="text"]');
      firstInput?.focus();
    }
  }, [draft]);

  useEffect(() => {
    if (isOpen) {
      setDraft(data);
      setSaveState('idle');
    }
  }, [isOpen, data]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDirty = JSON.stringify(draft) !== JSON.stringify(data);

  const handleSave = async () => {
    setSaveState('saving');
    const ok = await setData(draft);
    setSaveState(ok ? 'saved' : 'failed');
    if (ok) setTimeout(() => setSaveState('idle'), 2200);
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset the entire portfolio back to its original default content? This cannot be undone.')) return;
    await resetToDefaults();
    onClose();
  };

  const handleClose = () => {
    if (isDirty && !confirm('You have unsaved changes. Close without saving?')) return;
    onClose();
  };

  // Generic helpers for the five array-backed sections
  function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  }
  function patch<T>(arr: T[], i: number, changes: Partial<T>): T[] {
    const copy = [...arr];
    copy[i] = { ...copy[i], ...changes };
    return copy;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 md:p-6" id="edit-portfolio-modal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl h-full sm:h-[90vh] sm:rounded-3xl border-0 sm:border border-white/15 bg-[#0a0a0a] text-white shadow-2xl z-10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center text-black shadow-md shadow-[#FF3E00]/30 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold uppercase tracking-wide truncate">Portfolio Editor</h3>
                <p className="text-[10px] font-mono text-neutral-400 truncate">Owner mode — everything on the site is editable here</p>
              </div>
            </div>
            <button type="button" onClick={handleClose} aria-label="Close editor"
              className="p-2 rounded-full border border-white/15 text-neutral-400 hover:text-white hover:border-white/30 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            {/* Sidebar nav (horizontal scroll strip on mobile, vertical rail on desktop) */}
            <nav className="flex md:flex-col gap-1 p-2 md:p-3 md:w-52 border-b md:border-b-0 md:border-r border-white/10 overflow-x-auto md:overflow-y-auto shrink-0">
              {TABS.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold whitespace-nowrap transition-all md:w-full ${
                      active ? 'accent-gradient text-black shadow-md shadow-[#FF3E00]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">

              {activeTab === 'personal' && (
                <div className="space-y-5 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Header Display Name" value={draft.personalInfo.headerName} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, headerName: v } })} />
                    <Field label="Full Name" value={draft.personalInfo.name} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, name: v } })} />
                    <Field label="Formal Name" value={draft.personalInfo.formalName} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, formalName: v } })} />
                    <Field label="Role / Title" value={draft.personalInfo.role} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, role: v } })} />
                    <Field label="Tagline" value={draft.personalInfo.tagline} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, tagline: v } })} />
                    <Field label="Public Contact Email" value={draft.personalInfo.email} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, email: v } })} />
                    <Field label="Phone" value={draft.personalInfo.phone} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, phone: v } })} />
                    <Field label="Location" value={draft.personalInfo.location} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, location: v } })} />
                    <Field label="Timezone" value={draft.personalInfo.timezone} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, timezone: v } })} />
                    <Field label="Availability Status" value={draft.personalInfo.status} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, status: v } })} />
                  </div>

                  <p className="text-[10px] font-mono text-neutral-500 leading-relaxed">
                    Note: changing the public contact email only changes what's shown on the site — your login email stays the same.
                  </p>

                  <TextArea label="Bio (shown in the hero)" value={draft.personalInfo.bio} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, bio: v } })} rows={5} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageField label="Header / Logo & Splash Picture" pathPrefix="avatars/avatar" value={draft.personalInfo.avatarUrl} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, avatarUrl: v } })} />
                    <ImageField label="Hero 3D Portrait Picture" pathPrefix="avatars/portrait" value={draft.personalInfo.portraitUrl} onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, portraitUrl: v } })} />
                  </div>

                  <div className={card}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF9E00]">Social & Profile Links</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(draft.personalInfo.socials).map(([key, val]) => (
                        <Field key={key} label={key} value={val}
                          onChange={v => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, socials: { ...draft.personalInfo.socials, [key]: v } } })} />
                      ))}
                    </div>
                  </div>

                  <div className={card}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF9E00]">Stat Highlights</h4>
                      <button type="button" className={addBtn}
                        onClick={() => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, stats: [...draft.personalInfo.stats, { label: 'New Stat', value: '0' }] } })}>
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    {draft.personalInfo.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={stat.label} placeholder="Label" className={input}
                          onChange={e => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, stats: patch(draft.personalInfo.stats, i, { label: e.target.value }) } })} />
                        <input type="text" value={stat.value} placeholder="Value" className={`${input} max-w-[130px]`}
                          onChange={e => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, stats: patch(draft.personalInfo.stats, i, { value: e.target.value }) } })} />
                        <button type="button" className="p-2 text-neutral-500 hover:text-rose-400 transition-colors shrink-0"
                          onClick={() => setDraft({ ...draft, personalInfo: { ...draft.personalInfo, stats: draft.personalInfo.stats.filter((_, x) => x !== i) } })}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Section Eyebrow Label" value={draft.about.sectionTitle} onChange={v => setDraft({ ...draft, about: { ...draft.about, sectionTitle: v } })} />
                    <Field label="Section Subtitle" value={draft.about.sectionSubtitle} onChange={v => setDraft({ ...draft, about: { ...draft.about, sectionSubtitle: v } })} />
                    <Field label="Headline (Main)" value={draft.about.headlineMain} onChange={v => setDraft({ ...draft, about: { ...draft.about, headlineMain: v } })} />
                    <Field label="Headline (Outlined)" value={draft.about.headlineHighlight} onChange={v => setDraft({ ...draft, about: { ...draft.about, headlineHighlight: v } })} />
                    <Field label="Formal Title" value={draft.about.formalTitle} onChange={v => setDraft({ ...draft, about: { ...draft.about, formalTitle: v } })} />
                    <Field label="Badge Text" value={draft.about.badgeText} onChange={v => setDraft({ ...draft, about: { ...draft.about, badgeText: v } })} />
                  </div>
                  <TextArea label="Section Description" value={draft.about.description} onChange={v => setDraft({ ...draft, about: { ...draft.about, description: v } })} rows={2} />
                  <TextArea label="Paragraph 1" value={draft.about.paragraph1} onChange={v => setDraft({ ...draft, about: { ...draft.about, paragraph1: v } })} rows={4} />
                  <TextArea label="Paragraph 2" value={draft.about.paragraph2} onChange={v => setDraft({ ...draft, about: { ...draft.about, paragraph2: v } })} rows={4} />
                  <Field label="Closing Quote" value={draft.about.quote} onChange={v => setDraft({ ...draft, about: { ...draft.about, quote: v } })} />

                  <div className="flex items-center justify-between pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF9E00]">Core Pillars</h4>
                    <button type="button" className={addBtn}
                      onClick={() => setDraft({ ...draft, about: { ...draft.about, pillars: [...draft.about.pillars, { title: 'New Pillar', desc: '', iconName: 'Brain' }] } })}>
                      <Plus className="w-3 h-3" /> Add Pillar
                    </button>
                  </div>
                  {draft.about.pillars.map((pillar, i) => (
                    <ItemCard key={i} title={pillar.title} index={i} total={draft.about.pillars.length}
                      onMove={d => setDraft({ ...draft, about: { ...draft.about, pillars: move(draft.about.pillars, i, d) } })}
                      onRemove={() => setDraft({ ...draft, about: { ...draft.about, pillars: draft.about.pillars.filter((_, x) => x !== i) } })}>
                      <Field label="Title" value={pillar.title} onChange={v => setDraft({ ...draft, about: { ...draft.about, pillars: patch(draft.about.pillars, i, { title: v }) } })} />
                      <TextArea label="Description" value={pillar.desc} rows={2} onChange={v => setDraft({ ...draft, about: { ...draft.about, pillars: patch(draft.about.pillars, i, { desc: v }) } })} />
                      <div>
                        <label className={label}>Icon</label>
                        <select value={pillar.iconName} className={input}
                          onChange={e => setDraft({ ...draft, about: { ...draft.about, pillars: patch(draft.about.pillars, i, { iconName: e.target.value }) } })}>
                          {['Brain', 'Layers', 'Cpu'].map(n => <option key={n} value={n} className="bg-black">{n}</option>)}
                        </select>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-mono text-neutral-500">{draft.skills.length} skills</p>
                    <button type="button" className={addBtn}
                      onClick={() => addItem('skills', { name: 'New Skill', category: 'Data Science & AI', level: 70, iconName: 'Code2', description: '' })}>
                      <Plus className="w-3 h-3" /> Add Skill
                    </button>
                  </div>
                  {draft.skills.map((skill, i) => (
                    <ItemCard key={i} title={skill.name} index={i} total={draft.skills.length}
                      innerRef={itemRef('skills', i)}
                      onMove={d => setDraft({ ...draft, skills: move(draft.skills, i, d) })}
                      onRemove={() => setDraft({ ...draft, skills: draft.skills.filter((_, x) => x !== i) })}>
                      <Field label="Name" value={skill.name} onChange={v => setDraft({ ...draft, skills: patch(draft.skills, i, { name: v }) })} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={label}>Category</label>
                          <select value={skill.category} className={input}
                            onChange={e => setDraft({ ...draft, skills: patch(draft.skills, i, { category: e.target.value as Skill['category'] }) })}>
                            {['Data Science & AI', 'Full-Stack Engineering', 'Cloud & DevOps', 'IoT & Tools'].map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={label}>Proficiency — {skill.level}%</label>
                          <input type="range" min={0} max={100} value={skill.level} className="w-full accent-[#FF3E00] mt-3"
                            onChange={e => setDraft({ ...draft, skills: patch(draft.skills, i, { level: Number(e.target.value) }) })} />
                        </div>
                      </div>
                      <TextArea label="Description" value={skill.description} rows={2} onChange={v => setDraft({ ...draft, skills: patch(draft.skills, i, { description: v }) })} />
                      <label className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 cursor-pointer">
                        <input type="checkbox" checked={!!skill.highlighted} className="accent-[#FF3E00]"
                          onChange={e => setDraft({ ...draft, skills: patch(draft.skills, i, { highlighted: e.target.checked }) })} />
                        Mark as Primary
                      </label>
                    </ItemCard>
                  ))}
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-mono text-neutral-500">{draft.projects.length} projects</p>
                    <button type="button" className={addBtn}
                      onClick={() => addItem('projects', {
                        id: `project-${Date.now()}`, title: 'New Project', subtitle: '', description: '',
                        category: 'fullstack', categoryLabel: 'Project', image: '', tags: [], featured: false,
                        highlights: []
                      } as Project)}>
                      <Plus className="w-3 h-3" /> Add Project
                    </button>
                  </div>
                  {draft.projects.map((project, i) => (
                    <ItemCard key={project.id} title={project.title} index={i} total={draft.projects.length}
                      innerRef={itemRef('projects', i)}
                      onMove={d => setDraft({ ...draft, projects: move(draft.projects, i, d) })}
                      onRemove={() => setDraft({ ...draft, projects: draft.projects.filter((_, x) => x !== i) })}>
                      <Field label="Name" value={project.title} onChange={v => setDraft({ ...draft, projects: patch(draft.projects, i, { title: v }) })} />
                      <Field label="Subtitle" value={project.subtitle} onChange={v => setDraft({ ...draft, projects: patch(draft.projects, i, { subtitle: v }) })} />
                      <TextArea label="Short Description" value={project.description} rows={3} onChange={v => setDraft({ ...draft, projects: patch(draft.projects, i, { description: v }) })} />
                      <TagsField label="Tech Tags" value={project.tags} onChange={v => setDraft({ ...draft, projects: patch(draft.projects, i, { tags: v }) })} />
                      <ImageField label="Cover Image (optional)" pathPrefix={`projects/${project.id}`} value={project.image} onChange={v => setDraft({ ...draft, projects: patch(draft.projects, i, { image: v }) })} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Category Label" value={project.categoryLabel} onChange={v => setDraft({ ...draft, projects: patch(draft.projects, i, { categoryLabel: v }) })} />
                        <div>
                          <label className={label}>Cover Colour</label>
                          <select value={project.category} className={input}
                            onChange={e => setDraft({ ...draft, projects: patch(draft.projects, i, { category: e.target.value as Project['category'] }) })}>
                            <option value="ai_ml" className="bg-black">AI / Machine Learning (purple)</option>
                            <option value="fullstack" className="bg-black">Web / Full-Stack (cyan)</option>
                            <option value="mobile_ui" className="bg-black">Mobile / Desktop App (orange)</option>
                            <option value="iot_data" className="bg-black">Automation / Vision (green)</option>
                          </select>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-mono text-neutral-500">{draft.timeline.length} milestones</p>
                    <button type="button" className={addBtn}
                      onClick={() => addItem('timeline', {
                        id: `timeline-${Date.now()}`, type: 'experience', title: 'New Milestone', organization: '',
                        location: '', period: '', description: '', achievements: [], badge: '', skills: []
                      } as TimelineItem)}>
                      <Plus className="w-3 h-3" /> Add Milestone
                    </button>
                  </div>
                  {draft.timeline.map((item, i) => (
                    <ItemCard key={item.id} title={item.title} index={i} total={draft.timeline.length}
                      innerRef={itemRef('timeline', i)}
                      onMove={d => setDraft({ ...draft, timeline: move(draft.timeline, i, d) })}
                      onRemove={() => setDraft({ ...draft, timeline: draft.timeline.filter((_, x) => x !== i) })}>
                      <Field label="Title" value={item.title} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { title: v }) })} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={label}>Type</label>
                          <select value={item.type} className={input}
                            onChange={e => setDraft({ ...draft, timeline: patch(draft.timeline, i, { type: e.target.value as TimelineItem['type'] }) })}>
                            <option value="education" className="bg-black">Education</option>
                            <option value="experience" className="bg-black">Experience</option>
                          </select>
                        </div>
                        <Field label="Period" placeholder="2021 — Present" value={item.period} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { period: v }) })} />
                        <Field label="Organization" value={item.organization} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { organization: v }) })} />
                        <Field label="Location" value={item.location} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { location: v }) })} />
                      </div>
                      <TextArea label="Description" value={item.description} rows={3} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { description: v }) })} />
                      <ListField label="Achievements" hint="one per line" value={item.achievements} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { achievements: v }) })} />
                      <TagsField label="Skill Tags" value={item.skills} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { skills: v }) })} />
                      <Field label="Badge" placeholder="🎓 Graduated" value={item.badge || ''} onChange={v => setDraft({ ...draft, timeline: patch(draft.timeline, i, { badge: v }) })} />
                    </ItemCard>
                  ))}
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-mono text-neutral-500">{draft.testimonials.length} references</p>
                    <button type="button" className={addBtn}
                      onClick={() => addItem('testimonials', { id: `reference-${Date.now()}`, name: 'New Referee', role: '', company: '', avatar: '', content: '', phone: '', rating: 0 } as Testimonial)}>
                      <Plus className="w-3 h-3" /> Add Reference
                    </button>
                  </div>
                  {draft.testimonials.map((t, i) => (
                    <ItemCard key={t.id} title={t.name} index={i} total={draft.testimonials.length}
                      innerRef={itemRef('testimonials', i)}
                      onMove={d => setDraft({ ...draft, testimonials: move(draft.testimonials, i, d) })}
                      onRemove={() => setDraft({ ...draft, testimonials: draft.testimonials.filter((_, x) => x !== i) })}>
                      <Field label="Name" value={t.name} onChange={v => setDraft({ ...draft, testimonials: patch(draft.testimonials, i, { name: v }) })} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Role" value={t.role} onChange={v => setDraft({ ...draft, testimonials: patch(draft.testimonials, i, { role: v }) })} />
                        <Field label="Company" value={t.company} onChange={v => setDraft({ ...draft, testimonials: patch(draft.testimonials, i, { company: v }) })} />
                      </div>
                      <Field label="Phone Number" placeholder="+60 12-345 6789" value={t.phone || ''} onChange={v => setDraft({ ...draft, testimonials: patch(draft.testimonials, i, { phone: v }) })} />
                      <TextArea label="Relationship / Note" value={t.content} rows={3} onChange={v => setDraft({ ...draft, testimonials: patch(draft.testimonials, i, { content: v }) })} />
                      <ImageField label="Photo (optional)" pathPrefix={`testimonials/${t.id}`} value={t.avatar} onChange={v => setDraft({ ...draft, testimonials: patch(draft.testimonials, i, { avatar: v }) })} />
                    </ItemCard>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-white/10 shrink-0 bg-black/40">
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-neutral-500 hover:text-rose-400 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button type="button" onClick={onSignOut}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {saveState === 'saved' && <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" />Saved</span>}
              {saveState === 'failed' && <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1 max-w-[240px] truncate"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error || 'Save failed'}</span>}
              {saveState === 'idle' && isDirty && <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">Unsaved changes</span>}
              <button type="button" onClick={handleSave} disabled={saveState === 'saving' || !isDirty}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold accent-gradient text-black shadow-lg shadow-[#FF3E00]/30 hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100">
                {saveState === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saveState === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
