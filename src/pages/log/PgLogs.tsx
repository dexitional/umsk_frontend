import moment from "moment";
import React, { useEffect, useState } from "react";
import {
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
import { PageHero, PageHeroBadge, PageHeroHeading } from "../../components/PageHero";
import { EmptyState, errorNotice, input, Pagination, secondaryButton } from "../../components/management/ManagementUI";
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

// Same icon frame as the page hero, so the module reads as one surface.
const iconFrame = "flex shrink-0 items-center justify-center rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-blue-100 text-primary";
const avatar = "flex shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-gradient-to-br from-white to-blue-50 font-bold text-primary";

function Tile({ label, value, sub, Icon }: { label: string; value: React.ReactNode; sub?: React.ReactNode; Icon: any }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className={`${iconFrame} h-11 w-11`}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</span>
        <span className="mt-1 block text-2xl font-bold tracking-tight text-primary tabular-nums">{value}</span>
        {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
      </div>
    </div>
  );
}

// ManagementPanel's frame (accent bar + tinted header strip), with the body
// left to the caller so the log table can run edge to edge.
function Panel({ title, description, Icon, className = "", children }: { title: string; description?: string; Icon: any; className?: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className={`min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm ${className}`}>
      <div className="h-1 bg-gradient-to-r from-primary-dark via-blue-500 to-cyan-300" />
      <div className="flex items-center gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/70 px-5 py-4 sm:px-6">
        <div className={`${iconFrame} h-10 w-10`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-primary sm:text-lg">{title}</h2>
          {description ? <p className="text-xs text-slate-500">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
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
      <div className="mx-auto mt-24 max-w-lg space-y-4 px-6 text-center">
        <div className={`${iconFrame} mx-auto h-14 w-14`}>
          <HiOutlineShieldCheck aria-hidden="true" className="h-7 w-7" />
        </div>
        <p role="alert" className={errorNotice}>{error}</p>
        <button onClick={() => revalidator.revalidate()} className={secondaryButton}><HiOutlineArrowPath aria-hidden="true" className="h-4 w-4" /> Retry</button>
      </div>
    );
  }

  const category = params.get("category") || "";
  const page = Number(params.get("page") || 1);
  const size = Number(params.get("size") || 25);
  const total = logs?.totalData || 0;
  const rows: any[] = logs?.data || [];
  const actions = (summary?.actions || []).filter((a: any) => !category || a.category === category);
  const activeChips = (["user", "student", "action"] as const).filter((k) => params.get(k));
  const anyFilter = FILTER_KEYS.some((k) => params.get(k));
  const a = summary?.assessment || { created: 0, updated: 0, deleted: 0 };
  const maxUser = Math.max(...(summary?.topUsers || []).map((u: any) => u.count), 1);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:space-y-8 md:px-8 md:py-10">
      <PageHero className="aisp-rise">
        <PageHeroHeading
          eyebrow="Log Module"
          title="Audit & Activity Logs"
          description="Every recorded action across the system: logins, student and course changes, and a full audit trail of assessment records."
          Icon={HiOutlineShieldCheck}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <PageHeroBadge Icon={HiOutlineSignal}>{(summary?.today ?? 0).toLocaleString()} events today</PageHeroBadge>
              <button
                type="button"
                onClick={() => revalidator.revalidate()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm shadow-blue-900/5 hover:bg-blue-50 disabled:opacity-70"
              >
                <HiOutlineArrowPath className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>
          }
        />
      </PageHero>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile label="Total events" value={(summary?.total ?? 0).toLocaleString()} sub="All time" Icon={HiOutlineQueueList} />
        <Tile label="Today" value={(summary?.today ?? 0).toLocaleString()} sub={moment().format("dddd, MMM D")} Icon={HiOutlineSignal} />
        <Tile label="Last 7 days" value={(summary?.last7 ?? 0).toLocaleString()} sub="Including today" Icon={HiOutlineCalendarDays} />
        <Tile
          label="Assessment changes"
          value={(a.created + a.updated + a.deleted).toLocaleString()}
          sub={
            <span className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="font-semibold text-emerald-700">{a.created.toLocaleString()} created</span>
              <span className="font-semibold text-amber-700">{a.updated.toLocaleString()} updated</span>
              <span className="font-semibold text-rose-700">{a.deleted.toLocaleString()} deleted</span>
            </span>
          }
          Icon={HiOutlineClipboardDocumentCheck}
        />
      </div>

      {/* Activity + top users */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <Panel title="Activity · last 14 days" description="Events recorded per day. Hover or focus a column for details." Icon={HiOutlineChartBar} className="lg:col-span-2">
          <div className="p-5 sm:p-6">{summary?.daily ? <LogActivityChart days={summary.daily} /> : null}</div>
        </Panel>
        <Panel title="Most active" description="Users by events, last 30 days" Icon={HiOutlineUsers}>
          <ul className="space-y-3 p-5 sm:p-6">
            {(summary?.topUsers || []).map((u: any) => (
              <li key={u.user}>
                <button onClick={() => update({ user: u.user })} title="Show only this user" className="group w-full text-left">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className={`${avatar} h-7 w-7 text-[0.65rem]`}>{initials(u.name, String(u.user).slice(0, 2).toUpperCase())}</span>
                      <span className="truncate font-medium text-slate-700 group-hover:text-primary">{u.name || u.user}</span>
                    </span>
                    <span className="font-bold text-primary tabular-nums">{u.count.toLocaleString()}</span>
                  </div>
                  <div className="ml-9 mt-1.5 h-1.5 overflow-hidden rounded-full bg-blue-50">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-primary opacity-70 group-hover:opacity-100" style={{ width: `${(u.count / maxUser) * 100}%` }} />
                  </div>
                </button>
              </li>
            ))}
            {!summary?.topUsers?.length ? <li className="text-sm text-slate-500">No activity in the last 30 days.</li> : null}
          </ul>
        </Panel>
      </div>

      {/* Explorer */}
      <Panel title="Event log" description="Select an entry to see who did what, the request and every affected record." Icon={HiOutlineQueueList}>
        {/* Category tabs -- ModuleTabs colours, compact for a long list */}
        <nav aria-label="Log categories" className="flex gap-2 overflow-x-auto px-4 pt-5 scrollbar-hide md:px-6">
          {["", ...CATEGORY_ORDER].map((c) => {
            const meta = c ? CATEGORY_META[c] : null;
            const count = c ? summary?.categories?.[c] || 0 : summary?.total || 0;
            if (c && !count) return null;
            const active = category === c;
            return (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => update({ category: c || null, action: null })}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${active ? "border-primary bg-gradient-to-br from-primary-dark via-primary to-secondary-accent text-white shadow-md shadow-blue-900/20" : "border-blue-100 bg-gradient-to-br from-white to-blue-50/70 text-slate-600 hover:border-blue-300"}`}
              >
                {meta ? <meta.Icon className={`h-4 w-4 ${active ? "text-blue-100" : "text-secondary-accent"}`} /> : <HiOutlineQueueList className={`h-4 w-4 ${active ? "text-blue-100" : "text-secondary-accent"}`} />}
                {meta ? meta.label : "All events"}
                <span className={`rounded-md px-1.5 text-[0.68rem] tabular-nums ${active ? "bg-white/15" : "border border-blue-100 bg-white text-slate-500"}`}>{count.toLocaleString()}</span>
              </button>
            );
          })}
        </nav>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 border-b border-blue-100 px-4 py-4 md:grid-cols-12 md:px-6">
          <form className="relative md:col-span-5" onSubmit={(e) => { e.preventDefault(); update({ keyword: keyword.trim() || null }); }}>
            <HiOutlineMagnifyingGlass aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="search" aria-label="Search logs" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search action, user or student, then press Enter" className={`${input} !pl-10`} />
          </form>
          <select aria-label="Action" value={params.get("action") || ""} onChange={(e) => update({ action: e.target.value || null })} className={`${input} md:col-span-3`}>
            <option value="">All actions</option>
            {actions.map((x: any) => <option key={x.action} value={x.action}>{humanize(x.action)} ({x.count.toLocaleString()})</option>)}
          </select>
          <input type="date" aria-label="From date" value={params.get("from") || ""} onChange={(e) => update({ from: e.target.value || null })} className={`${input} md:col-span-2`} />
          <input type="date" aria-label="To date" value={params.get("to") || ""} onChange={(e) => update({ to: e.target.value || null })} className={`${input} md:col-span-2`} />
        </div>

        {/* Active filter chips */}
        {anyFilter ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-blue-100 bg-gradient-to-r from-blue-50/70 to-white px-4 py-3 md:px-6">
            <HiOutlineFunnel aria-hidden="true" className="h-4 w-4 text-secondary-accent" />
            <span className="mr-1 text-xs font-semibold text-slate-600">{total.toLocaleString()} matching</span>
            {activeChips.map((k) => (
              <span key={k} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-blue-200 bg-white pl-2.5 pr-1 text-xs font-medium text-primary">
                {k}: <span className="font-mono">{k === "action" ? humanize(params.get(k) || "") : params.get(k)}</span>
                <button onClick={() => update({ [k]: null })} aria-label={`Remove ${k} filter`} className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-blue-50"><HiXMark className="h-3.5 w-3.5" /></button>
              </span>
            ))}
            <button onClick={() => { const n = new URLSearchParams(); if (params.get("size")) n.set("size", params.get("size")!); setParams(n); }} className="ml-auto text-xs font-semibold text-primary underline-offset-2 hover:underline">Clear all filters</button>
          </div>
        ) : null}

        {/* Results */}
        <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
          <div className="hidden grid-cols-12 gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/70 px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary/70 lg:grid">
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
                className="group grid cursor-pointer grid-cols-1 gap-2 border-b border-blue-50 px-4 py-3.5 outline-none transition-colors last:border-0 hover:bg-blue-50/50 focus-visible:bg-blue-50/70 md:px-6 lg:grid-cols-12 lg:gap-4"
              >
                <div className="text-xs text-slate-500 lg:col-span-2" title={moment(r.createdAt).format("LLLL")}>
                  <span className="block font-semibold text-slate-700">{moment(r.createdAt).fromNow()}</span>
                  <span className="block tabular-nums">{moment(r.createdAt).format("MMM D, YYYY · HH:mm:ss")}</span>
                </div>
                <div className="flex min-w-0 items-center gap-3 lg:col-span-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${meta.chip}`}><meta.Icon className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-primary">{humanize(r.action)}</span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      {kind ? <span className={`rounded px-1.5 text-[0.6rem] font-bold uppercase tracking-wide ring-1 ring-inset ${CHANGE_STYLE[kind].chip}`}>{CHANGE_STYLE[kind].label}</span> : null}
                      <span className="text-[0.68rem] text-slate-500">{meta.label}</span>
                    </span>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-2 lg:col-span-2">
                  {r.user ? (
                    <button onClick={(e) => { e.stopPropagation(); update({ user: r.user }); }} title="Show only this user" className="flex min-w-0 items-center gap-2 text-left decoration-blue-300 hover:underline">
                      <span className={`${avatar} h-7 w-7 text-[0.62rem]`}>{initials(r.userName, String(r.user).slice(0, 2).toUpperCase())}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-slate-800">{r.userName || r.user}</span>
                        {r.userName ? <span className="block truncate font-mono text-[0.65rem] text-slate-500">{r.user}</span> : null}
                      </span>
                    </button>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </div>
                <div className="min-w-0 lg:col-span-2">
                  {r.student ? (
                    <button onClick={(e) => { e.stopPropagation(); update({ student: r.student }); }} title="Show only this student" className="min-w-0 text-left decoration-blue-300 hover:underline">
                      <span className="block truncate text-xs font-semibold text-slate-800">{r.studentName || r.student}</span>
                      {r.studentName ? <span className="block truncate font-mono text-[0.65rem] text-slate-500">{r.student}</span> : null}
                    </button>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </div>
                <div className="flex min-w-0 items-center justify-between gap-3 lg:col-span-3">
                  <span className="truncate text-xs text-slate-500">{summarize(r) || "—"}</span>
                  <HiChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-blue-200 transition group-hover:text-primary" />
                </div>
              </div>
            );
          })}
          {!rows.length ? (
            <div className="p-4 md:p-6">
              <EmptyState>
                <span className="block font-semibold text-slate-700">No logs match these filters</span>
                {anyFilter ? <button onClick={() => setParams(new URLSearchParams())} className="mt-2 text-xs font-semibold text-primary underline-offset-2 hover:underline">Clear all filters</button> : null}
              </EmptyState>
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {total ? (
          <div className="flex flex-col gap-3 border-t border-blue-100 p-4 md:px-6 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <Pagination total={total} page={page} pageSize={size} disabled={loading} onChange={(p) => update({ page: String(p) }, false)} />
            </div>
            <select value={size} onChange={(e) => update({ size: e.target.value })} aria-label="Rows per page" className={`${input} lg:!w-36`}>
              {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
            </select>
          </div>
        ) : null}
      </Panel>

      <LogDetailDrawer log={selected} onClose={closeLog} />
    </div>
  );
}

export default PgLogs;
