import React from "react";
import { Outlet } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import NSSProfileCard from "./NSSProfileCard";

type Props = {};

function NSSPager({}: Props) {
  const lasChosen = useUserStore((state) => state.lasChosen);
  return (
    <main className="p-2 md:py-6 grid grid-cols-1 gap-y-3 md:gap-y-10">
      <section className="pb-6 pt-1 max-[cal(100vh-2rem)] grid grid-cols-1 md:grid-cols-3 space-y-6 md:space-y-0">
        <Outlet />
        <div className="p-0 md:px-4 md:border-l-2 rounded-xl md:rounded-none bg-gradient-to-r to-white via-slate-50 from-slate-100">
          {/* <h1 className="px-2 md:px-3 py-1 w-fit -skew-x-12  rounded bg-green-950/50 text-white font-bold tracking-wider">NSS Profile</h1> */}
          <div className="p-2 md:py-4 md:px-3 min-h-fit gap-y-6 overflow-y-scroll ">
            <NSSProfileCard data={lasChosen} />
            <div></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NSSPager;
