import { jsPDF } from 'jspdf';
import { PortfolioContent } from '../types';

/**
 * Builds the CV as a real, text-based PDF (selectable and searchable — not a
 * screenshot of the page).
 *
 * The layout is a small flow engine rather than fixed coordinates: every block
 * measures itself, asks for vertical space, and starts a new page when it does
 * not fit. That means the document keeps its structure no matter how much the
 * content grows or shrinks in the editor.
 */

// ---------------------------------------------------------------------------
// Page geometry (points; 1pt = 1/72in). A4 = 595.28 x 841.89.
// ---------------------------------------------------------------------------
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_X = 46;
const MARGIN_TOP = 44;
const MARGIN_BOTTOM = 52;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

// Palette, kept in step with the site's accent.
const INK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [71, 85, 105];
const LIGHT: [number, number, number] = [148, 163, 184];
const ACCENT: [number, number, number] = [255, 62, 0];
const RULE: [number, number, number] = [226, 232, 240];
const PANEL: [number, number, number] = [248, 250, 252];

/** Crops to a square, rounds the corners, returns a PNG data URL. */
async function loadRoundedImage(url: string, size = 220): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // White base so any transparency prints cleanly rather than black.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const r = size * 0.09;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(size, 0, size, size, r);
    ctx.arcTo(size, size, 0, size, r);
    ctx.arcTo(0, size, 0, 0, r);
    ctx.arcTo(0, 0, size, 0, r);
    ctx.closePath();
    ctx.clip();

    // "cover" crop, anchored slightly high so faces stay in frame.
    const scale = Math.max(size / bitmap.width, size / bitmap.height);
    const dw = bitmap.width * scale;
    const dh = bitmap.height * scale;
    ctx.drawImage(bitmap, (size - dw) / 2, (size - dh) * 0.25, dw, dh);

    return canvas.toDataURL('image/png');
  } catch (err) {
    // Offline, CORS-blocked, or broken URL — the CV still renders without it.
    console.warn('[resume] could not embed photo:', err);
    return null;
  }
}

/** "Rooben Prakaash" -> Rooben-Resume.pdf; follows the name if it ever changes. */
export function resumeFileName(name: string): string {
  const first = (name || 'Resume').trim().split(/\s+/)[0].replace(/[^\w-]/g, '');
  return `${first || 'Resume'}-Resume.pdf`;
}

