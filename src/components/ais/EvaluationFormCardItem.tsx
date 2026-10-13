import moment from "moment";
import React from "react";
import {
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { Form, Link } from "react-router-dom";
import { evaluationWindowElapsed, evaluationWindowState } from "../../utils/evaluation";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

const windowState = evaluationWindowState;
const elapsed = evaluationWindowElapsed;

function Stat({ Icon, value, label }: { Icon: any; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-primary/5 px-3 py-2">
      <Icon className="h-[18px] w-[18px] shrink-0 text-secondary-accent" />
      <div className="leading-tight">
        <span className="block text-base font-extrabold tabular-nums text-primary-dark/70">{value}</span>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-primary-dark/50">{label}</span>
      </div>
    </div>
  );
}

// One evaluation form: its key, live state and window, how big it is, and
// which year groups it targets.
function EvaluationFormCardItem({ data }: Props) {
  const canEdit = useHasRole("ais", ["evaluation::admin"]);
  const canDelete = useHasRole("ais", ["evaluation::admin"]);
  const state = windowState(data);
  const progress = state.key === "open" ? elapsed(data) : null;
  const years: number[] = (data?.yearGroups || []).map((yg: any) => Number(yg.yearGroup)).filter((n: number) => !isNaN(n)).sort();
  const questions = data?._count?.questions ?? 0;
  const guides = data?._count?.guides ?? 0;
  const relative =
    state.key === "open" && data?.endDate
      ? `Closes ${moment(data.endDate).fromNow()}`
      : state.key === "scheduled" && data?.startDate
      ? `Opens ${moment(data.startDate).fromNow()}`
      : state.key === "closed" && data?.endDate
      ? `Closed ${moment(data.endDate).fromNow()}`
      : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white font-roboto ring-1 ring-primary/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.15] hover:ring-primary/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="h-1.5 w-full bg-gradient-to-r from-secondary via-primary to-secondary-accent" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Key + state */}
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-lg bg-primary-dark/70 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">{data?.key || "form"}</span>
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${state.pill}`}>
            <state.Icon className="h-3.5 w-3.5" />
            {state.label}
          </span>
        </div>

        {/* Name */}
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-primary-dark/70" title={data?.name}>
          {data?.name || "Untitled form"}
        </h3>

        {/* Size */}
        <div className="grid grid-cols-2 gap-2.5">
          <Stat Icon={HiOutlineBookOpen} value={questions} label={questions === 1 ? "Question" : "Questions"} />
          <Stat Icon={HiOutlineCheckCircle} value={guides} label={guides === 1 ? "Guide" : "Guides"} />
        </div>

        {/* Window */}
        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-white p-3">
          <div className="flex items-center justify-between gap-2 text-[0.7rem]">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-primary-dark/50">
              <HiOutlineCalendarDays className="h-4 w-4 text-secondary-accent" /> Window
            </span>
            {relative ? <span className="font-semibold text-primary-dark/70">{relative}</span> : null}
          </div>
          {data?.startDate || data?.endDate ? (
            <>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-primary-dark/70">
                <span>
                  <span className="block text-[0.6rem] font-semibold uppercase tracking-wider text-primary-dark/40">Opens</span>
                  <b>{data?.startDate ? moment(data.startDate).format("MMM D, YYYY · HH:mm") : "—"}</b>
                </span>
                <span className="text-right">
                  <span className="block text-[0.6rem] font-semibold uppercase tracking-wider text-primary-dark/40">Closes</span>
                  <b>{data?.endDate ? moment(data.endDate).format("MMM D, YYYY · HH:mm") : "—"}</b>
                </span>
              </div>
              {progress != null ? (
                <div className="mt-2.5" title={`${Math.round(progress)}% of the window elapsed`}>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                    <div className="dash-grow-x h-full rounded-full bg-secondary-accent" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="mt-1.5 text-xs text-primary-dark/50">No opening or closing date set.</p>
          )}
        </div>

        {/* Year groups */}
        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          <HiOutlineUserGroup className="mr-0.5 h-4 w-4 text-secondary-accent" />
          {years.length ? (
            years.map((y) => (
              <span key={y} className="rounded-md bg-primary/5 px-2 py-0.5 text-[0.7rem] font-semibold text-primary-dark/70">
                Year {y}
              </span>
            ))
          ) : (
            <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[0.7rem] font-semibold text-primary-dark/70">All years</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 border-t border-primary/10 bg-primary/[0.03] px-5 py-3">
        <Link
          to={`${encodeURIComponent(data?.id)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-dark/70 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <HiOutlineEye className="h-3.5 w-3.5" /> View
        </Link>
        <div className="flex items-center gap-1.5">
          {canEdit ? (
            <Link
              to={`${encodeURIComponent(data?.id)}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-primary-dark/70 ring-1 ring-inset ring-primary/20 transition-colors hover:bg-primary hover:text-white hover:ring-primary"
            >
              <HiOutlinePencilSquare className="h-3.5 w-3.5" /> Edit
            </Link>
          ) : null}
          {canDelete ? (
            <Form
              method="post"
              action={`${data?.id}/destroy`}
              onSubmit={(e) => {
                if (!confirm(`Delete the evaluation form "${data?.name}"?`)) e.preventDefault();
              }}
            >
              <button
                type="submit"
                title="Delete"
                aria-label={`Delete ${data?.name}`}
                className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white text-primary/50 ring-1 ring-inset ring-primary/20 transition-colors hover:bg-rose-600 hover:text-white hover:ring-rose-600"
              >
                <HiOutlineTrash className="h-3.5 w-3.5" />
              </button>
            </Form>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default EvaluationFormCardItem;
