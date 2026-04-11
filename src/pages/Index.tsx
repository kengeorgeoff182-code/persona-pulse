import React from 'react';
import { ResumeProvider } from '@/contexts/ResumeContext';
import ResumeView from '@/components/ResumeView';
import CustomizationPanel from '@/components/CustomizationPanel';
import JobMatcher from '@/components/JobMatcher';
import { FileDown } from 'lucide-react';

const Index: React.FC = () => {
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <ResumeProvider>
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 xl:w-96 lg:h-screen lg:sticky lg:top-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border p-4 space-y-4 bg-background">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-foreground">
                Adaptive Resume
              </h1>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity print:hidden"
              >
                <FileDown className="w-3.5 h-3.5" />
                Export PDF
              </button>
            </div>
            <CustomizationPanel />
            <JobMatcher />
          </aside>

          {/* Resume Preview */}
          <main className="flex-1 min-h-screen">
            <ResumeView />
          </main>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default Index;
