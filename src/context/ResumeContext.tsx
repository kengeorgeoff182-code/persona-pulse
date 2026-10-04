import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultResume, ResumeData, ThemeId, ViewMode } from "@/data/defaultResume";

const STORAGE_KEY = "adaptive-resume-v1";

interface ResumeContextValue {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  editing: boolean;
  setEditing: (e: boolean) => void;
  resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

function load(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultResume, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupted storage */
  }
  return defaultResume;
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resume, setResume] = useState<ResumeData>(load);
  const [mode, setMode] = useState<ViewMode>("recruiter");
  const [theme, setTheme] = useState<ThemeId>("minimal");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  }, [resume]);

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setResume((r) => ({ ...r, [key]: value }));

  const resetResume = () => setResume(defaultResume);

  return (
    <ResumeContext.Provider
      value={{ resume, setResume, update, mode, setMode, theme, setTheme, editing, setEditing, resetResume }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
  return ctx;
}
