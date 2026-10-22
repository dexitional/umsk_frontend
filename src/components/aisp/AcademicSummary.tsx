import React from 'react';
import { formatGpa, transcriptSummary } from '../../utils/academic';

export default function AcademicSummary({ data }: { data: any }) {
  const summary = transcriptSummary(data);
  if (!summary.available) return <section role="status" className="rounded-2xl border p-5">
    <h2 className="font-bold">Academic summary unavailable</h2>
    <p className="text-sm">Results could not be loaded. Refresh the page to try again.</p>
  </section>;
  const items = [
    ['CGPA', formatGpa(summary.cgpa)],
    ['Graded credits', summary.credit],
    ['Incomplete', summary.incomplete],
    ['Invalid results', summary.invalid],
    ['Unpublished', summary.unpublished],
    ['Courses without a recorded pass', summary.failedCourses],
  ];
  return <section className="rounded-2xl border bg-white p-5 space-y-3">
    <h2 className="font-bold text-primary-dark">Academic summary</h2>
    <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(([label, value]) => <div key={label}>
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="text-lg font-bold tabular-nums">{value}</dd>
      </div>)}
    </dl>
    <p className="text-xs text-slate-500">CGPA includes published, validly graded results only. Incomplete, invalid and unpublished results are excluded. Course failures are separate from resit registrations.</p>
  </section>;
}
