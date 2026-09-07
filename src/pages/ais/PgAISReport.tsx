import React from "react";
import { useLoaderData } from "react-router-dom";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import ReportListView from "../../components/ais/ReportListView";
import Service from "../../utils/aisService";
import { jsonToExcel } from "../../utils/util";

type Props = {};

export async function action({ request, params }) {
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  console.log(data)
  let resp:any;
  if(data?.type == 'graduate_sheet'){
    resp = await Service.loadBroadsheet(data);
  } else {
    resp = await Service.loadReport(data);
  }
  console.log(resp);
  if (resp?.data?.length)
    jsonToExcel(resp.data, data?.type + "_" + Date.now());
  return true;
}

export async function loader({ params }) {
  const sessions = await Service.fetchSessionList();
  const rsessions = await Service.fetchResitSessionsList();
  const gsessions = await Service.fetchGraduateSessionsList();
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();

  return { programs, sessions, majors, rsessions, gsessions };
}

function PgAISReport({}: Props) {
  const { programs, sessions, majors, gsessions, rsessions }: any =
    useLoaderData();

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
              Generate and export academic data as spreadsheets
            </p>
          </div>
        </div>
      </div>
      <ReportListView
        programs={programs}
        majors={majors}
        sessions={sessions}
        rsessions={rsessions}
        gsessions={gsessions}
      />
    </div>
  );
}

export default PgAISReport;
