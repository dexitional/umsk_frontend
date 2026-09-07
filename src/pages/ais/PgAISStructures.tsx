import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import StructureCardItem from "../../components/ais/StructureCardItem";
import StructureListView from "../../components/ais/StructureListView";
import CurriculumShimCard from "../../components/shims/CurriculumShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";
type Props = {};

export async function action({ params, request }) {
  const search = new URL(request.url).searchParams.get("search") || "";
  await Service.deleteCurriculum(params.curriculumId);
  return redirect(`/ais/curriculums?search=${search}`);
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.curriculum;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, curriculum: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchCurriculums(search, page, limit);
  return { data, search, page };
}

function PgAISStructures({}: Props) {
  const [view, setView] = useState("card");
  const {
    data: { data, totalPages, totalData },
    page,
    search,
  }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateCurriculum = useHasRole("ais", ["curriculum::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Curriculum"
        createtext={canCreateCurriculum ? "New" : undefined}
        createlink={canCreateCurriculum ? "create" : undefined}
        pages={totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div
              className={`grid ${
                data.length ? "md:grid-cols-3" : "md:grid-cols-2 justify"
              } gap-3 md:gap-6`}
            >
              {data?.map((row: any) => (
                <StructureCardItem key={row.id} data={row} />
              ))}
              {!data?.length && (
                <div className="p-3 border rounded-xl">
                  <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                    No Records ...
                  </h1>
                </div>
              )}
            </div>
          )}

          {view == "list" && <StructureListView data={data} />}
        </div>
      )}
      {loading && <CurriculumShimCard view={view} />}
    </div>
  );
}

export default PgAISStructures;
