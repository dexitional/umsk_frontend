import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineChartPie,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineClipboardDocumentCheck,
  HiOutlineLightBulb,
  HiOutlinePencilSquare,
  HiOutlineQueueList,
  HiOutlineSparkles,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { CountUp, DashCard, HBarList, LinearMeter, RadialMeter, YearColumns, fmt, pct } from "../../components/ais/dash/DashKit";
import { BackPill } from "../../components/ais/EvalEditorKit";
import Service from "../../utils/aisService";
import { evaluationWindowElapsed, evaluationWindowState } from "../../utils/evaluation";
import { useHasRole } from "../../utils/roles";

export async function loader({ params }) {
  const [data, options] = await Promise.all([
    Service.fetchEvaluationForm(params.formId),
    Service.fetchEvaluationOptions().catch(() => []),
  ]);
  return { data, options: Array.isArray(options) ? options : [], params };
}

// Live countdown to the window's next edge (opening or closing), ticking
// every second. Hidden when there's nothing to count down to.
function Countdown({ to, label }: { to: string; label: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, moment(to).valueOf() - now);
  const parts = [
    { v: Math.floor(ms / 86400000), u: "days" },
    { v: Math.floor((ms % 86400000) / 3600000), u: "hrs" },
    { v: Math.floor((ms % 3600000) / 60000), u: "min" },
    { v: Math.floor((ms % 60000) / 1000), u: "sec" },
  ];
  return (
    <div>
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-sky-100/80">{label}</p>
      <div className="flex gap-2" aria-live="off">
        {parts.map((p) => (
          <div key={p.u} className="min-w-[3.25rem] rounded-xl bg-white/10 px-2 py-2 text-center ring-1 ring-inset ring-white/20 backdrop-blur">
            <span className="block text-xl font-extrabold tabular-nums leading-none">{String(p.v).padStart(2, "0")}</span>
            <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-wider text-sky-100/70">{p.u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// One-line "when" for the window, relative to now.
function relativeWhen(form: any, state: string) {
  if (state === "open" && form?.endDate) return `Closes ${moment(form.endDate).fromNow()}`;
  if (state === "scheduled" && form?.startDate) return `Opens ${moment(form.startDate).fromNow()}`;
  if (state === "closed" && form?.endDate) return `Closed ${moment(form.endDate).fromNow()}`;
  if (state === "always") return "No deadline";
  return "Not accepting responses";
}

// Window as a timeline: opens -> closes, the elapsed share filled, and a
// pulsing marker at "now" while the form is open.
function WindowTimeline({ form, state, stateInfo, years }: { form: any; state: string; stateInfo: any; years: number[] }) {
  const progress = state === "closed" ? 100 : state === "scheduled" ? 0 : evaluationWindowElapsed(form) ?? 0;
  const start = form?.startDate ? moment(form.startDate) : null;
  const end = form?.endDate ? moment(form.endDate) : null;
  const span = start && end ? moment.duration(end.diff(start)) : null;
  return (
    <div className="space-y-4">
      <div className="relative pt-7">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
          <div className="dash-grow-x h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary-accent" style={{ width: `${progress}%` }} />
        </div>
        {state === "open" ? (
          <div className="absolute top-0 -translate-x-1/2" style={{ left: `${progress}%` }}>
            <span className="block whitespace-nowrap rounded-md bg-primary-dark/70 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">Now</span>
            <span className="relative mx-auto mt-1 block h-3.5 w-3.5">
              <span className="dash-pulse-ring absolute inset-0 rounded-full bg-secondary-accent/40" />
              <span className="absolute inset-0 rounded-full bg-secondary-accent ring-2 ring-white" />
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-4 text-xs">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Opens</p>
          <p className="font-bold text-primary-dark/70">{start ? start.format("ddd, MMM D YYYY") : "Any time"}</p>
          {start ? <p className="text-slate-400">{start.format("HH:mm")}</p> : null}
        </div>
        {span ? (
          <div className="text-center">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Duration</p>
            <p className="font-bold text-primary-dark/70">{span.humanize()}</p>
            <p className="text-slate-400">{Math.round(progress)}% elapsed</p>
          </div>
        ) : null}
        <div className="text-right">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Closes</p>
          <p className="font-bold text-primary-dark/70">{end ? end.format("ddd, MMM D YYYY") : "No end date"}</p>
          {end ? <p className="text-slate-400">{end.format("HH:mm")}</p> : null}
        </div>
      </div>
      <div className="grid gap-2.5 border-t border-primary/10 pt-4 sm:grid-cols-3">
        {[
          { label: "Status", value: stateInfo.label, Icon: stateInfo.Icon },
          { label: "When", value: relativeWhen(form, state), Icon: HiOutlineClock },
          { label: "Audience", value: years.length ? `Year${years.length > 1 ? "s" : ""} ${years.join(", ")}` : "All year groups", Icon: HiOutlineUserGroup },
        ].map((t, i) => (
          <div key={t.label} className="dash-fade-up flex items-center gap-3 rounded-2xl bg-primary/[0.03] px-3.5 py-3" style={{ animationDelay: `${420 + i * 80}ms` }}>
            <t.Icon className="h-5 w-5 shrink-0 text-secondary-accent" />
            <div className="min-w-0 leading-tight">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{t.label}</p>
              <p className="truncate text-sm font-bold text-primary-dark/70">{t.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiTile({ label, value, Icon, caption, delay }: { label: string; value: number; Icon: any; caption: string; delay: number }) {
  return (
    <div
      className="dash-fade-up group relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-primary/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.15] motion-reduce:hover:translate-y-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary-accent opacity-[0.07] blur-lg transition-opacity group-hover:opacity-[0.14]" />
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/5 text-secondary-accent transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
        <Icon className="h-5 w-5" />
      </span>
      <p className="relative mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <CountUp value={value} className="relative mt-0.5 block text-3xl font-extrabold text-primary-dark/70" />
      <p className="relative mt-1 text-[0.7rem] text-slate-400">{caption}</p>
    </div>
  );
}

function PgAISEvaluationForm() {
  const navigate = useNavigate();
  const { data, options, params }: any = useLoaderData();
  const scale = (options || []).filter((o: any) => o.status);
  const canEdit = useHasRole("ais", ["evaluation::admin"]);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const state = evaluationWindowState(data);
  const questions: any[] = data?.questions || [];
  const guides: any[] = data?.guides || [];
  const years: number[] = (data?.yearGroups || []).map((y: any) => Number(y.yearGroup)).sort();
  const sub = data?.submissions || { total: 0, completed: 0, inProgress: 0, notStarted: 0 };

  const activeQ = questions.filter((q) => q.status);
  const required = activeQ.filter((q) => q.required).length;
  const likert = activeQ.filter((q) => q.type === "likert").length;

  // Question makeup
  const byCategory = useMemo(() => {
    const m = new Map<string, any[]>();
    questions.forEach((q) => m.set(q.category || "Uncategorised", [...(m.get(q.category || "Uncategorised") || []), q]));
    return Array.from(m.entries());
  }, [questions]);
  const yearCols = useMemo(() => {
    const ys = (years.length ? years : [1, 2, 3, 4]).filter((y) => y >= 1 && y <= 4);
    return { years: ys, values: ys.map((y) => activeQ.filter((q) => q.yearGroup === y).length), all: activeQ.filter((q) => !q.yearGroup).length };
  }, [questions, years]);

  const toggleStatus = async () => {
    if (!window.confirm(data?.status ? "Disable this evaluation form?" : "Enable this evaluation form?")) return;
    const resp = await Service.updateEvaluationForm(params?.formId, { status: !data?.status });
    if (resp) navigate(0);
  };

  const countdown =
    state.key === "open" && data?.endDate ? { to: data.endDate, label: "Closes in" } : state.key === "scheduled" && data?.startDate ? { to: data.startDate, label: "Opens in" } : null;

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-5 md:space-y-6 font-roboto">
      {/* Hero */}
      <section className="dash-fade-up relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-secondary-accent p-6 text-white shadow-xl shadow-primary/25 md:p-8">
        <div className="pointer-events-none absolute inset-0 aisp-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="dash-drift pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="dash-drift pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" style={{ animationDelay: "-4s" }} />

        <div className="relative space-y-6">
          <BackPill to="/ais/evaluation-forms" label="Evaluation Manager" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-white/[0.15] px-2.5 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ring-white/20">{data?.key}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${state.key === "open" || state.key === "always" ? "bg-white text-primary" : "bg-white/[0.15] text-white"}`}>
                  <state.Icon className="h-3.5 w-3.5" /> {state.label}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">{data?.name}</h1>
              {data?.description ? <p className="text-sm text-sky-100/80">{data.description}</p> : null}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {countdown ? <Countdown to={countdown.to} label={countdown.label} /> : null}
              <div className="flex items-center gap-2">
                {canEdit ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!!data?.status}
                    onClick={toggleStatus}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
                  >
                    <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${data?.status ? "bg-white" : "bg-white/30"}`}>
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full shadow transition-all duration-300 ${data?.status ? "left-[18px] bg-secondary-accent" : "left-0.5 bg-white"}`} />
                    </span>
                    {data?.status ? "Enabled" : "Disabled"}
                  </button>
                ) : null}
                {canEdit ? (
                  <Link
                    to="edit"
                    title="Edit form"
                    aria-label="Edit form"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:scale-105 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
                  >
                    <HiOutlinePencilSquare className="h-6 w-6" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
        <KpiTile label="Questions" value={activeQ.length} Icon={HiOutlineBookOpen} caption={`${fmt(questions.length - activeQ.length)} disabled`} delay={80} />
        <KpiTile label="Guides" value={guides.length} Icon={HiOutlineLightBulb} caption="shown before the questions" delay={140} />
        <KpiTile label="Year groups" value={years.length || 4} Icon={HiOutlineUserGroup} caption={years.length ? years.map((y) => `Year ${y}`).join(" · ") : "Open to all years"} delay={200} />
        <KpiTile label="Submissions" value={sub.total} Icon={HiOutlineClipboardDocumentCheck} caption={`${fmt(sub.completed)} completed`} delay={260} />
      </div>

      {/* Window + submissions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard titleFont="font-roboto" title="Evaluation window" subtitle={state.key === "always" ? "No dates set: open whenever enabled" : "When students can respond"} Icon={HiOutlineCalendarDays} delay={320} className="lg:col-span-2">
          <WindowTimeline form={data} state={state.key} stateInfo={state} years={years} />
        </DashCard>
        <DashCard titleFont="font-roboto" title="Submissions" subtitle="Completed of all started" Icon={HiOutlineChartPie} delay={380}>
          <div className="flex flex-col items-center gap-4">
            <RadialMeter value={sub.completed} total={sub.total} label="Completed" size={150} stroke={12} />
            <div className="grid w-full grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-primary/5 py-2">
                <CountUp value={sub.completed} className="block text-lg font-extrabold text-primary-dark/70" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Completed</span>
              </div>
              <div className="rounded-xl bg-primary/5 py-2">
                <CountUp value={sub.inProgress} className="block text-lg font-extrabold text-primary-dark/70" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">In progress</span>
              </div>
            </div>
            {!sub.total ? <p className="text-center text-xs text-slate-400">No students have started this evaluation yet.</p> : null}
          </div>
        </DashCard>
      </div>

      {/* Question makeup */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard titleFont="font-roboto" title="Questions by category" subtitle={`${fmt(byCategory.length)} categor${byCategory.length === 1 ? "y" : "ies"}`} Icon={HiOutlineQueueList} delay={440}>
          {byCategory.length ? (
            <HBarList rows={byCategory.map(([label, qs]) => ({ label, value: qs.filter((q) => q.status).length }))} unit="questions" />
          ) : (
            <p className="py-6 text-center text-xs uppercase tracking-wider text-slate-400">No questions yet</p>
          )}
        </DashCard>
        <DashCard titleFont="font-roboto" title="Questions by year group" subtitle={yearCols.all ? `+ ${fmt(yearCols.all)} asked of every year` : "Questions each year group answers"} Icon={HiOutlineUserGroup} delay={500}>
          <YearColumns values={yearCols.values} years={yearCols.years} height={170} unit="questions" />
        </DashCard>
        <DashCard titleFont="font-roboto" title="Question design" subtitle="How the form is built" Icon={HiOutlineSparkles} delay={560}>
          <div className="space-y-5">
            {[
              { label: "Required", value: required, note: `${fmt(activeQ.length - required)} optional` },
              { label: "Rating scale (Likert)", value: likert, note: `${fmt(activeQ.length - likert)} free-text` },
            ].map((m, i) => (
              <div key={m.label}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-primary-dark/70">{m.label}</span>
                  <span className="text-xs text-slate-500">
                    <span className="font-bold text-primary-dark/70">{fmt(m.value)}</span> of {fmt(activeQ.length)} · {pct(m.value, activeQ.length)}%
                  </span>
                </div>
                <LinearMeter value={m.value} total={activeQ.length} delay={600 + i * 120} />
                <p className="mt-1 text-[0.7rem] text-slate-400">{m.note}</p>
              </div>
            ))}
            {scale.length ? (
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-primary-dark/70">Rating scale</span>
                  <Link to="/ais/evaluation-forms/rating-scale" className="text-[0.7rem] font-semibold text-secondary-accent hover:underline">
                    Shared by every form
                  </Link>
                </div>
                <ol className="flex flex-wrap gap-1.5">
                  {scale.map((o: any) => (
                    <li key={o.id} className="rounded-md bg-primary/5 px-2 py-0.5 text-[0.7rem] font-semibold text-primary-dark/70">
                      <span className="mr-1 font-bold tabular-nums text-secondary-accent">{o.value}</span>
                      {o.option}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </DashCard>
      </div>

      {/* Questions + guides */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashCard titleFont="font-roboto" title="Questions" subtitle={`${fmt(questions.length)} in ${fmt(byCategory.length)} categor${byCategory.length === 1 ? "y" : "ies"}`} Icon={HiOutlineBookOpen} delay={620} className="lg:col-span-2">
          <div className="space-y-3">
            {byCategory.map(([category, qs], ci) => {
              const isOpen = open[category] ?? ci === 0;
              return (
                <div key={category} className="overflow-hidden rounded-2xl ring-1 ring-inset ring-primary/10">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen((o) => ({ ...o, [category]: !isOpen }))}
                    className="flex w-full items-center justify-between gap-3 bg-primary/[0.03] px-4 py-3 text-left transition-colors hover:bg-primary/5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-primary-dark/70">{category}</span>
                      <span className="text-[0.7rem] text-slate-400">{qs.length} question{qs.length === 1 ? "" : "s"}</span>
                    </span>
                    <HiOutlineChevronDown className={`h-4 w-4 shrink-0 text-primary/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen ? (
                    <ol className="divide-y divide-primary/5">
                      {qs.map((q: any, i: number) => (
                        <li key={q.id} className="dash-fade-up flex gap-3 px-4 py-3" style={{ animationDelay: `${i * 40}ms` }}>
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-dark/70 text-[0.65rem] font-bold text-white">{i + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm leading-snug ${q.status ? "text-primary-dark/70" : "text-slate-400 line-through"}`}>{q.question}</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              <span className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary-dark/70">{q.type === "likert" ? "Rating scale" : "Free text"}</span>
                              {q.yearGroup ? <span className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary-dark/70">Year {q.yearGroup}</span> : null}
                              {q.required ? <span className="rounded-md bg-secondary-accent px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">Required</span> : null}
                              {!q.status ? <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.65rem] font-semibold text-slate-500">Disabled</span> : null}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              );
            })}
            {!questions.length ? <p className="py-8 text-center text-xs uppercase tracking-wider text-slate-400">No questions yet</p> : null}
          </div>
        </DashCard>

        <DashCard titleFont="font-roboto" title="Guides" subtitle="What students read first" Icon={HiOutlineLightBulb} delay={680}>
          <ol className="relative space-y-4">
            {guides.length > 1 ? <span className="absolute bottom-3 left-[0.95rem] top-3 w-px bg-gradient-to-b from-primary/30 to-transparent" aria-hidden /> : null}
            {guides.map((g: any, i: number) => (
              <li key={g.id} className="dash-fade-up relative flex gap-3" style={{ animationDelay: `${700 + i * 80}ms` }}>
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary ring-1 ring-primary/20 shadow-sm">{i + 1}</span>
                <div className="min-w-0 flex-1 rounded-2xl bg-primary/[0.03] p-3">
                  <p className="text-sm font-bold text-primary-dark/70">{g.title || "Guide"}</p>
                  {g.description ? <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-500">{g.description}</p> : null}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.yearGroup ? <span className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary-dark/70">Year {g.yearGroup}</span> : null}
                    {!g.status ? <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.65rem] font-semibold text-slate-500">Hidden</span> : null}
                  </div>
                </div>
              </li>
            ))}
            {!guides.length ? <p className="py-8 text-center text-xs uppercase tracking-wider text-slate-400">No guides yet</p> : null}
          </ol>
        </DashCard>
      </div>
    </main>
  );
}

export default PgAISEvaluationForm;
