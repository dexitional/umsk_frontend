// Maximum marks per assessment component, from a grading scheme's
// scoreRange, e.g. { quiz: 20, midsem: 20, assignment: 20, class: 60, exam: 40 }.
// Falls back to these defaults when a scheme has no (or an invalid) value.
export const SCORE_RANGE_DEFAULTS = { quiz: 20, midsem: 20, assignment: 20, class: 60, exam: 40 };
export type ScoreKey = keyof typeof SCORE_RANGE_DEFAULTS;

export function scoreMax(scheme: any, key: ScoreKey): number {
  let range = scheme?.scoreRange;
  if (typeof range === "string") {
    try {
      range = JSON.parse(range);
    } catch {
      range = null;
    }
  }
  const v = Number(range?.[key]);
  return v > 0 ? v : SCORE_RANGE_DEFAULTS[key];
}
