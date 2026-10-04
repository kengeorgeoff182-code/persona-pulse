import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

/**
 * Comma-separated tag input that never eats keystrokes.
 * The raw text (including commas, spaces, tabs) lives in local state while
 * typing; it is only split into tags on Enter or when the field loses focus.
 */
export default function TechStackInput({ value, onChange, placeholder }: Props) {
  const [text, setText] = useState(value.join(", "));
  const focused = useRef(false);

  // Sync external changes in only while the user is not typing.
  useEffect(() => {
    if (!focused.current) setText(value.join(", "));
  }, [value]);

  const commit = (raw: string) => {
    const items = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(items);
    setText(items.join(", "));
  };

  const removeTag = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    setText(next.join(", "));
  };

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={text}
        placeholder={placeholder ?? "e.g. React, Node.js, PostgreSQL"}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => {
          focused.current = false;
          commit(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.target as HTMLInputElement).value);
          }
        }}
      />
      <p className="text-xs text-muted-foreground">Separate items with commas — press Enter or click away to apply.</p>
    </div>
  );
}
