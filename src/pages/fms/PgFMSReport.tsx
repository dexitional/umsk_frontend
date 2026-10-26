import React from "react";
import { PageHero, PageHeroHeading, PageHeroBadge } from "../../components/PageHero";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import ReportListView from "../../components/fms/ReportListView";
import Service from "../../utils/aisService";
import FmsService from "../../utils/fmsService";
import { jsonToExcel } from "../../utils/util";

type Props = {};

// Downloads the report as Excel. Route actions must return a value, so this
// always returns null (jsonToExcel itself returns nothing); empty results
// and failures are reported in a toast instead of the error screen.
export async function action({ request, params }) {
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  try {
    const resp = await FmsService.loadReport(data);
    if (resp?.data?.length) {
      jsonToExcel(resp.data, data?.type + "_" + Date.now());
      toast.success(`Report downloaded (${resp.data.length} row${resp.data.length === 1 ? "" : "s"}).`);
    } else {
      toast.error("No records found for the selected filters.");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "The report could not be generated. Please try again.");
  }
  return null;
}

export async function loader({ params }) {
  const sessions = await Service.fetchSessionList();
  const services = await FmsService.fetchServiceList();
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();

  return { programs, sessions, majors, services };
}

function PgFMSReport({}: Props) {
  const { programs, sessions, majors, services }: any =
    useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-5 md:space-y-6 animate-fade-in-up">
      <PageHero>
        <PageHeroHeading
          eyebrow="Finance system"
          title="System Reports"
          description="Generate and export financial data as spreadsheets."
          Icon={HiOutlineDocumentChartBar}
          action={<PageHeroBadge Icon={HiOutlineDocumentChartBar}>Spreadsheet exports</PageHeroBadge>}
        />
      </PageHero>
      <ReportListView
        programs={programs}
        majors={majors}
        sessions={sessions}
        services={services}
      />
    </div>
  );
}

export default PgFMSReport;
