import moment from "moment";
import React from "react";
import {
  HiArrowLongRight,
  HiArrowTrendingDown,
  HiArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineCalendar,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineReceiptPercent,
  HiOutlineScale,
  HiOutlineSparkles,
  HiOutlineTableCells,
  HiOutlineUserGroup,
  HiOutlineWallet,
} from "react-icons/hi2";
import { Link, useLoaderData } from "react-router-dom";
import { CountUp, DASH, DashCard, HBarList, Legend, RadialMeter, StackedColumns, fmt, pct } from "../../components/ais/dash/DashKit";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/fmsService";
import { formatCurrency } from "../../utils/util";

type Props = {};

export async function loader({ params }) {
  const data = await Service.loadDashboard();
  return { data };
}

// Whole cedis for headline figures; the breakdown table keeps pesewas.
const money = (n: number) => `GH₵ ${Math.round(Number(n) || 0).toLocaleString()}`;
// Compact, for axes and tight spots: GH₵ 1.2M, GH₵ 15.3K.
const moneyShort = (n: number) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1e6) return `GH₵ ${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M`;
  if (Math.abs(v) >= 1e3) return `GH₵ ${(v / 1e3).toFixed(v >= 1e4 ? 0 : 1)}K`;
  return `GH₵ ${Math.round(v)}`;
};
const cedis = (n: number) => formatCurrency(n || 0, "en-GH", "GHS");

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

