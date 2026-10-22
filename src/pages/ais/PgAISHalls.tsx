import React, { useEffect, useRef, useState } from 'react';
import SubPageTitle from '../../components/ais/SubPageTitle';
import { AssignmentForm, RecordForm, OriginalForm, ReleaseForm, StudentPicker, Field, input, button } from '../../components/residence/HallForms';
import { hallRoles, residenceService as api, yearKey } from '../../utils/residenceService';
import { useHasRole } from '../../utils/roles';
import { requestError } from '../../utils/requestError';
const emptyFilters = { academicYear: '', hallId: '', roomId: '', status: '', search: '' };
export default function PgAISHalls() {
  const allowed = useHasRole('ais', hallRoles);
  const [options, setOptions] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [occupancy, setOccupancy] = useState<any[]>([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('placements');
  const [form, setForm] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [revision, setRevision] = useState(0);
  const initialized = useRef(false);
  const lock = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (form) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [form]);
  useEffect(() => {
    if (!allowed) { setLoading(false); return; }
    let live = true; setLoading(true); setError(''); setResult(null);
    Promise.all([api.options(), api.assignments({ ...filters, page }), filters.academicYear ? api.occupancy(filters.academicYear) : Promise.resolve([])]).then(([opts, rows, spaces]) => {
      if (!live) return; setOptions(opts); setOccupancy(spaces);
      if (!initialized.current) { initialized.current = true; const current = opts.sessions.find((s: any) => s.default && s.status); if (current?.year) { setFilters(f => ({ ...f, academicYear: yearKey(current.year) })); return; } }
      setResult(rows);
    }).catch(e => { if (live) { setOptions(null); setError(requestError(e)); } }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [allowed, filters, page, revision]);
  const run = async (work: () => Promise<any>, message?: string) => {
    if (lock.current) return; lock.current = true; setBusy(true); setError(''); setSuccess('');
    try { await work(); if (message) setSuccess(message); } catch (e) { setError(requestError(e)); } finally { lock.current = false; setBusy(false); }
  };
  const refresh = () => { setForm(null); setHistory(null); setRevision(n => n + 1); };
  const save = (type: string, data: any, id?: string) => run(async () => { await api.save(type, data, id); refresh(); }, 'Saved successfully.');
  const openHistory = (studentId: string) => run(async () => { setHistory(await api.history(studentId)); setForm(null); });
  const remove = (type: string, r: any) => { if (window.confirm(`Delete ${r.name || r.code}? Used records must be deactivated instead.`)) run(async () => { await api.remove(type, r.id); refresh(); }, 'Deleted successfully.'); };
  const filter = (key: string, value: string) => { setFilters(f => ({ ...f, [key]: value, ...(key === 'hallId' ? { roomId: '' } : {}) })); setPage(1); };
  const current = options?.sessions.find((s: any) => s.default && s.status);
  const currentYear = yearKey(current?.year);
  const canAssign = current?.semester === 'SEM1';
  const years = [...new Set<string>((options?.sessions || []).map((s: any) => yearKey(s.year)).filter(Boolean))];
  if (!allowed) return <p role="alert" className="p-6">You do not have access to hall management.</p>;
  return <div className="p-4 md:p-6 space-y-5">
    <SubPageTitle title="Hall Module" page="Academics" />
    <p className="text-sm text-slate-600">Manage halls, gender-based rooms and annual placements. A student's original affiliation is preserved when their current hall changes.</p>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Hall management sections">{['placements', 'halls', 'rooms', 'affiliations'].map(t => <button type="button" key={t} role="tab" aria-selected={tab === t} disabled={busy} onClick={() => { setTab(t); setForm(null); setHistory(null); }} className={`rounded px-4 py-2 text-sm capitalize ${tab === t ? 'bg-primary text-white' : 'bg-slate-100'}`}>{t === 'placements' ? 'Placements & reports' : t}</button>)}</div>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{error} <button disabled={busy || loading} className="underline" onClick={() => setRevision(n => n + 1)}>Retry loading</button></p>}
    {success && <p role="status" className="rounded bg-green-50 p-3 text-sm text-green-800">{success}</p>}
    {loading && <p role="status">Loading hall records…</p>}
    {options && <>
      {!canAssign && <p className="rounded bg-amber-50 p-3 text-sm">Assignments and reassignments require an active first semester in Academic Calendar. Existing placements remain valid through the academic year.</p>}
      <div ref={formRef}>
        {['halls', 'rooms'].includes(form?.type) && <RecordForm key={`${form.type}-${form.record?.id || 'new'}`} {...form} options={options} busy={busy} save={save} cancel={() => setForm(null)} />}
        {form?.type === 'assignments' && <AssignmentForm key={form.record?.id || 'new'} record={form.record} options={options} occupancy={filters.academicYear === currentYear ? occupancy : null} current={current} busy={busy} save={save} cancel={() => setForm(null)} />}
        {form?.type === 'release' && <ReleaseForm record={form.record} current={current} busy={busy} cancel={() => setForm(null)} save={(id: string, data: any) => run(async () => { await api.release(id, data); refresh(); }, 'Room released.')} />}
      </div>
      {tab === 'placements' && <>
        <div className="flex gap-3"><button className={button} disabled={busy || loading || !canAssign} onClick={() => { setHistory(null); setForm({ type: 'assignments' }); }}>Assign student</button><button className={button} disabled={busy || loading || !result} onClick={() => run(() => api.report(filters), 'Report downloaded.')}>Download report (CSV)</button></div>
        <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field title="Academic year"><select className={input} value={filters.academicYear} onChange={e => filter('academicYear', e.target.value)}><option value="">All years</option>{years.map(y => <option key={y}>{y}</option>)}</select></Field>
          <Field title="Hall"><select className={input} value={filters.hallId} onChange={e => filter('hallId', e.target.value)}><option value="">All halls</option>{options.halls.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></Field>
          <Field title="Room"><select className={input} value={filters.roomId} onChange={e => filter('roomId', e.target.value)}><option value="">All rooms</option>{options.rooms.filter((r: any) => !filters.hallId || r.hallId === filters.hallId).map((r: any) => <option key={r.id} value={r.id}>{options.halls.find((h: any) => h.id === r.hallId)?.name} · {r.code}</option>)}</select></Field>
          <Field title="Status"><select className={input} value={filters.status} onChange={e => filter('status', e.target.value)}><option value="">All statuses</option><option>ACTIVE</option><option>RELEASED</option></select></Field>
        </fieldset>
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); filter('search', String(new FormData(e.currentTarget).get('search') || '').trim()); }}><input className={input} name="search" aria-label="Search placements" maxLength={100} placeholder="Student ID, name or index number" /><button className={button} disabled={busy}>Search</button></form>
        {result && !loading && <>
          <p className="text-sm">{result.total} placements. Hall and room names in this list are the names recorded at assignment.</p>
          <div className="overflow-x-auto rounded border"><table className="w-full text-left text-sm"><thead className="bg-slate-100"><tr>{['Student', 'Academic year', 'Original hall', 'Assigned hall / room', 'Status', 'Actions'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>{result.rows.map((r: any) => <tr key={r.id} className="border-t align-top"><td className="p-3"><strong>{r.studentName}</strong><p>{r.indexno || r.studentId}</p></td><td className="p-3">{r.academicYear}<p className="text-xs">Year {Math.ceil(r.semesterNum / 2)} at assignment</p></td><td className="p-3">{r.originalHallName}</td><td className="p-3">{r.hallName}<p>{r.roomCode} · {r.gender === 'M' ? 'Male' : 'Female'}</p></td><td className="p-3">{r.status}</td><td className="p-3 space-y-2">
            {r.academicYear === currentYear && canAssign && <button className="block text-primary underline" disabled={busy} onClick={() => setForm({ type: 'assignments', record: r })}>Reassign</button>}
            {r.academicYear === currentYear && r.status === 'ACTIVE' && <button className="block text-primary underline" disabled={busy} onClick={() => setForm({ type: 'release', record: r })}>Release room</button>}
            <button className="block text-primary underline" disabled={busy} onClick={() => openHistory(r.studentId)}>Student history</button>
          </td></tr>)}{!result.rows.length && <tr><td colSpan={6} className="p-6 text-center">No placements match these filters.</td></tr>}</tbody></table></div>
          <div className="flex gap-3 text-sm"><button disabled={busy || page === 1} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Math.max(1, Math.ceil(result.total / 50))}</span><button disabled={busy || page * 50 >= result.total} onClick={() => setPage(p => p + 1)}>Next</button></div>
        </>}
      </>}
      {tab === 'halls' && <>
        <button className={button} disabled={busy || loading} onClick={() => setForm({ type: 'halls' })}>Add hall</button>
        <div className="grid gap-3 sm:grid-cols-2">{options.halls.map((h: any) => <article key={h.id} className="rounded border p-4 space-y-2"><h2 className="font-semibold">{h.name}</h2><p className="text-sm">{h.code} · {h.active ? 'Active' : 'Inactive'}</p><p className="text-xs">{h._count.rooms} rooms · {h._count.originalStudents} original affiliations · {h._count.currentStudents} current affiliations</p><div className="flex gap-3 text-sm"><button disabled={busy} className="text-primary underline" onClick={() => setForm({ type: 'halls', record: h })}>Edit</button><button disabled={busy} className="text-red-700 underline" onClick={() => remove('halls', h)}>Delete</button></div></article>)}</div>
        {!options.halls.length && <p>Add a hall to begin creating rooms.</p>}
      </>}
      {tab === 'rooms' && <>
        <button className={button} disabled={busy || loading || !options.halls.length} onClick={() => setForm({ type: 'rooms' })}>Add room</button>
        <Field title="Occupancy for academic year"><select className={input} value={filters.academicYear} onChange={e => filter('academicYear', e.target.value)}><option value="">Choose year</option>{years.map(y => <option key={y}>{y}</option>)}</select></Field>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{options.rooms.map((r: any) => { const used = occupancy.find(o => o.id === r.id); return <article key={r.id} className="rounded border p-4 space-y-2"><h2 className="font-semibold">{options.halls.find((h: any) => h.id === r.hallId)?.name} · {r.code}</h2><p className="text-sm">{r.gender === 'M' ? 'Male' : 'Female'} · Capacity {r.capacity} · {r.active ? 'Active' : 'Inactive'}</p><p className="text-sm">{loading ? 'Loading occupancy…' : used ? `${used.occupied} occupied · ${used.available} available in ${filters.academicYear}` : 'Choose an academic year to view occupancy.'}</p><div className="flex gap-3 text-sm"><button disabled={busy} className="text-primary underline" onClick={() => setForm({ type: 'rooms', record: r })}>Edit</button><button disabled={busy} className="text-red-700 underline" onClick={() => remove('rooms', r)}>Delete</button></div></article>; })}</div>
        {!options.rooms.length && <p>No rooms have been added.</p>}
      </>}
      {tab === 'affiliations' && <>
        <StudentPicker selected={student} disabled={busy} onSelect={(s: any) => { setStudent(s); setHistory(null); }} />
        {student && <><p className="text-sm">Original affiliation source: {student.originalHallSource || 'Not recorded'}. Legacy values preserve the hall recorded before this module was introduced.</p><button disabled={busy} className="text-primary underline" onClick={() => openHistory(student.id)}>View affiliation and room history</button>{!student.originalHallId && <OriginalForm student={student} halls={options.halls} busy={busy} save={(id: string, data: any) => run(async () => { const updated = await api.original(id, data); setStudent(updated); refresh(); }, 'Original affiliation recorded.')} />}</>}
      </>}
      {history && <section className="rounded border p-4 space-y-4"><h2 className="font-bold">Student history — {history.student.id}</h2><p className="text-sm">Original: {history.student.instituteAffliate || 'Not recorded'} · Current: {history.student.currentHall?.name || 'Not recorded'}</p><h3 className="font-semibold">Affiliation changes</h3>{history.affiliations.map((e: any) => <div key={e.id} className="border-t pt-2 text-sm"><strong>{e.action.replaceAll('_', ' ')}</strong> · {new Date(e.createdAt).toLocaleString()} · {e.actor}<p>{e.snapshot.fromHallName ? e.snapshot.fromHallName + ' → ' : ''}{e.snapshot.currentHallName || e.snapshot.originalHallName}</p><p>{e.reason}</p></div>)}<h3 className="font-semibold">Room placements</h3>{history.assignments.map((a: any) => <div key={a.id} className="rounded bg-slate-50 p-3 text-sm"><strong>{a.academicYear} · {a.hallName} / {a.roomCode} · {a.status}</strong>{a.events.map((e: any) => <p key={e.id} className="mt-2">{e.action} · {new Date(e.createdAt).toLocaleString()} · {e.actor} · {e.snapshot.before ? `${e.snapshot.before.hallName} / ${e.snapshot.before.roomCode} → ` : ''}{e.snapshot.after?.hallName} / {e.snapshot.after?.roomCode} · {e.reason}</p>)}</div>)}{!history.assignments.length && <p className="text-sm">No room placements recorded.</p>}<button className="text-primary underline" onClick={() => setHistory(null)}>Close history</button></section>}
    </>}
  </div>;
}
