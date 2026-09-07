import React, { useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import GraduateCardItem from "../../components/ais/GraduateCardItem";
import PageTitle from "../../components/ais/PageTitle";
import GraduateShimCard from "../../components/shims/GraduateShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.graduates;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, graduates: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchGraduates(search, page, limit);
  return { data, search, page };
}

function PgAISGraduates({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Graduates"
        createtext=""
        createlink="create"
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div
              className={`grid ${
                data?.data?.length ? "md:grid-cols-3" : "md:grid-cols-2 justify"
              } gap-3 md:gap-6`}
            >
              {data?.data?.map((row: any) => (
                <GraduateCardItem key={row.id} data={row} />
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
          ={" "}
          {/* { view == 'list' && (
           <ProgressionListView data={data?.data} />
         )} */}
        </div>
      )}
      {loading && <GraduateShimCard view={view} />}
    </div>
  );
}

export default PgAISGraduates;
