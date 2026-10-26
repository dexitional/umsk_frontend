import React, { useEffect, useRef, useState } from 'react';
import { PageHero, PageHeroHeading, PageHeroBadge } from '../../components/PageHero';
import { ModuleTabs, ManagementPanel, StatusBadge, SearchBar, Pagination, RecordDirectory, EmptyState, secondaryButton, editButton, deleteButton, quietButton, recordCard, formPanel, warning, errorNotice, successNotice } from '../../components/management/ManagementUI';
import { HiOutlineBuildingLibrary, HiOutlineHomeModern, HiOutlineUsers, HiOutlineClipboardDocumentList, HiOutlineCalendarDays, HiOutlinePlus, HiOutlineArrowDownTray, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineClock, HiOutlineArrowsRightLeft, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

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
  const [search, setSearch] = useState('');
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
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== filters.search) { setFilters(f => ({ ...f, search: search.trim() })); setPage(1); setHistory(null); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filters.search]);
  useEffect(() => { if (form) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [form]);
  useEffect(() => {
    if (!allowed) { setLoading(false); return; }
    let live = true; setLoading(true); setError(''); setResult(null);
    Promise.all([api.options(), api.assignments({ ...filters, page }), filters.academicYear ? api.occupancy(filters.academicYear) : Promise.resolve([])]).then(([opts, rows, spaces]) => {
      if (!live) return; setOptions(opts); setOccupancy(spaces);
      if (!initialized.current) { initialized.current = true; const current = opts.sessions.find((s: any) => s.default && s.status); if (current?.year) { setFilters(f => ({ ...f, academicYear: yearKey(current.year) })); return; } }
      setResult(rows);
      const lastPage = Math.max(1, Math.ceil(rows.total / 50));
      if (page > lastPage) setPage(lastPage);
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
  return <div className="min-w-0 space-y-6 p-4 md:p-6 md:pl-10">
    <PageHero><PageHeroHeading eyebrow="Academic system" title="Hall Module" description="Manage gender-based halls, rooms and annual placements while preserving every student's original affiliation." Icon={HiOutlineBuildingLibrary} action={<PageHeroBadge Icon={HiOutlineCalendarDays}>{currentYear || 'Annual placements'}</PageHeroBadge>} /></PageHero>
    <ModuleTabs label="Hall management sections" value={tab} disabled={busy} onChange={t => { setTab(t); setForm(null); setHistory(null); }} tabs={[
      { key: 'placements', label: 'Placements & reports', Icon: HiOutlineClipboardDocumentList },
      { key: 'halls', label: 'Halls', Icon: HiOutlineBuildingLibrary },
      { key: 'rooms', label: 'Rooms', Icon: HiOutlineHomeModern },
      { key: 'affiliations', label: 'Affiliations', Icon: HiOutlineUsers },
    ]} />
    {error && <p role="alert" className={errorNotice}>{error} <button disabled={busy || loading} className="underline" onClick={() => setRevision(n => n + 1)}>Retry loading</button></p>}
    {success && <p role="status" className={successNotice}>{success}</p>}
    {loading && <p role="status">Loading hall records…</p>}
    {options && <>
      {options.halls.some((h: any) => !h.gender) && <p role="status" className={warning}>Set Male or Female for each existing hall in the Halls tab. Halls without a configured gender cannot receive new affiliations or room assignments.</p>}
      {!canAssign && <p className={warning}>Assignments and reassignments require an active first semester in Academic Calendar. Existing placements remain valid through the academic year.</p>}
      <div ref={formRef}>
        {['halls', 'rooms'].includes(form?.type) && <RecordForm key={`${form.type}-${form.record?.id || 'new'}`} {...form} options={options} busy={busy} save={save} cancel={() => setForm(null)} />}
        {form?.type === 'assignments' && <AssignmentForm key={form.record?.id || 'new'} record={form.record} options={options} occupancy={filters.academicYear === currentYear ? occupancy : null} current={current} busy={busy} save={save} cancel={() => setForm(null)} />}
        {form?.type === 'release' && <ReleaseForm record={form.record} current={current} busy={busy} cancel={() => setForm(null)} save={(id: string, data: any) => run(async () => { await api.release(id, data); refresh(); }, 'Room released.')} />}
      </div>
      {tab === 'placements' && <ManagementPanel title="Placements & reports" description="Filter placements, review assignment history and export records for reporting." actions={<><button className={button} disabled={busy || loading || !canAssign} onClick={() => { setHistory(null); setForm({ type: 'assignments' }); }}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />Assign student</button><button className={secondaryButton} disabled={busy || loading || !result || search.trim() !== filters.search} onClick={() => run(() => api.report(filters), 'Report downloaded.')}><HiOutlineArrowDownTray aria-hidden="true" className="h-4 w-4" />Download report (CSV)</button></>}>

        <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field title="Academic year"><select className={input} value={filters.academicYear} onChange={e => filter('academicYear', e.target.value)}><option value="">All years</option>{years.map(y => <option key={y}>{y}</option>)}</select></Field>
          <Field title="Hall"><select className={input} value={filters.hallId} onChange={e => filter('hallId', e.target.value)}><option value="">All halls</option>{options.halls.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></Field>
          <Field title="Room"><select className={input} value={filters.roomId} onChange={e => filter('roomId', e.target.value)}><option value="">All rooms</option>{options.rooms.filter((r: any) => !filters.hallId || r.hallId === filters.hallId).map((r: any) => <option key={r.id} value={r.id}>{options.halls.find((h: any) => h.id === r.hallId)?.name} · {r.code}</option>)}</select></Field>
          <Field title="Status"><select className={input} value={filters.status} onChange={e => filter('status', e.target.value)}><option value="">All statuses</option><option>ACTIVE</option><option>RELEASED</option></select></Field>
        </fieldset>
        <SearchBar value={search} onChange={setSearch} label="Search placements" placeholder="Student name, ID or index number…" disabled={busy} loading={loading} refresh={() => setRevision(n => n + 1)} filtered={Object.values(filters).some(Boolean) || !!search} clear={() => { setSearch(''); setFilters(emptyFilters); setPage(1); setHistory(null); }} />
        {result && !loading && <>
          <p className="text-sm">{result.total} placements. Hall and room names in this list are the names recorded at assignment.</p>
          <div className="overflow-x-auto rounded-xl border border-blue-100"><table className="w-full text-left text-sm"><thead className="border-b border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50/60 text-xs uppercase tracking-wide text-primary"><tr>{['Student', 'Academic year', 'Original hall', 'Assigned hall / room', 'Status', 'Actions'].map(h => <th key={h} scope="col" className="whitespace-nowrap px-5 py-4 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{result.rows.map((r: any) => <tr key={r.id} className="align-top text-slate-600 transition-colors hover:bg-blue-50/40"><td className="px-5 py-4"><strong className="font-semibold text-slate-800">{r.studentName}</strong><p>{r.indexno || r.studentId}</p></td><td className="px-5 py-4">{r.academicYear}<p className="text-xs">Year {Math.ceil(r.semesterNum / 2)} at assignment</p></td><td className="px-5 py-4">{r.originalHallName}</td><td className="px-5 py-4">{r.hallName}<p>{r.roomCode} · {r.gender === 'M' ? 'Male' : 'Female'}</p></td><td className="px-5 py-4"><StatusBadge value={r.status} /></td><td className="space-y-2 px-5 py-4">
            {r.academicYear === currentYear && canAssign && <button className={quietButton + ' flex w-fit'} disabled={busy} onClick={() => setForm({ type: 'assignments', record: r })}><HiOutlineArrowsRightLeft aria-hidden="true" className="h-4 w-4" />Reassign</button>}
            {r.academicYear === currentYear && r.status === 'ACTIVE' && <button className={quietButton + ' flex w-fit'} disabled={busy} onClick={() => setForm({ type: 'release', record: r })}><HiOutlineArrowRightOnRectangle aria-hidden="true" className="h-4 w-4" />Release room</button>}
            <button className={quietButton + ' flex w-fit'} disabled={busy} onClick={() => openHistory(r.studentId)}><HiOutlineClock aria-hidden="true" className="h-4 w-4" />Student history</button>
          </td></tr>)}{!result.rows.length && <tr><td colSpan={6} className="p-3"><EmptyState>No placements match these filters.</EmptyState></td></tr>}</tbody></table></div>
          <Pagination total={result.total} page={page} onChange={setPage} disabled={busy || loading} />
        </>}
      </ManagementPanel>}
      {tab === 'halls' && <ManagementPanel title="Halls" description="Manage hall details, gender eligibility and student affiliations." actions={<><button className={button} disabled={busy || loading} onClick={() => setForm({ type: 'halls' })}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />Add hall</button></>}>

        <RecordDirectory key="halls" records={options.halls} label="halls" busy={busy} loading={loading} refresh={() => setRevision(n => n + 1)} searchText={(h: any) => [h.name, h.code, h.gender === 'M' ? 'Male' : h.gender === 'F' ? 'Female' : ''].join(' ')} render={(h: any) => <article key={h.id} className={recordCard}><h2 className="break-words text-lg font-semibold tracking-tight text-primary">{h.name}</h2><p className="text-sm">{h.code} · {h.gender === 'M' ? 'Male' : h.gender === 'F' ? 'Female' : 'Gender not configured'} · <StatusBadge value={!!h.active} /></p>{(h.genderConflicts > 0 || h.roomGenderConflicts > 0) && <p role="alert" className="text-sm text-amber-800">Review existing records: {h.genderConflicts} current affiliations have a different or missing student gender; {h.roomGenderConflicts} rooms have a different gender. Historical affiliations are preserved.</p>}<p className="text-xs">{h._count.rooms} rooms · {h._count.originalStudents} original affiliations · {h._count.currentStudents} current affiliations</p><div className="flex flex-wrap gap-2 border-t border-blue-100 pt-3 text-sm"><button disabled={busy} className={editButton} onClick={() => setForm({ type: 'halls', record: h })}><HiOutlinePencilSquare aria-hidden="true" className="h-4 w-4" />Edit</button><button disabled={busy} className={deleteButton} onClick={() => remove('halls', h)}><HiOutlineTrash aria-hidden="true" className="h-4 w-4" />Delete</button></div></article>} />
      </ManagementPanel>}
      {tab === 'rooms' && <ManagementPanel title="Rooms" description="Manage room capacity and view occupancy for the selected academic year." actions={<><button className={button} disabled={busy || loading || !options.halls.length} onClick={() => setForm({ type: 'rooms' })}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />Add room</button></>}>

        <Field title="Occupancy for academic year"><select className={input} value={filters.academicYear} onChange={e => filter('academicYear', e.target.value)}><option value="">Choose year</option>{years.map(y => <option key={y}>{y}</option>)}</select></Field>
        <RecordDirectory key="rooms" records={options.rooms} label="rooms" busy={busy} loading={loading} refresh={() => setRevision(n => n + 1)} searchText={(r: any) => [r.code, options.halls.find((h: any) => h.id === r.hallId)?.name, r.gender === 'M' ? 'Male' : 'Female'].join(' ')} render={(r: any) => { const used = occupancy.find(o => o.id === r.id); return <article key={r.id} className={recordCard}><h2 className="break-words text-lg font-semibold tracking-tight text-primary">{options.halls.find((h: any) => h.id === r.hallId)?.name} · {r.code}</h2><p className="text-sm">{r.gender === 'M' ? 'Male' : 'Female'} · Capacity {r.capacity} · <StatusBadge value={!!r.active} /></p><p className="text-sm">{loading ? 'Loading occupancy…' : used ? `${used.occupied} occupied · ${used.available} available in ${filters.academicYear}` : 'Choose an academic year to view occupancy.'}</p>{!loading && used && <div role="img" aria-label={`${used.occupied} of ${r.capacity} spaces occupied`} className="h-2 overflow-hidden rounded-full bg-blue-100"><div className={`h-full rounded-full ${used.available <= 0 ? 'bg-rose-500' : 'bg-gradient-to-r from-primary to-secondary-accent'}`} style={{ width: `${Math.min(100, Math.max(0, used.occupied / Math.max(1, r.capacity) * 100))}%` }} /></div>}<div className="flex flex-wrap gap-2 border-t border-blue-100 pt-3 text-sm"><button disabled={busy} className={editButton} onClick={() => setForm({ type: 'rooms', record: r })}><HiOutlinePencilSquare aria-hidden="true" className="h-4 w-4" />Edit</button><button disabled={busy} className={deleteButton} onClick={() => remove('rooms', r)}><HiOutlineTrash aria-hidden="true" className="h-4 w-4" />Delete</button></div></article>; }} />
      </ManagementPanel>}
      {tab === 'affiliations' && <ManagementPanel title="Hall affiliations" description="Find a student to review their original and current hall affiliations.">
        <StudentPicker selected={student} disabled={busy} onSelect={(s: any) => { setStudent(s); setHistory(null); }} />
        {student && <><p className="text-sm">Original affiliation source: {student.originalHallSource || 'Not recorded'}. Legacy values preserve the hall recorded before this module was introduced.</p><button disabled={busy} className={quietButton} onClick={() => openHistory(student.id)}>View affiliation and room history</button>{!student.originalHallId && <OriginalForm student={student} halls={options.halls} busy={busy} save={(id: string, data: any) => run(async () => { const updated = await api.original(id, data); setStudent(updated); refresh(); }, 'Original affiliation recorded.')} />}</>}
      </ManagementPanel>}
      {history && <section className={formPanel}><h2 className="text-lg font-semibold text-primary">Student history — {history.student.id}</h2><p className="text-sm">Original: {history.student.instituteAffliate || 'Not recorded'} · Current: {history.student.currentHall?.name || 'Not recorded'}</p><h3 className="font-semibold text-primary">Affiliation changes</h3>{history.affiliations.map((e: any) => <div key={e.id} className="border-t pt-2 text-sm"><strong>{e.action.replaceAll('_', ' ')}</strong> · {new Date(e.createdAt).toLocaleString()} · {e.actor}<p>{e.snapshot.fromHallName ? e.snapshot.fromHallName + ' → ' : ''}{e.snapshot.currentHallName || e.snapshot.originalHallName}</p><p>{e.reason}</p></div>)}<h3 className="font-semibold text-primary">Room placements</h3>{history.assignments.map((a: any) => <div key={a.id} className="rounded bg-slate-50 p-3 text-sm"><strong>{a.academicYear} · {a.hallName} / {a.roomCode} · {a.status}</strong>{a.events.map((e: any) => <p key={e.id} className="mt-2">{e.action} · {new Date(e.createdAt).toLocaleString()} · {e.actor} · {e.snapshot.before ? `${e.snapshot.before.hallName} / ${e.snapshot.before.roomCode} → ` : ''}{e.snapshot.after?.hallName} / {e.snapshot.after?.roomCode} · {e.reason}</p>)}</div>)}{!history.assignments.length && <p className="text-sm">No room placements recorded.</p>}<button className={quietButton} onClick={() => setHistory(null)}>Close history</button></section>}
    </>}
  </div>;
}
