import { useResume } from "@/context/ResumeContext";
import { uid, ExperienceItem, ProjectItem, EducationItem, LinkItem } from "@/data/defaultResume";
import TechStackInput from "@/components/TechStackInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export default function EditPanel() {
  const { resume, update } = useResume();

  const patchList = <T extends { id: string }>(key: "experience" | "projects" | "education" | "links", id: string, patch: Partial<T>) => {
    update(
      key,
      (resume[key] as T[]).map((item) => (item.id === id ? { ...item, ...patch } : item)) as never
    );
  };

  const removeFrom = (key: "experience" | "projects" | "education" | "links", id: string) => {
    update(key, (resume[key] as { id: string }[]).filter((i) => i.id !== id) as never);
  };

  return (
    <div className="space-y-4">
      <Section title="Basics">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name">
            <Input value={resume.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Title">
            <Input value={resume.title} onChange={(e) => update("title", e.target.value)} />
          </Field>
          <Field label="Email">
            <Input value={resume.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={resume.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={resume.location} onChange={(e) => update("location", e.target.value)} />
          </Field>
        </div>
        <Field label="Professional summary">
          <Textarea rows={4} value={resume.summary} onChange={(e) => update("summary", e.target.value)} />
        </Field>
      </Section>

      <Section title="Skills">
        <TechStackInput value={resume.skills} onChange={(v) => update("skills", v)} placeholder="e.g. TypeScript, React, AWS" />
      </Section>

      <Section title="Links">
        {resume.links.map((link) => (
          <div key={link.id} className="flex items-end gap-2">
            <Field label="Label">
              <Input value={link.label} onChange={(e) => patchList<LinkItem>("links", link.id, { label: e.target.value })} />
            </Field>
            <Field label="URL">
              <Input value={link.url} onChange={(e) => patchList<LinkItem>("links", link.id, { url: e.target.value })} />
            </Field>
            <Button variant="ghost" size="icon" onClick={() => removeFrom("links", link.id)} aria-label="Remove link">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => update("links", [...resume.links, { id: uid(), label: "", url: "" }])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add link
        </Button>
      </Section>

      <Section title="Experience">
        {resume.experience.map((exp) => (
          <div key={exp.id} className="space-y-3 rounded-md border border-border p-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role">
                <Input value={exp.role} onChange={(e) => patchList<ExperienceItem>("experience", exp.id, { role: e.target.value })} />
              </Field>
              <Field label="Company">
                <Input value={exp.company} onChange={(e) => patchList<ExperienceItem>("experience", exp.id, { company: e.target.value })} />
              </Field>
              <Field label="Period">
                <Input value={exp.period} onChange={(e) => patchList<ExperienceItem>("experience", exp.id, { period: e.target.value })} />
              </Field>
            </div>
            <Field label="Achievements (one per line)">
              <Textarea
                rows={3}
                value={exp.bullets.join("\n")}
                onChange={(e) => patchList<ExperienceItem>("experience", exp.id, { bullets: e.target.value.split("\n") })}
              />
            </Field>
            <Button variant="ghost" size="sm" onClick={() => removeFrom("experience", exp.id)}>
              <Trash2 className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            update("experience", [...resume.experience, { id: uid(), role: "", company: "", period: "", bullets: [] }])
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Add experience
        </Button>
      </Section>

      <Section title="Projects">
        {resume.projects.map((proj) => (
          <div key={proj.id} className="space-y-3 rounded-md border border-border p-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Project name">
                <Input value={proj.name} onChange={(e) => patchList<ProjectItem>("projects", proj.id, { name: e.target.value })} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea rows={2} value={proj.description} onChange={(e) => patchList<ProjectItem>("projects", proj.id, { description: e.target.value })} />
            </Field>
            <Field label="Tech stack (comma separated)">
              <TechStackInput
                value={proj.techStack}
                onChange={(v) => patchList<ProjectItem>("projects", proj.id, { techStack: v })}
              />
            </Field>
            <Field label="Highlights (one per line)">
              <Textarea
                rows={2}
                value={proj.highlights.join("\n")}
                onChange={(e) => patchList<ProjectItem>("projects", proj.id, { highlights: e.target.value.split("\n") })}
              />
            </Field>
            <Button variant="ghost" size="sm" onClick={() => removeFrom("projects", proj.id)}>
              <Trash2 className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            update("projects", [...resume.projects, { id: uid(), name: "", description: "", techStack: [], highlights: [] }])
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Add project
        </Button>
      </Section>

      <Section title="Education">
        {resume.education.map((edu) => (
          <div key={edu.id} className="flex items-end gap-2">
            <Field label="Degree">
              <Input value={edu.degree} onChange={(e) => patchList<EducationItem>("education", edu.id, { degree: e.target.value })} />
            </Field>
            <Field label="School">
              <Input value={edu.school} onChange={(e) => patchList<EducationItem>("education", edu.id, { school: e.target.value })} />
            </Field>
            <Field label="Year">
              <Input value={edu.year} onChange={(e) => patchList<EducationItem>("education", edu.id, { year: e.target.value })} />
            </Field>
            <Button variant="ghost" size="icon" onClick={() => removeFrom("education", edu.id)} aria-label="Remove education">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => update("education", [...resume.education, { id: uid(), degree: "", school: "", year: "" }])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add education
        </Button>
      </Section>
    </div>
  );
}
