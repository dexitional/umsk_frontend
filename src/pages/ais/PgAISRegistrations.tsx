import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import RegistrationCardItem from "../../components/ais/RegistrationCardItem";
import RegistrationShimCard from "../../components/shims/RegistrationShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
type Props = {};

export async function action({ params }) {
  await Service.deleteRegistration(params.registrationId);
  return redirect("/ais/registrations");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.registrations;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, registrations: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchRegistrations(search, page, limit);
  return { data, search, page };
}

function PgAISRegistrations({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Registrations - Current Sessions"
        createtext="New"
        createlink=""
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className={`grid md:grid-cols-3 gap-3 md:gap-6`}>
              {data?.data?.map((row: any) => (
                <RegistrationCardItem key={row.id} data={row} />
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

          {/* { view == 'list' && (
           <RegistrationListView data={data} />
         )}
          */}
        </div>
      )}
      {loading && <RegistrationShimCard view={view} />}
    </div>
  );
}

export default PgAISRegistrations;
