export type ThemeMode = 'artistic' | 'dark' | 'light' | 'midnight' | 'cyberpunk';

export interface SocialLinks {
  facebook: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  jobstreet: string;
  indeed: string;
  email: string;
  github: string;
  website: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface PersonalInfo {
  headerName: string;
  name: string;
  formalName: string;
  role: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  status: string;
  /** Right-to-work summary, shown on the site and on the generated CV. */
  workEligibility: string;
  bio: string;
  avatarUrl: string;
  portraitUrl: string;
  socials: SocialLinks;
  stats: StatItem[];
}

export interface PillarItem {
  title: string;
  desc: string;
  iconName: string;
}

export interface AboutData {
  sectionTitle: string;
  sectionSubtitle: string;
  headlineMain: string;
  headlineHighlight: string;
  description: string;
  formalTitle: string;
  badgeText: string;
  paragraph1: string;
  paragraph2: string;
  quote: string;
  pillars: PillarItem[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  category: 'ai_ml' | 'fullstack' | 'iot_data' | 'mobile_ui';
  categoryLabel: string;
  image: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  highlights: string[];
  architecture?: string[];
}

export interface Skill {
  name: string;
  category: 'Data Science & AI' | 'Full-Stack Engineering' | 'Cloud & DevOps' | 'IoT & Tools';
  level: number; // 0 to 100
  iconName: string;
  description: string;
  highlighted?: boolean;
}

export interface TimelineItem {
  id: string;
  type: 'experience' | 'education' | 'award';
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  badge?: string;
  skills: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  /** Referee's contact number, shown publicly on the references card. */
  phone?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  serviceType: string;
  budget?: string;
  message: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PortfolioContent {
  personalInfo: PersonalInfo;
  about: AboutData;
  projects: Project[];
  skills: Skill[];
  timeline: TimelineItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
}

