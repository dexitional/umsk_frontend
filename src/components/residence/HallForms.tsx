import React, { useEffect, useState } from 'react';
import { residenceService } from '../../utils/residenceService';
import { requestError } from '../../utils/requestError';
export const input = 'w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100';
export const button = 'rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50';
export const Field = ({ title, children }: any) => <label className="flex flex-col gap-1 text-sm font-medium">{title}{children}</label>;
export function StudentPicker({ selected, onSelect, disabled = false }: any) {
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let live = true; setRows([]); setError('');
    if (search.trim().length < 2) { setLoading(false); return; }
    setLoading(true);
    const timer = setTimeout(() => { residenceService.students(search.trim()).then(data => { if (live) setRows(data); }).catch(e => { if (live) setError(requestError(e)); }).finally(() => { if (live) setLoading(false); }); }, 250);
    return () => { live = false; clearTimeout(timer); };
  }, [search]);
  return <div className="space-y-2">
    <Field title="Find student"><input className={input} placeholder="Student ID, index number or name" value={search} maxLength={100} disabled={disabled} onChange={e => setSearch(e.target.value)} /></Field>
    {loading && <p role="status" className="text-sm">Searching students…</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {!loading && !error && search.trim().length >= 2 && !rows.length && <p className="text-sm">No matching students.</p>}
    <div className="max-h-48 overflow-y-auto">{rows.map(s => <button type="button" disabled={disabled} key={s.id} className="block w-full border-b p-2 text-left text-sm hover:bg-slate-50" onClick={() => { onSelect(s); setSearch(''); }}>{[s.fname, s.lname].filter(Boolean).join(' ')} · {s.indexno || s.id}</button>)}</div>
    {selected && <div className="rounded bg-slate-100 p-3 text-sm"><strong>{[selected.fname, selected.lname].filter(Boolean).join(' ')} · {selected.id}</strong><p>Year {Math.ceil((selected.semesterNum || 0) / 2) || 'not set'} · Semester {selected.semesterNum || 'not set'} · Gender {selected.gender || 'not set'}</p><p>Original hall: {selected.instituteAffliate || selected.originalHall?.name || 'Not recorded'} · Current hall: {selected.currentHall?.name || 'Not recorded'}</p></div>}
  </div>;
}
export function RecordForm({ type, record, options, busy, save, cancel }: any) {
  const isRoom = type === 'rooms';
  return <form className="rounded border bg-slate-50 p-4 space-y-4" onSubmit={e => {
    e.preventDefault(); const data: any = Object.fromEntries(new FormData(e.currentTarget)); data.active = data.active === 'on';
    if (isRoom) data.capacity = Number(data.capacity);
    if (record) data.version = record.version;
    save(type, data, record?.id);
  }}>
    <h2 className="font-bold">{record ? 'Edit' : 'Add'} {isRoom ? 'room' : 'hall'}</h2>
    <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2">
      {isRoom && <Field title="Hall"><select className={input} name="hallId" required defaultValue={record?.hallId || ''}><option value="">Choose hall</option>{options.halls.map((h: any) => <option key={h.id} value={h.id}>{h.name}{h.active ? '' : ' (inactive)'}</option>)}</select></Field>}
      <Field title={isRoom ? 'Room number' : 'Hall code'}><input className={input} name="code" maxLength={50} required defaultValue={record?.code || ''} /></Field>
      {!isRoom && <Field title="Hall name"><input className={input} name="name" maxLength={350} required defaultValue={record?.name || ''} /></Field>}
      {isRoom && <><Field title="Gender"><select className={input} name="gender" required defaultValue={record?.gender || ''}><option value="">Choose gender</option><option value="M">Male</option><option value="F">Female</option></select></Field><Field title="Capacity"><input className={input} type="number" name="capacity" min={1} max={10000} step={1} required defaultValue={record?.capacity || ''} /></Field></>}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={record?.active ?? true} />Active</label>
    </fieldset>
    <p className="text-xs text-slate-600">Records used in placements must be deactivated instead of deleted. Historical placement details are preserved.</p>
    <div className="flex gap-3"><button className={button} disabled={busy}>Save</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}
