import React from 'react';
import { Link, useRevalidator } from 'react-router-dom';

export default function AISPSTSCard({ data }: { data: any }) {
  const revalidator = useRevalidator();
  const placement = data?.placement;
  const available = data && Object.prototype.hasOwnProperty.call(data, 'session');
  return <section className="aisp-card p-5 md:p-6 space-y-3">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-extrabold text-slate-900">STS School</h2>
      <Link to="/aisp/sts" className="text-sm font-semibold text-primary underline">Placement history</Link>
    </div>
    {!available ? <div role="alert" className="text-sm text-slate-600">Your STS placement could not be loaded. <button type="button" disabled={revalidator.state === 'loading'} className="text-primary underline" onClick={() => revalidator.revalidate()}>Retry</button></div>
      : !data.session ? <p className="text-sm text-slate-500">No active academic semester is configured.</p>
      : <>
        <p className="text-xs font-semibold text-slate-500">{data.session.title}</p>
        {!placement ? <p className="text-sm text-slate-600">No STS school has been assigned for this semester. Contact the STS coordinator for assistance.</p>
          : <div className="rounded-xl bg-slate-50 p-4 space-y-2">
            <p className="text-base font-bold text-slate-900">{placement.schoolName}</p>
            <p className="text-sm text-slate-600">{[placement.school?.district, placement.school?.address].filter(Boolean).join(' · ')}</p>
            <p className="text-sm"><strong>Mentor:</strong> {placement.mentorName}</p>
            <p className="text-sm text-slate-600">{[placement.mentor?.phone, placement.mentor?.email].filter(Boolean).join(' · ')}</p>
            <p className="text-xs text-slate-500">{placement.status === 'COMPLETED' ? 'Placement completed' : 'Active placement'}</p>
          </div>}
      </>}
  </section>;
}
