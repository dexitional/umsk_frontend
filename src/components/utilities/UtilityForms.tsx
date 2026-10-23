import React, { useEffect, useState } from 'react';
import { utilitiesService as api } from '../../utils/utilitiesService';
export const input = 'w-full rounded border border-slate-300 bg-white p-2 text-sm';
export const button = 'rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50';
export const studentName = (s: any) => [s?.fname, s?.mname, s?.lname].filter(Boolean).join(' ') || s?.id || 'Student';
export const Field = ({ title, children }: { title: string; children: React.ReactNode }) => <label className="block space-y-1 text-sm"><span className="font-medium">{title}</span>{children}</label>;
export function LookupForm({ meta, record, busy, save, cancel }: any) {
  const [values, setValues] = useState<any>(() => ({ ...Object.fromEntries(meta.fields.map((f: any) => [f.key, record?.[f.key] ?? ''])), status: record?.status ?? true }));
  return <form onSubmit={e => { e.preventDefault(); save({ ...values, updatedAt: record?.updatedAt }); }} className="rounded border bg-slate-50 p-4 space-y-4">
    <h2 className="font-semibold">{record ? 'Edit' : 'Add'} {meta.title.toLowerCase()}</h2>
    <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2">{meta.fields.map((f: any) => <Field key={f.key} title={f.label + (f.required ? ' *' : '')}><input className={input} type={f.type || 'text'} min={f.type === 'number' ? 1 : undefined} max={f.type === 'number' ? 2147483647 : undefined} step={f.type === 'number' ? 1 : undefined} maxLength={f.max} required={f.required} value={values[f.key]} onChange={e => setValues((v: any) => ({ ...v, [f.key]: e.target.value }))} /></Field>)}
      <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={values.status} onChange={e => setValues((v: any) => ({ ...v, status: e.target.checked }))} />Active — available for selection</label>
    </fieldset>
    <div className="flex gap-3"><button className={button} disabled={busy}>Save</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}
export function ChangeForm({ record, options, busy, save, cancel }: any) {
  const [student, setStudent] = useState<any>(record?.student || null);
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [values, setValues] = useState({ sessionId: record?.sessionId || options.sessions[0]?.id || '', newProgramId: record?.newProgramId || '', newSemesterNum: record?.newSemesterNum || '', reason: record?.reason || '' });
  useEffect(() => {
    if (record || query.trim().length < 2) { setStudents([]); setSearching(false); return; }
    let live = true; setSearching(true); setError('');
    const timer = setTimeout(() => api.students(query.trim()).then(rows => { if (live) setStudents(rows); }).catch(e => { if (live) { setStudents([]); setError(e.message); } }).finally(() => { if (live) setSearching(false); }), 300);
    return () => { live = false; clearTimeout(timer); };
  }, [query, record]);
  const program = options.programs.find((p: any) => p.id === values.newProgramId);
  return <form className="rounded border bg-slate-50 p-4 space-y-4" onSubmit={e => { e.preventDefault(); save({ ...values, studentId: student?.id, updatedAt: record?.updatedAt }); }}>
    <h2 className="font-semibold">{record ? 'Edit' : 'New'} change of program</h2>
    <p className="text-sm text-slate-600">Save a draft, then review and approve it to update the student. The index number and existing academic records are retained.</p>
    <fieldset disabled={busy} className="space-y-3">
      {!record && <Field title="Find student"><input className={input} value={query} maxLength={100} placeholder="Enter at least 2 characters: ID, index number or name" onChange={e => { setQuery(e.target.value); setStudent(null); }} /></Field>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {searching ? <p role="status">Searching…</p> : !record && query.trim().length >= 2 && !student && <div className="max-h-52 overflow-y-auto rounded border bg-white">{students.map(s => <button type="button" key={s.id} className="block w-full border-b p-2 text-left text-sm hover:bg-slate-100" onClick={() => { setStudent(s); setValues(v => ({ ...v, newProgramId: '' })); }}>{studentName(s)} · {s.indexno || s.id}<span className="block text-slate-500">{s.program?.longName || 'No program'}</span></button>)}{!students.length && <p className="p-3">No students found.</p>}</div>}
      {student && <p className="rounded bg-white p-3 text-sm"><strong>{studentName(student)}</strong> · {student.indexno || student.id}<br />Current program: {record?.oldprogram?.longName || student.program?.longName || student.programId} · Semester {student.semesterNum}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field title="Academic session *"><select required className={input} value={values.sessionId} onChange={e => setValues(v => ({ ...v, sessionId: e.target.value }))}><option value="">Choose current session</option>{options.sessions.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}</select></Field>
        <Field title="Destination program *"><select required className={input} value={values.newProgramId} onChange={e => setValues(v => ({ ...v, newProgramId: e.target.value }))}><option value="">Choose program</option>{options.programs.filter((p: any) => p.id !== student?.programId).map((p: any) => <option key={p.id} value={p.id}>{p.longName}</option>)}</select></Field>
        <Field title="Destination semester number *"><input className={input} type="number" min={1} max={program?.semesterTotal || 100} step={1} required value={values.newSemesterNum} onChange={e => setValues(v => ({ ...v, newSemesterNum: e.target.value }))} /></Field>
        <Field title="Reason *"><textarea className={input} required maxLength={255} value={values.reason} onChange={e => setValues(v => ({ ...v, reason: e.target.value }))} /></Field>
      </div>
    </fieldset>
    <div className="flex gap-3"><button className={button} disabled={busy || !student || !options.sessions.length}>Save draft</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}
export function ApprovalForm({ record, options, busy, approve, cancel }: any) {
  const [majorId, setMajorId] = useState('');
  return <form className="rounded border bg-amber-50 p-4 space-y-3" onSubmit={e => { e.preventDefault(); approve(majorId); }}>
    <h2 className="font-semibold">Approve change for {studentName(record.student)}</h2>
    <p>{record.oldprogram?.longName} → {record.newprogram?.longName}</p>
    <p className="text-sm">{record.session?.title} · Destination semester {record.newSemesterNum} · Index number {record.oldIndexno}</p>
    <p className="text-sm">Reason: {record.reason || 'Not recorded'}</p>
    {record.newprogram?.hasMajor && <Field title="Destination major *"><select required disabled={busy} className={input} value={majorId} onChange={e => setMajorId(e.target.value)}><option value="">Choose major</option>{options.majors.filter((m: any) => m.programId === record.newProgramId).map((m: any) => <option key={m.id} value={m.id}>{m.longName || m.shortName}</option>)}</select></Field>}
    <p className="text-sm">Approval changes the student's current program, major and semester. The approved record remains in the history.</p>
    <div className="flex gap-3"><button className={button} disabled={busy}>Approve and apply</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}