/** Lays out the document. Kept separate from saving so it can be tested. */
export async function buildResumePdf(content: PortfolioContent): Promise<jsPDF> {
  const { personalInfo: info, skills, projects, timeline, testimonials: refs } = content;

  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  let y = MARGIN_TOP;

  // -- primitives ----------------------------------------------------------
  const setFont = (size: number, weight: 'normal' | 'bold' | 'italic' = 'normal', color = INK) => {
    doc.setFont('helvetica', weight);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
  };

  const wrap = (text: string, width: number) => doc.splitTextToSize(text || '', width) as string[];

  const footer = (pageNo: number) => {
    setFont(7.5, 'normal', LIGHT);
    doc.text(info.formalName || info.name, MARGIN_X, PAGE_H - 26);
    doc.text(`Page ${pageNo}`, PAGE_W - MARGIN_X, PAGE_H - 26, { align: 'right' });
  };

  const newPage = () => {
    footer(doc.getNumberOfPages());
    doc.addPage();
    y = MARGIN_TOP;
  };

  /** Starts a new page when `needed` points would overflow the current one. */
  const need = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN_BOTTOM) newPage();
  };

  /** Body copy that can itself break across pages, line by line. */
  const paragraph = (text: string, size = 9.3, color = MUTED, width = CONTENT_W, x = MARGIN_X) => {
    if (!text) return;
    setFont(size, 'normal', color);
    const lh = size * 1.42;
    for (const line of wrap(text, width)) {
      need(lh);
      setFont(size, 'normal', color);
      doc.text(line, x, y + size * 0.85);
      y += lh;
    }
  };

  const sectionHeading = (label: string) => {
    // Keep the heading with at least the first lines of its section.
    need(58);
    y += 6;
    setFont(9.5, 'bold', INK);
    doc.text(label.toUpperCase(), MARGIN_X + 12, y + 8, { charSpace: 1.1 });

    // Accent tick to the left of the label
    doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
    doc.rect(MARGIN_X, y + 1, 4, 9, 'F');

    y += 15;
    doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
    doc.setLineWidth(0.7);
    doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
    y += 11;
  };

  const bullets = (items: string[], x = MARGIN_X + 10) => {
    const size = 8.9;
    const lh = size * 1.42;
    const textW = CONTENT_W - (x - MARGIN_X) - 10;
    for (const item of items) {
      const lines = wrap(item, textW);
      lines.forEach((line, i) => {
        need(lh);
        if (i === 0) {
          doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
          doc.circle(x + 1.6, y + size * 0.5, 1.5, 'F');
        }
        setFont(size, 'normal', MUTED);
        doc.text(line, x + 10, y + size * 0.85);
        y += lh;
      });
    }
  };

  /** Title on the left, period right-aligned on the same baseline. */
  const entryHeader = (title: string, period: string, subtitle?: string) => {
    need(34);
    const periodW = period ? doc.getStringUnitWidth(period) * 8.6 / doc.internal.scaleFactor + 8 : 0;
    setFont(10.4, 'bold', INK);
    const titleLines = wrap(title, CONTENT_W - periodW);

    titleLines.forEach((line, i) => {
      need(14);
      setFont(10.4, 'bold', INK);
      doc.text(line, MARGIN_X, y + 9);
      if (i === 0 && period) {
        setFont(8.6, 'normal', MUTED);
        doc.text(period, PAGE_W - MARGIN_X, y + 9, { align: 'right' });
      }
      y += 14;
    });

    if (subtitle) {
      need(12);
      setFont(8.9, 'italic', ACCENT);
      doc.text(subtitle, MARGIN_X, y + 7);
      y += 13;
    }
  };

  const metaLine = (text: string) => {
    if (!text) return;
    need(12);
    setFont(8.6, 'italic', LIGHT);
    doc.text(text, MARGIN_X, y + 7);
    y += 12;
  };

  const tagLine = (label: string, items: string[]) => {
    if (!items.length) return;
    const size = 8.2;
    const lh = size * 1.4;
    const text = `${label}: ${items.join('  •  ')}`;
    setFont(size, 'normal', LIGHT);
    for (const line of wrap(text, CONTENT_W - 10)) {
      need(lh);
      setFont(size, 'normal', LIGHT);
      doc.text(line, MARGIN_X + 10, y + size * 0.85);
      y += lh;
    }
  };

  // -- letterhead ----------------------------------------------------------
  const photo = info.avatarUrl ? await loadRoundedImage(info.avatarUrl) : null;
  const PHOTO = 76;
  const textX = photo ? MARGIN_X + PHOTO + 18 : MARGIN_X;
  const textW = PAGE_W - MARGIN_X - textX;

  if (photo) doc.addImage(photo, 'PNG', MARGIN_X, y, PHOTO, PHOTO);

  let ty = y;
  setFont(21, 'bold', INK);
  for (const line of wrap((info.formalName || info.name).toUpperCase(), textW)) {
    doc.text(line, textX, ty + 16);
    ty += 23;
  }

  setFont(11.5, 'bold', ACCENT);
  doc.text(info.role, textX, ty + 9);
  ty += 16;

  if (info.tagline) {
    setFont(8.8, 'italic', MUTED);
    for (const line of wrap(info.tagline, textW)) {
      doc.text(line, textX, ty + 7);
      ty += 11;
    }
  }

  ty += 4;
  setFont(8.7, 'normal', MUTED);
  const contacts = [info.email, info.phone, info.location].filter(Boolean);
  for (const line of wrap(contacts.join('   •   '), textW)) {
    doc.text(line, textX, ty + 7);
    ty += 11.5;
  }

  if (info.workEligibility) {
    setFont(8.2, 'italic', MUTED);
    for (const line of wrap(info.workEligibility, textW)) {
      doc.text(line, textX, ty + 7);
      ty += 10.5;
    }
    ty += 2;
  }

  const web = [info.socials.linkedin, info.socials.github, info.socials.website]
    .filter(Boolean)
    .map(u => u.replace(/^https?:\/\//, '').replace(/\/$/, ''));
  if (web.length) {
    setFont(8.2, 'normal', LIGHT);
    for (const line of wrap(web.join('   •   '), textW)) {
      doc.text(line, textX, ty + 7);
      ty += 11;
    }
  }

  y = Math.max(ty, y + (photo ? PHOTO : 0)) + 12;

  // Accent rule closing the letterhead
  doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.rect(MARGIN_X, y, CONTENT_W, 2.4, 'F');
  y += 16;

  // -- profile -------------------------------------------------------------
  if (info.bio) {
    sectionHeading('Professional Profile');
    paragraph(info.bio, 9.3, MUTED);
    y += 4;
  }

  // -- stats strip ---------------------------------------------------------
  if (info.stats.length) {
    const n = Math.min(info.stats.length, 4);
    const gap = 9;
    const boxW = (CONTENT_W - gap * (n - 1)) / n;
    const boxH = 40;
    need(boxH + 10);
    info.stats.slice(0, n).forEach((s, i) => {
      const x = MARGIN_X + i * (boxW + gap);
      doc.setFillColor(PANEL[0], PANEL[1], PANEL[2]);
      doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
      doc.setLineWidth(0.6);
      doc.roundedRect(x, y, boxW, boxH, 5, 5, 'FD');

      // Shrink to fit: values range from "11" to "BSc Data Science", and a long
      // one at a fixed size spills straight out of the box.
      const maxValueW = boxW - 10;
      let vSize = 13;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(vSize);
      while (vSize > 6.5 && doc.getTextWidth(s.value) > maxValueW) {
        vSize -= 0.5;
        doc.setFontSize(vSize);
      }
      setFont(vSize, 'bold', ACCENT);
      doc.text(s.value, x + boxW / 2, y + 18, { align: 'center' });

      setFont(6.6, 'normal', MUTED);
      const label = wrap(s.label.toUpperCase(), boxW - 8);
      doc.text(label.slice(0, 2), x + boxW / 2, y + 28, { align: 'center' });
    });
    y += boxH + 12;
  }

  // -- education -----------------------------------------------------------
  const education = timeline.filter(t => t.type === 'education');
  if (education.length) {
    sectionHeading('Education');
    education.forEach((item, i) => {
      entryHeader(item.title, item.period);
      metaLine([item.organization, item.location].filter(Boolean).join('  •  '));
      if (item.description) { y += 1; paragraph(item.description, 9, MUTED); }
      if (item.achievements.length) { y += 2; bullets(item.achievements); }
      if (i < education.length - 1) y += 10;
    });
    y += 4;
  }

  // -- skills --------------------------------------------------------------
  if (skills.length) {
    sectionHeading('Technical Skills');
    const grouped = skills.reduce<Record<string, string[]>>((acc, s) => {
      (acc[s.category] ||= []).push(s.name);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([category, names]) => {
      need(24);
      setFont(9, 'bold', INK);
      doc.text(category, MARGIN_X, y + 7);
      y += 13;

      const size = 8.8;
      const lh = size * 1.42;
      setFont(size, 'normal', MUTED);
      for (const line of wrap(names.join('  •  '), CONTENT_W - 10)) {
        need(lh);
        setFont(size, 'normal', MUTED);
        doc.text(line, MARGIN_X + 10, y + size * 0.85);
        y += lh;
      }
      y += 6;
    });
  }

  // -- experience ----------------------------------------------------------
  const experience = timeline.filter(t => t.type === 'experience');
  if (experience.length) {
    sectionHeading('Professional Experience');
    experience.forEach((item, i) => {
      entryHeader(item.title, item.period);
      metaLine([item.organization, item.location].filter(Boolean).join('  •  '));
      if (item.description) { y += 1; paragraph(item.description, 9, MUTED); }
      if (item.achievements.length) { y += 2; bullets(item.achievements); }
      if (item.skills.length) { y += 2; tagLine('Skills', item.skills); }
      if (i < experience.length - 1) y += 10;
    });
    y += 4;
  }

  // -- projects ------------------------------------------------------------
  // "Feature on CV" in the editor picks what appears here. Every ticked project
  // is rendered — an explicit tick is an instruction, so it is never silently
  // dropped. With nothing ticked at all, fall back to the first six projects
  // so the CV is not left empty.
  const featuredProjects = projects.filter(p => p.featured);
  const cvProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 6);
  if (cvProjects.length) {
    sectionHeading('Selected Projects');
    cvProjects.forEach((p, i) => {
      entryHeader(p.title, p.categoryLabel, p.subtitle);
      if (p.description) paragraph(p.description, 8.9, MUTED);
      if (p.tags.length) { y += 1; tagLine('Tech', p.tags); }
      const links = [p.demoUrl, p.githubUrl]
        .filter(Boolean)
        .map(u => (u as string).replace(/^https?:\/\//, '').replace(/\/$/, ''));
      if (links.length) tagLine('Links', links);
      if (i < cvProjects.length - 1) y += 9;
    });
    if (projects.length > cvProjects.length) {
      y += 3;
      paragraph(
        `Plus ${projects.length - cvProjects.length} further projects — see ${
          (info.socials.website || 'the portfolio').replace(/^https?:\/\//, '')
        }`,
        8.2,
        LIGHT
      );
    }
    y += 4;
  }

  // -- references ----------------------------------------------------------
  if (refs.length) {
    // Up to three across so a typical set of referees sits on a single row.
    const cols = Math.min(refs.length, 3);
    const gap = 16;
    const colW = (CONTENT_W - gap * (cols - 1)) / cols;

    // Measure first: the whole section (heading, referees and the closing
    // note) is kept on one page rather than leaving a stray name overleaf.
    setFont(8.4, 'italic', MUTED);
    const roleLinesFor = refs.map(r =>
      wrap([r.role, r.company].filter(Boolean).join(' • '), colW).slice(0, 3)
    );
    const maxRoleLines = Math.max(1, ...roleLinesFor.map(l => l.length));
    const anyPhone = refs.some(r => r.phone);
    const blockH = 18 + maxRoleLines * 10 + (anyPhone ? 14 : 4);
    const rows = Math.ceil(refs.length / cols);
    need(58 + rows * blockH + 34);

    sectionHeading('References');

    for (let i = 0; i < refs.length; i += cols) {
      const rowY = y;
      refs.slice(i, i + cols).forEach((r, c) => {
        const x = MARGIN_X + c * (colW + gap);

        setFont(9.4, 'bold', INK);
        doc.text(wrap(r.name, colW)[0], x, rowY + 8);

        const roleLines = roleLinesFor[i + c];
        setFont(8.4, 'italic', MUTED);
        roleLines.forEach((line, li) => doc.text(line, x, rowY + 19 + li * 10));

        if (r.phone) {
          setFont(8.6, 'normal', ACCENT);
          doc.text(r.phone, x, rowY + 21 + maxRoleLines * 10);
        }
      });
      y = rowY + blockH;
    }
  }

  // -- close out -----------------------------------------------------------
  need(26);
  y += 6;
  doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
  doc.setLineWidth(0.7);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
  y += 12;
  setFont(7.8, 'normal', LIGHT);
  doc.text('Academic transcripts available upon request.', MARGIN_X, y);
  if (info.status) doc.text(info.status, PAGE_W - MARGIN_X, y, { align: 'right' });

  footer(doc.getNumberOfPages());

  doc.setProperties({
    title: `${info.formalName || info.name} — Curriculum Vitae`,
    subject: info.role,
    author: info.formalName || info.name,
    keywords: skills.slice(0, 12).map(s => s.name).join(', '),
    creator: 'Portfolio',
  });

  return doc;
}

/** Builds the CV and triggers the browser download. */
export async function generateResumePdf(content: PortfolioContent): Promise<string> {
  const doc = await buildResumePdf(content);
  const filename = resumeFileName(content.personalInfo.name);
  doc.save(filename);
  return filename;
}
