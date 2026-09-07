import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/aisService";
import AISPProfileCard from "./AISPProfileCard";

type Props = {};

// The card previously received `lasChosen` (election-vote data, unrelated
// to the student) instead of the student's own record — that's why its
// "department" line silently rendered blank. Fetch the real student here.
export async function loader() {
  const user = useUserStore.getState().user;
  const student = await Service.fetchStudent(user?.user?.tag);
  return { student };
}

function AISPPager({}: Props) {
  const { student }: any = useLoaderData();
  return (
    <main className="p-4 md:p-0 grid grid-cols-1 gap-y-6 md:gap-y-10">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Outlet />
        <div>
          <AISPProfileCard data={student} />
        </div>
      </section>
    </main>
  );
}

export default AISPPager;
