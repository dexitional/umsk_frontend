import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import ResitCourseCardItem from "../../components/ais/ResitCourseCardItem";
import ResitSessionShimCard from "../../components/shims/ResitSessionShimCard";
import Service from "../../utils/aisService";

type Props = {};

// One card per course registered for resit in the active resit session,
// scoped to whichever department(s) the caller heads (resitScopeWhere on
// the backend) — no session picker, "My Resits" always means the active
// resit session.
export async function loader() {
  const data = await Service.fetchMyResitCourses();
  return { data };
}

function PgAISMyResitCourses({}: Props) {
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="My Resits"
        createtext=""
        createlink=""
        setView={() => null}
        view={""}
      />
      {!loading && (
        <div className="grid md:grid-cols-3 gap-3 md:gap-6">
          {Array.isArray(data) &&
            data.map((row: any) => (
              <ResitCourseCardItem key={row.courseId} data={row} />
            ))}
          {!Array.isArray(data) || !data.length ? (
            <div className="p-3 border rounded-xl">
              <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                No Records ...
              </h1>
            </div>
          ) : null}
        </div>
      )}
      {loading && <ResitSessionShimCard view={"card"} />}
    </div>
  );
}

export default PgAISMyResitCourses;
