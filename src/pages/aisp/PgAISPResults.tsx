import React from "react";
import { GrDocumentLocked } from "react-icons/gr";
import { BsInfoCircle } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
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

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <AISPPageHeader title="Results Statement" subtitle="Your academic transcript by semester" />

      <div className="p-4 md:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-4">
        <BsInfoCircle className="h-5 w-5 md:h-6 md:w-6 text-primary/50 shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-slate-500">
          Courses marked <span className="font-semibold text-primary">Incomplete (I)</span> are not included in your CGPA until a final score is recorded.
        </p>
      </div>

      <div className="space-y-6">
        {data &&
          Array.from(data).map(([title, row, meta]: any) => (
            <ResultListView
              key={title}
              title={title.toUpperCase()}
              data={row}
              meta={meta}
            />
          ))}

        {sum > 0 && !student?.flagPardon ? (
          <div className="p-5 md:p-6 bg-white border border-red-100 rounded-2xl shadow-sm flex items-center gap-5">
            <GrDocumentLocked className="hidden md:flex h-12 w-12 text-red-400 shrink-0" />
            <div className="flex flex-col space-y-1">
              <h3 className="text-sm md:text-base font-semibold text-primary">
                Sorry, you have an accrued debt of{" "}
                <span className="text-red-500">
                  {fees && fees[0]?.currency} {sum.toFixed(2) || 0}
                </span>
              </h3>
              <p className="text-xs md:text-sm text-slate-400">
                Please contact the <b>Finance office</b> to resolve any debt
                related issues with your receipts.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {!data.length ? (
        <div className="p-10 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
          <h1 className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            No Academic Statement ...
          </h1>
        </div>
      ) : null}
    </div>
  );
}

export default PgAISPResults;
