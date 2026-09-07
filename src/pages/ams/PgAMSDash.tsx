import React from "react";
import {
  FaFileInvoiceDollar,
  FaFilter,
  FaLayerGroup,
  FaTicketAlt,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import DashBarChart from "../../components/ams/DashBarChart";
import DashDonutChart from "../../components/ams/DashDonutChart";
import DashHBarChart from "../../components/ams/DashHBarChart";
import DashStatCard from "../../components/ams/DashStatCard";
import Service from "../../utils/amsService";
import { formatCurrency } from "../../utils/util";

type Props = {};

const COLORS = {
  applicant: "#E77B1D",
  sort: "#AD5913",
  submit: "rgba(52,52,52,0.8)",
  fresher: "#4A5578",
  male: "#E77B1D",
  female: "rgba(52,52,52,0.8)",
};

export async function loader({ params }) {
  const data = await Service.fetchDashboard();
  return { data };
}

function PgAMSDash({}: Props) {
  const { data }: any = useLoaderData();

  const general = data?.general || {};
  const programs = data?.program || [];

  const genderTotals = programs.reduce(
    (acc: any, p: any) => ({
      applicant: {
        m: acc.applicant.m + (p.applicant?.m || 0),
        f: acc.applicant.f + (p.applicant?.f || 0),
      },
      sort: {
        m: acc.sort.m + (p.sort?.m || 0),
        f: acc.sort.f + (p.sort?.f || 0),
      },
      submit: {
        m: acc.submit.m + (p.submit?.m || 0),
        f: acc.submit.f + (p.submit?.f || 0),
      },
      fresher: {
        m: acc.fresher.m + (p.fresher?.m || 0),
        f: acc.fresher.f + (p.fresher?.f || 0),
      },
    }),
    {
      applicant: { m: 0, f: 0 },
      sort: { m: 0, f: 0 },
      submit: { m: 0, f: 0 },
      fresher: { m: 0, f: 0 },
    }
  );

  const topPrograms = [...programs]
    .map((p: any) => ({
      ...p,
      total: (p.applicant?.m || 0) + (p.applicant?.f || 0),
    }))
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 8);

  const funnelSegments = [
    { label: "Applicants", value: general.applicant || 0, color: COLORS.applicant },
    { label: "Shortlisted", value: general.sort || 0, color: COLORS.sort },
    { label: "Submitted", value: general.submit || 0, color: COLORS.submit },
    { label: "Admitted", value: general.fresher || 0, color: COLORS.fresher },
  ];

  const genderBarData = [
    { m: genderTotals.applicant.m, f: genderTotals.applicant.f },
    { m: genderTotals.sort.m, f: genderTotals.sort.f },
    { m: genderTotals.submit.m, f: genderTotals.submit.f },
    { m: genderTotals.fresher.m, f: genderTotals.fresher.f },
  ];

  return (
    <main className="md:my-6 md:px-6 p-3 space-y-4 md:space-y-6 font-inter">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-poppins text-primary">
          Dashboard
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Admissions overview — {data?.session || "no active session"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="dash-fade-up" style={{ animationDelay: "0ms" }}>
          <DashStatCard
            icon={<FaUsers className="h-5 w-5 text-primary-accent" />}
            iconBg="bg-primary-accent/10"
            label="Applicants"
            value={general.applicant}
            male={genderTotals.applicant.m}
            female={genderTotals.applicant.f}
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "60ms" }}>
          <DashStatCard
            icon={<FaFilter className="h-5 w-5 text-primary-dark" />}
            iconBg="bg-primary-dark/10"
            label="Shortlisted"
            value={general.sort}
            male={genderTotals.sort.m}
            female={genderTotals.sort.f}
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "120ms" }}>
          <DashStatCard
            icon={<FaUserCheck className="h-5 w-5" style={{ color: COLORS.submit }} />}
            iconBg="bg-primary/10"
            label="Submitted"
            value={general.submit}
            male={genderTotals.submit.m}
            female={genderTotals.submit.f}
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "180ms" }}>
          <DashStatCard
            icon={<FaLayerGroup className="h-5 w-5" style={{ color: COLORS.fresher }} />}
            iconBg="bg-slate-500/10"
            label="Admitted"
            value={general.fresher}
            male={genderTotals.fresher.m}
            female={genderTotals.fresher.f}
          />
        </div>
      </div>

      {/* Funnel donut + Session panel */}
      {/* grid-cols-1 (not just md:grid-cols-5) matters: Tailwind's
          grid-cols-N sets track sizing to minmax(0,1fr), which overrides a
          grid item's default min-width:auto — without an explicit base
          track, a wide child can force the row past the viewport on mobile
          instead of shrinking to fit (see PgFMSDash.tsx for the case that
          actually triggered this). */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
        <div
          className="dash-fade-up md:col-span-2 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
          style={{ animationDelay: "240ms" }}
        >
          <h2 className="text-sm font-bold font-poppins text-primary mb-4">
            Admission Funnel
          </h2>
          <DashDonutChart segments={funnelSegments} centerLabel="Applicants" />
        </div>

        <div
          className="dash-fade-up md:col-span-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-poppins text-primary">
              Voucher Sales
            </h2>
            <Link
              to="/ams/vouchers"
              className="text-xs font-semibold text-primary-accent hover:underline"
            >
              View Vouchers
            </Link>
          </div>
          <div className="flex-1 divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary-accent/10 flex items-center justify-center shrink-0">
                  <FaFileInvoiceDollar className="h-3.5 w-3.5 text-primary-accent" />
                </div>
                <span className="text-sm font-medium text-primary">Total Revenue</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-accent/10 text-primary-accent text-[0.65rem] font-semibold">
                {formatCurrency(general.sale || 0, "en-GH", "GHS")}
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary-dark/10 flex items-center justify-center shrink-0">
                  <FaTicketAlt className="h-3.5 w-3.5 text-primary-dark" />
                </div>
                <span className="text-sm font-medium text-primary">Vouchers Issued</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-dark/10 text-primary-dark text-[0.65rem] font-semibold">
                {general.voucher || 0}
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FaTicketAlt className="h-3.5 w-3.5 text-primary/80" />
                </div>
                <span className="text-sm font-medium text-primary">Sold</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 text-[0.65rem] font-semibold">
                {general.sold || 0}
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-slate-500/10 flex items-center justify-center shrink-0">
                  <FaTicketAlt className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-primary">Unsold</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 text-[0.65rem] font-semibold">
                {general.unsold || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gender x Funnel bar chart + Top programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div
          className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
          style={{ animationDelay: "360ms" }}
        >
          <h2 className="text-sm font-bold font-poppins text-primary mb-4">
            Applicants by Gender &amp; Stage
          </h2>
          <DashBarChart
            categories={["Applicants", "Shortlisted", "Submitted", "Admitted"]}
            series={[
              { key: "m", label: "Male", color: COLORS.male },
              { key: "f", label: "Female", color: COLORS.female },
            ]}
            data={genderBarData}
          />
        </div>

        <div
          className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
          style={{ animationDelay: "420ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-poppins text-primary">
              Top Programs by Applicants
            </h2>
            <Link
              to="/ams/applicants"
              className="text-xs font-semibold text-primary-accent hover:underline"
            >
              View All
            </Link>
          </div>
          <DashHBarChart
            rows={topPrograms.map((p: any) => ({ label: p.label, value: p.total }))}
            color={COLORS.applicant}
          />
        </div>
      </div>

      {/* Programs table */}
      <div
        className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto"
        style={{ animationDelay: "480ms" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold font-poppins text-primary flex items-center space-x-2">
            <FaLayerGroup className="h-4 w-4 text-primary-accent" />
            <span>Programs</span>
          </h2>
          <Link
            to="/ams/applicants"
            className="text-xs font-semibold text-primary-accent hover:underline"
          >
            View All
          </Link>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="py-2 font-semibold">Program</th>
              <th className="py-2 font-semibold text-right">Applicants</th>
              <th className="py-2 font-semibold text-right">Shortlisted</th>
              <th className="py-2 font-semibold text-right">Submitted</th>
              <th className="py-2 font-semibold text-right">Admitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {topPrograms.map((p: any, i: number) => (
              <tr key={i} className="transition-colors hover:bg-slate-50/70">
                <td className="py-2.5 font-medium text-primary truncate max-w-[10rem]">{p.label}</td>
                <td className="py-2.5 text-right text-slate-500">
                  {(p.applicant?.m || 0) + (p.applicant?.f || 0)}
                </td>
                <td className="py-2.5 text-right text-slate-500">
                  {(p.sort?.m || 0) + (p.sort?.f || 0)}
                </td>
                <td className="py-2.5 text-right text-slate-500">
                  {(p.submit?.m || 0) + (p.submit?.f || 0)}
                </td>
                <td className="py-2.5 text-right font-semibold text-primary">
                  {(p.fresher?.m || 0) + (p.fresher?.f || 0)}
                </td>
              </tr>
            ))}
            {!topPrograms.length ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400 uppercase tracking-wider">
                  No records
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default PgAMSDash;
