import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import CourseCardItem from "../../components/ais/CourseCardItem";
import PageTitle from "../../components/ais/PageTitle";
import CourseShimCard from "../../components/shims/CourseShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";
type Props = {};

export async function action({ params }) {
  await Service.deleteCourse(params.courseId);
  return redirect("/ais/courses");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.courses;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, courses: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchCourses(search, page, limit);
  return { data, search, page };
}

function PgAISCourses({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateCourse = useHasRole("ais", ["course::admin"]);
  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Courses"
        createtext={canCreateCourse ? "New" : undefined}
        createlink={canCreateCourse ? "create" : undefined}
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
                  <CourseCardItem key={row.id} data={row} />
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
           <CourseListView data={data} />
         )} */}
        </div>
      )}
      {loading && <CourseShimCard view={view} />}
    </div>
  );
}

export default PgAISCourses;
