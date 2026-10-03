import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowPath,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentCheck,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineQueueList,
  HiOutlineShieldCheck,
  HiOutlineSignal,
  HiOutlineUsers,
  HiXMark,
} from "react-icons/hi2";
import { useLoaderData, useNavigation, useRevalidator, useSearchParams } from "react-router-dom";
import LogActivityChart from "../../components/log/LogActivityChart";
import LogDetailDrawer from "../../components/log/LogDetailDrawer";
import { CATEGORY_META, CATEGORY_ORDER, CHANGE_STYLE, changeType, humanize, initials, summarize } from "../../components/log/logMeta";
import LogService from "../../utils/logService";

const FILTER_KEYS = ["keyword", "category", "action", "user", "student", "from", "to"] as const;
const PAGE_SIZES = [25, 50, 100];

export async function loader({ request }) {
  const sp = new URL(request.url).searchParams;
  const q: any = Object.fromEntries(FILTER_KEYS.map((k) => [k, sp.get(k) || ""]));
  q.page = sp.get("page") || 1;
  q.pageSize = sp.get("size") || 25;
  const logId = sp.get("log");
  try {
    const [logs, summary, single] = await Promise.all([
      LogService.fetchLogs(q),
      LogService.fetchSummary(),
      logId ? LogService.fetchLog(logId).catch(() => null) : Promise.resolve(null),
    ]);
    return { logs, summary, single, error: null };
  } catch (e: any) {
    const status = e?.response?.status;
    return { logs: null, summary: null, single: null, error: status === 403 ? "You don't have permission to view logs (audit::admin required)." : "Logs could not be loaded. Please try again." };
  }
}

