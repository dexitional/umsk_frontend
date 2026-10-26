import React from "react";
import { PageHero, PageHeroHeading, PageHeroBadge } from "../../components/PageHero";
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
  // GTEC statutory tables download as ready-made Excel files.
  if(String(data?.type).startsWith('gtec_')){
    const table = String(data.type).slice(5);
    await Service.downloadStatutoryReport({ table, gsession: data?.gsession }, `GTEC ${table.toUpperCase()}`).catch(() => {});
    return true;
  }
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
      <PageHero>
        <PageHeroHeading
          eyebrow="Academic system"
          title="System Reports"
          description="Generate and export academic data as spreadsheets."
          Icon={HiOutlineDocumentChartBar}
          action={<PageHeroBadge Icon={HiOutlineDocumentChartBar}>Spreadsheet exports</PageHeroBadge>}
        />
      </PageHero>
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
