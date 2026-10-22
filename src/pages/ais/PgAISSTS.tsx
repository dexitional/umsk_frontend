import React, { useEffect, useRef, useState } from 'react';
import SubPageTitle from '../../components/ais/SubPageTitle';
import { Field, RecordForm, PlacementForm, ProgressForm, inputClass, buttonClass } from '../../components/sts/STSForms';
import { stsService, stsRoles } from '../../utils/stsService';
import { useHasRole } from '../../utils/roles';
import { requestError } from '../../utils/requestError';

const blankFilters = { sessionId: '', schoolId: '', mentorId: '', programId: '', yearGroup: '', status: '', search: '' };
export default function PgAISSTS() {
  const allowed = useHasRole('ais', stsRoles);
  const [options, setOptions] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [filters, setFilters] = useState(blankFilters);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('placements');
  const [form, setForm] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refresh, setRefresh] = useState(0);
  const initialized = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (form) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [form]);
  useEffect(() => {
    if (!allowed) { setLoading(false); return; }
    let live = true;
    setLoading(true); setError(''); setResult(null);
    Promise.all([stsService.options(), stsService.assignments({ ...filters, page })]).then(([opts, rows]) => {
      if (!live) return;
      setOptions(opts);
      if (!initialized.current) {
        initialized.current = true;
        const active = opts.sessions.find((s: any) => s.default && s.status);
        if (active) { setFilters(f => ({ ...f, sessionId: active.id })); return; }
      }
      setResult(rows);
    }).catch(e => { if (live) setError(requestError(e)); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [allowed, filters, page, refresh]);
  const run = async (work: () => Promise<any>, message?: string) => {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError(''); setSuccess('');
    try { await work(); if (message) setSuccess(message); }
    catch (e) { setError(requestError(e)); }
    finally { lock.current = false; setBusy(false); }
  };
  const save = (type: string, data: any, id?: string) => run(async () => {
    await stsService.save(type, data, id); setForm(null); setHistory(null); setRefresh(n => n + 1);
  }, 'Saved successfully.');
  const remove = (type: string, record: any) => {
    if (!window.confirm(`Delete ${record.name}? Records with placement history must be deactivated instead.`)) return;
    run(async () => { await stsService.remove(type, record.id); setRefresh(n => n + 1); }, 'Deleted successfully.');
  };
  const changeFilter = (key: string, value: string) => { setFilters(f => ({ ...f, [key]: value, ...(key === 'schoolId' ? { mentorId: '' } : {}) })); setPage(1); setHistory(null); };
  const admin = options?.canManage;
  const current = options?.sessions.find((s: any) => s.default && s.status);
  const mentors = options?.schools.flatMap((s: any) => s.mentors.map((m: any) => ({ ...m, schoolName: s.name }))) || [];
  const openForm = (next: any) => { setError(''); setSuccess(''); setHistory(null); setForm(next); };
  if (!allowed) return <div className="p-6" role="alert">You do not have access to Supported Teaching in Schools.</div>;
  return <div className="p-4 md:p-6 space-y-5">
    <SubPageTitle title="Supported Teaching in Schools" page="Academics" />
    <p className="text-sm text-slate-600">Manage school placements, mentors and each student's semester history.</p>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="STS sections">
      {['placements', ...(admin ? ['schools', 'mentors'] : [])].map(t => <button key={t} type="button" role="tab" aria-selected={tab === t} disabled={busy} onClick={() => { setTab(t); setForm(null); setHistory(null); }} className={`rounded px-4 py-2 text-sm capitalize ${tab === t ? 'bg-primary text-white' : 'bg-slate-100'}`}>{t === 'placements' ? 'Placements & reports' : t}</button>)}
    </div>
    {error && <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error} <button type="button" className="underline" disabled={busy || loading} onClick={() => setRefresh(n => n + 1)}>Refresh data</button></div>}
    {success && <p role="status" className="rounded bg-green-50 p-3 text-sm text-green-800">{success}</p>}
    {loading && <p role="status" className="text-sm">Loading STS records…</p>}
    {options && <>
      {admin && !current && <p className="rounded bg-amber-50 p-3 text-sm">Set an active default semester in Academic Calendar before assigning students.</p>}
      <div ref={formRef} className="scroll-mt-4">
        {form?.type === 'assignments' && <PlacementForm key={`${form.record?.id || 'new'}-${form.record?.version || ''}`} options={options} record={form.record} reassign={!!form.record} busy={busy} save={save} cancel={() => setForm(null)} />}
        {form?.type === 'progress' && <ProgressForm key={form.record.id} record={form.record} admin={admin} busy={busy} save={save} cancel={() => setForm(null)} />}
        {['schools', 'mentors'].includes(form?.type) && <RecordForm key={`${form.type}-${form.record?.id || 'new'}`} type={form.type} record={form.record} schools={options.schools} busy={busy} save={save} cancel={() => setForm(null)} />}
      </div>
      {tab === 'placements' && <>
        <div className="flex flex-wrap gap-2">
          {admin && <button type="button" className={buttonClass} disabled={busy || loading || !current} onClick={() => openForm({ type: 'assignments' })}>Assign student</button>}
          <button type="button" className={buttonClass} disabled={busy || loading || !result} onClick={() => run(() => stsService.report(filters), 'Report downloaded.')}>Download filtered report (CSV)</button>
        </div>
        <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Academic semester"><select className={inputClass} value={filters.sessionId} onChange={e => changeFilter('sessionId', e.target.value)}><option value="">All semesters</option>{options.sessions.map((s: any) => <option key={s.id} value={s.id}>{s.title}{s.default ? ' (current)' : ''}</option>)}</select></Field>
          <Field label="School"><select className={inputClass} value={filters.schoolId} onChange={e => changeFilter('schoolId', e.target.value)}><option value="">All schools</option>{options.schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Mentor"><select className={inputClass} value={filters.mentorId} onChange={e => changeFilter('mentorId', e.target.value)}><option value="">All mentors</option>{mentors.filter((m: any) => !filters.schoolId || m.schoolId === filters.schoolId).map((m: any) => <option key={m.id} value={m.id}>{m.name} — {m.schoolName}</option>)}</select></Field>
          <Field label="Programme"><select className={inputClass} value={filters.programId} onChange={e => changeFilter('programId', e.target.value)}><option value="">All programmes</option>{options.programs.map((p: any) => <option key={p.id} value={p.id}>{p.longName}</option>)}</select></Field>
          <Field label="Year at assignment"><select className={inputClass} value={filters.yearGroup} onChange={e => changeFilter('yearGroup', e.target.value)}><option value="">All years</option>{[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}</select></Field>
          <Field label="Status"><select className={inputClass} value={filters.status} onChange={e => changeFilter('status', e.target.value)}><option value="">All statuses</option>{['ACTIVE', 'COMPLETED', 'CANCELLED'].map(s => <option key={s}>{s}</option>)}</select></Field>
        </fieldset>
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); changeFilter('search', String(new FormData(e.currentTarget).get('search') || '').trim()); }}><input aria-label="Search placement by student name, ID or index number" name="search" maxLength={100} className={inputClass} placeholder="Student name, ID or index number" /><button className={buttonClass} disabled={busy}>Search</button></form>
        {result && !loading && <>
          <div className="flex flex-wrap gap-3 text-sm"><strong>{result.total} placements</strong>{result.counts.map((c: any) => <span key={c.status}>{c.status}: {c._count._all}</span>)}</div>
          <p className="text-xs text-slate-500">Reports use the programme, year, school and mentor recorded at assignment. Choose All semesters to see a student's placement history.</p>
          <div className="overflow-x-auto rounded border"><table className="w-full text-left text-sm"><thead className="bg-slate-100"><tr>{['Student', 'Semester / year', 'School / mentor', 'Status', 'Actions'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>
            {result.rows.map((r: any) => <tr key={r.id} className="border-t align-top"><td className="p-3"><strong>{r.studentName}</strong><p>{r.indexno || r.studentId}</p><p className="text-xs text-slate-500">{r.programName}</p></td><td className="p-3">{r.session.title}<p className="text-xs">Year {r.yearGroup} · Semester {r.semesterNum}</p></td><td className="p-3">{r.schoolName}<p className="text-xs">{r.mentorName}</p></td><td className="p-3">{r.status}</td><td className="p-3"><div className="flex flex-col items-start gap-2">
              {(admin || r.status !== 'CANCELLED') && <button type="button" disabled={busy} className="text-primary underline" onClick={() => openForm({ type: 'progress', record: r })}>Update progress</button>}
              {admin && r.sessionId === current?.id && <button type="button" disabled={busy} className="text-primary underline" onClick={() => openForm({ type: 'assignments', record: r })}>Reassign</button>}
              <button type="button" disabled={busy} className="text-primary underline" onClick={() => run(async () => { const events = await stsService.history(r.id); setHistory({ record: r, events }); setForm(null); })}>View history</button>
            </div></td></tr>)}
            {!result.rows.length && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No placements match these filters.</td></tr>}
          </tbody></table></div>
          <div className="flex items-center gap-3 text-sm"><button type="button" disabled={page <= 1 || busy} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Math.max(1, Math.ceil(result.total / 50))}</span><button type="button" disabled={page * 50 >= result.total || busy} onClick={() => setPage(p => p + 1)}>Next</button></div>
        </>}
        {history && <section className="rounded border p-4 space-y-3"><h2 className="font-semibold">Placement history — {history.record.studentName}</h2>{history.events.map((e: any) => <div key={e.id} className="border-t pt-3 text-sm"><strong>{e.action}</strong> · {new Date(e.createdAt).toLocaleString()} · {e.actor}<p>{e.snapshot.schoolName} · {e.snapshot.mentorName} · {e.snapshot.status}</p>{e.reason && <p>Reason: {e.reason}</p>}{e.snapshot.notes && <p className="whitespace-pre-wrap">Notes: {e.snapshot.notes}</p>}</div>)}<button onClick={() => setHistory(null)} className="text-primary underline">Close history</button></section>}
      </>}
      {tab === 'schools' && admin && <>
        <button type="button" className={buttonClass} disabled={busy || loading} onClick={() => openForm({ type: 'schools' })}>Add school</button>
        <p className="text-xs text-slate-500">Deactivate schools with historical placements. A school can be deleted only when it has no mentors or placements.</p>
        <div className="grid gap-3 sm:grid-cols-2">{options.schools.map((s: any) => <article key={s.id} className="rounded border p-4 space-y-2"><h2 className="font-semibold">{s.name}</h2><p className="text-sm">{s.code} · {s.active ? 'Active' : 'Inactive'}</p><p className="text-sm">{[s.district, s.address, s.phone].filter(Boolean).join(' · ')}</p><p className="text-xs">{s.mentors.length} mentors · {s._count.assignments} placements</p><div className="flex gap-3 text-sm"><button disabled={busy} className="text-primary underline" onClick={() => openForm({ type: 'schools', record: s })}>Edit</button><button disabled={busy} className="text-primary underline" onClick={() => { setTab('mentors'); openForm({ type: 'mentors', record: { schoolId: s.id } }); }}>Add mentor</button><button disabled={busy} className="text-red-700 underline" onClick={() => remove('schools', s)}>Delete</button></div></article>)}</div>
        {!options.schools.length && <p className="text-sm">No schools yet. Add the schools available for STS placements.</p>}
      </>}
      {tab === 'mentors' && admin && <>
        <button type="button" className={buttonClass} disabled={busy || loading || !options.schools.length} onClick={() => openForm({ type: 'mentors' })}>Add mentor</button>
        <div className="grid gap-3 sm:grid-cols-2">{mentors.map((m: any) => <article key={m.id} className="rounded border p-4 space-y-2"><h2 className="font-semibold">{m.name}</h2><p className="text-sm">{m.schoolName} · {m.active ? 'Active' : 'Inactive'}</p><p className="text-sm">{[m.phone, m.email].filter(Boolean).join(' · ')}</p>{m.accountTag && <p className="text-xs">Linked staff login: {m.accountTag}</p>}<div className="flex gap-3 text-sm"><button disabled={busy} className="text-primary underline" onClick={() => openForm({ type: 'mentors', record: m })}>Edit</button><button disabled={busy} className="text-red-700 underline" onClick={() => remove('mentors', m)}>Delete</button></div></article>)}</div>
        {!mentors.length && <p className="text-sm">Add a school, then add its mentors before assigning students.</p>}
      </>}
    </>}
  </div>;
}
