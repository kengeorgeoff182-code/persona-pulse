import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';

const ResumeHeader: React.FC = () => {
  const { resume, customization, editMode, updateField } = useResume();
  const isGlow = customization.theme === 'cyberpunk' || customization.theme === 'hacker';

  const accentBorder = customization.accentStyle === 'border'
    ? { borderLeft: '4px solid hsl(var(--resume-accent))', paddingLeft: '1rem' }
    : customization.accentStyle === 'underline'
      ? { borderBottom: '2px solid hsl(var(--resume-accent))', paddingBottom: '1rem' }
      : {};

  return (
    <div style={accentBorder} className={isGlow && customization.accentStyle === 'glow' ? 'glow-text' : ''}>
      {editMode ? (
        <input
          value={resume.name}
          onChange={e => updateField('name', e.target.value)}
          className="text-3xl font-bold bg-transparent border-b-2 border-dashed border-primary/40 outline-none w-full"
          style={{ color: 'hsl(var(--resume-heading))' }}
          placeholder="Your Name"
        />
      ) : (
        <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--resume-heading))' }}>
          {customization.theme === 'hacker' ? `> ${resume.name}` : resume.name}
        </h1>
      )}

      {editMode ? (
        <input
          value={resume.title}
          onChange={e => updateField('title', e.target.value)}
          className="text-lg mt-1 bg-transparent border-b-2 border-dashed border-primary/40 outline-none w-full"
          style={{ color: 'hsl(var(--resume-accent))' }}
          placeholder="Your Title"
        />
      ) : (
        <p className="text-lg mt-1" style={{ color: 'hsl(var(--resume-accent))' }}>
          {customization.theme === 'hacker' ? `$ ${resume.title}` : resume.title}
        </p>
      )}

      {editMode ? (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <EditInput icon={<Mail className="w-3.5 h-3.5" />} value={resume.email} onChange={v => updateField('email', v)} placeholder="Email" />
          <EditInput icon={<Phone className="w-3.5 h-3.5" />} value={resume.phone || ''} onChange={v => updateField('phone', v)} placeholder="Phone" />
          <EditInput icon={<MapPin className="w-3.5 h-3.5" />} value={resume.location || ''} onChange={v => updateField('location', v)} placeholder="Location" />
          <EditInput icon={<Globe className="w-3.5 h-3.5" />} value={resume.website || ''} onChange={v => updateField('website', v)} placeholder="Website" />
          <EditInput icon={<Github className="w-3.5 h-3.5" />} value={resume.github || ''} onChange={v => updateField('github', v)} placeholder="GitHub URL" />
          <EditInput icon={<Linkedin className="w-3.5 h-3.5" />} value={resume.linkedin || ''} onChange={v => updateField('linkedin', v)} placeholder="LinkedIn URL" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {resume.email && <ContactItem icon={<Mail className="w-3.5 h-3.5" />} text={resume.email} href={`mailto:${resume.email}`} />}
          {resume.phone && <ContactItem icon={<Phone className="w-3.5 h-3.5" />} text={resume.phone} />}
          {resume.location && <ContactItem icon={<MapPin className="w-3.5 h-3.5" />} text={resume.location} />}
          {resume.website && <ContactItem icon={<Globe className="w-3.5 h-3.5" />} text="Website" href={resume.website} />}
          {resume.github && <ContactItem icon={<Github className="w-3.5 h-3.5" />} text="GitHub" href={resume.github} />}
          {resume.linkedin && <ContactItem icon={<Linkedin className="w-3.5 h-3.5" />} text="LinkedIn" href={resume.linkedin} />}
        </div>
      )}
    </div>
  );
};

const EditInput: React.FC<{ icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder: string }> = ({ icon, value, onChange, placeholder }) => (
  <div className="flex items-center gap-1.5">
    <span style={{ color: 'hsl(var(--resume-accent))' }}>{icon}</span>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none flex-1"
      style={{ color: 'hsl(var(--resume-muted))' }}
    />
  </div>
);

const ContactItem: React.FC<{ icon: React.ReactNode; text: string; href?: string }> = ({ icon, text, href }) => {
  const inner = (
    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>
      <span style={{ color: 'hsl(var(--resume-accent))' }}>{icon}</span>
      {text}
    </span>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">{inner}</a> : inner;
};

export default ResumeHeader;
