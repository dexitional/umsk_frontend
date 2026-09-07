import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import CalendarCardItem from "../../components/ais/CalendarCardItem";
import PageTitle from "../../components/ais/PageTitle";
import CalendarShimCard from "../../components/shims/CalendarShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";
type Props = {};

export async function action({ params }) {
  await Service.deleteSession(params.programId);
  return redirect("/ais/calendars");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.academiccalendar;
  if (!pglimit)
    useUserStore.setState({ limit: { ...lm, academiccalendar: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchSessions(search, page, limit);

  return { data, search, page };
}

function PgAISCalendars({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateCalendar = useHasRole("ais", ["calendar::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Academic Calendar"
        createtext={canCreateCalendar ? "New" : undefined}
        createlink={canCreateCalendar ? "create" : undefined}
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
                  <CalendarCardItem key={row.id} data={row} />
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
           <CalendarListView data={data} />
         )} */}
        </div>
      )}
      {loading && <CalendarShimCard view={view} />}
    </div>
  );
}

export default PgAISCalendars;
