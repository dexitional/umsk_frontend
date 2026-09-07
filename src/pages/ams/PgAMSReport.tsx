import React from "react";
import { useLoaderData } from "react-router-dom";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import toast from "react-hot-toast";
import ReportListView from "../../components/ams/ReportListView";
import Service from "../../utils/amsService";
import Helper from "../../utils/aisService";
import { jsonToExcel } from "../../utils/util";

type Props = {};

// Route access is enforced server-side (admreport::admin, see amsRoute.ts) —
// this action just forwards the chosen report type/filters and, on success,
// turns the returned rows into a downloadable spreadsheet.
export async function action({ request }) {
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  let resp: any = await Service.loadReport(data);
  if (resp?.data?.length) {
    jsonToExcel(resp.data, data?.type + "_" + Date.now());
    toast.success(`Report ready — ${resp.data.length} record${resp.data.length == 1 ? "" : "s"} exported.`);
  } else {
    toast.error("No records found for the selected filters.");
  }
  return true;
}

export async function loader() {
  const sessions = await Service.fetchSessionList();
  const programs = await Helper.fetchProgramList();
  return { sessions, programs };
}

function PgAMSReport({}: Props) {
  const { sessions, programs }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-5 md:space-y-6 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-xl bg-primary/90 px-5 py-3.5 md:px-7 md:py-4 shadow-md shadow-slate-500/10">
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/90">
            <HiOutlineDocumentChartBar className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-base md:text-lg font-semibold tracking-wide text-white">
              System Reports
            </h1>
            <p className="text-[0.7rem] md:text-xs text-white/60">
              Generate and export admission data as spreadsheets
            </p>
          </div>
        </div>
      </div>
      <ReportListView sessions={sessions} programs={programs} />
    </div>
  );
}

export default PgAMSReport;
