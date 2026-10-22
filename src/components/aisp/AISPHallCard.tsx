import React from 'react';
import { useRevalidator } from 'react-router-dom';
export default function AISPHallCard({ data }: { data: any }) {
  const retry = useRevalidator();
  return <section className="aisp-card p-5 md:p-6 space-y-3"><h2 className="text-lg font-extrabold text-slate-900">Hall & room</h2>
    {!data?.student ? <p role="alert" className="text-sm">Your hall and room details could not be loaded. <button className="text-primary underline" disabled={retry.state === 'loading'} onClick={() => retry.revalidate()}>Retry</button></p>
      : <><dl className="grid gap-3 sm:grid-cols-2 text-sm"><div><dt className="text-slate-500">Original hall</dt><dd className="font-semibold">{data.student.instituteAffliate || data.student.originalHall?.name || 'Not recorded'}</dd></div><div><dt className="text-slate-500">Current hall</dt><dd className="font-semibold">{data.student.currentHall?.name || 'Not recorded'}</dd></div></dl>
        {!data.session ? <p className="text-sm text-slate-500">No active academic semester is configured.</p>
          : <div className="rounded bg-slate-50 p-3 text-sm"><p className="font-semibold">{data.academicYear}</p>{data.placement?.status === 'ACTIVE' ? <p>{data.placement.hallName} · Room {data.placement.roomCode}</p> : <p>{data.placement?.status === 'RELEASED' ? 'Your room placement has been released.' : 'No room has been assigned for this academic year.'} Contact the hall office for assistance.</p>}</div>}
      </>}
  </section>;
}
