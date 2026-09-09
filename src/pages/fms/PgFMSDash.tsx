import React from "react";
import {
  FaCalendarDay,
  FaCalendarWeek,
  FaChartPie,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import DashBarChart from "../../components/fms/DashBarChart";
import DashDonutChart from "../../components/fms/DashDonutChart";
import DashHBarChart from "../../components/fms/DashHBarChart";
import DashStatCard from "../../components/fms/DashStatCard";
import Service from "../../utils/fmsService";
import { formatCurrency } from "../../utils/util";

type Props = {};

const PALETTE = ["#5599c3", "#29688e", "rgba(52,52,52,0.8)", "#4A5578", "#a1c6de", "#7C8A99", "#B08968"];
const colorAt = (i: number) => PALETTE[i % PALETTE.length];

export async function loader({ params }) {
  const data = await Service.loadDashboard();
  return { data };
}

function PgFMSDash({}: Props) {
  const { data }: any = useLoaderData();

  const feesPayment = data?.feesPayment || { today: 0, week: 0, month: 0, year: 0 };
  const otherPayment = data?.otherPayment || [];

  const allTypes = [
    { label: "academic fees", today: feesPayment.today, week: feesPayment.week, month: feesPayment.month, year: feesPayment.year },
    ...otherPayment,
  ];

  const revenueSegments = allTypes.map((t: any, i: number) => ({
    label: t.label,
    value: t.year || 0,
    color: colorAt(i),
  }));

  const topByYear = [...allTypes]
    .sort((a: any, b: any) => (b.year || 0) - (a.year || 0))
    .slice(0, 6);

  return (
    <main className="md:my-6 md:px-6 p-3 space-y-4 md:space-y-6 font-inter">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-poppins text-primary">
          Dashboard
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Academic fee collections over time
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="dash-fade-up" style={{ animationDelay: "0ms" }}>
          <DashStatCard
            icon={<FaCalendarDay className="h-5 w-5 text-secondary-accent" />}
            iconBg="bg-secondary-accent/10"
            label="Today"
            value={feesPayment.today}
            currency
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "60ms" }}>
          <DashStatCard
            icon={<FaCalendarWeek className="h-5 w-5 text-primary-dark" />}
            iconBg="bg-primary-dark/10"
            label="This Week"
            value={feesPayment.week}
            currency
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "120ms" }}>
          <DashStatCard
            icon={<FaReceipt className="h-5 w-5 text-primary/80" />}
            iconBg="bg-primary/10"
            label="This Month"
            value={feesPayment.month}
            currency
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "180ms" }}>
          <DashStatCard
            icon={<FaMoneyBillWave className="h-5 w-5 text-slate-500" />}
            iconBg="bg-slate-500/10"
            label="This Year"
            value={feesPayment.year}
            currency
          />
        </div>
      </div>

      {/* Revenue mix donut + payment types panel */}
      {/* grid-cols-1 (not just md:grid-cols-5) matters here, not just for
          layout: Tailwind's grid-cols-N utilities set track sizing to
          minmax(0,1fr), which overrides a grid item's default min-width:auto
          — without an explicit base track, a wide child (like the bar chart
          below) can force the whole row past the viewport on mobile instead
          of shrinking to fit. */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-6">
        <div
          className="dash-fade-up md:col-span-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
          style={{ animationDelay: "240ms" }}
        >
          <h2 className="text-sm font-bold font-poppins text-primary mb-4">
            Revenue Mix (Year)
          </h2>
          <DashDonutChart segments={revenueSegments} centerLabel="Total" />
        </div>

        <div
          className="dash-fade-up md:col-span-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-poppins text-primary">
              Payment Types
            </h2>
            <Link
              to="/fms/reports"
              className="text-xs font-semibold text-secondary-accent hover:underline"
            >
              View Reports
            </Link>
          </div>
          <div className="flex-1 divide-y divide-slate-100">
            {allTypes.map((t: any, i: number) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary-accent/10 flex items-center justify-center shrink-0">
                    <FaChartPie className="h-3.5 w-3.5 text-secondary-accent" />
                  </div>
                  <span className="text-sm font-medium text-primary capitalize">{t.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 text-[0.65rem] font-semibold">
                    {formatCurrency(t.month || 0, "en-GH", "GHS")} / mo
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-dark/10 text-primary-dark text-[0.65rem] font-semibold">
                    {formatCurrency(t.year || 0, "en-GH", "GHS")} / yr
                  </span>
                </div>
              </div>
            ))}
            {!allTypes.length ? (
              <div className="py-6 text-center text-xs text-slate-400 uppercase tracking-wider">
                No payment types
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* This month collections + top types by year */}
      {/* grid-cols-1 base track (see note above) is what actually lets the
          "This Month by Type" card's horizontally-scrollable bar chart
          clip/scroll instead of stretching the whole page wider than the
          viewport on mobile. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div
          className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
          style={{ animationDelay: "360ms" }}
        >
          <h2 className="text-sm font-bold font-poppins text-primary mb-4">
            This Month by Type
          </h2>
          <DashBarChart
            categories={allTypes.map((t: any) => t.label)}
            series={[{ key: "v", label: "Collected", color: "#5599c3" }]}
            data={allTypes.map((t: any) => ({ v: t.month || 0 }))}
          />
        </div>

        <div
          className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
          style={{ animationDelay: "420ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-poppins text-primary">
              Top Types by Year
            </h2>
            <Link
              to="/fms/bills"
              className="text-xs font-semibold text-secondary-accent hover:underline"
            >
              View Bills
            </Link>
          </div>
          <DashHBarChart
            rows={topByYear.map((t: any) => ({ label: t.label, value: t.year || 0 }))}
            color="#29688e"
          />
        </div>
      </div>

      {/* Payment types table */}
      <div
        className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto"
        style={{ animationDelay: "480ms" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold font-poppins text-primary flex items-center space-x-2">
            <FaChartPie className="h-4 w-4 text-secondary-accent" />
            <span>Payment Types Breakdown</span>
          </h2>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="py-2 font-semibold">Type</th>
              <th className="py-2 font-semibold text-right">Today</th>
              <th className="py-2 font-semibold text-right">This Week</th>
              <th className="py-2 font-semibold text-right">This Month</th>
              <th className="py-2 font-semibold text-right">This Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allTypes.map((t: any, i: number) => (
              <tr key={i} className="transition-colors hover:bg-slate-50/70">
                <td className="py-2.5 font-medium text-primary capitalize truncate max-w-[10rem]">{t.label}</td>
                <td className="py-2.5 text-right text-slate-500">{formatCurrency(t.today || 0, "en-GH", "GHS")}</td>
                <td className="py-2.5 text-right text-slate-500">{formatCurrency(t.week || 0, "en-GH", "GHS")}</td>
                <td className="py-2.5 text-right text-slate-500">{formatCurrency(t.month || 0, "en-GH", "GHS")}</td>
                <td className="py-2.5 text-right font-semibold text-primary">{formatCurrency(t.year || 0, "en-GH", "GHS")}</td>
              </tr>
            ))}
            {!allTypes.length ? (
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

export default PgFMSDash;
