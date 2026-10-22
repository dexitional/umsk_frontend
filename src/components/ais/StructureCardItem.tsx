import React from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineBuildingLibrary,
  HiOutlineCalendarDays,
  HiOutlineLockClosed,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Form, Link } from "react-router-dom";
import { useHasRole } from "../../utils/roles";
import { capitalise } from "../../utils/util";

type Props = {
  data: any;
};

// Theme colours only: one primary gradient for every card; the category is
// told apart by shades of primary (solid / accent / light).
const CATEGORY: Record<string, { label: string; pill: string }> = {
  C: { label: "Compulsory", pill: "bg-primary-dark/70 text-white" },
  E: { label: "Elective", pill: "bg-secondary-accent text-white" },
  O: { label: "Optional", pill: "bg-primary/5 text-primary" },
};

function Chip({ Icon, children, title }: { Icon: any; children: React.ReactNode; title?: string }) {
  return (
    <span title={title} className="inline-flex min-w-0 items-center gap-1.5 rounded-lg bg-primary/[0.04] px-2.5 py-1 text-[0.7rem] font-semibold text-primary-dark/70">
      <Icon className="h-3.5 w-3.5 shrink-0 text-secondary-accent" />
      <span className="truncate">{children}</span>
    </span>
  );
}

// One curriculum entry: a course mounted on a programme (and optionally a
// major) in a given year/semester, assigned to a department.
function StructureCardItem({ data }: Props) {
  const canEditStructure = useHasRole("ais", ["curriculum::admin"]);
  const cat = CATEGORY[data?.type] || CATEGORY.O;
  const year = Math.ceil((data?.semesterNum || 0) / 2);
  const semester = data?.semesterNum % 2 === 0 ? 2 : 1;
  const credits = data?.course?.creditHour;
  const active = data?.status !== false;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white font-roboto ring-1 ring-primary/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.15] hover:ring-primary/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Category accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-secondary via-primary to-secondary-accent" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Code + category */}
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-lg bg-primary-dark/70 px-2.5 py-1 text-xs font-bold tracking-wider text-white shadow-sm shadow-primary-dark/20">
            {data?.courseId}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            {data?.type === "E" && data?.lock ? (
              <span title="Locked on registration" className="inline-flex items-center gap-1 rounded-full bg-primary-dark px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                <HiOutlineLockClosed className="h-3 w-3" /> Locked
              </span>
            ) : null}
            <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${cat.pill}`}>{cat.label}</span>
          </div>
        </div>

        {/* Course title */}
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-primary-dark/70" title={data?.course?.title}>
          {capitalise(data?.course?.title) || "Untitled course"}
        </h3>

        {/* Key facts */}
        <div className="flex flex-wrap gap-1.5">
          <Chip Icon={HiOutlineCalendarDays}>
            Year {year || "—"} · Sem {semester}
          </Chip>
          {credits != null ? <Chip Icon={HiOutlineBookOpen}>{credits} Credit{credits == 1 ? "" : "s"}</Chip> : null}
          <Chip Icon={HiOutlineBuildingLibrary} title={data?.unit?.title ? "Department" : "No department assigned"}>
            {data?.unit?.title ? capitalise(data.unit.title) : <span className="italic font-medium text-primary/40">No department</span>}
          </Chip>
        </div>

        <p className="text-xs text-primary-dark/70">Grading scheme: <strong>{data?.scheme?.title || "Not assigned"}</strong></p>

        {/* Programme (+ major) */}
        <div className="mt-auto flex items-start gap-2.5 rounded-xl bg-gradient-to-br from-primary/[0.06] to-white p-3 ring-1 ring-inset ring-primary/10">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary via-primary to-secondary-accent text-white">
            <HiOutlineAcademicCap className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-xs font-semibold leading-snug text-primary-dark/70" title={data?.program?.longName}>
              {capitalise(data?.program?.longName) || "—"}
            </p>
            {data?.major ? (
              <p className="mt-0.5 truncate text-[0.7rem] text-primary-dark/70">Major: {capitalise(data.major.longName || data.major.shortName)}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-primary/10 bg-primary/[0.03] px-5 py-3">
        <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-semibold ${active ? "text-primary-dark/70" : "text-primary/40"}`}>
          <span className={`h-2 w-2 rounded-full ${active ? "bg-secondary-accent shadow-[0_0_0_3px_rgba(57,124,166,0.18)]" : "bg-primary/20"}`} />
          {active ? "Active" : "Inactive"}
        </span>
        {canEditStructure ? (
          <div className="flex items-center gap-1.5">
            <Link
              to={`${encodeURIComponent(data?.id)}/edit`}
              title="Edit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20 transition-colors hover:bg-primary hover:text-white hover:ring-primary"
            >
              <HiOutlinePencilSquare className="h-3.5 w-3.5" /> Edit
            </Link>
            <Form
              method="post"
              action={`${data?.id}/destroy`}
              onSubmit={(e) => {
                if (!confirm(`Remove ${data?.courseId} from this curriculum?`)) e.preventDefault();
              }}
            >
              <button
                type="submit"
                title="Delete"
                aria-label={`Delete ${data?.courseId}`}
                className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white text-primary/50 ring-1 ring-inset ring-primary/20 transition-colors hover:bg-rose-600 hover:text-white hover:ring-rose-600"
              >
                <HiOutlineTrash className="h-3.5 w-3.5" />
              </button>
            </Form>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default StructureCardItem;
