import React, { useState } from "react";
import { HiOutlineAdjustmentsHorizontal, HiOutlineArrowRight } from "react-icons/hi2";
import { Link, redirect, useLoaderData, useNavigation } from "react-router-dom";
import EvaluationFormCardItem from "../../components/ais/EvaluationFormCardItem";
import PageTitle from "../../components/ais/PageTitle";
import EvaluationFormShimCard from "../../components/shims/EvaluationFormShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";
type Props = {};

export async function action({ params }) {
  await Service.deleteEvaluationForm(params.formId);
  return redirect("/ais/evaluation-forms");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.evaluationforms;
  if (!pglimit)
    useUserStore.setState({ limit: { ...lm, evaluationforms: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const [data, options] = await Promise.all([
    Service.fetchEvaluationForms(search, page, limit),
    // The page still works if the rating scale can't be loaded.
    Service.fetchEvaluationOptions().catch(() => []),
  ]);

  return { data, options: Array.isArray(options) ? options : [], search, page };
}

// The shared rating scale every form's rating questions use, with a way in to
// edit it.
function RatingScaleStrip({ options, canEdit }: { options: any[]; canEdit: boolean }) {
  const shown = options.filter((o) => o.status);
  return (
    <section className="dash-fade-up flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl bg-white px-4 py-3.5 font-roboto ring-1 ring-primary/10 shadow-sm md:px-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-secondary-accent">
          <HiOutlineAdjustmentsHorizontal className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-primary-dark/80">Rating scale</p>
          <p className="text-[0.7rem] text-slate-400">Shared by every form</p>
        </div>
      </div>
      <ol className="flex min-w-0 flex-1 flex-wrap gap-1.5">
        {shown.map((o) => (
          <li key={o.id} className="rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary-dark/70">
            <span className="mr-1 font-bold tabular-nums text-secondary-accent">{o.value}</span>
            {o.option}
          </li>
        ))}
        {!shown.length ? <li className="text-xs text-slate-400">No options switched on yet.</li> : null}
      </ol>
      {canEdit ? (
        <Link to="rating-scale" className="inline-flex items-center gap-1.5 rounded-xl bg-primary-dark/70 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark">
          Manage scale <HiOutlineArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </section>
  );
}

function PgAISEvaluationForms({}: Props) {
  const [view, setView] = useState("card");
  const { data, options }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreate = useHasRole("ais", ["evaluation::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Evaluation Manager"
        createtext={canCreate ? "New" : undefined}
        createlink={canCreate ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <RatingScaleStrip options={options || []} canEdit={canCreate} />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data?.data &&
                data?.data?.map((row: any) => (
                  <EvaluationFormCardItem key={row.id} data={row} />
                ))}
              {!data?.data?.length && (
                <div className="p-3 border rounded-xl">
                  <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                    No Records ...
                  </h1>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {loading && <EvaluationFormShimCard view={view} />}
    </div>
  );
}

export default PgAISEvaluationForms;
