import React, { useEffect, useState } from 'react';
import { stsService } from '../../utils/stsService';
import { requestError } from '../../utils/requestError';

export default function PgAISPSTS() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let live = true; setLoading(true); setError('');
    stsService.mine().then(data => { if (live) setRows(data); }).catch(e => { if (live) setError(requestError(e)); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [refresh]);
  return <div className="p-4 md:p-6 space-y-5"><h1 className="text-xl font-semibold">Supported Teaching in Schools</h1><p className="text-sm text-slate-600">Your school and mentor assignments for each academic semester.</p>
    {loading && <p role="status">Loading placements…</p>}
    {error && <p role="alert" className="text-red-700">{error} <button className="underline" onClick={() => setRefresh(n => n + 1)}>Retry</button></p>}
    {!loading && !error && !rows.length && <p>No STS placement has been recorded for you. Contact the STS coordinator for assistance.</p>}
    {!loading && !error && rows.map(r => <article key={r.id} className="rounded-lg border bg-white p-5 space-y-2"><h2 className="font-semibold">{r.session.title}{r.session.default ? ' · Current semester' : ''}</h2><p className="text-sm">Year {r.yearGroup} · Student semester {r.semesterNum} · {r.status}</p><p><strong>School:</strong> {r.schoolName}</p><p className="text-sm">{[r.school.district, r.school.address].filter(Boolean).join(' · ')}</p><p><strong>Mentor:</strong> {r.mentorName}</p>{r.status !== 'CANCELLED' && <p className="text-sm">{[r.mentor.phone, r.mentor.email].filter(Boolean).join(' · ')}</p>}{r.notes && <p className="whitespace-pre-wrap text-sm">{r.notes}</p>}</article>)}
  </div>;
}
