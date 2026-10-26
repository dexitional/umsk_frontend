import React, { useEffect, useRef, useState } from 'react';
import { PageHero, PageHeroHeading, PageHeroBadge } from '../../components/PageHero';
import { ModuleTabs, ManagementPanel, StatusBadge, SearchBar, Pagination, RecordDirectory, EmptyState, secondaryButton, editButton, deleteButton, quietButton, recordCard, formPanel, warning, errorNotice, successNotice } from '../../components/management/ManagementUI';
import { HiOutlineAcademicCap, HiOutlineBuildingOffice2, HiOutlineUsers, HiOutlineClipboardDocumentList, HiOutlineCalendarDays, HiOutlinePlus, HiOutlineArrowDownTray, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineClock, HiOutlineArrowsRightLeft } from 'react-icons/hi2';

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
  const [search, setSearch] = useState('');
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
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== filters.search) { setFilters(f => ({ ...f, search: search.trim() })); setPage(1); setHistory(null); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filters.search]);
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
      const lastPage = Math.max(1, Math.ceil(rows.total / 50));
      if (page > lastPage) setPage(lastPage);
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
  return <div className="min-w-0 space-y-6 p-4 md:p-6 md:pl-10">
    <PageHero><PageHeroHeading eyebrow="Academic system" title="STS Module" description="Supported Teaching in Schools. Manage school placements, mentors and each student's semester history." Icon={HiOutlineAcademicCap} action={<PageHeroBadge Icon={HiOutlineCalendarDays}>{current?.title || 'Semester placements'}</PageHeroBadge>} /></PageHero>
    <ModuleTabs label="STS sections" value={tab} disabled={busy} onChange={t => { setTab(t); setForm(null); setHistory(null); }} tabs={[
      { key: 'placements', label: 'Placements & reports', Icon: HiOutlineClipboardDocumentList },
      ...(admin ? [{ key: 'schools', label: 'Schools', Icon: HiOutlineBuildingOffice2 }, { key: 'mentors', label: 'Mentors', Icon: HiOutlineUsers }] : []),
    ]} />
    {error && <div role="alert" className={errorNotice}>{error} <button type="button" className="underline" disabled={busy || loading} onClick={() => setRefresh(n => n + 1)}>Refresh data</button></div>}
    {success && <p role="status" className={successNotice}>{success}</p>}
    {loading && <p role="status" className="text-sm">Loading STS records…</p>}
    {options && <>
      {admin && !current && <p className={warning}>Set an active default semester in Academic Calendar before assigning students.</p>}
      <div ref={formRef} className="scroll-mt-4">
        {form?.type === 'assignments' && <PlacementForm key={`${form.record?.id || 'new'}-${form.record?.version || ''}`} options={options} record={form.record} reassign={!!form.record} busy={busy} save={save} cancel={() => setForm(null)} />}
        {form?.type === 'progress' && <ProgressForm key={form.record.id} record={form.record} admin={admin} busy={busy} save={save} cancel={() => setForm(null)} />}
        {['schools', 'mentors'].includes(form?.type) && <RecordForm key={`${form.type}-${form.record?.id || 'new'}`} type={form.type} record={form.record} schools={options.schools} busy={busy} save={save} cancel={() => setForm(null)} />}
      </div>
      {tab === 'placements' && <ManagementPanel title="Placements & reports" description="Filter placements, review assignment history and export records for reporting." actions={<>
          {admin && <button type="button" className={buttonClass} disabled={busy || loading || !current} onClick={() => openForm({ type: 'assignments' })}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />Assign student</button>}
          <button type="button" className={secondaryButton} disabled={busy || loading || !result || search.trim() !== filters.search} onClick={() => run(() => stsService.report(filters), 'Report downloaded.')}><HiOutlineArrowDownTray aria-hidden="true" className="h-4 w-4" />Download filtered report (CSV)</button>
        </>}>

        <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Academic semester"><select className={inputClass} value={filters.sessionId} onChange={e => changeFilter('sessionId', e.target.value)}><option value="">All semesters</option>{options.sessions.map((s: any) => <option key={s.id} value={s.id}>{s.title}{s.default ? ' (current)' : ''}</option>)}</select></Field>
          <Field label="School"><select className={inputClass} value={filters.schoolId} onChange={e => changeFilter('schoolId', e.target.value)}><option value="">All schools</option>{options.schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Mentor"><select className={inputClass} value={filters.mentorId} onChange={e => changeFilter('mentorId', e.target.value)}><option value="">All mentors</option>{mentors.filter((m: any) => !filters.schoolId || m.schoolId === filters.schoolId).map((m: any) => <option key={m.id} value={m.id}>{m.name} — {m.schoolName}</option>)}</select></Field>
          <Field label="Programme"><select className={inputClass} value={filters.programId} onChange={e => changeFilter('programId', e.target.value)}><option value="">All programmes</option>{options.programs.map((p: any) => <option key={p.id} value={p.id}>{p.longName}</option>)}</select></Field>
          <Field label="Year at assignment"><select className={inputClass} value={filters.yearGroup} onChange={e => changeFilter('yearGroup', e.target.value)}><option value="">All years</option>{[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}</select></Field>
          <Field label="Status"><select className={inputClass} value={filters.status} onChange={e => changeFilter('status', e.target.value)}><option value="">All statuses</option>{['ACTIVE', 'COMPLETED', 'CANCELLED'].map(s => <option key={s}>{s}</option>)}</select></Field>
        </fieldset>
        <SearchBar value={search} onChange={setSearch} label="Search placements" placeholder="Student name, ID or index number…" disabled={busy} loading={loading} refresh={() => setRefresh(n => n + 1)} filtered={Object.values(filters).some(Boolean) || !!search} clear={() => { setSearch(''); setFilters(blankFilters); setPage(1); setHistory(null); }} />
        {result && !loading && <>
          <div className="flex flex-wrap items-center gap-3 text-sm"><span className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white px-4 py-2 font-semibold text-primary">{result.total.toLocaleString()} placements</span>{result.counts.map((c: any) => <span key={c.status} className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2"><StatusBadge value={c.status} /><strong className="text-slate-700">{c._count._all}</strong></span>)}</div>
          <p className="text-xs text-slate-500">Reports use the programme, year, school and mentor recorded at assignment. Choose All semesters to see a student's placement history.</p>
          <div className="overflow-x-auto rounded-xl border border-blue-100"><table className="w-full text-left text-sm"><thead className="border-b border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50/60 text-xs uppercase tracking-wide text-primary"><tr>{['Student', 'Semester / year', 'School / mentor', 'Status', 'Actions'].map(h => <th key={h} scope="col" className="whitespace-nowrap px-5 py-4 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">
            {result.rows.map((r: any) => <tr key={r.id} className="align-top text-slate-600 transition-colors hover:bg-blue-50/40"><td className="px-5 py-4"><strong className="font-semibold text-slate-800">{r.studentName}</strong><p>{r.indexno || r.studentId}</p><p className="text-xs text-slate-500">{r.programName}</p></td><td className="px-5 py-4">{r.session.title}<p className="text-xs">Year {r.yearGroup} · Semester {r.semesterNum}</p></td><td className="px-5 py-4">{r.schoolName}<p className="text-xs">{r.mentorName}</p></td><td className="px-5 py-4"><StatusBadge value={r.status} /></td><td className="px-5 py-4"><div className="flex flex-col items-start gap-2">
              {(admin || r.status !== 'CANCELLED') && <button type="button" disabled={busy} className={quietButton} onClick={() => openForm({ type: 'progress', record: r })}>Update progress</button>}
              {admin && r.sessionId === current?.id && <button type="button" disabled={busy} className={quietButton} onClick={() => openForm({ type: 'assignments', record: r })}><HiOutlineArrowsRightLeft aria-hidden="true" className="h-4 w-4" />Reassign</button>}
              <button type="button" disabled={busy} className={quietButton} onClick={() => run(async () => { const events = await stsService.history(r.id); setHistory({ record: r, events }); setForm(null); })}><HiOutlineClock aria-hidden="true" className="h-4 w-4" />View history</button>
            </div></td></tr>)}
            {!result.rows.length && <tr><td colSpan={5} className="p-3"><EmptyState>No placements match these filters.</EmptyState></td></tr>}
          </tbody></table></div>
          <Pagination total={result.total} page={page} onChange={setPage} disabled={busy || loading} />
        </>}
        {history && <section className={formPanel}><h2 className="break-words text-lg font-semibold tracking-tight text-primary">Placement history — {history.record.studentName}</h2>{history.events.map((e: any) => <div key={e.id} className="border-t pt-3 text-sm"><strong>{e.action}</strong> · {new Date(e.createdAt).toLocaleString()} · {e.actor}<p>{e.snapshot.schoolName} · {e.snapshot.mentorName} · {e.snapshot.status}</p>{e.reason && <p>Reason: {e.reason}</p>}{e.snapshot.notes && <p className="whitespace-pre-wrap">Notes: {e.snapshot.notes}</p>}</div>)}<button onClick={() => setHistory(null)} className={quietButton}>Close history</button></section>}
      </ManagementPanel>}
      {tab === 'schools' && admin && <ManagementPanel title="Schools" description="Maintain the schools available for Supported Teaching in Schools placements." actions={<><button type="button" className={buttonClass} disabled={busy || loading} onClick={() => openForm({ type: 'schools' })}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />Add school</button></>}>

        <p className="text-xs text-slate-500">Deactivate schools with historical placements. A school can be deleted only when it has no mentors or placements.</p>
        <RecordDirectory key="schools" records={options.schools} label="schools" busy={busy} loading={loading} refresh={() => setRefresh(n => n + 1)} searchText={(s: any) => [s.name, s.code, s.district, s.address, s.phone].filter(Boolean).join(' ')} render={(s: any) => <article key={s.id} className={recordCard}><h2 className="break-words text-lg font-semibold tracking-tight text-primary">{s.name}</h2><p className="text-sm">{s.code} · <StatusBadge value={!!s.active} /></p><p className="break-words text-sm">{[s.district, s.address, s.phone].filter(Boolean).join(' · ')}</p><p className="text-xs">{s.mentors.length} mentors · {s._count.assignments} placements</p><div className="flex flex-wrap gap-2 border-t border-blue-100 pt-3 text-sm"><button disabled={busy} className={editButton} onClick={() => openForm({ type: 'schools', record: s })}><HiOutlinePencilSquare aria-hidden="true" className="h-4 w-4" />Edit</button><button disabled={busy} className={quietButton} onClick={() => { setTab('mentors'); openForm({ type: 'mentors', record: { schoolId: s.id } }); }}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />Add mentor</button><button disabled={busy} className={deleteButton} onClick={() => remove('schools', s)}><HiOutlineTrash aria-hidden="true" className="h-4 w-4" />Delete</button></div></article>} />
      </ManagementPanel>}
      {tab === 'mentors' && admin && <ManagementPanel title="Mentors" description="Manage school mentors and their linked staff accounts." actions={<><button type="button" className={buttonClass} disabled={busy || loading || !options.schools.length} onClick={() => openForm({ type: 'mentors' })}><HiOutlinePlus aria-hidden="true" className="h-4 w-4" />Add mentor</button></>}>

        <RecordDirectory key="mentors" records={mentors} label="mentors" busy={busy} loading={loading} refresh={() => setRefresh(n => n + 1)} searchText={(m: any) => [m.name, m.schoolName, m.phone, m.email, m.accountTag].filter(Boolean).join(' ')} render={(m: any) => <article key={m.id} className={recordCard}><h2 className="break-words text-lg font-semibold tracking-tight text-primary">{m.name}</h2><p className="text-sm">{m.schoolName} · <StatusBadge value={!!m.active} /></p><p className="break-words text-sm">{[m.phone, m.email].filter(Boolean).join(' · ')}</p>{m.accountTag && <p className="text-xs">Linked staff login: {m.accountTag}</p>}<div className="flex flex-wrap gap-2 border-t border-blue-100 pt-3 text-sm"><button disabled={busy} className={editButton} onClick={() => openForm({ type: 'mentors', record: m })}><HiOutlinePencilSquare aria-hidden="true" className="h-4 w-4" />Edit</button><button disabled={busy} className={deleteButton} onClick={() => remove('mentors', m)}><HiOutlineTrash aria-hidden="true" className="h-4 w-4" />Delete</button></div></article>} />
      </ManagementPanel>}
    </>}
  </div>;
}
