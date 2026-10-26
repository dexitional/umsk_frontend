import moment from "moment";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { HiArrowLongRight, HiOutlineClipboard, HiOutlineCodeBracket, HiOutlineGlobeAlt, HiXMark } from "react-icons/hi2";
import { quietButton } from "../management/ManagementUI";
import { CATEGORY_META, CHANGE_STYLE, changeType, fieldLabel, formatValue, humanize, initials } from "./logMeta";

type Props = { log: any | null; onClose: () => void };

const RECORD_PAGE = 25;

function Person({ label, name, tag }: { label: string; name?: string | null; tag?: string | null }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary-dark via-primary to-secondary-accent text-white text-xs font-bold flex items-center justify-center shadow-sm shadow-blue-900/20">
        {initials(name, tag ? tag.slice(0, 2).toUpperCase() : "—")}
      </div>
      <div className="min-w-0">
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
        <span className="block text-sm font-semibold text-slate-900 truncate">{name || tag || "—"}</span>
        {name && tag ? <span className="block text-xs text-slate-500 font-mono truncate">{tag}</span> : null}
      </div>
    </div>
  );
}

function RecordCard({ record, kind }: { record: any; kind: "created" | "updated" | "deleted" | null }) {
  const style = kind ? CHANGE_STYLE[kind] : null;
  const changes = record?.changes ? Object.entries(record.changes) as [string, any][] : null;
  const values = Object.entries(record || {}).filter(([k]) => k !== "changes");
  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div className={`px-4 py-2.5 flex items-center justify-between gap-3 ${style?.row || "bg-gradient-to-r from-blue-50/80 to-white"}`}>
        <span className="text-xs font-semibold text-slate-700 truncate">
          {[record?.indexno, record?.courseId, record?.narrative, record?.transtag].filter(Boolean).join(" · ") || "Record"}
        </span>
        {record?.id ? <span className="text-[0.65rem] font-mono text-slate-400 truncate">{String(record.id).slice(0, 8)}…</span> : null}
      </div>
      {changes ? (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[0.62rem] uppercase tracking-[0.12em] text-primary/60">
              <th className="px-4 pt-2.5 pb-1.5 font-semibold">Field</th>
              <th className="px-2 pt-2.5 pb-1.5 font-semibold">Before</th>
              <th className="w-6" />
              <th className="px-2 pt-2.5 pb-1.5 font-semibold">After</th>
            </tr>
          </thead>
          <tbody>
            {changes.map(([field, c]) => (
              <tr key={field} className="border-t border-blue-50">
                <td className="px-4 py-2 font-medium text-slate-700">{fieldLabel(field)}</td>
                <td className="px-2 py-2"><span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 font-mono tabular-nums line-through decoration-rose-300">{formatValue(c?.from)}</span></td>
                <td className="text-blue-300"><HiArrowLongRight className="h-4 w-4" /></td>
                <td className="px-2 py-2"><span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-semibold tabular-nums">{formatValue(c?.to)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <dl className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {values.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-primary/60">{fieldLabel(k)}</dt>
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
  const records: any[] = meta?.table && Array.isArray(meta.records) ? meta.records.filter(Boolean) : [];
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
        className={`absolute inset-y-0 right-0 w-full max-w-xl bg-gradient-to-b from-slate-50 to-blue-50/40 shadow-2xl shadow-blue-950/20 flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {log ? (
          <>
            <header className="relative isolate overflow-hidden border-b border-blue-100 bg-gradient-to-br from-white via-blue-50 to-sky-100 px-6 pt-6 pb-5 text-primary">
              <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-sky-300/30 to-transparent" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-20 h-56 w-56 rounded-full border border-blue-200/50 bg-white/30" />
              <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 h-9 w-9 rounded-xl flex items-center justify-center text-primary/60 hover:text-primary hover:bg-white/70">
                <HiXMark className="h-5 w-5" />
              </button>
              <div className="relative space-y-3 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-200 bg-white/70 text-[0.68rem] font-semibold text-primary">
                    <cat.Icon className="h-3.5 w-3.5" /> {cat.label}
                  </span>
                  {kind ? <span className={`px-2.5 py-1 rounded-full text-[0.68rem] font-bold ring-1 ring-inset ${CHANGE_STYLE[kind].chip}`}>{CHANGE_STYLE[kind].label}</span> : null}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-primary">{humanize(log.action)}</h2>
                <p className="text-xs text-slate-500 font-mono">{log.action}</p>
                <p className="text-sm text-slate-600">
                  {moment(log.createdAt).format("dddd, MMMM D YYYY · h:mm:ss A")} <span className="text-slate-400">({moment(log.createdAt).fromNow()})</span>
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <section className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 shadow-sm">
                <Person label="Performed by" name={log.userName} tag={log.user} />
                <Person label="Student" name={log.studentName} tag={log.student} />
              </section>

              {request ? (
                <section className="p-4 rounded-2xl border border-blue-100 bg-white shadow-sm flex items-start gap-3">
                  <HiOutlineGlobeAlt className="h-5 w-5 text-secondary-accent shrink-0 mt-0.5" />
                  <div className="min-w-0 text-xs space-y-1">
                    <div><span className="px-1.5 py-0.5 rounded bg-primary text-white font-mono font-bold">{request.method}</span> <span className="font-mono text-slate-700 break-all">{request.path}</span></div>
                    <div className="text-slate-500">From IP <span className="font-mono text-slate-600">{request.ip || "—"}</span></div>
                  </div>
                </section>
              ) : null}

              {records.length ? (
                <section className="space-y-3">
                  <div className="flex items-end justify-between">
                    <h3 className="text-sm font-bold text-primary">Affected records <span className="text-slate-500 font-semibold">({meta.count ?? records.length})</span></h3>
                    <span className="text-[0.68rem] font-mono text-slate-500">{meta.table} · {meta.operation}</span>
                  </div>
                  {records.slice(0, shown).map((r, i) => <RecordCard key={r.id || i} record={r} kind={kind} />)}
                  {records.length > shown ? (
                    <button onClick={() => setShown(shown + RECORD_PAGE)} className={`${quietButton} w-full`}>
                      Show {Math.min(RECORD_PAGE, records.length - shown)} more of {records.length - shown} remaining
                    </button>
                  ) : null}
                </section>
              ) : null}

              <section className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between">
                  <button onClick={() => setRawOpen(!rawOpen)} className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
                    <HiOutlineCodeBracket className="h-4 w-4" /> {rawOpen ? "Hide" : "Show"} raw data
                  </button>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(raw); toast.success("Copied log JSON"); }}
                    className="h-8 px-3 rounded-lg text-xs font-semibold text-primary/70 hover:bg-blue-50 hover:text-primary flex items-center gap-1.5"
                  >
                    <HiOutlineClipboard className="h-4 w-4" /> Copy
                  </button>
                </div>
                {rawOpen ? <pre className="mx-4 mb-4 p-3 rounded-xl bg-blue-50/50 border border-blue-100 max-h-96 overflow-auto text-[0.7rem] leading-relaxed font-mono text-slate-600 whitespace-pre-wrap break-all">{raw}</pre> : null}
              </section>

              <p className="text-[0.68rem] text-slate-500 font-mono">Log ID {log.id}</p>
            </div>
          </>
        ) : null}
      </aside>
    </div>,
    document.body
  );
}

export default LogDetailDrawer;
