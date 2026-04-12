import React from 'react';
import { ResumeProvider, useResume } from '@/contexts/ResumeContext';
import ResumeView from '@/components/ResumeView';
import CustomizationPanel from '@/components/CustomizationPanel';
import JobMatcher from '@/components/JobMatcher';
import ExplainCandidate from '@/components/ExplainCandidate';
import AISummaryGenerator from '@/components/AISummaryGenerator';
import { FileDown, Pencil, Eye } from 'lucide-react';

const IndexContent: React.FC = () => {
  const { editMode, toggleEditMode } = useResume();

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 xl:w-96 lg:h-screen lg:sticky lg:top-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border p-4 space-y-4 bg-background print:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">Adaptive Resume</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleEditMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  editMode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {editMode ? <><Pencil className="w-3.5 h-3.5" /> Editing</> : <><Eye className="w-3.5 h-3.5" /> Preview</>}
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <FileDown className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
          <CustomizationPanel />
          <AISummaryGenerator />
          <JobMatcher />
          <ExplainCandidate />
        </aside>

        <main className="flex-1 min-h-screen">
          <ResumeView />
        </main>
      </div>
    </div>
  );
};

const Index: React.FC = () => (
  <ResumeProvider>
    <IndexContent />
  </ResumeProvider>
);

export default Index;
