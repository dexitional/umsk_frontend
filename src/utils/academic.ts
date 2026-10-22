export const formatGpa = (value: number | null | undefined) =>
  value == null || !Number.isFinite(Number(value)) ? '--' : Number(value).toFixed(2);

// Presentation only: every numeric total comes from the transcript API.
export function transcriptSummary(data: any) {
  const available = Array.isArray(data) && data.every((group: any) => Array.isArray(group) && Array.isArray(group[1]) && group[2] != null && Number.isFinite(group[2].cumulativeCredit) && Number.isFinite(group[2].cumulativeIncomplete));
  const groups = available ? data : [];
  const meta = groups[groups.length - 1]?.[2];
  return {
    available, groups,
    cgpa: meta?.cgpa ?? null,
    credit: meta?.cumulativeCredit ?? 0,
    incomplete: meta?.cumulativeIncomplete ?? 0,
    invalid: meta?.cumulativeInvalid ?? 0,
    unpublished: meta?.cumulativeUnpublished ?? 0,
    failedCourses: meta?.failedCourses ?? 0,
    cgpas: groups.map((group: any) => formatGpa(group[2].cgpa)),
    credits: groups.map((group: any) => group[2].cumulativeCredit),
    points: groups.map((group: any) => group[2].cumulativeGradepoint),
  };
}

export function studentStatus(student: any) {
  if (!student || typeof student.completeStatus !== 'boolean') return 'Unavailable';
  if (student.completeStatus) return 'Completed';
  if (student.deferStatus) return 'Deferred';
  return 'Active';
}

export const visibleGrade = (row: any) => row.totalScore == null ? 'I'
  : row.status !== true ? 'Unpublished' : row.validGrade === false ? 'Invalid' : row.grade;

export const visiblePoints = (row: any) => row.includedInGpa === true && row.gradepoint != null
  ? (Number(row.gradepoint) * Number(row.credit)).toFixed(1) : '--';

export function resitNotice(summary: any) {
  const resit = summary?.resit;
  if (!Number.isInteger(resit?.count) || resit.count < 0 || !Array.isArray(resit?.items)) {
    return { tone: 'neutral', badge: 'UNAVAILABLE', title: 'Resit Status', message: 'Resit status could not be loaded. Please try again.' };
  }
  if (resit.count > 0) {
    const listed = resit.items.slice(0, 2).map((r: any) => `${r.courseId} (${r.trailSessionTitle || 'period unknown'})`).join(', ');
    const more = resit.count > 2 ? `, and ${resit.count - 2} more` : '';
    return { tone: 'warning', badge: `${resit.count} OUTSTANDING`, title: 'Resit Status', message: `You have outstanding resit(s): ${listed}${more}. Pay and register promptly.` };
  }
  return { tone: 'neutral', badge: 'NONE RECORDED', title: 'Resit Status', message: 'No outstanding resit registrations are recorded. Check your academic summary for failed or incomplete results.' };
}
