import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Props = {
  label: string;
  value: string;
  onChange: (html: string) => void;
  // Submitted with a router <Form> when given (hidden input).
  name?: string;
  placeholder?: string;
  rows?: number;
  editorClassName?: string;
  action?: React.ReactNode;
  labelClassName?: string;
};

// Letter text field with an Editor | HTML switch. Both views edit the same
// value; HTML mode shows the raw markup so it can be pasted or fine-tuned.
// The rich editor keeps only the formatting it supports, so custom HTML
// (e.g. inline styles or tables) is best edited and saved in HTML mode.
function RichHtmlField({ label, value, onChange, name, placeholder, rows = 14, editorClassName = "", action, labelClassName = "text-sm md:text-base text-gray-500 font-medium" }: Props) {
  const [mode, setMode] = useState<"editor" | "html">("editor");
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={labelClassName}>{label}</span>
        <div className="flex items-center gap-3">
          {action}
          <div className="flex rounded-md bg-slate-100 p-0.5 text-xs font-semibold" role="tablist" aria-label={`${label} view`}>
            {(["editor", "html"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`rounded px-2.5 py-1 ${mode === m ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {m === "editor" ? "Editor" : "HTML"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      {mode === "editor" ? (
        <ReactQuill theme="snow" value={value} onChange={onChange} placeholder={placeholder} className={`bg-white ${editorClassName}`} />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          spellCheck={false}
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs leading-relaxed text-slate-700 focus:border-slate-300 focus:ring-0"
        />
      )}
    </div>
  );
}

export default RichHtmlField;
