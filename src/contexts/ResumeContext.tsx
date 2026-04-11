import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ResumeData, CustomizationSettings, defaultCustomization } from '@/types/resume';
import { sampleResume } from '@/data/sampleResume';

interface ResumeContextType {
  resume: ResumeData;
  setResume: (data: ResumeData) => void;
  customization: CustomizationSettings;
  updateCustomization: (updates: Partial<CustomizationSettings>) => void;
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

  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(resume));
  }, [resume]);

  useEffect(() => {
    localStorage.setItem('resume-customization', JSON.stringify(customization));
    document.documentElement.setAttribute('data-theme', customization.theme);
  }, [customization]);

  const updateCustomization = useCallback((updates: Partial<CustomizationSettings>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <ResumeContext.Provider value={{ resume, setResume, customization, updateCustomization }}>
      {children}
    </ResumeContext.Provider>
  );
};
