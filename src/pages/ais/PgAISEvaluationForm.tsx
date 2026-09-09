import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { MdEditDocument, MdToggleOff, MdToggleOn } from "react-icons/md";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchEvaluationForm(params.formId);
  return { data, params };
}

function PgAISEvaluationForm({}: Props) {
  const navigate = useNavigate();
  const { data, params }: any = useLoaderData();
  const canEdit = useHasRole("ais", ["evaluation::admin"]);

  const toggleStatus = async () => {
    const ok = window.confirm(
      data?.status ? "Disable this evaluation form?" : "Enable this evaluation form?"
    );
    if (ok) {
      const resp = await Service.updateEvaluationForm(params?.formId, {
        status: !data?.status,
      });
      if (resp) navigate(0);
    }
  };

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle title={data?.name} page="Evaluation Manager" link="/ais/evaluation-forms" />

      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.name}
            </h1>
            <span className="text-xs text-gray-400">
              key: <b>{data?.key}</b>
            </span>
            {data?.description && (
              <p className="text-sm text-gray-500 max-w-xl">{data?.description}</p>
            )}
          </div>
          {canEdit && (
            <Link
              to="edit"
              className="py-1.5 px-3 rounded-md flex items-center space-x-1.5 bg-primary/60"
            >
              <MdEditDocument className="h-4 w-4 text-green-200" />
              <span className="text-sm text-white font-semibold">Edit</span>
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={canEdit ? toggleStatus : undefined}
            disabled={!canEdit}
            className={`p-1.5 px-3 rounded-full flex items-center space-x-2 ${
              data?.status
                ? "bg-green-500/5 border-green-500/20"
                : "bg-gray-200/40 border-gray-300"
            } border shadow disabled:cursor-not-allowed`}
          >
            {data?.status ? (
              <MdToggleOn className="h-6 w-6 text-green-700" />
            ) : (
              <MdToggleOff className="h-6 w-6 text-gray-400" />
            )}
            <span className="text-sm font-semibold text-gray-600">
              {data?.status ? "Enabled" : "Disabled"}
            </span>
          </button>

          <div className="p-1.5 px-3 rounded-full flex items-center space-x-2 bg-white border shadow">
            <span className="text-sm text-gray-500">
              Year Groups:{" "}
              <b>
                {data?.yearGroups?.length
                  ? data.yearGroups.map((yg: any) => yg.yearGroup).sort().join(", ")
                  : "All"}
              </b>
            </span>
          </div>

          {(data?.startDate || data?.endDate) && (
            <div className="p-1.5 px-3 rounded-full flex items-center space-x-2 bg-white border shadow">
              <span className="text-sm text-gray-500">
                Window:{" "}
                <b>
                  {data?.startDate ? moment(data.startDate).format("MMM DD, YY HH:mm") : "—"}
                  {" → "}
                  {data?.endDate ? moment(data.endDate).format("MMM DD, YY HH:mm") : "—"}
                </b>
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-1 gap-4">
          <div className="p-3 md:p-4 border rounded-lg bg-white space-y-2 order-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Questions ({data?.questions?.length ?? 0})
            </h2>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {data?.questions?.map((q: any) => (
                <div key={q.id} className="p-2 border rounded text-sm text-gray-600 flex flex-col ">
                  <span>{q.question}</span>
                  <span className="text-[0.6rem] text-gray-400 whitespace-nowrap ml-2">
                    {q.category} {q.yearGroup ? `· Y${q.yearGroup}` : ""} {!q.status ? "· DISABLED" : ""}
                  </span>
                </div>
              ))}
              {!data?.questions?.length && (
                <div className="text-xs text-gray-400">No questions yet.</div>
              )}
            </div>
          </div>

          <div className="p-3 md:p-4 border rounded-lg bg-white space-y-2 order-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Guides ({data?.guides?.length ?? 0})
            </h2>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {data?.guides?.map((g: any) => (
                <div key={g.id} className="p-2 border rounded text-sm text-gray-600">
                  <div className="font-semibold">{g.title || "(untitled)"}</div>
                  <div className="text-xs text-gray-500">{g.description}</div>
                </div>
              ))}
              {!data?.guides?.length && (
                <div className="text-xs text-gray-400">No guides yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PgAISEvaluationForm;
