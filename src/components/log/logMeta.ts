import { IconType } from "react-icons";
import {
  HiOutlineAcademicCap,
  HiOutlineBanknotes,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineClipboardDocumentCheck,
  HiOutlineKey,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
} from "react-icons/hi2";

// Display metadata for the categories the backend assigns (logController.ts).
export const CATEGORY_META: Record<string, { label: string; Icon: IconType; chip: string; dot: string }> = {
  assessment: { label: "Assessments", Icon: HiOutlineClipboardDocumentCheck, chip: "bg-orange-50 text-orange-700 ring-orange-200", dot: "bg-orange-500" },
  auth: { label: "Authentication", Icon: HiOutlineKey, chip: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  students: { label: "Students", Icon: HiOutlineUserGroup, chip: "bg-violet-50 text-violet-700 ring-violet-200", dot: "bg-violet-500" },
  academics: { label: "Academics", Icon: HiOutlineAcademicCap, chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  finance: { label: "Finance", Icon: HiOutlineBanknotes, chip: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  messaging: { label: "Messaging", Icon: HiOutlineChatBubbleLeftEllipsis, chip: "bg-pink-50 text-pink-700 ring-pink-200", dot: "bg-pink-500" },
  other: { label: "Other", Icon: HiOutlineSquares2X2, chip: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
};
export const CATEGORY_ORDER = ["assessment", "auth", "students", "academics", "finance", "messaging", "other"];

// Change type for record-level audit entries.
export const changeType = (action: string): "created" | "updated" | "deleted" | null =>
  /_(CREATED|CREATE|ADDED)$/.test(action) ? "created" : /_(UPDATED|UPDATE|PUBLISHED|CHANGED|RESET)$/.test(action) ? "updated" : /_(DELETED|DELETE|REMOVED|REVOKED)$/.test(action) ? "deleted" : null;

export const CHANGE_STYLE = {
  created: { label: "Created", chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", row: "bg-emerald-50/50", accent: "text-emerald-700" },
  updated: { label: "Updated", chip: "bg-amber-50 text-amber-700 ring-amber-200", row: "bg-amber-50/50", accent: "text-amber-700" },
  deleted: { label: "Deleted", chip: "bg-rose-50 text-rose-700 ring-rose-200", row: "bg-rose-50/50", accent: "text-rose-700" },
};

// "ASSESSMENT_UPDATED" -> "Assessment updated"
export const humanize = (action = "") => {
  const s = action.toLowerCase().replace(/_/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const initials = (name?: string | null, fallback = "?") =>
  (name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || fallback;

const FIELD_LABELS: Record<string, string> = {
  classScore: "Class score", examScore: "Exam score", totalScore: "Total score", status: "Published", semesterNum: "Semester",
  courseId: "Course", sessionId: "Session", schemeId: "Scheme", indexno: "Index no.", credit: "Credit", type: "Type",
  scoreA: "Score A", scoreB: "Score B", scoreC: "Score C", id: "Record ID",
};
export const fieldLabel = (f: string) => FIELD_LABELS[f] || f;

export const formatValue = (v: any) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

// One-line description for the table.
export function summarize(log: any): string {
  const m = log?.meta;
  if (m?.table === "ais_assessment" && Array.isArray(m.records)) {
    const n = m.count ?? m.records.length;
    const records = `${n} record${n == 1 ? "" : "s"}`;
    if (changeType(log.action) === "updated") {
      const fields = [...new Set(m.records.flatMap((r: any) => Object.keys(r.changes || {})))].map(fieldLabel);
      return `${records} · ${fields.slice(0, 3).join(", ")}${fields.length > 3 ? ` +${fields.length - 3}` : ""}`;
    }
    const courses = [...new Set(m.records.map((r: any) => r.courseId).filter(Boolean))];
    return `${records}${courses.length ? ` · ${courses.slice(0, 2).join(", ")}${courses.length > 2 ? ` +${courses.length - 2}` : ""}` : ""}`;
  }
  if (m && typeof m === "object" && !Array.isArray(m)) {
    const keys = Object.keys(m).filter((k) => !["password", "unlockPin", "token"].includes(k));
    return keys.slice(0, 3).map((k) => `${k}: ${typeof m[k] === "object" ? "…" : String(m[k]).slice(0, 24)}`).join(" · ");
  }
  return typeof m === "number" || typeof m === "string" ? String(m) : "";
}
