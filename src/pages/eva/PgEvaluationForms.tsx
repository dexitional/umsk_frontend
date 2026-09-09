import React from "react";
import { HiCheckCircle, HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { Link, useLoaderData } from "react-router-dom";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import Service from "../../utils/aisService";

type Props = {};

export async function loader() {
  const data = await Service.fetchAvailableEvaluationForms();
  return { data: Array.isArray(data) ? data : [] };
}

function PgEvaluationForms({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <AISPPageHeader
        title="Evaluations"
        subtitle="Assess your registered courses under each open evaluation form — completed courses show a receipt automatically"
      />

      <div className="space-y-4">
        {data.map((form: any) => (
          <div
            key={form.id}
            className="p-4 md:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4"
          >
            {form.completed ? (
              <HiCheckCircle className="hidden md:flex h-10 w-10 text-green-500 shrink-0" />
            ) : (
              <HiOutlineClipboardDocumentCheck className="hidden md:flex h-10 w-10 text-primary/40 shrink-0" />
            )}
            <div className="flex-1 flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-semibold text-primary">
                  {form.name}
                </h3>
                {form.completed && (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[0.65rem] font-semibold uppercase tracking-wider">
                    Completed
                  </span>
                )}
              </div>
              {form.description ? (
                <p className="text-xs md:text-sm text-slate-400">{form.description}</p>
              ) : null}
            </div>
            <Link
              to={form.key}
              className={`px-5 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase transition-colors whitespace-nowrap ${
                form.completed
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-secondary-accent text-white hover:bg-secondary-accent/90"
              }`}
            >
              {form.completed ? "View Receipt" : "Assess"}
            </Link>
          </div>
        ))}
      </div>

      {!data.length ? (
        <div className="p-10 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
          <h1 className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            No Evaluations Open Right Now ...
          </h1>
        </div>
      ) : null}
    </div>
  );
}

export default PgEvaluationForms;
