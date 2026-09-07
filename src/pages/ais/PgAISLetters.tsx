import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import LetterCardItem from "../../components/ais/LetterCardItem";
import LetterListView from "../../components/ais/LetterListView";
import PageTitle from "../../components/ais/PageTitle";
import LetterShimCard from "../../components/shims/LetterShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  await Service.deleteLetter(params.letterId);
  return redirect("/ais/letters");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.seviceletters;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, seviceletters: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchLetters(search, page, limit);
  return { data, search, page };
}

function PgAISLetters({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateLetter = useHasRole("ais", ["sletter::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Service Letters"
        createtext={canCreateLetter ? "New" : undefined}
        createlink={canCreateLetter ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data &&
                data?.data?.map((row: any) => (
                  <LetterCardItem key={row?.id} data={row} />
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

          {view == "list" && <LetterListView data={data?.data} />}
        </div>
      )}
      {loading && <LetterShimCard view={view} />}
    </div>
  );
}

export default PgAISLetters;
