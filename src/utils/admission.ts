import { capitalise } from "./util";

// Fresher admission offer: the student portal's access rules, and the
// admission notice SMS template (below). Portal rules: admissionStatus is
// set to PENDING by "Activate Admission" (Admission Letters) and answered
// ACCEPTED / REJECTED by the student; NULL means no offer (continuing
// students, who always get the full portal). A fresher gets the full portal
// once they've ACCEPTED and their fees are cleared. Mirrors admissionLocked
// in the backend's aisController.

// Freshers = Year 1 (semesters 1 and 2). Only a fresher with an admission
// offer sees the Admission nav item / page / dashboard button; continuing
// students never do.
export const isFresher = (student: any) => student?.semesterNum == 1 || student?.semesterNum == 2;
export const hasAdmissionOffer = (student: any) => isFresher(student) && !!student?.admissionStatus;

// Fees cleared: owes nothing (accountNet <= 0 -- positive means owing, as
// on the FMS debtors list) or has a fee pardon. Same as FMS "eligible".
export const feesCleared = (student: any) => Number(student?.accountNet || 0) <= 0 || !!student?.flagPardon;

// Until a semester-1 fresher has accepted AND cleared their fees, the
// portal is limited to ADMISSION_OPEN_PATHS. Semester 2 is never locked
// (semester-2 fees owed are a normal continuing-student balance).
export const admissionLocked = (student: any) =>
  student?.semesterNum == 1 && !!student?.admissionStatus && (student.admissionStatus !== "ACCEPTED" || !feesCleared(student));

export const ADMISSION_PATH = "/aisp/admission";
export const ADMISSION_OPEN_PATHS = [ADMISSION_PATH, "/aisp/profile", "/aisp/fees", "/aisp/changepwd"];

export const isAdmissionOpenPath = (pathname: string) =>
  ADMISSION_OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

// Admission notice SMS ("Activate Admission"), edited on the admission
// letter form. Keep in sync with admissionSmsText in the backend's
// aisController -- this copy only drives the form's live preview.
export const DEFAULT_ADMISSION_SMS =
  "Congratulations ::first_name! You have been admitted into ::program. Log in to the student portal (::portal_url) to view your admission letter and accept or reject the offer. ::login";

export const ADMISSION_SMS_PLACEHOLDERS: [string, string][] = [
  ["::first_name", "First name (title case)"],
  ["::full_name", "Full name (title case)"],
  ["::student_id", "Application number"],
  ["::program", "Programme (title case)"],
  ["::session_year", "Admission session, e.g. 2026/2027"],
  ["::portal_url", "Student portal address"],
  ["::login", "Username + password (added at the end if left out)"],
];

export function renderAdmissionSms(template: string, st: any, letter: any, login: string, portalUrl: string) {
  const tpl = template?.trim() || DEFAULT_ADMISSION_SMS;
  const first = (st?.fname || "").trim().split(/\s+/)[0] || "";
  const tokens: Record<string, string> = {
    // Names/programme are title-cased; ::login (username + password) is
    // passed through untouched -- the password is case-sensitive.
    "::first_name": capitalise(first),
    "::full_name": capitalise([st?.fname, st?.mname, st?.lname].filter(Boolean).join(" ")),
    "::student_id": st?.id || "",
    "::program": capitalise(letter?.program?.longName) || "your programme",
    "::session_year": letter?.year ? `${letter.year}/${Number(letter.year) + 1}` : "",
    "::portal_url": portalUrl,
    "::login": login,
  };
  const text = tpl.includes("::login") ? tpl : `${tpl} ::login`;
  return text.replace(/::[a-z_]+/g, (t) => tokens[t] ?? t).replace(/\s+/g, " ").replace(/\s+([!.,])/g, "$1").trim();
}

// GSM SMS parts: 160 characters for one, 153 per part once split.
export const smsParts = (text: string) => (text.length <= 160 ? 1 : Math.ceil(text.length / 153));
