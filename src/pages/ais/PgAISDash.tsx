import moment from "moment";
import React from "react";
import {
  HiArrowLongRight,
  HiOutlineAcademicCap,
  HiOutlineArrowPath,
  HiOutlineBuildingLibrary,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
  HiOutlineClipboardDocumentCheck,
  HiOutlinePauseCircle,
  HiOutlineRectangleStack,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";
import { Link, useLoaderData } from "react-router-dom";
import Torch from "../../assets/img/torch.png";
import {
  CountUp,
  DashCard,
  DepartmentBoard,
  GenderSplit,
  LinearMeter,
  ProgrammeStacks,
  RadialMeter,
  YearColumns,
  fmt,
  pct,
} from "../../components/ais/dash/DashKit";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

export async function loader() {
  const data = await Service.loadDashboard();
  return { data };
}

const greeting = () => {
  const h = moment().hour();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const sum = (g: any) => (g?.m || 0) + (g?.f || 0) + (g?.u || 0);

function KpiTile({ label, value, Icon, share, caption, delay }: { label: string; value: number; Icon: any; share: number; caption: string; delay: number }) {
  return (
    <div
      className="dash-fade-up group relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-primary/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.15] motion-reduce:hover:translate-y-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary-accent opacity-[0.07] blur-lg transition-opacity group-hover:opacity-[0.14]" />
      <div className="relative flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary-accent text-white shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[0.65rem] font-bold text-primary-dark/70">{share}%</span>
      </div>
      <p className="relative mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <CountUp value={value} className="relative mt-0.5 block text-3xl font-extrabold font-inter text-primary-dark" />
      <div className="relative mt-3">
        <LinearMeter value={share} total={100} delay={delay + 200} />
        <p className="mt-1.5 text-[0.7rem] text-slate-400">{caption}</p>
      </div>
    </div>
  );
}

function PgAISDash() {
  const { data }: any = useLoaderData();
  const user = useUserStore((state) => state.user);

  const student = data?.student || {};
  const active = sum(student.active);
  const deferred = sum(student.defer);
  const completed = sum(student.complete);
  const graduated = sum(student.graduate);
  const records = active + deferred + completed; // graduates are a subset of completed

  const academic: any[] = data?.sessions?.academic || [];
  const resit = data?.sessions?.resit;
  const graduation = data?.sessions?.graduation;
  const current = academic[0];
  const currentTotal = (current?.register || 0) + (current?.unregister || 0);

  const programs: any[] = data?.program || [];
  const departments: any[] = data?.department || [];
  const yearTotals = [1, 2, 3, 4].map((y) => programs.reduce((s: number, p: any) => s + (p[`y${y}`] || 0), 0));

  return (
    <main className="md:my-6 md:px-6 p-3 space-y-5 md:space-y-6 font-inter">
      {/* Hero */}
      <section className="dash-fade-up relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-secondary-accent p-6 text-white shadow-xl shadow-primary/25 md:p-8">
        <div className="pointer-events-none absolute inset-0 aisp-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="dash-drift pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="dash-drift pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" style={{ animationDelay: "-4s" }} />
        <img src={Torch} alt="" className="pointer-events-none absolute -bottom-6 right-[28%] hidden h-56 opacity-[0.08] lg:block" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.7rem] font-semibold text-sky-100 ring-1 ring-inset ring-white/[0.15] backdrop-blur">
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              {current?.label ? current.label : "Academic Information System"}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl font-poppins">
                {greeting()}
                {user?.user?.fname ? <span className="capitalize">, {String(user.user.fname).toLowerCase()}</span> : null}
              </h1>
              <p className="mt-1 text-sm text-sky-100/80">Here's how the college is doing today.</p>
            </div>
            <div className="flex items-end gap-4">
              <CountUp value={active} className="text-5xl font-extrabold leading-none md:text-6xl" />
              <span className="pb-1.5 text-sm font-medium text-sky-100/80">students on roll</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { Icon: HiOutlineRectangleStack, label: `${fmt(programs.length)} programmes` },
                { Icon: HiOutlineBuildingLibrary, label: `${fmt(departments.length)} departments` },
                { Icon: HiOutlineCalendarDays, label: `${fmt(academic.length)} active session${academic.length === 1 ? "" : "s"}` },
              ].map(({ Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ring-white/[0.15]">
                  <Icon className="h-4 w-4 text-sky-200" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {current ? (
            <div className="flex flex-col items-center gap-5 rounded-3xl bg-white/10 p-5 text-center ring-1 ring-inset ring-white/[0.15] backdrop-blur sm:flex-row sm:text-left">
              <div className="relative">
                <span className="dash-pulse-ring pointer-events-none absolute inset-3 rounded-full ring-2 ring-sky-200/50" />
                <RadialMeter value={current.register || 0} total={currentTotal} size={148} stroke={12} color="#ffffff" track="rgba(255,255,255,0.18)" label="Registered" invert />
              </div>
              <div className="space-y-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-sky-100/70">Course registration</p>
                <p className="text-sm font-bold">{current.label}</p>
                <p className="text-xs text-sky-100/80">
                  <span className="font-bold text-white">{fmt(current.register)}</span> registered ·{" "}
                  <span className="font-bold text-white">{fmt(current.unregister)}</span> yet to register
                </p>
                <Link to="/ais/registrations" className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline">
                  View registrations <HiArrowLongRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
        <KpiTile label="Active" value={active} Icon={HiOutlineUsers} share={pct(active, records)} caption="of all student records" delay={80} />
        <KpiTile label="Deferred" value={deferred} Icon={HiOutlinePauseCircle} share={pct(deferred, records)} caption="on approved deferment" delay={140} />
        <KpiTile label="Completed" value={completed} Icon={HiOutlineCheckBadge} share={pct(completed, records)} caption="finished their programme" delay={200} />
        <KpiTile label="Graduated" value={graduated} Icon={HiOutlineAcademicCap} share={pct(graduated, records)} caption="conferred and graduated" delay={260} />
      </div>

      {/* Registration + gender */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard
          title="Registration & sessions"
          subtitle="Course registration, resits and graduation"
          Icon={HiOutlineClipboardDocumentCheck}
          delay={320}
          className="lg:col-span-2"
          action={
            <Link to="/ais/calendars" className="text-xs font-semibold text-secondary-accent hover:underline">
              Calendar
            </Link>
          }
        >
          <div className="space-y-4">
            {academic.map((s: any, i: number) => {
              const total = (s.register || 0) + (s.unregister || 0);
              return (
                <div key={s.label + i} className="rounded-2xl bg-primary/[0.03] p-4 ring-1 ring-inset ring-primary/5">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-primary-dark">
                      <HiOutlineCalendarDays className="h-4 w-4 text-secondary-accent" />
                      {s.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      <span className="font-bold text-primary-dark">{fmt(s.register)}</span> of {fmt(total)} registered · {pct(s.register, total)}%
                    </span>
                  </div>
                  <LinearMeter value={s.register || 0} total={total} delay={400 + i * 100} />
                </div>
              );
            })}
            {!academic.length ? <p className="py-4 text-center text-xs uppercase tracking-wider text-slate-400">No active sessions</p> : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl p-4 ring-1 ring-inset ring-primary/10">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <HiOutlineArrowPath className="h-4 w-4 text-secondary-accent" /> Resit {resit?.label ? `· ${resit.label}` : ""}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  <CountUp value={resit?.register || 0} className="text-2xl font-extrabold text-primary-dark" /> of {fmt(resit?.estimate || 0)} registered
                </p>
                <div className="mt-2">
                  <LinearMeter value={resit?.register || 0} total={resit?.estimate || 0} delay={600} />
                </div>
                <p className="mt-1.5 text-[0.7rem] text-slate-400">{fmt(resit?.courses || 0)} course{resit?.courses === 1 ? "" : "s"} with resit registrations</p>
              </div>
              <div className="rounded-2xl p-4 ring-1 ring-inset ring-primary/10">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <HiOutlineAcademicCap className="h-4 w-4 text-secondary-accent" /> Graduation {graduation?.label ? `· ${graduation.label}` : ""}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  <CountUp value={graduation?.graduand || 0} className="text-2xl font-extrabold text-primary-dark" /> graduands
                </p>
                <p className="mt-2 text-[0.7rem] text-slate-400">
                  {fmt(graduation?.complete || 0)} completed student{graduation?.complete === 1 ? "" : "s"} not yet graduated
                </p>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard title="Gender split" subtitle="Active students" Icon={HiOutlineUserGroup} delay={380}>
          <GenderSplit m={student.active?.m || 0} f={student.active?.f || 0} u={student.active?.u || 0} />
          <table className="mt-6 w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-left uppercase tracking-wider text-slate-400">
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 text-right font-semibold">Male</th>
                <th className="py-2 text-right font-semibold">Female</th>
                <th className="py-2 text-right font-semibold" title="Gender not recorded">N/R</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 tabular-nums">
              {[
                ["Active", student.active],
                ["Deferred", student.defer],
                ["Completed", student.complete],
                ["Graduated", student.graduate],
              ].map(([label, g]: any) => (
                <tr key={label}>
                  <td className="py-2 font-semibold text-primary-dark/80">{label}</td>
                  <td className="py-2 text-right text-slate-500">{fmt(g?.m || 0)}</td>
                  <td className="py-2 text-right text-slate-500">{fmt(g?.f || 0)}</td>
                  <td className="py-2 text-right text-slate-500">{fmt(g?.u || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(student.active?.u || 0) > 0 ? (
            <p className="mt-3 rounded-xl bg-primary/5 px-3 py-2 text-[0.7rem] text-primary-dark/70">
              {fmt(student.active.u)} active student{student.active.u === 1 ? " has" : "s have"} no gender recorded.
            </p>
          ) : null}
        </DashCard>
      </div>

      {/* Enrollment */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard title="Enrollment by year" subtitle={`${fmt(yearTotals.reduce((a, b) => a + b, 0))} students across all programmes`} Icon={HiOutlineChartBar} delay={440}>
          <YearColumns values={yearTotals} />
        </DashCard>
        <DashCard
          title="Programme composition"
          subtitle="Students per programme, by year"
          Icon={HiOutlineRectangleStack}
          delay={500}
          className="lg:col-span-2"
          action={
            <Link to="/ais/programs" className="text-xs font-semibold text-secondary-accent hover:underline">
              Programmes
            </Link>
          }
        >
          <ProgrammeStacks programs={programs} />
        </DashCard>
      </div>

      {/* Lifecycle + departments */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard title="Student lifecycle" subtitle="Where every student record sits" Icon={HiOutlineSparkles} delay={560}>
          <ol className="relative space-y-3">
            <span className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-gradient-to-b from-primary/30 via-secondary-accent/30 to-transparent" aria-hidden />
            {[
              { label: "Active", value: active, Icon: HiOutlineUsers, note: "studying now" },
              { label: "Deferred", value: deferred, Icon: HiOutlinePauseCircle, note: "paused, returning later" },
              { label: "Completed", value: completed, Icon: HiOutlineCheckBadge, note: "programme finished" },
              { label: "Graduated", value: graduated, Icon: HiOutlineAcademicCap, note: "degree conferred" },
            ].map((s, i) => (
              <li key={s.label} className="dash-fade-up relative flex items-center gap-4" style={{ animationDelay: `${640 + i * 90}ms` }}>
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary ring-1 ring-primary/[0.15] shadow-sm">
                  <s.Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-1 items-center justify-between gap-3 rounded-2xl bg-primary/[0.03] px-4 py-2.5">
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-primary-dark">{s.label}</p>
                    <p className="text-[0.7rem] text-slate-400">{s.note}</p>
                  </div>
                  <div className="text-right leading-tight">
                    <CountUp value={s.value} className="block text-lg font-extrabold text-primary-dark" />
                    <span className="text-[0.65rem] font-semibold text-slate-400">{pct(s.value, records)}%</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </DashCard>
        <DashCard
          title="Departments"
          subtitle="Courses assigned in the curriculum, and staff"
          Icon={HiOutlineBuildingLibrary}
          delay={620}
          className="lg:col-span-2"
          action={
            <Link to="/ais/departments" className="text-xs font-semibold text-secondary-accent hover:underline">
              All departments
            </Link>
          }
        >
          {departments.length ? (
            <DepartmentBoard departments={departments} />
          ) : (
            <p className="py-8 text-center text-xs uppercase tracking-wider text-slate-400">No departments yet</p>
          )}
        </DashCard>
      </div>
    </main>
  );
}

export default PgAISDash;
