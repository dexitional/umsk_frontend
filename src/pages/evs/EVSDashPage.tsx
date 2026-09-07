import React from "react";
import { useLoaderData } from "react-router-dom";
import PgElectionCard from "../../components/evs/PgElectionCard";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/evsService";

export async function loader({ params }) {
  const { user } = useUserStore.getState();
  const data = await Service.fetchMyElections(user?.user?.tag);
  return { data };
}

function EVSDashPage() {
  const { data }: any = useLoaderData() || [];
  return (
    <main className="w-full flex flex-col overflow-y-scroll">
      <section className="mx-1.5 md:mx-auto py-6 w-full md:max-w-6xl">
        <div className="px-2 py-2 md:py-1 md:px-3 w-full rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
          <div className="text-center text-2xl md:text-4xl text-gray-500 font-black font-mono tracking-wide">
            ELECTA VOTING SYSTEM
          </div>
        </div>
      </section>
      <section className="mx-1.5 md:mx-auto py-6 w-full md:max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-10">
        {data &&
          data?.map((row: any, i: number) => (
            <PgElectionCard key={i} data={row} />
          ))}
        {!data && (
          <div className="px-4 py-2 mx-auto w-fit rounded-lg border bg-slate-100 text-gray-600 text-center font-medium tracking-wide text-xl">
            No election staged !!
          </div>
        )}
      </section>
    </main>
  );
}

export default EVSDashPage;