function Tile({ label, value, sub, Icon, tint }: { label: string; value: React.ReactNode; sub?: React.ReactNode; Icon: any; tint: string }) {
  return (
    <div className="aisp-rise aisp-card p-5 flex items-start gap-4">
      <div className={`h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg ${tint}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
        <span className="block mt-1 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums">{value}</span>
        {sub ? <div className="mt-1 text-xs text-slate-400">{sub}</div> : null}
      </div>
    </div>
  );
}

function PgLogs() {
  const { logs, summary, single, error }: any = useLoaderData();
  const [params, setParams] = useSearchParams();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const loading = navigation.state === "loading" || revalidator.state === "loading";
  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const [selected, setSelected] = useState<any>(null);
  useEffect(() => setKeyword(params.get("keyword") || ""), [params]);

  // Deep link (?log=<id>): open that entry once loaded.
  useEffect(() => {
    const id = params.get("log");
    if (!id) return;
    const row = logs?.data?.find((r: any) => r.id === id) || single;
    if (row) setSelected(row);
  }, [single, logs]);

  const update = (patch: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (resetPage) next.delete("page");
    setParams(next);
  };
  const openLog = (row: any) => { setSelected(row); const n = new URLSearchParams(params); n.set("log", row.id); setParams(n, { replace: true, preventScrollReset: true }); };
  const closeLog = () => { setSelected(null); const n = new URLSearchParams(params); n.delete("log"); setParams(n, { replace: true, preventScrollReset: true }); };

  if (error) {
    return (
      <div className="mx-auto max-w-lg mt-24 px-6 text-center space-y-3">
        <HiOutlineShieldCheck className="mx-auto h-10 w-10 text-slate-300" />
        <p className="text-sm text-slate-600">{error}</p>
        <button onClick={() => revalidator.revalidate()} className="aisp-btn-soft inline-flex"><HiOutlineArrowPath className="h-4 w-4" /> Retry</button>
      </div>
    );
  }

  const category = params.get("category") || "";
  const page = Number(params.get("page") || 1);
  const size = Number(params.get("size") || 25);
  const total = logs?.totalData || 0;
  const pages = logs?.totalPages || 0;
  const rows: any[] = logs?.data || [];
  const actions = (summary?.actions || []).filter((a: any) => !category || a.category === category);
  const activeChips = (["user", "student", "action"] as const).filter((k) => params.get(k));
  const anyFilter = FILTER_KEYS.some((k) => params.get(k));
  const a = summary?.assessment || { created: 0, updated: 0, deleted: 0 };
  const maxUser = Math.max(...(summary?.topUsers || []).map((u: any) => u.count), 1);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8">
      {/* Header */}
      <section className="aisp-rise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-sky-700 text-white shadow-xl shadow-slate-900/20">
        <div className="pointer-events-none absolute inset-0 aisp-grid [mask-image:linear-gradient(to_right,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-24 -right-10 h-72 w-72 rounded-full bg-sky-400/30 blur-3xl" />
        <div className="relative px-6 py-7 md:px-9 md:py-9 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-12 w-12 shrink-0 rounded-2xl bg-white/[0.15] ring-1 ring-inset ring-white/25 items-center justify-center">
              <HiOutlineShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="block mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-200">Log Module</span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Audit & Activity Logs</h1>
              <p className="mt-1.5 max-w-2xl text-sm text-sky-100/80">Every recorded action across the system — logins, student and course changes, and a full audit trail of assessment records.</p>
            </div>
          </div>
          <button onClick={() => revalidator.revalidate()} className="aisp-btn-glass w-fit">
            <HiOutlineArrowPath className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Tile label="Total events" value={(summary?.total ?? 0).toLocaleString()} sub="All time" Icon={HiOutlineQueueList} tint="from-slate-600 to-slate-800 shadow-slate-500/30" />
        <Tile label="Today" value={(summary?.today ?? 0).toLocaleString()} sub={moment().format("dddd, MMM D")} Icon={HiOutlineSignal} tint="from-sky-500 to-primary shadow-primary/30" />
        <Tile label="Last 7 days" value={(summary?.last7 ?? 0).toLocaleString()} sub="Including today" Icon={HiOutlineCalendarDays} tint="from-sky-400 to-blue-600 shadow-sky-500/30" />
        <Tile
          label="Assessment changes"
          value={(a.created + a.updated + a.deleted).toLocaleString()}
          sub={
            <span className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="text-emerald-600 font-semibold">{a.created.toLocaleString()} created</span>
              <span className="text-amber-600 font-semibold">{a.updated.toLocaleString()} updated</span>
              <span className="text-rose-600 font-semibold">{a.deleted.toLocaleString()} deleted</span>
            </span>
          }
          Icon={HiOutlineClipboardDocumentCheck}
          tint="from-emerald-400 to-teal-600 shadow-emerald-500/30"
        />
      </div>

      {/* Activity + top users */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <section className="aisp-rise aisp-card p-5 md:p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100 flex items-center justify-center"><HiOutlineChartBar className="h-[1.1rem] w-[1.1rem]" /></div>
            <div>
              <h2 className="text-[0.95rem] font-bold text-slate-900">Activity · last 14 days</h2>
              <p className="text-xs text-slate-400">Events recorded per day — hover or focus a column for details</p>
            </div>
          </div>
          {summary?.daily ? <LogActivityChart days={summary.daily} /> : null}
        </section>
        <section className="aisp-rise aisp-card p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100 flex items-center justify-center"><HiOutlineUsers className="h-[1.1rem] w-[1.1rem]" /></div>
            <div>
              <h2 className="text-[0.95rem] font-bold text-slate-900">Most active</h2>
              <p className="text-xs text-slate-400">Users by events, last 30 days</p>
            </div>
          </div>
          <ul className="space-y-3">
            {(summary?.topUsers || []).map((u: any) => (
              <li key={u.user}>
                <button onClick={() => update({ user: u.user })} className="w-full text-left group">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="h-7 w-7 shrink-0 rounded-lg bg-slate-100 text-slate-600 text-[0.65rem] font-bold flex items-center justify-center">{initials(u.name, String(u.user).slice(0, 2).toUpperCase())}</span>
                      <span className="truncate font-medium text-slate-700 group-hover:text-slate-900">{u.name || u.user}</span>
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">{u.count.toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 ml-9 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-sky-500/70 group-hover:bg-sky-500" style={{ width: `${(u.count / maxUser) * 100}%` }} />
                  </div>
                </button>
              </li>
            ))}
            {!summary?.topUsers?.length ? <li className="text-sm text-slate-400">No activity in the last 30 days.</li> : null}
          </ul>
        </section>
      </div>

      {/* Explorer */}
      <section className="aisp-rise aisp-card overflow-hidden">
        {/* Category tabs */}
        <div className="px-4 md:px-6 pt-5 flex gap-2 overflow-x-auto scrollbar-hide">
          {["", ...CATEGORY_ORDER].map((c) => {
            const meta = c ? CATEGORY_META[c] : null;
            const count = c ? summary?.categories?.[c] || 0 : summary?.total || 0;
            if (c && !count) return null;
            const active = category === c;
            return (
              <button
                key={c || "all"}
                onClick={() => update({ category: c || null, action: null })}
                className={`shrink-0 h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${active ? "bg-slate-900 text-white shadow" : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"}`}
              >
                {meta ? <meta.Icon className="h-4 w-4" /> : <HiOutlineQueueList className="h-4 w-4" />}
                {meta ? meta.label : "All events"}
                <span className={`px-1.5 rounded-md text-[0.68rem] tabular-nums ${active ? "bg-white/15" : "bg-white text-slate-500"}`}>{count.toLocaleString()}</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 border-b border-slate-100">
          <form className="md:col-span-5 relative" onSubmit={(e) => { e.preventDefault(); update({ keyword: keyword.trim() || null }); }}>
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search action, user or student — press Enter" className="aisp-input pl-10" />
          </form>
          <select value={params.get("action") || ""} onChange={(e) => update({ action: e.target.value || null })} className="aisp-input md:col-span-3">
            <option value="">All actions</option>
            {actions.map((x: any) => <option key={x.action} value={x.action}>{humanize(x.action)} ({x.count.toLocaleString()})</option>)}
          </select>
          <input type="date" aria-label="From date" value={params.get("from") || ""} onChange={(e) => update({ from: e.target.value || null })} className="aisp-input md:col-span-2" />
          <input type="date" aria-label="To date" value={params.get("to") || ""} onChange={(e) => update({ to: e.target.value || null })} className="aisp-input md:col-span-2" />
        </div>

        {/* Active filter chips */}
        {anyFilter ? (
          <div className="px-4 md:px-6 py-3 flex flex-wrap items-center gap-2 bg-slate-50/60 border-b border-slate-100">
            <HiOutlineFunnel className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 mr-1">{total.toLocaleString()} matching</span>
            {activeChips.map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5 pl-2.5 pr-1 h-7 rounded-full bg-white ring-1 ring-inset ring-slate-200 text-xs font-medium text-slate-700">
                {k}: <span className="font-mono">{k === "action" ? humanize(params.get(k) || "") : params.get(k)}</span>
                <button onClick={() => update({ [k]: null })} aria-label={`Remove ${k} filter`} className="h-5 w-5 rounded-full hover:bg-slate-100 flex items-center justify-center"><HiXMark className="h-3.5 w-3.5" /></button>
              </span>
            ))}
            <button onClick={() => { const n = new URLSearchParams(); if (params.get("size")) n.set("size", params.get("size")!); setParams(n); }} className="ml-auto text-xs font-semibold text-sky-700 hover:text-sky-800">Clear all filters</button>
          </div>
        ) : null}

        {/* Results */}
        <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/80 border-b border-slate-100 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <div className="col-span-2">Time</div>
            <div className="col-span-3">Event</div>
            <div className="col-span-2">Performed by</div>
            <div className="col-span-2">Student</div>
            <div className="col-span-3">Details</div>
          </div>
          {rows.map((r) => {
            const meta = CATEGORY_META[r.category] || CATEGORY_META.other;
            const kind = changeType(r.action);
            return (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => openLog(r)}
                onKeyDown={(e) => e.key === "Enter" && openLog(r)}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-4 md:px-6 py-3.5 border-b border-slate-100 last:border-0 cursor-pointer transition-colors hover:bg-sky-50/40 focus-visible:bg-sky-50/60 outline-none"
              >
                <div className="lg:col-span-2 text-xs text-slate-500" title={moment(r.createdAt).format("LLLL")}>
                  <span className="block font-semibold text-slate-700">{moment(r.createdAt).fromNow()}</span>
                  <span className="block tabular-nums">{moment(r.createdAt).format("MMM D, YYYY · HH:mm:ss")}</span>
                </div>
                <div className="lg:col-span-3 flex items-center gap-3 min-w-0">
                  <span className={`h-9 w-9 shrink-0 rounded-xl ring-1 ring-inset flex items-center justify-center ${meta.chip}`}><meta.Icon className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900 truncate">{humanize(r.action)}</span>
                    <span className="flex items-center gap-1.5 mt-0.5">
                      {kind ? <span className={`px-1.5 rounded text-[0.6rem] font-bold uppercase tracking-wide ring-1 ring-inset ${CHANGE_STYLE[kind].chip}`}>{CHANGE_STYLE[kind].label}</span> : null}
                      <span className="text-[0.68rem] text-slate-400">{meta.label}</span>
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-2 min-w-0 flex items-center gap-2">
                  {r.user ? (
                    <button onClick={(e) => { e.stopPropagation(); update({ user: r.user }); }} title="Show only this user" className="flex items-center gap-2 min-w-0 text-left hover:underline decoration-slate-300">
                      <span className="h-7 w-7 shrink-0 rounded-lg bg-slate-100 text-slate-600 text-[0.62rem] font-bold flex items-center justify-center">{initials(r.userName, String(r.user).slice(0, 2).toUpperCase())}</span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-slate-800 truncate">{r.userName || r.user}</span>
                        {r.userName ? <span className="block text-[0.65rem] text-slate-400 font-mono truncate">{r.user}</span> : null}
                      </span>
                    </button>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </div>
                <div className="lg:col-span-2 min-w-0">
                  {r.student ? (
                    <button onClick={(e) => { e.stopPropagation(); update({ student: r.student }); }} title="Show only this student" className="text-left min-w-0 hover:underline decoration-slate-300">
                      <span className="block text-xs font-semibold text-slate-800 truncate">{r.studentName || r.student}</span>
                      {r.studentName ? <span className="block text-[0.65rem] text-slate-400 font-mono truncate">{r.student}</span> : null}
                    </button>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </div>
                <div className="lg:col-span-3 flex items-center justify-between gap-3 min-w-0">
                  <span className="text-xs text-slate-500 truncate">{summarize(r) || "—"}</span>
                  <HiChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-sky-600 transition" />
                </div>
              </div>
            );
          })}
          {!rows.length ? (
            <div className="py-16 text-center">
              <HiOutlineQueueList className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">No logs match these filters</p>
              {anyFilter ? <button onClick={() => setParams(new URLSearchParams())} className="mt-2 text-xs font-semibold text-sky-700">Clear all filters</button> : null}
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {total ? (
          <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing <b className="text-slate-800">{((page - 1) * size + 1).toLocaleString()}–{Math.min(page * size, total).toLocaleString()}</b> of <b className="text-slate-800">{total.toLocaleString()}</b>
            </span>
            <div className="flex items-center gap-2">
              <select value={size} onChange={(e) => update({ size: e.target.value })} aria-label="Rows per page" className="h-9 pl-3 pr-8 rounded-xl border-0 ring-1 ring-inset ring-slate-200 bg-white text-xs font-semibold text-slate-600">
                {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
              </select>
              <button disabled={page <= 1} onClick={() => update({ page: String(page - 1) }, false)} aria-label="Previous page" className="h-9 w-9 rounded-xl bg-white ring-1 ring-inset ring-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"><HiChevronLeft className="h-4 w-4" /></button>
              <span className="text-xs font-semibold text-slate-600 tabular-nums px-1">Page {page} of {pages}</span>
              <button disabled={page >= pages} onClick={() => update({ page: String(page + 1) }, false)} aria-label="Next page" className="h-9 w-9 rounded-xl bg-white ring-1 ring-inset ring-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"><HiChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        ) : null}
      </section>

      <LogDetailDrawer log={selected} onClose={closeLog} />
    </div>
  );
}

export default PgLogs;
