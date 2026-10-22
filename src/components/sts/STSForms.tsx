import React, { useState } from 'react';
import { stsService } from '../../utils/stsService';
import { requestError } from '../../utils/requestError';

export const inputClass = 'w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm';
export const buttonClass = 'rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50';
export function Field({ label, children }: any) {
  return <label className="flex flex-col gap-1 text-sm text-slate-700"><span>{label}</span>{children}</label>;
}
export function RecordForm({ type, record, schools, busy, save, cancel }: any) {
  const school = type === 'schools';
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values: any = Object.fromEntries(new FormData(event.currentTarget));
    values.active = values.active === 'on';
    save(type, values, record?.id);
  };
  return <form onSubmit={submit} className="rounded-lg border bg-slate-50 p-4 space-y-4">
    <h2 className="font-semibold">{record?.id ? 'Edit' : 'Add'} {school ? 'school' : 'mentor'}</h2>
    <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
      {school ? <Field label="School code"><input className={inputClass} name="code" required maxLength={50} defaultValue={record?.code || ''} /></Field> :
        <Field label="School"><select className={inputClass} name="schoolId" required defaultValue={record?.schoolId || ''}><option value="">Choose school</option>{schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}{!s.active ? ' (inactive)' : ''}</option>)}</select></Field>}
      <Field label={school ? 'School name' : 'Mentor name'}><input className={inputClass} name="name" required maxLength={255} defaultValue={record?.name || ''} /></Field>
      <Field label="Phone"><input className={inputClass} name="phone" maxLength={30} defaultValue={record?.phone || ''} /></Field>
      {school ? <><Field label="District"><input className={inputClass} name="district" maxLength={255} defaultValue={record?.district || ''} /></Field><Field label="Address"><input className={inputClass} name="address" maxLength={500} defaultValue={record?.address || ''} /></Field></> :
        <><Field label="Email"><input className={inputClass} name="email" type="email" maxLength={255} defaultValue={record?.email || ''} /></Field><Field label="Staff login tag (optional)"><input className={inputClass} name="accountTag" maxLength={50} defaultValue={record?.accountTag || ''} /><span className="text-xs text-slate-500">Link an existing staff account and grant it the sts::mentor role in Access Control to let the mentor manage their students.</span></Field></>}
      <label className="flex gap-2 items-center text-sm"><input name="active" type="checkbox" defaultChecked={record?.active ?? true} />Active</label>
    </fieldset>
    <div className="flex gap-3"><button className={buttonClass} disabled={busy}>Save {school ? 'school' : 'mentor'}</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}

export function PlacementForm({ options, record, reassign, busy, save, cancel }: any) {
  const current = options.sessions.find((s: any) => s.default && s.status);
  const [schoolId, setSchoolId] = useState(record?.schoolId || '');
  const [student, setStudent] = useState<any>(record ? { id: record.studentId, name: record.studentName } : null);
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searched, setSearched] = useState(false);
  const school = options.schools.find((s: any) => s.id === schoolId);
  const search = async () => {
    setSearching(true); setSearchError(''); setCandidates([]); setSearched(false);
    try { setCandidates(await stsService.students(query)); setSearched(true); }
    catch (error) { setSearchError(requestError(error)); }
    finally { setSearching(false); }
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!student) { setSearchError('Search for and select a student.'); return; }
    const values: any = Object.fromEntries(new FormData(event.currentTarget));
    values.studentId = student.id; values.sessionId = record?.sessionId || current?.id;
    if (record) values.version = record.version;
    save('assignments', values, record?.id);
  };
  return <form onSubmit={submit} className="rounded-lg border bg-slate-50 p-4 space-y-4">
    <h2 className="font-semibold">{reassign ? 'Reassign student' : 'Assign student to a school'}</h2>
    <p className="text-sm">Semester: <strong>{record?.session?.title || current?.title || 'No active academic semester'}</strong></p>
    <p className="text-xs text-slate-600">Create a fresh placement each semester after student progression. Years 1–3 are eligible each semester; Year 4 is excluded in the final programme semester.</p>
    <fieldset disabled={busy} className="space-y-4">
      {!record && <div className="space-y-2"><Field label="Find student by name, ID or index number"><div className="flex gap-2"><input className={inputClass} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (query.trim().length >= 2 && !searching) search(); } }} /><button type="button" className={buttonClass} disabled={searching || query.trim().length < 2} onClick={search}>{searching ? 'Searching…' : 'Search'}</button></div></Field>
        {searchError && <p role="alert" className="text-red-700">{searchError}</p>}
        {searched && !candidates.length && <p className="text-sm">No students found.</p>}
        {!!candidates.length && <div className="max-h-56 overflow-y-auto rounded border bg-white">{candidates.map(s => <button type="button" key={s.id} disabled={!!s.ineligibleReason} onClick={() => { setStudent(s); setCandidates([]); setSearched(false); }} className="block w-full border-b p-3 text-left text-sm hover:bg-slate-50 disabled:opacity-50"><strong>{s.name}</strong> · {s.indexno || s.id} · Semester {s.semesterNum}<br /><span>{s.ineligibleReason || s.program?.longName}</span></button>)}</div>}
      </div>}
      {student && <p className="rounded bg-blue-50 p-3 text-sm">Selected student: <strong>{student.name}</strong> ({student.indexno || student.id})</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="School"><select className={inputClass} value={schoolId} name="schoolId" required onChange={e => setSchoolId(e.target.value)}><option value="">Choose school</option>{options.schools.filter((s: any) => s.active).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
        <Field label="Mentor"><select key={schoolId} className={inputClass} name="mentorId" required defaultValue={schoolId === record?.schoolId ? record?.mentorId : ''}><option value="">Choose mentor</option>{school?.mentors.filter((m: any) => m.active).map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>{school && !school.mentors.some((m: any) => m.active) && <span className="text-xs text-red-700">Add an active mentor to this school first.</span>}</Field>
      </div>
      {reassign && <Field label="Reason for reassignment"><input className={inputClass} name="reason" maxLength={1000} required /></Field>}
      <Field label="Placement notes"><textarea className={inputClass} name="notes" maxLength={5000} defaultValue={record?.notes || ''} /></Field>
    </fieldset>
    <div className="flex gap-3"><button className={buttonClass} disabled={busy || !student || !current}>{reassign ? 'Save reassignment' : 'Assign student'}</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}

export function ProgressForm({ record, admin, busy, save, cancel }: any) {
  const [status, setStatus] = useState(record.status);
  return <form className="rounded-lg border bg-slate-50 p-4 space-y-4" onSubmit={e => {
    e.preventDefault(); const values: any = Object.fromEntries(new FormData(e.currentTarget));
    save('assignments', { ...values, version: record.version }, record.id);
  }}>
    <h2 className="font-semibold">Update placement — {record.studentName}</h2>
    <fieldset disabled={busy} className="space-y-4">
      <Field label="Status"><select name="status" className={inputClass} value={status} onChange={e => setStatus(e.target.value)}>{(record.status === 'CANCELLED' ? ['CANCELLED'] : ['ACTIVE', 'COMPLETED', ...(admin ? ['CANCELLED'] : [])]).map(s => <option key={s}>{s}</option>)}</select></Field>
      {status === 'CANCELLED' && <Field label="Cancellation reason"><input className={inputClass} name="reason" required maxLength={1000} /></Field>}
      <Field label="Mentor / placement notes"><textarea name="notes" maxLength={5000} className={inputClass} defaultValue={record.notes || ''} /></Field>
    </fieldset>
    <div className="flex gap-3"><button className={buttonClass} disabled={busy}>Save progress</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}
