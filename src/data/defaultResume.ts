export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  links: LinkItem[];
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
}

export type ViewMode = "recruiter" | "developer" | "creative";
export type ThemeId = "minimal" | "corporate" | "cyberpunk" | "hacker";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultResume: ResumeData = {
  name: "Alex Carter",
  title: "Full-Stack Engineer",
  email: "alex.carter@example.com",
  phone: "+1 (555) 010-2233",
  location: "Bengaluru, IN",
  summary:
    "Full-stack engineer with 6+ years building scalable web platforms. I care about clean architecture, fast interfaces, and shipping products people actually use.",
  links: [
    { id: uid(), label: "GitHub", url: "https://github.com/alexcarter" },
    { id: uid(), label: "LinkedIn", url: "https://linkedin.com/in/alexcarter" },
    { id: uid(), label: "Portfolio", url: "https://alexcarter.dev" },
  ],
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL", "AWS", "Docker", "Redis"],
  experience: [
    {
      id: uid(),
      role: "Senior Full-Stack Engineer",
      company: "Nimbus Labs",
      period: "2022 — Present",
      bullets: [
        "Led rebuild of the core dashboard, cutting load times by 58% for 40k daily users.",
        "Designed event-driven billing pipeline processing $2M+ monthly volume.",
        "Mentored 4 engineers; introduced typed API contracts across teams.",
      ],
    },
    {
      id: uid(),
      role: "Software Engineer",
      company: "Brightstack",
      period: "2019 — 2022",
      bullets: [
        "Built real-time collaboration features used by 120k accounts.",
        "Owned migration from REST to GraphQL with zero downtime.",
      ],
    },
  ],
  projects: [
    {
      id: uid(),
      name: "Pulseboard",
      description: "Open-source analytics dashboard with plug-in data sources.",
      techStack: ["React", "D3.js", "Node.js", "ClickHouse"],
      highlights: ["2.1k GitHub stars", "Sub-100ms query rendering"],
    },
    {
      id: uid(),
      name: "Formgate",
      description: "Headless form backend with spam filtering and webhooks.",
      techStack: ["TypeScript", "Hono", "PostgreSQL"],
      highlights: ["Handles 1M+ submissions/month"],
    },
  ],
  education: [
    {
      id: uid(),
      degree: "B.E. Computer Science",
      school: "Visvesvaraya Technological University",
      year: "2015 — 2019",
    },
  ],
};
