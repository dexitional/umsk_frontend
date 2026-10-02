import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/aisService";
import AISPProfileCard from "./AISPProfileCard";

type Props = {};

// The card previously received `lasChosen` (election-vote data, unrelated
// to the student) instead of the student's own record — that's why its
// "department" line silently rendered blank. Fetch the real student here.
// Child pages read the same record via useRouteLoaderData("aisp-student").
export async function loader() {
  const user = useUserStore.getState().user;
  const student = await Service.fetchStudent(user?.user?.tag);
  return { student };
}

function AISPPager({}: Props) {
  const { student }: any = useLoaderData();
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start">
      <Outlet />
      <aside className="xl:sticky xl:top-24 space-y-6">
        <AISPProfileCard data={student} />
      </aside>
    </section>
  );
}

export default AISPPager;
