import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { UserCheck, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CandidateAnalysis {
  strengths: string[];
  weaknesses: string[];
  bestRoleFit: string;
  hiringDecision: string;
  summary: string;
}

const ExplainCandidate: React.FC = () => {
  const { resume } = useResume();
  const [analysis, setAnalysis] = useState<CandidateAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const explain = async () => {
    setLoading(true);
    setOpen(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-resume', {
        body: {
          action: 'explain',
          resume: {
            name: resume.name,
            title: resume.title,
            summary: resume.summary,
            skills: resume.skills.map(s => ({ name: s.name, level: s.level })),
            experience: resume.experience.map(e => ({ role: e.role, company: e.company, period: e.period, description: e.description })),
            projects: resume.projects.map(p => ({ name: p.name, description: p.description, techStack: p.techStack })),
            education: resume.education,
          },
        },
      });
      if (error) throw error;
      setAnalysis(data);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to analyze candidate');
    } finally {
      setLoading(false);
    }
  };

  const decisionColor = (d: string) => {
    if (d.toLowerCase().includes('strong')) return 'text-green-500';
    if (d.toLowerCase().includes('potential')) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <>
      <button
        onClick={explain}
        disabled={loading}
        className="w-full py-2 px-4 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
        Explain Candidate
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4 relative">
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" /> Candidate Analysis
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing candidate profile...</p>
              </div>
            ) : analysis ? (
              <>
                <div className="text-center p-4 rounded-lg bg-secondary">
                  <div className={`text-lg font-bold ${decisionColor(analysis.hiringDecision)}`}>{analysis.hiringDecision}</div>
                  <div className="text-xs text-muted-foreground mt-1">Hiring Recommendation</div>
                </div>

                <p className="text-sm text-muted-foreground">{analysis.summary}</p>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Best Role Fit</h3>
                  <p className="text-sm text-card-foreground">{analysis.bestRoleFit}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-card-foreground flex gap-2">
                        <span className="text-green-500">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Areas for Growth</h3>
                  <ul className="space-y-1">
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-card-foreground flex gap-2">
                        <span className="text-orange-500">△</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default ExplainCandidate;
