import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ResumeData, CustomizationSettings, defaultCustomization, Skill, Experience, Project, Education } from '@/types/resume';
import { sampleResume } from '@/data/sampleResume';

interface ResumeContextType {
  resume: ResumeData;
  setResume: (data: ResumeData) => void;
  customization: CustomizationSettings;
  updateCustomization: (updates: Partial<CustomizationSettings>) => void;
  editMode: boolean;
  toggleEditMode: () => void;
  updateField: (field: keyof ResumeData, value: any) => void;
  addSkill: () => void;
  removeSkill: (index: number) => void;
  updateSkill: (index: number, updates: Partial<Skill>) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  updateExperience: (index: number, updates: Partial<Experience>) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
  updateProject: (index: number, updates: Partial<Project>) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  updateEducation: (index: number, updates: Partial<Education>) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resume, setResume] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : sampleResume;
  });

  const [customization, setCustomization] = useState<CustomizationSettings>(() => {
    const saved = localStorage.getItem('resume-customization');
    return saved ? { ...defaultCustomization, ...JSON.parse(saved) } : defaultCustomization;
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(resume));
  }, [resume]);

  useEffect(() => {
    localStorage.setItem('resume-customization', JSON.stringify(customization));
    document.documentElement.setAttribute('data-theme', customization.theme);
  }, [customization]);

  const toggleEditMode = useCallback(() => setEditMode(prev => !prev), []);

  const updateCustomization = useCallback((updates: Partial<CustomizationSettings>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  }, []);

  const updateField = useCallback((field: keyof ResumeData, value: any) => {
    setResume(prev => ({ ...prev, [field]: value }));
  }, []);

  const addSkill = useCallback(() => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, { name: 'New Skill', level: 50, projects: [] }],
    }));
  }, []);

  const removeSkill = useCallback((index: number) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  }, []);

  const updateSkill = useCallback((index: number, updates: Partial<Skill>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? { ...s, ...updates } : s),
    }));
  }, []);

  const addExperience = useCallback(() => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: 'Company', role: 'Role', period: '2024 — Present', description: ['Describe your achievements'] }],
    }));
  }, []);

  const removeExperience = useCallback((index: number) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  }, []);

  const updateExperience = useCallback((index: number, updates: Partial<Experience>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((e, i) => i === index ? { ...e, ...updates } : e),
    }));
  }, []);

  const addProject = useCallback(() => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { name: 'New Project', description: 'Describe your project', techStack: [] }],
    }));
  }, []);

  const removeProject = useCallback((index: number) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  }, []);

  const updateProject = useCallback((index: number, updates: Partial<Project>) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((p, i) => i === index ? { ...p, ...updates } : p),
    }));
  }, []);

  const addEducation = useCallback(() => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { institution: 'University', degree: 'Degree', period: '2020 — 2024' }],
    }));
  }, []);

  const removeEducation = useCallback((index: number) => {
    setResume(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  }, []);

  const updateEducation = useCallback((index: number, updates: Partial<Education>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map((e, i) => i === index ? { ...e, ...updates } : e),
    }));
  }, []);

  return (
    <ResumeContext.Provider value={{
      resume, setResume, customization, updateCustomization,
      editMode, toggleEditMode, updateField,
      addSkill, removeSkill, updateSkill,
      addExperience, removeExperience, updateExperience,
      addProject, removeProject, updateProject,
      addEducation, removeEducation, updateEducation,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};
