import React from "react";
import { Outlet } from "react-router-dom";
import SubPageTitle from "../../components/fms/SubPageTitle";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

function PgFMSAccount({}: Props) {
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="STUDENT FINANCIAL STATEMENT" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded md:rounded-xl bg-white">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgFMSAccount;
