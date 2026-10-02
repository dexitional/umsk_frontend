import React from "react";
import {
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlineLockClosed,
  HiOutlinePresentationChartLine,
} from "react-icons/hi2";
import { useLoaderData } from "react-router-dom";
import AISPEmpty from "../../components/aisp/AISPEmpty";
import AISPGpaChart from "../../components/aisp/AISPGpaChart";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import AISPPanel from "../../components/aisp/AISPPanel";
import { AISPPhotoBlend } from "../../components/aisp/AISPPhotoBlend";
import ResultListView from "../../components/aisp/ResultListView";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

export async function loader() {
  const user = useUserStore.getState().user;
  // gpa/cgpa are computed server-side (fetchStudentTranscript) — the single
  // source of truth shared with the admin transcript view, so both always
  // agree instead of each re-deriving its own (which had drifted).
  const data = await Service.fetchStudentTranscript(user?.user?.tag);
  const fees = await Service.fetchStudentFinance(user?.user?.tag);
  const student = await Service.fetchStudent(user?.user?.tag);

  return { data, fees, student };
}

function PgAISPResults({}: Props) {
  const { data, fees, student }: any = useLoaderData();
  const sum = fees?.reduce((sum: any, cur: any) => cur.amount + sum, 0);
  // Groups arrive oldest-first, each carrying its running CGPA, so the
  // current CGPA is the last group's that has one.
  const groups: any[] = Array.isArray(data) ? data : [];
  const metas = groups.map(([, , meta]: any) => meta);
  const cgpa = [...metas].reverse().find((m: any) => m?.cgpa != null)?.cgpa ?? null;
  const credits = metas.reduce((total: number, m: any) => total + (m?.credit || 0), 0);
  const points = groups.map(([title, rows, meta]: any, i: number) => ({
    title,
    label: rows?.[0]?.semesterNum ? `S${rows[0].semesterNum}` : `S${i + 1}`,
    gpa: meta?.gpa ?? null,
    cgpa: meta?.cgpa ?? null,
    credit: meta?.credit ?? 0,
  }));

  return (
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="culture"
        eyebrow="Academics"
        title="Results Statement"
        subtitle="Your academic transcript by semester, with GPA and running CGPA."
        Icon={HiOutlineChartBar}
      />

      {groups.length ? (
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Headline CGPA */}
          <div className="aisp-rise relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-secondary via-primary to-sky-700 shadow-xl shadow-primary/25 flex flex-col justify-between gap-6">
            <AISPPhotoBlend photo="lab" fade="bottom" className="opacity-40" />
            <div className="pointer-events-none absolute inset-0 aisp-grid opacity-70" />
            <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-sky-400/30 blur-3xl" />
            <div className="relative">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-200">Cumulative GPA</span>
              <div className="mt-2 text-6xl font-extrabold tracking-tight leading-none">
                {cgpa == null ? "—" : Number(cgpa).toFixed(2)}
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white/10 ring-1 ring-inset ring-white/[0.15]">
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-sky-100/80">Graded credits</span>
                <span className="block mt-0.5 text-lg font-bold">{credits.toFixed(1)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 ring-1 ring-inset ring-white/[0.15]">
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-sky-100/80">Semesters</span>
                <span className="block mt-0.5 text-lg font-bold">{groups.length}</span>
              </div>
            </div>
          </div>

          <AISPPanel
            title="GPA by semester"
            subtitle="Hover or focus a column for details"
            Icon={HiOutlinePresentationChartLine}
            className="lg:col-span-2"
          >
            <AISPGpaChart points={points} />
          </AISPPanel>
        </div>
      ) : null}

      <div className="aisp-rise p-4 rounded-2xl bg-sky-50/70 ring-1 ring-inset ring-sky-100 flex items-start gap-3">
        <HiOutlineInformationCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">
          Courses marked <span className="font-semibold text-slate-900">Incomplete (I)</span> are not included in your CGPA until a final score is recorded.
        </p>
      </div>

      {sum > 0 && !student?.flagPardon ? (
        <div className="aisp-rise p-5 md:p-6 rounded-3xl bg-gradient-to-r from-rose-50 to-white ring-1 ring-inset ring-rose-100 flex items-center gap-5">
          <div className="hidden md:flex h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white items-center justify-center shadow-lg shadow-rose-500/30">
            <HiOutlineLockClosed className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm md:text-base font-bold text-slate-900">
              Sorry, you have an accrued debt of{" "}
              <span className="text-rose-600">
                {fees && fees[0]?.currency} {sum.toFixed(2) || 0}
              </span>
            </h3>
            <p className="text-xs md:text-sm text-slate-500">
              Please contact the <b>Finance office</b> to resolve any debt
              related issues with your receipts.
            </p>
          </div>
        </div>
      ) : null}

      <div className="space-y-6">
        {groups.map(([title, row, meta]: any) => (
          <ResultListView key={title} title={title.toUpperCase()} data={row} meta={meta} />
        ))}
      </div>

      {!groups.length ? (
        <div className="aisp-card">
          <AISPEmpty
            title="No academic statement yet"
            message="Your semester results will appear here once they are published."
            Icon={HiOutlineChartBar}
          />
        </div>
      ) : null}
    </div>
  );
}

export default PgAISPResults;