export function AssignmentForm({ record, options, occupancy, current, busy, save, cancel }: any) {
  const [student, setStudent] = useState<any>(null);
  const [hallId, setHallId] = useState(record?.hallId || '');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!record) return;
    let live = true;
    residenceService.students(record.studentId).then(rows => { if (live) { const st = rows.find((s: any) => s.id === record.studentId); if (!st) throw new Error('Student not found.'); setStudent(st); } }).catch(e => { if (live) setError(requestError(e)); });
    return () => { live = false; };
  }, [record]);
  const crossHall = student?.currentHallId && student.currentHallId !== hallId;
  const gender = ['M', 'MALE'].includes(student?.gender?.toUpperCase()) ? 'M' : ['F', 'FEMALE'].includes(student?.gender?.toUpperCase()) ? 'F' : null;
  const rooms = options.rooms.filter((r: any) => r.hallId === hallId && r.active && r.gender === gender);
  const missingOriginal = student && !student.originalHallId && (student.semesterNum !== 1 || student.instituteAffliate);
  return <form className="rounded border bg-slate-50 p-4 space-y-4" onSubmit={e => {
    e.preventDefault(); const data: any = Object.fromEntries(new FormData(e.currentTarget));
    save('assignments', { ...data, studentId: student?.id, sessionId: current?.id, version: record?.version,
      expectedHallId: student?.currentHallId ?? null, reaffiliate: data.reaffiliate === 'on' }, record?.id);
  }}>
    <h2 className="font-bold">{record ? 'Reassign room' : 'Assign room'} — {current?.title || 'No current semester'}</h2>
    {!record ? <StudentPicker selected={student} disabled={busy} onSelect={(s: any) => { setStudent(s); setHallId(s.currentHallId || ''); }} /> : <p className="text-sm">{record.studentName} · {record.studentId}</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {missingOriginal && <p role="alert" className="text-amber-800">Record this student's original hall in Affiliations before assigning a room.</p>}
    {student && <p className="text-sm">Original: {student.instituteAffliate || 'Will be recorded with first assignment'} · Current: {student.currentHall?.name || 'Not recorded'}</p>}
    <fieldset disabled={busy || !student || !!missingOriginal} className="grid gap-3 sm:grid-cols-2">
      <Field title="Assigned hall"><select className={input} required value={hallId} onChange={e => setHallId(e.target.value)}><option value="">Choose hall</option>{options.halls.filter((h: any) => h.active).map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></Field>
      <Field title="Room"><select key={hallId + (student?.id || '')} className={input} name="roomId" required defaultValue={record?.hallId === hallId ? record.roomId : ''}><option value="">Choose room</option>{rooms.map((r: any) => { const used = occupancy?.find((o: any) => o.id === r.id); const available = used ? used.available + (record?.roomId === r.id && record?.status === 'ACTIVE' ? 1 : 0) : null; return <option key={r.id} value={r.id} disabled={available === 0}>{r.code} · {r.gender === 'M' ? 'Male' : 'Female'} · {available == null ? 'capacity ' + r.capacity : available + ' spaces available'}</option>; })}</select></Field>
      {!gender && <p className="text-sm text-amber-800">Record the student's gender before choosing a room.</p>}
      {crossHall && <label className="sm:col-span-2 flex gap-2 text-sm"><input type="checkbox" name="reaffiliate" required />Change the current hall to this room's hall. The original hall will remain unchanged.</label>}
      <Field title={`Reason${record || crossHall ? ' (required)' : ' (optional)'}`}><textarea name="reason" className={input} maxLength={1000} required={!!record || !!crossHall} /></Field>
    </fieldset>
    <p className="text-xs text-slate-600">Assignments and reassignments are allowed only in the active first semester. Placement remains valid for that academic year.</p>
    <div className="flex gap-3"><button className={button} disabled={busy || !student || !!missingOriginal || current?.semester !== 'SEM1'}>Save placement</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div>
  </form>;
}
export function OriginalForm({ student, halls, busy, save }: any) {
  return <form className="rounded border p-4 space-y-3" onSubmit={e => { e.preventDefault(); save(student.id, Object.fromEntries(new FormData(e.currentTarget))); }}>
    <h2 className="font-semibold">Record original hall</h2>
    <p className="text-sm">Record the hall at admission. For continuing students, verify it from admission records. This becomes permanent; later transfers change only the current hall.</p>
    <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2"><Field title="Original hall"><select className={input} name="hallId" required defaultValue=""><option value="">Choose hall</option>{halls.filter((h: any) => h.active).map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></Field><Field title="Reason / source of affiliation"><textarea className={input} name="reason" maxLength={1000} required /></Field></fieldset>
    <button disabled={busy} className={button}>Record affiliation</button>
  </form>;
}
export function ReleaseForm({ record, current, busy, save, cancel }: any) {
  return <form className="rounded border p-4 space-y-3" onSubmit={e => { e.preventDefault(); save(record.id, { ...Object.fromEntries(new FormData(e.currentTarget)), sessionId: current?.id, version: record.version }); }}><h2 className="font-bold">Release room — {record.studentName}</h2><p className="text-sm">Free the room space for this academic year. Original and current hall affiliations are retained.</p><Field title="Release reason"><textarea className={input} name="reason" maxLength={1000} required disabled={busy} /></Field><div className="flex gap-3"><button className={button} disabled={busy}>Release room</button><button type="button" disabled={busy} onClick={cancel}>Cancel</button></div></form>;
}
