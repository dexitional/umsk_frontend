import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { HiOutlineSquares2X2, HiOutlineSparkles, HiOutlineMapPin, HiOutlineArrowsRightLeft, HiOutlineHeart, HiOutlineIdentification, HiOutlineGlobeAlt, HiOutlineUserGroup, HiOutlineUsers, HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineArrowPath, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineInbox } from 'react-icons/hi2';
import { LookupForm, ChangeForm, ApprovalForm, studentName, input, button } from '../../components/utilities/UtilityForms';
import { utilitiesService as api, utilityModules, utilityRoles } from '../../utils/utilitiesService';
import { useHasRole } from '../../utils/roles';

const moduleIcons = [HiOutlineSparkles, HiOutlineMapPin, HiOutlineArrowsRightLeft, HiOutlineHeart, HiOutlineIdentification, HiOutlineGlobeAlt, HiOutlineUserGroup, HiOutlineUsers];
const PAGE_SIZE = 50;
const pageButton = 'flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-35';
const actionButton = 'inline-flex min-h-[36px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none';

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${active ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800' : 'border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 text-slate-600'}`}><span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />{label}</span>;
}

export default function PgAISUtilities() {
  const { module = 'religion' } = useParams();
  const allowed = useHasRole('ais', utilityRoles);
  return <div className="min-w-0 space-y-6 p-4 md:p-6 md:pl-10">
    <header className="relative isolate overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-sky-100 p-6 text-primary shadow-lg shadow-blue-900/10 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-300/30 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-28 h-64 w-64 rounded-full border border-blue-200/50 bg-white/30" />
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4"><div className="hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-blue-100 p-3 sm:block"><HiOutlineSquares2X2 aria-hidden="true" className="h-8 w-8" /></div><div>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">Academic system</p>
          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">Utilities Module</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">Keep institutional records organised and manage student program changes in one place.</p>
        </div></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-medium"><HiOutlineSquares2X2 aria-hidden="true" className="h-4 w-4" />{utilityModules.length} submodules</span>
      </div>
    </header>
    {!allowed ? <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-red-800">You do not have permission to manage utilities.</p> : <>
      <nav aria-label="Utilities submodules" className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">{utilityModules.map(([key, label], index) => {
        const Icon = moduleIcons[index] || HiOutlineSquares2X2;
        const selected = module === key;
        return <NavLink key={key} to={'/ais/utilities/' + key} aria-current={selected ? 'page' : undefined} className={`group flex min-h-[100px] flex-col items-start justify-between gap-3 rounded-xl border p-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? 'border-primary bg-gradient-to-br from-primary-dark via-primary to-secondary-accent text-white shadow-md shadow-blue-900/20' : 'border-blue-100/80 bg-gradient-to-br from-white to-blue-50/70 text-slate-600 hover:border-blue-300 hover:shadow-md'}`}><Icon aria-hidden="true" className={`h-5 w-5 ${selected ? 'text-blue-100' : 'text-secondary-accent'}`} /><span className="leading-snug">{label}</span></NavLink>;
      })}</nav>
      {utilityModules.some(([key]) => key === module) ? <UtilityManager key={module} module={module} /> : <p role="alert">Utility module not found.</p>}
    </>}
  </div>;
}

