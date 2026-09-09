import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
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
  const data = await Service.fetchEvaluationForms(search, page, limit);

  return { data, search, page };
}

function PgAISEvaluationForms({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
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
