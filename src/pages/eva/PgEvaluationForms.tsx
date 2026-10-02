import React from "react";
import { HiArrowRight, HiCheck, HiOutlineChatBubbleLeftRight, HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import AISPEmpty from "../../components/aisp/AISPEmpty";
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

  const done = data.filter((form: any) => form.completed).length;

  return (
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="culture"
        eyebrow="Academics"
        title="Evaluations"
        subtitle="Assess your registered courses under each open evaluation form — completed courses show a receipt automatically."
        Icon={HiOutlineChatBubbleLeftRight}
      >
        {data.length ? (
          <span className="px-3 py-1.5 rounded-full bg-white/[0.15] ring-1 ring-inset ring-white/25 backdrop-blur text-xs font-bold text-white whitespace-nowrap">
            {done} of {data.length} completed
          </span>
        ) : null}
      </AISPPageHeader>

      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        {data.map((form: any, i: number) => (
          <div
            key={form.id}
            style={{ animationDelay: `${i * 60}ms` }}
            className="aisp-rise aisp-card relative overflow-hidden p-5 md:p-6 flex flex-col gap-5"
          >
            <div className={`pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-2xl ${form.completed ? "bg-emerald-300/25" : "bg-sky-300/25"}`} />
            <div className="relative flex items-start justify-between gap-3">
              <div
                className={`h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg ${
                  form.completed ? "from-emerald-400 to-teal-500 shadow-emerald-500/30" : "from-sky-500 to-indigo-600 shadow-sky-500/30"
                }`}
              >
                {form.completed ? <HiCheck className="h-6 w-6" /> : <HiOutlineClipboardDocumentCheck className="h-6 w-6" />}
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ring-1 ring-inset ${
                  form.completed ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"
                }`}
              >
                {form.completed ? "Completed" : "Open"}
              </span>
            </div>
            <div className="relative flex-1 space-y-1">
              <h3 className="text-base font-bold text-slate-900">{form.name}</h3>
              {form.description ? <p className="text-sm text-slate-500">{form.description}</p> : null}
            </div>
            <Link to={form.key} className={`relative ${form.completed ? "aisp-btn-soft" : "aisp-btn-primary"}`}>
              {form.completed ? "View Receipt" : "Start Assessment"}
              <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      {!data.length ? (
        <div className="aisp-card">
          <AISPEmpty
            title="No evaluations open right now"
            message="When an evaluation window opens for your courses, it will appear here."
            Icon={HiOutlineChatBubbleLeftRight}
          />
        </div>
      ) : null}
    </div>
  );
}

export default PgEvaluationForms;
