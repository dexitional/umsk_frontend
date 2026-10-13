import React from "react";
import { HiOutlineBookOpen, HiOutlineRectangleGroup, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi2";
import { capitalise } from "../../utils/util";

type Props = {
  data: any;
};

function Stat({ Icon, label, value }: { Icon: any; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-primary/[0.04] px-3 py-2.5 ring-1 ring-inset ring-primary/10">
      <Icon className="h-5 w-5 shrink-0 text-secondary-accent" />
      <div className="leading-tight">
        <span className="block text-lg font-extrabold tabular-nums text-primary-dark/70">{value ?? 0}</span>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-primary-dark/70">{label}</span>
      </div>
    </div>
  );
}

// An academic department: its unit, head, and how many courses (through
// curriculum assignments) and staff it has. Theme colours throughout.
function DepartmentCardItem({ data }: Props) {
  const unit = data?.level1?.title;

  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-white font-roboto p-5 ring-1 ring-primary/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.15] hover:ring-primary/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary-accent opacity-[0.08] blur-xl" />

      <div className="relative flex items-start gap-3.5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-primary-dark/70" title={data?.title}>
            {capitalise(data?.title)}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {data?.code ? (
              <span className="rounded-md bg-primary px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-white">{data.code}</span>
            ) : null}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                unit ? "bg-primary/5 text-primary-dark/70" : "bg-slate-50 text-slate-400"
              }`}
            >
              <HiOutlineRectangleGroup className="h-3 w-3" />
              {unit ? capitalise(unit) : "No unit"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-2.5">
        <Stat Icon={HiOutlineBookOpen} label={data?.courses === 1 ? "Course" : "Courses"} value={data?.courses} />
        <Stat Icon={HiOutlineUserGroup} label="Staff" value={data?._count?.staff} />
      </div>

      <div className="relative mt-auto flex items-center gap-2.5 border-t border-primary/10 pt-3.5">
        <HiOutlineUserCircle className={`h-8 w-8 shrink-0 ${data?.head ? "text-primary" : "text-primary/25"}`} />
        <div className="min-w-0 leading-tight">
          <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-primary-dark/70">Head of Department</span>
          <span className={`block truncate ${data?.head ? "text-sm font-semibold text-primary-dark/70" : "text-xs italic text-primary/40"}`}>{data?.head || "Not assigned"}</span>
        </div>
      </div>
    </article>
  );
}

export default DepartmentCardItem;