function UtilityManager({ module }: { module: string }) {
  const isChange = module === 'change-of-program';
  const [options, setOptions] = useState<any>(null), [result, setResult] = useState<any>(null);
  const [filters, setFilters] = useState({ search: '', status: '' }), [search, setSearch] = useState('');
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0);
  const [form, setForm] = useState<any>(null), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
  const [error, setError] = useState(''), [success, setSuccess] = useState('');
  const lock = useRef(false), formRef = useRef<HTMLDivElement>(null), live = useRef(true);
  useEffect(() => { live.current = true; return () => { live.current = false; }; }, []);
  useEffect(() => { if (form) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [form]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== filters.search) { setFilters(f => ({ ...f, search: search.trim() })); setPage(1); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filters.search]);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    Promise.all([api.options(), api.list(module, { ...filters, page })]).then(([opts, rows]) => {
      if (active) {
        setOptions(opts); setResult(rows);
        const lastPage = Math.max(1, Math.ceil(rows.total / PAGE_SIZE));
        if (page > lastPage) setPage(lastPage);
      }
    }).catch(e => { if (active) { setResult(null); setError(e.message || 'Records could not be loaded. Please try again.'); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [module, filters, page, revision]);
  const run = async (work: () => Promise<any>, message: string) => {
    if (lock.current) return; lock.current = true; setBusy(true); setError(''); setSuccess('');
    try { await work(); if (live.current) { setForm(null); setSuccess(message); setRevision(v => v + 1); } }
    catch (e: any) { if (live.current) setError(e.message || 'The request could not be completed.'); }
    finally { lock.current = false; if (live.current) setBusy(false); }
  };
  const save = (data: any) => run(() => api.save(module, data, form?.record?.id), isChange ? 'Program change draft saved.' : 'Record saved.');
  const remove = (r: any) => { if (window.confirm(isChange ? 'Delete this draft program change?' : 'Delete this record? Records already in use must be deactivated instead.')) run(() => api.remove(module, r), 'Record deleted.'); };
  const clearFilters = () => { setSearch(''); setFilters({ search: '', status: '' }); setPage(1); };
  const meta = options?.modules[module];
  const title = utilityModules.find(([key]) => key === module)?.[1];
  const total = result?.total || 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNumbers = Array.from(new Set([1, ...Array.from({ length: 3 }, (_, i) => page - 1 + i).filter(n => n > 1 && n < pages), pages])).sort((a, b) => a - b);
  const filtered = !!(filters.search || filters.status);
  return <section aria-label={`${title} management`} className="space-y-4">
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-white p-4 text-sm text-red-800"><span>{error}</span><button type="button" className="font-semibold underline underline-offset-4 disabled:opacity-50" disabled={busy || loading} onClick={() => { setForm(null); setRevision(v => v + 1); }}>Refresh records</button></div>}
    {success && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-sm text-emerald-800"><HiOutlineCheckCircle aria-hidden="true" className="h-5 w-5 shrink-0" />{success}</p>}
    <div ref={formRef} className="scroll-mt-6">{options && form && (form.type === 'approve' ? <ApprovalForm key={form.record.id} record={form.record} options={options} busy={busy} approve={(majorId: string) => run(() => api.approve(form.record, majorId), 'Program change approved and applied.')} cancel={() => setForm(null)} /> : isChange ? <ChangeForm key={form.record?.id || 'new'} record={form.record} options={options} busy={busy} save={save} cancel={() => setForm(null)} /> : <LookupForm key={form.record?.id || 'new'} meta={meta} record={form.record} busy={busy} save={save} cancel={() => setForm(null)} />)}</div>
    <div className="min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="h-1 bg-gradient-to-r from-primary-dark via-blue-500 to-cyan-300" />
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/70 p-5 sm:p-6">
        <div className="max-w-2xl"><div className="flex items-center gap-3"><h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>{result && !loading && <span className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-xs font-semibold text-primary">{total.toLocaleString()} {total === 1 ? 'record' : 'records'}</span>}</div><p className="mt-2 text-sm leading-relaxed text-slate-500">{isChange ? 'Manage program transfers from draft to approval, with a retained history of every approved change.' : 'Manage values used in student and staff forms. Deactivate values to keep existing records while preventing new selections.'}</p></div>
        <button type="button" className={button} disabled={busy || loading || !options} onClick={() => { setError(''); setSuccess(''); setForm({ type: 'edit' }); }}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />{isChange ? 'New program change' : 'Add record'}</button>
      </div>
      <div className="border-y border-slate-100 px-5 py-4 sm:px-6">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center" role="search" onSubmit={e => { e.preventDefault(); setFilters(f => ({ ...f, search: search.trim() })); setPage(1); }}>
          <div className="relative min-w-0 flex-1"><HiOutlineMagnifyingGlass aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="search" className={input + ' !pl-10'} name="search" aria-label="Search records" placeholder={isChange ? 'Search student name, ID or index number…' : `Search ${title?.toLowerCase()}…`} maxLength={100} disabled={busy} value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select aria-label="Filter status" className={input + ' sm:!w-44'} disabled={busy} value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}><option value="">All statuses</option>{(isChange ? [['draft', 'Draft'], ['approved', 'Approved']] : [['active', 'Active'], ['inactive', 'Inactive']]).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
          <button type="button" aria-label="Refresh records" title="Refresh records" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 px-3 text-sm text-primary transition hover:border-blue-300 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40" disabled={busy || loading} onClick={() => setRevision(v => v + 1)}><HiOutlineArrowPath aria-hidden="true" className={`h-4 w-4 ${loading ? 'motion-safe:animate-spin' : ''}`} /><span className="sm:hidden">Refresh</span></button>
        </form>
        {(filtered || search) && <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>Filters:</span>{filters.search && <span className="max-w-full break-words rounded-lg bg-blue-50 px-2.5 py-1 text-primary">Search: {filters.search}</span>}{filters.status && <span className="rounded-lg bg-blue-50 px-2.5 py-1 capitalize text-primary">{filters.status}</span>}<button type="button" disabled={busy} onClick={clearFilters} className="rounded px-2 py-1 font-medium text-primary underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-primary">Clear filters</button></div>}
      </div>
      {loading ? <div role="status" className="space-y-4 p-6"><p className="text-sm font-medium text-slate-500">Loading records…</p><div aria-hidden="true" className="space-y-3 motion-safe:animate-pulse">{[0, 1, 2, 3].map(n => <div key={n} className="h-11 rounded-lg bg-gradient-to-r from-slate-100 via-blue-50 to-slate-50" />)}</div></div> : result && <>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">{title} records</caption><thead className="border-b border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50/60 text-xs uppercase tracking-wide text-primary"><tr>{(isChange ? ['Student', 'Program change', 'Session / semester', 'Status', 'Actions'] : [...(meta?.fields.map((f: any) => f.label) || []), 'Status', 'Usage', 'Actions']).map((label: string) => <th key={label} scope="col" className="whitespace-nowrap px-5 py-4 font-semibold">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{result.rows.map((r: any) => <tr key={r.id} className="align-top text-slate-600 transition-colors hover:bg-blue-50/40">{isChange ? <>
            <td className="min-w-[190px] px-5 py-4"><strong className="font-semibold text-slate-800">{studentName(r.student)}</strong><p className="mt-1 text-xs text-slate-500">{r.oldIndexno}</p><p className="mt-1 text-xs text-slate-400">{r.studentId}</p></td>
            <td className="min-w-[240px] max-w-sm px-5 py-4"><span className="text-xs text-slate-500">{r.oldprogram?.longName || r.oldProgramId}</span><p className="mt-1 font-medium text-primary">→ {r.newprogram?.longName || r.newProgramId || 'Not recorded'}</p><p className="mt-2 break-words text-xs leading-relaxed text-slate-500">{r.reason}</p></td>
            <td className="px-5 py-4">{r.session?.title || 'Not recorded'}<p className="mt-1 text-xs text-slate-500">Semester {r.newSemesterNum}</p></td>
            <td className="px-5 py-4"><StatusBadge active={!!r.approved} label={r.approved ? 'Approved' : 'Draft'} />{r.approved && <p className="mt-2 text-xs text-slate-500">{r.approvedBy || 'Legacy record'}{r.approvedAt ? ' · ' + new Date(r.approvedAt).toLocaleString() : ''}</p>}</td>
          </> : <>{meta.fields.map((f: any, index: number) => <td key={f.key} className={`max-w-sm break-words px-5 py-4 ${index === 0 ? 'font-medium text-slate-800' : ''}`}>{r[f.key] ?? '—'}</td>)}<td className="px-5 py-4"><StatusBadge active={!!r.status} label={r.status ? 'Active' : 'Inactive'} /></td><td className="px-5 py-4"><span className="inline-block whitespace-nowrap rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500">{Object.values(r._count || {}).reduce((sum: number, count) => sum + Number(count), 0) as number} references</span></td></>}
            <td className="px-5 py-3"><div className="flex min-w-max items-center gap-2">{(!isChange || !r.approved) && <><button type="button" className={actionButton + ' border-primary bg-gradient-to-br from-primary-dark via-primary to-secondary-accent text-white enabled:hover:brightness-110 enabled:hover:shadow-md focus-visible:ring-primary'} disabled={busy} onClick={() => setForm({ type: 'edit', record: r })}><HiOutlinePencilSquare aria-hidden="true" className="h-4 w-4" />Edit</button>{isChange && <button type="button" className={actionButton + ' border-emerald-200 bg-gradient-to-br from-white to-emerald-50 text-emerald-800 enabled:hover:border-emerald-300 enabled:hover:to-emerald-100 focus-visible:ring-emerald-600'} disabled={busy} onClick={() => setForm({ type: 'approve', record: r })}>Review & approve</button>}<button type="button" className={actionButton + ' border-rose-200 bg-gradient-to-br from-white to-rose-50 text-rose-700 enabled:hover:border-rose-300 enabled:hover:from-rose-50 enabled:hover:to-rose-100 enabled:hover:shadow-md focus-visible:ring-rose-500'} title={!isChange && Object.values(r._count || {}).some(n => Number(n) > 0) ? 'This record is in use. Edit it to deactivate instead.' : 'Delete record'} disabled={busy || (!isChange && Object.values(r._count || {}).some(n => Number(n) > 0))} onClick={() => remove(r)}><HiOutlineTrash aria-hidden="true" className="h-4 w-4" />Delete</button></>}{isChange && r.approved && <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">Retained history</span>}</div></td>
          </tr>)}{!result.rows.length && <tr><td colSpan={isChange ? 5 : (meta?.fields.length || 0) + 3} className="px-6 py-14 text-center"><HiOutlineInbox aria-hidden="true" className="mx-auto mb-3 h-10 w-10 text-blue-300" /><p className="font-semibold text-slate-700">{filtered ? 'No matching records' : 'No records yet'}</p><p className="mt-1 text-sm text-slate-500">{filtered ? 'Try a different search or clear your filters.' : isChange ? 'Create a program change to get started.' : 'Add your first record using the button above.'}</p>{filtered && <button type="button" className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-blue-50 disabled:opacity-50" disabled={busy} onClick={clearFilters}>Clear filters</button>}</td></tr>}</tbody>
        </table></div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50/60 px-5 py-4 sm:px-6">
          <p role="status" className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)}</span> of <span className="font-semibold text-slate-700">{total.toLocaleString()}</span> records</p>
          <nav aria-label="Records pagination" className="flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-blue-100 bg-white p-1 text-slate-600"><button type="button" aria-label="Previous page" className={pageButton} disabled={busy || page === 1} onClick={() => setPage(p => p - 1)}><HiOutlineChevronLeft aria-hidden="true" className="h-4 w-4" /></button>{pageNumbers.map((n, i) => <React.Fragment key={n}>{i > 0 && n - pageNumbers[i - 1] > 1 && <span className="px-1 text-slate-400">…</span>}<button type="button" aria-label={`Page ${n}`} aria-current={page === n ? 'page' : undefined} disabled={busy} className={pageButton + (page === n ? ' bg-gradient-to-br from-primary to-secondary-accent text-white shadow-sm hover:!bg-primary' : '')} onClick={() => setPage(n)}>{n}</button></React.Fragment>)}<button type="button" aria-label="Next page" className={pageButton} disabled={busy || page >= pages} onClick={() => setPage(p => p + 1)}><HiOutlineChevronRight aria-hidden="true" className="h-4 w-4" /></button></nav>
        </div>
      </>}
    </div>
  </section>;
}
