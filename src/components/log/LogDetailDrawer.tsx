import moment from "moment";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { HiArrowLongRight, HiOutlineClipboard, HiOutlineCodeBracket, HiOutlineGlobeAlt, HiXMark } from "react-icons/hi2";
import { CATEGORY_META, CHANGE_STYLE, changeType, fieldLabel, formatValue, humanize, initials } from "./logMeta";

type Props = { log: any | null; onClose: () => void };

const RECORD_PAGE = 25;

function Person({ label, name, tag }: { label: string; name?: string | null; tag?: string | null }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-primary text-white text-xs font-bold flex items-center justify-center">
        {initials(name, tag ? tag.slice(0, 2).toUpperCase() : "—")}
      </div>
      <div className="min-w-0">
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
        <span className="block text-sm font-semibold text-slate-900 truncate">{name || tag || "—"}</span>
        {name && tag ? <span className="block text-xs text-slate-400 font-mono truncate">{tag}</span> : null}
      </div>
    </div>
  );
}

function RecordCard({ record, kind }: { record: any; kind: "created" | "updated" | "deleted" | null }) {
  const style = kind ? CHANGE_STYLE[kind] : null;
  const changes = record?.changes ? Object.entries(record.changes) as [string, any][] : null;
  const values = Object.entries(record || {}).filter(([k]) => k !== "changes");
  return (
    <div className="rounded-2xl ring-1 ring-inset ring-slate-200 bg-white overflow-hidden">
      <div className={`px-4 py-2.5 flex items-center justify-between gap-3 ${style?.row || "bg-slate-50"}`}>
        <span className="text-xs font-semibold text-slate-700 truncate">
          {[record?.indexno, record?.courseId].filter(Boolean).join(" · ") || "Record"}
        </span>
        {record?.id ? <span className="text-[0.65rem] font-mono text-slate-400 truncate">{String(record.id).slice(0, 8)}…</span> : null}
      </div>
      {changes ? (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[0.62rem] uppercase tracking-[0.12em] text-slate-400">
              <th className="px-4 pt-2.5 pb-1.5 font-semibold">Field</th>
              <th className="px-2 pt-2.5 pb-1.5 font-semibold">Before</th>
              <th className="w-6" />
              <th className="px-2 pt-2.5 pb-1.5 font-semibold">After</th>
            </tr>
          </thead>
          <tbody>
            {changes.map(([field, c]) => (
              <tr key={field} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-700">{fieldLabel(field)}</td>
                <td className="px-2 py-2"><span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 font-mono tabular-nums line-through decoration-rose-300">{formatValue(c?.from)}</span></td>
                <td className="text-slate-300"><HiArrowLongRight className="h-4 w-4" /></td>
                <td className="px-2 py-2"><span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-semibold tabular-nums">{formatValue(c?.to)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <dl className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {values.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-slate-400">{fieldLabel(k)}</dt>
              <dd className={`text-xs font-mono truncate ${kind === "deleted" ? "text-rose-700" : "text-slate-800"}`} title={formatValue(v)}>{formatValue(v)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function LogDetailDrawer({ log, onClose }: Props) {
  const [shown, setShown] = useState(RECORD_PAGE);
  const [rawOpen, setRawOpen] = useState(false);
  useEffect(() => { setShown(RECORD_PAGE); setRawOpen(false); }, [log?.id]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = !!log;
  const cat = CATEGORY_META[log?.category] || CATEGORY_META.other;
  const kind = log ? changeType(log.action) : null;
  const meta = log?.meta;
  const records: any[] = meta?.table === "ais_assessment" && Array.isArray(meta.records) ? meta.records : [];
  const request = meta?.request;
  const raw = JSON.stringify(meta, null, 2);

  // Portalled to <body>: an ancestor in the page layout acts as the
  // containing block for fixed elements, which pushed the drawer down under
  // the app header.
  return createPortal(
    <div className={`fixed inset-0 z-[100] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Log details"
        className={`absolute inset-y-0 right-0 w-full max-w-xl bg-[#f8fafc] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {log ? (
          <>
            <header className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-secondary via-primary to-sky-800 text-white overflow-hidden">
              <div className="pointer-events-none absolute inset-0 aisp-grid opacity-60" />
              <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10">
                <HiXMark className="h-5 w-5" />
              </button>
              <div className="relative space-y-3 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 ring-1 ring-inset ring-white/20 text-[0.68rem] font-semibold">
                    <cat.Icon className="h-3.5 w-3.5" /> {cat.label}
                  </span>
                  {kind ? <span className={`px-2.5 py-1 rounded-full text-[0.68rem] font-bold ring-1 ring-inset ${CHANGE_STYLE[kind].chip}`}>{CHANGE_STYLE[kind].label}</span> : null}
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">{humanize(log.action)}</h2>
                <p className="text-xs text-white/60 font-mono">{log.action}</p>
                <p className="text-sm text-sky-100/80">
                  {moment(log.createdAt).format("dddd, MMMM D YYYY · h:mm:ss A")} <span className="text-white/40">({moment(log.createdAt).fromNow()})</span>
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <section className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white ring-1 ring-inset ring-slate-200">
                <Person label="Performed by" name={log.userName} tag={log.user} />
                <Person label="Student" name={log.studentName} tag={log.student} />
              </section>

              {request ? (
                <section className="p-4 rounded-2xl bg-white ring-1 ring-inset ring-slate-200 flex items-start gap-3">
                  <HiOutlineGlobeAlt className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 text-xs space-y-1">
                    <div><span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono font-bold">{request.method}</span> <span className="font-mono text-slate-700 break-all">{request.path}</span></div>
                    <div className="text-slate-400">From IP <span className="font-mono text-slate-600">{request.ip || "—"}</span></div>
                  </div>
                </section>
              ) : null}

              {records.length ? (
                <section className="space-y-3">
                  <div className="flex items-end justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Affected records <span className="text-slate-400 font-semibold">({meta.count ?? records.length})</span></h3>
                    <span className="text-[0.68rem] font-mono text-slate-400">{meta.table} · {meta.operation}</span>
                  </div>
                  {records.slice(0, shown).map((r, i) => <RecordCard key={r.id || i} record={r} kind={kind} />)}
                  {records.length > shown ? (
                    <button onClick={() => setShown(shown + RECORD_PAGE)} className="aisp-btn-soft w-full">
                      Show {Math.min(RECORD_PAGE, records.length - shown)} more of {records.length - shown} remaining
                    </button>
                  ) : null}
                </section>
              ) : null}

              <section className="rounded-2xl bg-white ring-1 ring-inset ring-slate-200 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between">
                  <button onClick={() => setRawOpen(!rawOpen)} className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
                    <HiOutlineCodeBracket className="h-4 w-4" /> {rawOpen ? "Hide" : "Show"} raw data
                  </button>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(raw); toast.success("Copied log JSON"); }}
                    className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    <HiOutlineClipboard className="h-4 w-4" /> Copy
                  </button>
                </div>
                {rawOpen ? <pre className="px-4 pb-4 max-h-96 overflow-auto text-[0.7rem] leading-relaxed font-mono text-slate-600 whitespace-pre-wrap break-all">{raw}</pre> : null}
              </section>

              <p className="text-[0.68rem] text-slate-400 font-mono">Log ID {log.id}</p>
            </div>
          </>
        ) : null}
      </aside>
    </div>,
    document.body
  );
}

export default LogDetailDrawer;
