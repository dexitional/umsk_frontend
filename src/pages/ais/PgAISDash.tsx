import React from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaLayerGroup,
  FaRegCalendarAlt,
  FaRegClock,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import DashBarChart from "../../components/ais/DashBarChart";
import DashDonutChart from "../../components/ais/DashDonutChart";
import DashHBarChart from "../../components/ais/DashHBarChart";
import DashStatCard from "../../components/ais/DashStatCard";
import Service from "../../utils/aisService";

type Props = {};

const COLORS = {
  active: "#E77B1D",
  defer: "#AD5913",
  complete: "rgba(52,52,52,0.8)",
  graduate: "#4A5578",
  male: "#E77B1D",
  female: "rgba(52,52,52,0.8)",
};

export async function loader({ params }) {
  const data = await Service.loadDashboard();
  return { data };
}

function PgAISDash({}: Props) {
  const { data }: any = useLoaderData();

  const student = data?.student || {
    active: { f: 0, m: 0 },
    defer: { f: 0, m: 0 },
    complete: { f: 0, m: 0 },
    graduate: { f: 0, m: 0 },
  };
  const totalActive = (student.active?.f || 0) + (student.active?.m || 0);
  const totalDefer = (student.defer?.f || 0) + (student.defer?.m || 0);
  const totalComplete = (student.complete?.f || 0) + (student.complete?.m || 0);
  const totalGraduate = (student.graduate?.f || 0) + (student.graduate?.m || 0);

  const departments = data?.department || [];
  const programs = data?.program || [];
  const academic = data?.sessions?.academic || [];
  const resit = data?.sessions?.resit;
  const graduation = data?.sessions?.graduation;

  const topDepartments = [...departments]
    .sort((a: any, b: any) => (b.students || 0) - (a.students || 0))
    .slice(0, 6);

  const topPrograms = [...programs]
    .map((p: any) => ({
      ...p,
      total: (p.y1 || 0) + (p.y2 || 0) + (p.y3 || 0) + (p.y4 || 0),
    }))
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 8);

  const yearTotals = [1, 2, 3, 4].map((y) =>
    programs.reduce((sum: number, p: any) => sum + (p[`y${y}`] || 0), 0)
  );

  const statusSegments = [
    { label: "Active", value: totalActive, color: COLORS.active },
    { label: "Deferred", value: totalDefer, color: COLORS.defer },
    { label: "Completed", value: totalComplete, color: COLORS.complete },
    { label: "Graduated", value: totalGraduate, color: COLORS.graduate },
  ];

  const genderBarData = [
    { m: student.active?.m || 0, f: student.active?.f || 0 },
    { m: student.defer?.m || 0, f: student.defer?.f || 0 },
    { m: student.complete?.m || 0, f: student.complete?.f || 0 },
    { m: student.graduate?.m || 0, f: student.graduate?.f || 0 },
  ];

  return (
    <main className="md:my-6 md:px-6 p-3 space-y-4 md:space-y-6 font-inter">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-poppins text-primary">
          Dashboard
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Academic overview across sessions, students, departments &amp; programs
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="dash-fade-up" style={{ animationDelay: "0ms" }}>
          <DashStatCard
            icon={<FaUsers className="h-5 w-5 text-primary-accent" />}
            iconBg="bg-primary-accent/10"
            label="Active Students"
            value={totalActive}
            male={student.active?.m}
            female={student.active?.f}
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "60ms" }}>
          <DashStatCard
            icon={<FaRegClock className="h-5 w-5 text-primary-dark" />}
            iconBg="bg-primary-dark/10"
            label="Deferred"
            value={totalDefer}
            male={student.defer?.m}
            female={student.defer?.f}
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "120ms" }}>
          <DashStatCard
            icon={<FaCheckCircle className="h-5 w-5" style={{ color: COLORS.complete }} />}
            iconBg="bg-primary/10"
            label="Completed"
            value={totalComplete}
            male={student.complete?.m}
            female={student.complete?.f}
          />
        </div>
        <div className="dash-fade-up" style={{ animationDelay: "180ms" }}>
          <DashStatCard
            icon={<FaUserGraduate className="h-5 w-5" style={{ color: COLORS.graduate }} />}
            iconBg="bg-slate-500/10"
            label="Graduated"
            value={totalGraduate}
            male={student.graduate?.m}
            female={student.graduate?.f}
          />
        </div>
      </div>

      {/* Student population donut + Academic sessions panel */}
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
            Student Population
          </h2>
          <DashDonutChart segments={statusSegments} centerLabel="Students" />
        </div>

        <div
          className="dash-fade-up md:col-span-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-poppins text-primary">
              Academic Sessions
            </h2>
            <Link
              to="/ais/calendars"
              className="text-xs font-semibold text-primary-accent hover:underline"
            >
              View Calendar
            </Link>
          </div>
          <div className="flex-1 divide-y divide-slate-100">
            {academic.map((s: any, i: number) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-accent/10 flex items-center justify-center shrink-0">
                    <FaRegCalendarAlt className="h-3.5 w-3.5 text-primary-accent" />
                  </div>
                  <span className="text-sm font-medium text-primary">{s.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 text-[0.65rem] font-semibold">
                    {s.register} REG
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-dark/10 text-primary-dark text-[0.65rem] font-semibold">
                    {s.unregister} UNREG
                  </span>
                </div>
              </div>
            ))}
            {!academic.length ? (
              <div className="py-6 text-center text-xs text-slate-400 uppercase tracking-wider">
                No active sessions
              </div>
            ) : null}
            {resit ? (
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-dark/10 flex items-center justify-center shrink-0">
                    <FaLayerGroup className="h-3.5 w-3.5 text-primary-dark" />
                  </div>
                  <span className="text-sm font-medium text-primary">
                    Resit — {resit.label || "—"}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary-accent/10 text-primary-accent text-[0.65rem] font-semibold">
                  {resit.register} OF {resit.estimate} REGISTERED
                </span>
              </div>
            ) : null}
            {graduation ? (
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FaUserGraduate className="h-3.5 w-3.5 text-primary/80" />
                  </div>
                  <span className="text-sm font-medium text-primary">
                    Graduation — {graduation.label || "—"}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 text-[0.65rem] font-semibold">
                  {graduation.graduand} GRADUANDS
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Gender x Status bar chart + Top departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div
          className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
          style={{ animationDelay: "360ms" }}
        >
          <h2 className="text-sm font-bold font-poppins text-primary mb-4">
            Students by Gender &amp; Status
          </h2>
          <DashBarChart
            categories={["Active", "Deferred", "Completed", "Graduated"]}
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
              Top Departments by Students
            </h2>
            <Link
              to="/ais/departments"
              className="text-xs font-semibold text-primary-accent hover:underline"
            >
              View All
            </Link>
          </div>
          <DashHBarChart
            rows={topDepartments.map((d: any) => ({ label: d.label, value: d.students || 0 }))}
            color={COLORS.active}
          />
        </div>
      </div>

      {/* Enrollment by year level */}
      <div
        className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
        style={{ animationDelay: "480ms" }}
      >
        <h2 className="text-sm font-bold font-poppins text-primary mb-4">
          Enrollment by Year Level
        </h2>
        <DashBarChart
          categories={["Year 1", "Year 2", "Year 3", "Year 4"]}
          series={[{ key: "v", label: "Students", color: COLORS.active }]}
          data={yearTotals.map((v) => ({ v }))}
        />
      </div>

      {/* Departments & Programs tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div
          className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto"
          style={{ animationDelay: "540ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-poppins text-primary flex items-center space-x-2">
              <FaBuilding className="h-4 w-4 text-primary-accent" />
              <span>Departments</span>
            </h2>
            <Link
              to="/ais/departments"
              className="text-xs font-semibold text-primary-accent hover:underline"
            >
              View All
            </Link>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-2 font-semibold">Department</th>
                <th className="py-2 font-semibold text-right">Programs</th>
                <th className="py-2 font-semibold text-right">Students</th>
                <th className="py-2 font-semibold text-right">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topDepartments.map((d: any, i: number) => (
                <tr key={i} className="transition-colors hover:bg-slate-50/70">
                  <td className="py-2.5 font-medium text-primary truncate max-w-[10rem]">{d.label}</td>
                  <td className="py-2.5 text-right text-slate-500">{d.programs}</td>
                  <td className="py-2.5 text-right text-slate-500">{d.students}</td>
                  <td className="py-2.5 text-right text-slate-500">{d.staff}</td>
                </tr>
              ))}
              {!topDepartments.length ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 uppercase tracking-wider">
                    No records
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div
          className="dash-fade-up p-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto"
          style={{ animationDelay: "600ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-poppins text-primary flex items-center space-x-2">
              <FaLayerGroup className="h-4 w-4 text-primary-accent" />
              <span>Programs</span>
            </h2>
            <Link
              to="/ais/programs"
              className="text-xs font-semibold text-primary-accent hover:underline"
            >
              View All
            </Link>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-2 font-semibold">Program</th>
                <th className="py-2 font-semibold text-right">Y1</th>
                <th className="py-2 font-semibold text-right">Y2</th>
                <th className="py-2 font-semibold text-right">Y3</th>
                <th className="py-2 font-semibold text-right">Y4</th>
                <th className="py-2 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topPrograms.map((p: any, i: number) => (
                <tr key={i} className="transition-colors hover:bg-slate-50/70">
                  <td className="py-2.5 font-medium text-primary truncate max-w-[7rem]">{p.label}</td>
                  <td className="py-2.5 text-right text-slate-500">{p.y1}</td>
                  <td className="py-2.5 text-right text-slate-500">{p.y2}</td>
                  <td className="py-2.5 text-right text-slate-500">{p.y3}</td>
                  <td className="py-2.5 text-right text-slate-500">{p.y4}</td>
                  <td className="py-2.5 text-right font-semibold text-primary">{p.total}</td>
                </tr>
              ))}
              {!topPrograms.length ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 uppercase tracking-wider">
                    No records
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default PgAISDash;
