import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import SubPageTitle from '../../components/ais/SubPageTitle';
import { LookupForm, ChangeForm, ApprovalForm, studentName, input, button } from '../../components/utilities/UtilityForms';
import { utilitiesService as api, utilityModules, utilityRoles } from '../../utils/utilitiesService';
import { useHasRole } from '../../utils/roles';

export default function PgAISUtilities() {
  const { module = 'religion' } = useParams();
  const allowed = useHasRole('ais', utilityRoles);
  return <div className="p-4 md:p-6 space-y-5">
    <SubPageTitle page="Academic system" title="Utilities Module" />
    {!allowed ? <p role="alert">You do not have permission to manage utilities.</p> : <>
      <nav aria-label="Utilities submodules" className="flex flex-wrap gap-2">{utilityModules.map(([key, label]) => <NavLink key={key} to={'/ais/utilities/' + key} className={`rounded border px-3 py-2 text-sm ${module === key ? 'bg-primary text-white' : 'bg-white'}`}>{label}</NavLink>)}</nav>
      {utilityModules.some(([key]) => key === module) ? <UtilityManager key={module} module={module} /> : <p role="alert">Utility module not found.</p>}
    </>}
  </div>;
}
function UtilityManager({ module }: { module: string }) {
  const isChange = module === 'change-of-program';
  const [options, setOptions] = useState<any>(null), [result, setResult] = useState<any>(null);
  const [filters, setFilters] = useState({ search: '', status: '' }), [page, setPage] = useState(1), [revision, setRevision] = useState(0);
  const [form, setForm] = useState<any>(null), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
  const [error, setError] = useState(''), [success, setSuccess] = useState('');
  const lock = useRef(false), formRef = useRef<HTMLDivElement>(null), live = useRef(true);
  useEffect(() => { live.current = true; return () => { live.current = false; }; }, []);
  useEffect(() => { if (form) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [form]);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    Promise.all([api.options(), api.list(module, { ...filters, page })]).then(([opts, rows]) => { if (active) { setOptions(opts); setResult(rows); } }).catch(e => { if (active) { setResult(null); setError(e.message); } }).finally(() => { if (active) setLoading(false); });
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
  const filter = (key: string, value: string) => { setFilters(f => ({ ...f, [key]: value })); setPage(1); };
  const meta = options?.modules[module];
  return <section className="space-y-4">
    <h2 className="text-lg font-semibold">{utilityModules.find(([key]) => key === module)?.[1]}</h2>
    <p className="text-sm text-slate-600">{isChange ? 'Manage student program changes. Drafts can be edited or deleted; approved changes are retained in the history.' : 'Manage values used in student and staff forms. Inactive values remain on existing records but are unavailable for new selections.'}</p>
    {error && <div role="alert" className="rounded bg-red-50 p-3 text-red-800">{error} <button type="button" className="underline" disabled={busy || loading} onClick={() => { setForm(null); setRevision(v => v + 1); }}>Refresh records</button></div>}
    {success && <p role="status" className="rounded bg-green-50 p-3 text-green-800">{success}</p>}
    {loading && <p role="status">Loading records…</p>}
    <div ref={formRef}>{options && form && (form.type === 'approve' ? <ApprovalForm key={form.record.id} record={form.record} options={options} busy={busy} approve={(majorId: string) => run(() => api.approve(form.record, majorId), 'Program change approved and applied.')} cancel={() => setForm(null)} /> : isChange ? <ChangeForm key={form.record?.id || 'new'} record={form.record} options={options} busy={busy} save={save} cancel={() => setForm(null)} /> : <LookupForm key={form.record?.id || 'new'} meta={meta} record={form.record} busy={busy} save={save} cancel={() => setForm(null)} />)}</div>
    <button className={button} disabled={busy || loading || !options} onClick={() => { setError(''); setSuccess(''); setForm({ type: 'edit' }); }}>{isChange ? 'New program change' : 'Add record'}</button>
    <form className="flex flex-wrap items-center gap-2" onSubmit={e => { e.preventDefault(); filter('search', String(new FormData(e.currentTarget).get('search') || '').trim()); }}>
      <input className={input + ' sm:!w-72'} name="search" aria-label="Search records" placeholder={isChange ? 'Student name, ID or index number' : 'Search records'} maxLength={100} disabled={busy} />
      <button className={button} disabled={busy}>Search</button>
      <select aria-label="Filter status" className={input + ' sm:!w-48'} disabled={busy} value={filters.status} onChange={e => filter('status', e.target.value)}><option value="">All statuses</option>{(isChange ? [['draft', 'Draft'], ['approved', 'Approved']] : [['active', 'Active'], ['inactive', 'Inactive']]).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
    </form>
    {result && !loading && <>
      <p className="text-sm">{result.total} records</p>
      <div className="overflow-x-auto rounded border"><table className="w-full text-left text-sm"><thead className="bg-slate-100"><tr>{(isChange ? ['Student', 'Program change', 'Session / semester', 'Status', 'Actions'] : [...(meta?.fields.map((f: any) => f.label) || []), 'Status', 'Usage', 'Actions']).map((label: string) => <th key={label} className="p-3">{label}</th>)}</tr></thead>
        <tbody>{result.rows.map((r: any) => <tr key={r.id} className="border-t align-top">{isChange ? <>
          <td className="p-3"><strong>{studentName(r.student)}</strong><p>{r.oldIndexno}</p><p>{r.studentId}</p></td>
          <td className="p-3">{r.oldprogram?.longName || r.oldProgramId}<p className="font-medium">→ {r.newprogram?.longName || r.newProgramId || 'Not recorded'}</p><p className="mt-2 text-slate-600">{r.reason}</p></td>
          <td className="p-3">{r.session?.title || 'Not recorded'}<p>Semester {r.newSemesterNum}</p></td>
          <td className="p-3">{r.approved ? 'Approved' : 'Draft'}{r.approved && <p className="text-xs">{r.approvedBy || 'Legacy record'}{r.approvedAt ? ' · ' + new Date(r.approvedAt).toLocaleString() : ''}</p>}</td>
        </> : <>{meta.fields.map((f: any) => <td key={f.key} className="p-3">{r[f.key] ?? '—'}</td>)}<td className="p-3">{r.status ? 'Active' : 'Inactive'}</td><td className="p-3">{Object.values(r._count || {}).reduce((sum: number, count) => sum + Number(count), 0) as number} references</td></>}
          <td className="p-3"><div className="flex flex-wrap gap-3">{(!isChange || !r.approved) && <><button className="text-primary underline" disabled={busy} onClick={() => setForm({ type: 'edit', record: r })}>Edit</button>{isChange && <button className="text-primary underline" disabled={busy} onClick={() => setForm({ type: 'approve', record: r })}>Review & approve</button>}<button className="text-red-700 underline" disabled={busy || (!isChange && Object.values(r._count || {}).some(n => Number(n) > 0))} onClick={() => remove(r)}>Delete</button></>}{isChange && r.approved && <span className="text-slate-500">Retained history</span>}</div></td>
        </tr>)}{!result.rows.length && <tr><td colSpan={isChange ? 5 : (meta?.fields.length || 0) + 3} className="p-6 text-center">No records match these filters.</td></tr>}</tbody>
      </table></div>
      <div className="flex items-center gap-3 text-sm"><button disabled={busy || page === 1} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Math.max(1, Math.ceil(result.total / 50))}</span><button disabled={busy || page * 50 >= result.total} onClick={() => setPage(p => p + 1)}>Next</button></div>
    </>}
  </section>;
}
