import moment from "moment";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineNoSymbol, HiOutlinePlayCircle } from "react-icons/hi2";

// Where an evaluation form stands right now: disabled, or (when enabled)
// where today falls in its open window. Shared by the form cards and the
// form's detail page so they always agree. Each state has an icon + label,
// so it never relies on colour alone.
export type FormState = "disabled" | "scheduled" | "closed" | "always" | "open";

export function evaluationWindowState(form: any) {
  if (!form?.status) return { key: "disabled" as FormState, label: "Disabled", Icon: HiOutlineNoSymbol, pill: "bg-slate-100 text-slate-500" };
  const now = moment();
  const start = form?.startDate ? moment(form.startDate) : null;
  const end = form?.endDate ? moment(form.endDate) : null;
  if (start && now.isBefore(start)) return { key: "scheduled" as FormState, label: "Scheduled", Icon: HiOutlineClock, pill: "bg-primary/5 text-primary-dark/70" };
  if (end && now.isAfter(end)) return { key: "closed" as FormState, label: "Closed", Icon: HiOutlineCheckCircle, pill: "bg-slate-100 text-slate-500" };
  if (!start && !end) return { key: "always" as FormState, label: "Always open", Icon: HiOutlinePlayCircle, pill: "bg-secondary-accent text-white" };
  return { key: "open" as FormState, label: "Open now", Icon: HiOutlinePlayCircle, pill: "bg-secondary-accent text-white" };
}

// Share of the open window already elapsed (0-100); null without a full window.
export function evaluationWindowElapsed(form: any) {
  if (!form?.startDate || !form?.endDate) return null;
  const start = moment(form.startDate).valueOf();
  const end = moment(form.endDate).valueOf();
  if (end <= start) return null;
  return Math.max(0, Math.min(100, ((Date.now() - start) / (end - start)) * 100));
}
