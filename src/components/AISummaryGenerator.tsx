import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AISummaryGenerator: React.FC = () => {
  const { resume, updateField, customization } = useResume();
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-resume', {
        body: {
          action: 'summary',
          resume: {
            name: resume.name,
            title: resume.title,
            skills: resume.skills.map(s => s.name),
            experience: resume.experience.map(e => ({ role: e.role, company: e.company, description: e.description })),
            projects: resume.projects.map(p => ({ name: p.name, description: p.description })),
          },
          tone: customization.tone,
        },
      });
      if (error) throw error;
      if (data.summary) {
        updateField('summary', data.summary);
        toast.success('AI summary generated!');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generateSummary}
      disabled={loading}
      className="w-full py-2 px-4 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 border border-border"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      {loading ? 'Generating...' : `Generate AI Summary (${customization.tone})`}
    </button>
  );
};

export default AISummaryGenerator;