// Change against the same point in the previous period. Up/down carry an
// arrow and words, never colour alone.
function Delta({ now, prev, against, invert = false }: { now: number; prev: number; against: string; invert?: boolean }) {
  if (!now && !prev) return <span className={`text-[0.7rem] ${invert ? "text-white/70" : "text-slate-400"}`}>No payments yet · {against}</span>;
  if (!prev)
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${invert ? "bg-white/[0.15] text-white" : "bg-emerald-50 text-emerald-700"}`}>
        <HiArrowTrendingUp className="h-3.5 w-3.5" /> New · {against}
      </span>
    );
  const change = Math.round(((now - prev) / prev) * 100);
  const up = change >= 0;
  const Icon = up ? HiArrowTrendingUp : HiArrowTrendingDown;
  const tone = invert ? "bg-white/[0.15] text-white" : up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {up ? "Up" : "Down"} {Math.abs(change)}% {against}
    </span>
  );
}

function KpiTile({ label, value, prev, count, against, Icon, delay }: { label: string; value: number; prev: number; count: number; against: string; Icon: any; delay: number }) {
  return (
    <div
      className="dash-fade-up group relative overflow-hidden rounded-3xl bg-white p-4 sm:p-5 ring-1 ring-primary/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.15] motion-reduce:hover:translate-y-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary-accent opacity-[0.07] blur-lg transition-opacity group-hover:opacity-[0.14]" />
      <div className="relative flex items-start justify-between gap-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary-accent text-white shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[0.65rem] font-bold text-primary-dark/70">
          {fmt(count)} payment{count === 1 ? "" : "s"}
        </span>
      </div>
      <p className="relative mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <CountUp value={value} format={money} className="relative mt-0.5 block truncate text-lg font-extrabold font-inter text-primary-dark sm:text-2xl md:text-[1.7rem]" />
      <div className="relative mt-3">
        <Delta now={value} prev={prev} against={against} />
      </div>
    </div>
  );
}

// Student balances as one bar: owing, in credit, settled (2px gaps).
function BalanceBar({ owing, credit, settled }: { owing: number; credit: number; settled: number }) {
  const total = owing + credit + settled;
  const parts = [
    { label: "Owing", v: owing, color: DASH.pair[0] },
    { label: "In credit", v: credit, color: DASH.pair[1] },
    { label: "Settled", v: settled, color: DASH.unknown },
  ].filter((p) => p.v > 0);
  if (!total) return <p className="py-6 text-center text-xs uppercase tracking-wider text-slate-400">No current students</p>;
  return (
    <div>
      <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded-[4px]" role="img" aria-label={parts.map((p) => `${p.label} ${fmt(p.v)} (${pct(p.v, total)}%)`).join(", ")}>
        {parts.map((p, i) => (
          <div key={p.label} className="dash-grow-x h-full" style={{ width: `${(p.v / total) * 100}%`, background: p.color, animationDelay: `${300 + i * 120}ms` }} />
        ))}
      </div>
      <div className="mt-3">
        <Legend items={parts.map((p) => ({ label: p.label, color: p.color, value: `${fmt(p.v)} · ${pct(p.v, total)}%` }))} />
      </div>
    </div>
  );
}

function PgFMSDash({}: Props) {
  const { data }: any = useLoaderData();
  const user = useUserStore((state) => state.user);

  const feesPayment = data?.feesPayment || { today: 0, week: 0, month: 0, year: 0 };
  const otherPayment: any[] = data?.otherPayment || [];
  const p = data?.periods || {};
  const trend: any[] = data?.trend || [];
  const rec = data?.receivables || { students: 0, debtors: 0, owed: 0, inCredit: 0, credit: 0, settled: 0 };
  const byYear: any[] = data?.receivablesByYear || [];
  const session = data?.session || { titles: [], billed: 0 };
  const recent: any[] = data?.recent || [];
  const cleared = (rec.students || 0) - (rec.debtors || 0);

  const allTypes = [{ label: "academic fees", ...feesPayment }, ...otherPayment];
  const byTypeYear = allTypes
    .filter((t: any) => (t.year || 0) > 0)
    .sort((a: any, b: any) => (b.year || 0) - (a.year || 0))
    .map((t: any) => ({ label: t.label.replace(/\b\w/g, (c: string) => c.toUpperCase()), value: Math.round(t.year || 0) }));

  return (
    <main className="md:my-6 md:px-6 p-3 space-y-5 md:space-y-6 font-inter">
      {/* Hero */}
      <section className="dash-fade-up relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-secondary-accent p-6 text-white shadow-xl shadow-primary/25 md:p-8">
        <div className="pointer-events-none absolute inset-0 aisp-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="dash-drift pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="dash-drift pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" style={{ animationDelay: "-4s" }} />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.7rem] font-semibold text-sky-100 ring-1 ring-inset ring-white/[0.15] backdrop-blur">
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              {session.titles?.length ? session.titles.join(" · ") : "Finance Management System"}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl font-poppins">
                {greeting()}
                {user?.user?.fname ? <span className="capitalize">, {String(user.user.fname).toLowerCase()}</span> : null}
              </h1>
              <p className="mt-1 text-sm text-sky-100/80">Here's how fee collection is going.</p>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                <CountUp value={p.year || 0} format={money} className="text-4xl font-extrabold leading-none md:text-5xl" />
                <span className="pb-1 text-sm font-medium text-sky-100/80">collected in {moment().format("YYYY")}</span>
              </div>
              <Delta now={p.year || 0} prev={p.yearPrev || 0} against="on this time last year" invert />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { Icon: HiOutlineReceiptPercent, label: `${fmt(p.yearCount || 0)} payments this year` },
                { Icon: HiOutlineWallet, label: `${moneyShort(session.billed)} billed this session` },
                { Icon: HiOutlineUserGroup, label: `${fmt(rec.debtors)} students owing` },
              ].map(({ Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ring-white/[0.15]">
                  <Icon className="h-4 w-4 text-sky-200" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-3xl bg-white/10 p-5 text-center ring-1 ring-inset ring-white/[0.15] backdrop-blur sm:flex-row sm:text-left">
            <div className="relative">
              <span className="dash-pulse-ring pointer-events-none absolute inset-3 rounded-full ring-2 ring-sky-200/50" />
              <RadialMeter value={cleared} total={rec.students || 0} size={148} stroke={12} color="#ffffff" track="rgba(255,255,255,0.18)" label="Fees cleared" invert />
            </div>
            <div className="space-y-2">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-sky-100/70">Current students</p>
              <p className="text-sm font-bold">
                {fmt(cleared)} of {fmt(rec.students)} owe nothing
              </p>
              <p className="text-xs text-sky-100/80">
                <span className="font-bold text-white">{money(rec.owed)}</span> outstanding from {fmt(rec.debtors)} student{rec.debtors === 1 ? "" : "s"}
              </p>
              <Link to="/fms/debtors" className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline">
                View debtors <HiArrowLongRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KPI row: all payment types, each against the same point in the previous period */}
      <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
        <KpiTile label="Today" value={p.today || 0} prev={p.todayPrev || 0} count={p.todayCount || 0} against="on yesterday so far" Icon={HiOutlineClock} delay={80} />
        <KpiTile label="This week" value={p.week || 0} prev={p.weekPrev || 0} count={p.weekCount || 0} against="on last week so far" Icon={HiOutlineCalendarDays} delay={140} />
        <KpiTile label="This month" value={p.month || 0} prev={p.monthPrev || 0} count={p.monthCount || 0} against="on last month so far" Icon={HiOutlineCalendar} delay={200} />
        <KpiTile label="This year" value={p.year || 0} prev={p.yearPrev || 0} count={p.yearCount || 0} against="on last year to date" Icon={HiOutlineBanknotes} delay={260} />
      </div>

      {/* Monthly collections + balances */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard
          title="Monthly collections"
          subtitle="Last 12 months · academic fees and other payments"
          Icon={HiOutlineChartBar}
          delay={320}
          className="lg:col-span-2"
          action={
            <Link to="/fms/reports" className="text-xs font-semibold text-secondary-accent hover:underline">
              Reports
            </Link>
          }
        >
          <StackedColumns
            rows={trend.map((m: any) => ({ label: moment(m.ym, "YYYY-MM").format("MMM"), title: moment(m.ym, "YYYY-MM").format("MMMM YYYY"), values: [m.fees, m.other] }))}
            series={[
              { label: "Academic fees", color: DASH.pair[0] },
              { label: "Other payments", color: DASH.pair[1] },
            ]}
            format={money}
            axisFormat={moneyShort}
            empty="No payments in the last 12 months"
          />
        </DashCard>

        <DashCard title="Student balances" subtitle="Current students' accounts" Icon={HiOutlineScale} delay={380}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-primary/[0.03] p-3 ring-1 ring-inset ring-primary/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Outstanding</p>
                <CountUp value={rec.owed || 0} format={moneyShort} className="mt-0.5 block text-xl font-extrabold text-primary-dark" />
                <p className="text-[0.7rem] text-slate-400">{fmt(rec.debtors)} owing</p>
              </div>
              <div className="rounded-2xl bg-primary/[0.03] p-3 ring-1 ring-inset ring-primary/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">In credit</p>
                <CountUp value={rec.credit || 0} format={moneyShort} className="mt-0.5 block text-xl font-extrabold text-primary-dark" />
                <p className="text-[0.7rem] text-slate-400">{fmt(rec.inCredit)} overpaid</p>
              </div>
            </div>
            <BalanceBar owing={rec.debtors || 0} credit={rec.inCredit || 0} settled={rec.settled || 0} />
            <Link to="/fms/accounts" className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-accent hover:underline">
              Student accounts <HiArrowLongRight className="h-4 w-4" />
            </Link>
          </div>
        </DashCard>
      </div>

      {/* Owed by year · collections by type · recent payments */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard title="Owed by year group" subtitle="Outstanding fees, current students" Icon={HiOutlineUserGroup} delay={440}>
          {byYear.some((y: any) => y.owed > 0) ? (
            <HBarList rows={byYear.map((y: any) => ({ label: `Year ${y.year} · ${fmt(y.debtors)} of ${fmt(y.students)} owing`, value: Math.round(y.owed) }))} unit="owed" format={moneyShort} />
          ) : (
            <p className="py-8 text-center text-xs uppercase tracking-wider text-slate-400">Nothing outstanding</p>
          )}
        </DashCard>

        <DashCard title={`Collections by type · ${moment().format("YYYY")}`} subtitle="Every payment type, this year" Icon={HiOutlineReceiptPercent} delay={500}>
          {byTypeYear.length ? (
            <HBarList rows={byTypeYear} unit="collected" format={moneyShort} />
          ) : (
            <p className="py-8 text-center text-xs uppercase tracking-wider text-slate-400">No payments this year</p>
          )}
        </DashCard>

        <DashCard
          title="Recent payments"
          subtitle="Latest received"
          Icon={HiOutlineBanknotes}
          delay={560}
          action={
            <Link to="/fms/payments" className="text-xs font-semibold text-secondary-accent hover:underline">
              All payments
            </Link>
          }
        >
          <ul className="-my-1 divide-y divide-slate-100">
            {recent.map((t: any) => {
              const name = [t.student?.fname, t.student?.lname].filter(Boolean).join(" ").trim();
              const initials = name ? name.split(/\s+/).map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : "—";
              return (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-xs font-bold text-primary-dark/70">{initials}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold text-primary-dark ${name ? "capitalize" : ""}`}>{name ? name.toLowerCase() : "No student linked"}</p>
                    <p className="truncate text-[0.7rem] text-slate-400">
                      {t.transtype?.title ? String(t.transtype.title).toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : "Payment"} · {moment(t.createdAt).fromNow()}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-primary-dark">{money(t.amount)}</span>
                </li>
              );
            })}
            {!recent.length ? <li className="py-8 text-center text-xs uppercase tracking-wider text-slate-400">No payments yet</li> : null}
          </ul>
        </DashCard>
      </div>

      {/* Breakdown table */}
      <DashCard title="Payment types breakdown" subtitle="Collected per type, by period" Icon={HiOutlineTableCells} delay={620}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-left uppercase tracking-wider text-slate-400">
                <th className="py-2 font-semibold">Type</th>
                <th className="py-2 text-right font-semibold">Today</th>
                <th className="py-2 text-right font-semibold">This week</th>
                <th className="py-2 text-right font-semibold">This month</th>
                <th className="py-2 text-right font-semibold">This year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 tabular-nums">
              {allTypes.map((t: any, i: number) => (
                <tr key={i} className="hover:bg-primary/[0.03]">
                  <td className="max-w-[12rem] truncate py-2.5 font-semibold capitalize text-primary-dark">{t.label}</td>
                  <td className="py-2.5 text-right text-slate-500">{cedis(t.today)}</td>
                  <td className="py-2.5 text-right text-slate-500">{cedis(t.week)}</td>
                  <td className="py-2.5 text-right text-slate-500">{cedis(t.month)}</td>
                  <td className="py-2.5 text-right font-bold text-primary-dark">{cedis(t.year)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td className="py-2.5 font-bold uppercase tracking-wider text-slate-500">All types</td>
                <td className="py-2.5 text-right font-bold text-primary-dark">{cedis(p.today)}</td>
                <td className="py-2.5 text-right font-bold text-primary-dark">{cedis(p.week)}</td>
                <td className="py-2.5 text-right font-bold text-primary-dark">{cedis(p.month)}</td>
                <td className="py-2.5 text-right font-bold text-primary-dark">{cedis(p.year)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </DashCard>
    </main>
  );
}

export default PgFMSDash;
