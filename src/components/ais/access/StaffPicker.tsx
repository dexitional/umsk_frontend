import React, { useEffect, useRef, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import Service from "../../../utils/aisService";
import { initials, photoUrl } from "./accessUtil";

type Picked = { tag: string; name: string; detail?: string };
type Props = {
  placeholder?: string;
  onPick: (staff: Picked) => void;
  autoFocus?: boolean;
  exclude?: string[];
};

// Type-ahead staff search (by staff number, name, phone or email).
function StaffPicker({ placeholder = "Search staff by name or staff no…", onPick, autoFocus, exclude = [] }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Picked[]>([]);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    const mine = ++seq.current;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const res: any = await Service.fetchStaffs(term, 1, 8);
        if (mine !== seq.current) return;
        setResults(
          (res?.data || [])
            .filter((s: any) => !exclude.includes(s.staffNo))
            .map((s: any) => ({
              tag: s.staffNo,
              name: [s.fname, s.mname, s.lname].filter(Boolean).join(" "),
              detail: [s.job?.title, s.unit?.title].filter(Boolean).join(" · "),
            }))
        );
      } catch {
        if (mine === seq.current) setResults([]);
      } finally {
        if (mine === seq.current) setBusy(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
        <HiOutlineMagnifyingGlass className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent px-0 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0"
        />
        {busy ? <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-primary/60" /> : null}
      </div>
      {q.trim().length >= 2 && !busy ? (
        <div className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {results.length ? (
            results.map((r) => (
              <button
                type="button"
                key={r.tag}
                onClick={() => {
                  onPick(r);
                  setQ("");
                  setResults([]);
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
              >
                <Avatar tag={r.tag} name={r.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-700">{r.name}</span>
                  <span className="block truncate text-xs text-slate-400">
                    {r.tag}
                    {r.detail ? ` · ${r.detail}` : ""}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-xs text-slate-400">No staff found for “{q.trim()}”.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

// Photo with an initials fallback.
export function Avatar({ tag, name, size = "md", rounded = "rounded-full" }: { tag?: string; name?: string; size?: "sm" | "md" | "lg"; rounded?: string }) {
  const [failed, setFailed] = useState(false);
  const dim = size === "lg" ? "h-14 w-14 text-base" : size === "sm" ? "h-7 w-7 text-[0.6rem]" : "h-10 w-10 text-xs";
  return failed || !tag ? (
    <span className={`${dim} flex shrink-0 items-center justify-center ${rounded} bg-primary/10 font-semibold text-primary`}>{initials(name, tag)}</span>
  ) : (
    <img crossOrigin="anonymous" src={photoUrl(tag)} onError={() => setFailed(true)} className={`${dim} shrink-0 ${rounded} border border-slate-200 bg-slate-100 object-cover`} alt="" />
  );
}

export default StaffPicker;
