export type ViewMode = 'recruiter' | 'developer' | 'creative';
export type ThemePreset = 'minimal' | 'corporate' | 'cyberpunk' | 'hacker';
export type ToneStyle = 'formal' | 'confident' | 'technical' | 'story-driven';
export type LayoutType = 'single' | 'split' | 'timeline';
export type CardStyle = 'rounded' | 'sharp' | 'glass';
export type AccentStyle = 'underline' | 'border' | 'glow';

export interface Skill {
  name: string;
  level: number; // 0-100
  projects: string[];
  githubLinks?: string[];
  context?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  techStack?: string[];
  highlights?: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  challenges?: string;
  architecture?: string;
  codeSnippet?: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
}

export interface CustomizationSettings {
  theme: ThemePreset;
  mode: ViewMode;
  tone: ToneStyle;
  layout: LayoutType;
  cardStyle: CardStyle;
  accentStyle: AccentStyle;
  fontFamily: string;
  fontSize: number;
  spacing: 'compact' | 'normal' | 'relaxed';
  sectionOrder: string[];
}

export const defaultCustomization: CustomizationSettings = {
  theme: 'minimal',
  mode: 'recruiter',
  tone: 'formal',
  layout: 'single',
  cardStyle: 'rounded',
  accentStyle: 'underline',
  fontFamily: 'Inter',
  fontSize: 16,
  spacing: 'normal',
  sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education'],
};
