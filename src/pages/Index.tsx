import { ResumeProvider, useResume } from "@/context/ResumeContext";
import ResumePreview from "@/components/ResumePreview";
import EditPanel from "@/components/EditPanel";
import AIPanel from "@/components/AIPanel";
import { Button } from "@/components/ui/button";
import { ThemeId, ViewMode } from "@/data/defaultResume";
import { Pencil, Eye, Printer, RotateCcw } from "lucide-react";

const modes: { id: ViewMode; label: string }[] = [
  { id: "recruiter", label: "Recruiter" },
  { id: "developer", label: "Developer" },
  { id: "creative", label: "Creative" },
];

const themes: { id: ThemeId; label: string; swatch: string }[] = [
  { id: "minimal", label: "Minimal", swatch: "#2563eb" },
  { id: "corporate", label: "Corporate", swatch: "#1e4e8c" },
  { id: "cyberpunk", label: "Cyberpunk", swatch: "#00e5ff" },
  { id: "hacker", label: "Hacker", swatch: "#33ff66" },
];

function Toolbar() {
  const { mode, setMode, theme, setTheme, editing, setEditing, resetResume } = useResume();
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <span className="text-sm font-bold tracking-tight">Adaptive Resume</span>

        <div className="flex rounded-md border border-border">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {themes.map((t) => (
            <button
              key={t.id}
              title={t.label}
              onClick={() => setTheme(t.id)}
              className={`h-6 w-6 rounded-full border-2 transition-transform ${
                theme === t.id ? "scale-110 border-foreground" : "border-transparent"
              }`}
              style={{ background: t.swatch }}
            />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? <Eye className="mr-1.5 h-4 w-4" /> : <Pencil className="mr-1.5 h-4 w-4" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-4 w-4" /> PDF
          </Button>
          <Button variant="ghost" size="sm" onClick={resetResume}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </header>
  );
}

function Layout() {
  const { editing } = useResume();
  return (
    <div className="min-h-screen bg-background">
      <Toolbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className={`grid gap-6 ${editing ? "lg:grid-cols-[minmax(0,380px)_1fr]" : "grid-cols-1"}`}>
          {editing && (
            <aside className="space-y-4">
              <EditPanel />
              <AIPanel />
            </aside>
          )}
          <ResumePreview />
        </div>
        {!editing && (
          <div className="mx-auto mt-6 max-w-3xl">
            <AIPanel />
          </div>
        )}
      </main>
    </div>
  );
}

const Index = () => (
  <ResumeProvider>
    <Layout />
  </ResumeProvider>
);

export default Index;
