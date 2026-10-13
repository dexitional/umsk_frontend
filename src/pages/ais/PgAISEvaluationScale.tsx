import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineArrowDown,
  HiOutlineArrowPath,
  HiOutlineArrowUp,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineInformationCircle,
  HiOutlineListBullet,
  HiOutlineNumberedList,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Form, redirect, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { BackPill, IconBtn, INPUT, INPUT_ERR, Keyed, Section, Switch, uid } from "../../components/ais/EvalEditorKit";
import Service from "../../utils/aisService";

type Props = {};

// The rating scale is shared by every evaluation form: these are the options
// students pick from on every rating (Likert) question. `value` is the score
// reports average; it's kept as text while editing.
type OptionDraft = { id?: string; option: string; value: string; status: boolean; responses: number };

export async function loader() {
  const options = await Service.fetchEvaluationOptions();
  return { options: Array.isArray(options) ? options : [] };
}

export async function action({ request }) {
  const formData = await request.formData();
  const options = JSON.parse(String(formData.get("optionsJson") || "[]"));
  try {
    await Service.saveEvaluationScale(options);
  } catch (e: any) {
    toast.error(e?.response?.data?.message || "Could not save the rating scale.");
    return null;
  }
  return redirect("/ais/evaluation-forms");
}

const toDraft = (o: any): Keyed<OptionDraft> => ({
  _key: uid(),
  id: o.id,
  option: o.option || "",
  value: String(o.value ?? ""),
  status: o.status !== false,
  responses: o?._count?.responses || 0,
});
// What the save endpoint receives; display order is the array order.
const payload = (rows: OptionDraft[]) => rows.map((r) => ({ id: r.id, option: r.option.trim(), value: Number(r.value), status: r.status }));
const isWhole = (v: string) => /^-?\d+$/.test(v.trim());
const fmt = (n: number) => n.toLocaleString();

function PgAISEvaluationScale({}: Props) {
  const navigate = useNavigate();
  const { options }: any = useLoaderData();
  const navigation = useNavigation();
  const saving = navigation?.state === "submitting";
  const savingRef = useRef(saving);
  savingRef.current = saving;
  const formRef = useRef<HTMLFormElement>(null);

  const [rows, setRows] = useState<Keyed<OptionDraft>[]>(() => (options || []).map(toDraft));
  const [showErrors, setShowErrors] = useState(false);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  const initial = useMemo(() => (options || []).map(toDraft), [options]);
  const dirty = JSON.stringify(payload(rows)) !== JSON.stringify(payload(initial));
  const enabled = rows.filter((r) => r.status);
  const answers = rows.reduce((a, r) => a + r.responses, 0);

  // Problems per row, then the summary list. Labels and scores only need to be
  // unique among options that are switched on: submissions match an answer to
  // its option by label.
  const rowIssues = useMemo(() => {
    const issues: Record<string, Set<string>> = {};
    const add = (key: string, issue: string) => (issues[key] = (issues[key] || new Set()).add(issue));
    const labels = new Map<string, number>();
    const values = new Map<number, number>();
    rows.forEach((r) => {
      if (!r.status) return;
      const l = r.option.trim().toLowerCase();
      if (l) labels.set(l, (labels.get(l) || 0) + 1);
      if (isWhole(r.value)) values.set(Number(r.value), (values.get(Number(r.value)) || 0) + 1);
    });
    rows.forEach((r) => {
      const l = r.option.trim().toLowerCase();
      if (!l) add(r._key, "label");
      if (!isWhole(r.value)) add(r._key, "value");
      if (r.status && l && (labels.get(l) || 0) > 1) add(r._key, "label-dup");
      if (r.status && isWhole(r.value) && (values.get(Number(r.value)) || 0) > 1) add(r._key, "value-dup");
    });
    return issues;
  }, [rows]);
  const errors = useMemo(() => {
    const all = new Set(Object.values(rowIssues).flatMap((s) => Array.from(s)));
    const e: string[] = [];
    if (all.has("label")) e.push("Every option needs a label.");
    if (all.has("value")) e.push("Every score must be a whole number.");
    if (all.has("label-dup")) e.push("Two options that are switched on share a label.");
    if (all.has("value-dup")) e.push("Two options that are switched on share a score.");
    if (enabled.length < 2) e.push("Keep at least two options switched on.");
    return e;
  }, [rowIssues, enabled.length]);
  const bad = (key: string, ...kinds: string[]) => showErrors && kinds.some((k) => rowIssues[key]?.has(k));

  // Not blocking: scores should rise from the first option to the last, so a
  // higher average means more agreement.
  const scored = enabled.filter((r) => isWhole(r.value)).map((r) => Number(r.value));
  const rising = scored.every((v, i) => i === 0 || v > scored[i - 1]);
  const range = scored.length ? `${Math.min(...scored)} to ${Math.max(...scored)}` : "—";
  const hidden = rows.length - enabled.length;

  // Options students already answered with whose label or score changed.
  const changedInUse = rows.filter((r) => {
    const o = initial.find((x) => x.id && x.id === r.id);
    return o && o.responses > 0 && (o.option.trim() !== r.option.trim() || Number(o.value) !== Number(r.value));
  });

  useEffect(() => {
    if (!focusKey) return;
    document.getElementById(`opt-${focusKey}`)?.focus();
    setFocusKey(null);
  }, [focusKey]);

  // Cmd/Ctrl+S saves; leaving with unsaved changes asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!savingRef.current) formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty && !saving) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, saving]);

  const onSubmit = (e: React.FormEvent) => {
    if (errors.length) {
      e.preventDefault();
      setShowErrors(true);
      return;
    }
    if (
      changedInUse.length &&
      !window.confirm(
        `${changedInUse.map((r) => `"${r.option.trim()}"`).join(", ")} already ${changedInUse.length === 1 ? "has" : "have"} student answers. ` +
          "Renaming or re-scoring changes how those answers read in reports. Save anyway?"
      )
    )
      e.preventDefault();
  };
  const cancel = () => {
    if (!dirty || window.confirm("Discard your unsaved changes?")) navigate(-1);
  };
  const goBack = () => {
    if (!dirty || window.confirm("Discard your unsaved changes?")) navigate("/ais/evaluation-forms");
  };

  const update = (key: string, field: keyof OptionDraft, value: any) => setRows((rs) => rs.map((r) => (r._key === key ? { ...r, [field]: value } : r)));
  const add = () => {
    const key = uid();
    const top = rows.filter((r) => isWhole(r.value)).map((r) => Number(r.value));
    setRows((rs) => [...rs, { _key: key, option: "", value: String(top.length ? Math.max(...top) + 1 : 1), status: true, responses: 0 }]);
    setFocusKey(key);
  };
  const remove = (key: string) => setRows((rs) => rs.filter((r) => r._key !== key));
  const move = (key: string, dir: -1 | 1) =>
    setRows((rs) => {
      const i = rs.findIndex((r) => r._key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  // Scores 1..n down the options that are switched on, in display order.
  const renumber = () => {
    let n = 0;
    setRows((rs) => rs.map((r) => (r.status ? { ...r, value: String(++n) } : r)));
  };

  return (
    <main className="md:pl-10 p-3 md:p-6 font-roboto">
      <Form ref={formRef} method="post" onSubmit={onSubmit} noValidate className="space-y-5">
        <input type="hidden" name="optionsJson" value={JSON.stringify(payload(rows))} readOnly />

        {/* Sticky action bar */}
        <div className="sticky top-0 z-30 -mx-3 px-3 pt-1 md:-mx-6 md:px-6">
          <div className="dash-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-primary to-secondary-accent px-5 py-4 text-white shadow-xl shadow-primary/25 md:px-6">
            <div className="pointer-events-none absolute inset-0 aisp-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3 sm:block">
                <BackPill label="Evaluation Manager" onClick={goBack} className="sm:mb-2.5" />
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-extrabold md:text-xl">Rating scale</h1>
                  <p className="hidden text-xs text-sky-100/80 sm:block">
                    Used by every evaluation form · {enabled.length} option{enabled.length === 1 ? "" : "s"} shown · {fmt(answers)} answer{answers === 1 ? "" : "s"} recorded
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {dirty ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.15] px-2.5 py-1 text-[0.7rem] font-semibold">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" /> Unsaved changes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-semibold text-sky-100/80">
                    <HiOutlineCheck className="h-3.5 w-3.5" /> All saved
                  </span>
                )}
                <button type="button" onClick={cancel} disabled={saving} className="rounded-xl px-3.5 py-2 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/10 disabled:opacity-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !dirty}
                  title="Save (Ctrl/Cmd + S)"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
                >
                  {saving ? (
                    <>
                      <HiOutlineArrowPath className="h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <HiOutlineCheck className="h-4 w-4" /> Save scale
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {showErrors && errors.length ? (
          <div role="alert" className="dash-fade-up rounded-2xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200">
            <p className="flex items-center gap-2 text-sm font-bold text-rose-700">
              <HiOutlineExclamationTriangle className="h-5 w-5" /> Fix {errors.length} thing{errors.length === 1 ? "" : "s"} before saving
            </p>
            <ul className="mt-2 list-disc space-y-0.5 pl-9 text-xs text-rose-700">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <Section
            id="options"
            title="Options"
            subtitle="What students choose from on every rating question, top to bottom"
            Icon={HiOutlineListBullet}
            delay={60}
            action={
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={renumber} title="Score the options that are switched on 1, 2, 3… in this order" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary-dark/70 hover:bg-primary/5">
                  <HiOutlineNumberedList className="h-4 w-4" /> Renumber scores
                </button>
                <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-dark/70 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark">
                  <HiOutlinePlus className="h-4 w-4" /> Add option
                </button>
              </div>
            }
          >
            {answers > 0 ? (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-primary/5 px-3.5 py-3 text-xs text-primary-dark/70">
                <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary-accent" />
                <span>
                  Students have already answered with this scale ({fmt(answers)} answers). Renaming or re-scoring an option changes how those answers read in reports. Options
                  in use can be switched off, so new students no longer see them, but not removed.
                </span>
              </div>
            ) : null}

            <ol className="space-y-2.5">
              {rows.map((r, i) => (
                <li
                  key={r._key}
                  className={`dash-fade-up flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl p-3 ring-1 ring-inset transition-shadow ${
                    showErrors && rowIssues[r._key]?.size ? "ring-rose-300" : "ring-primary/10"
                  } ${r.status ? "bg-white" : "bg-primary/[0.03] opacity-75"}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-dark/70 text-xs font-bold text-white">{i + 1}</span>
                  <input
                    id={`opt-${r._key}`}
                    aria-label={`Option ${i + 1} label`}
                    value={r.option}
                    maxLength={100}
                    onChange={(e) => update(r._key, "option", e.target.value)}
                    placeholder="Label, e.g. Neutral"
                    className={`${INPUT} min-w-0 flex-1 basis-48 font-semibold ${bad(r._key, "label", "label-dup") ? INPUT_ERR : ""}`}
                  />
                  <label className="relative w-28 shrink-0">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Score</span>
                    <input
                      aria-label={`Option ${i + 1} score`}
                      inputMode="numeric"
                      value={r.value}
                      onChange={(e) => update(r._key, "value", e.target.value.replace(/[^\d-]/g, ""))}
                      className={`${INPUT} pl-14 text-right font-bold tabular-nums ${bad(r._key, "value", "value-dup") ? INPUT_ERR : ""}`}
                    />
                  </label>
                  <span
                    className={`w-24 shrink-0 text-center text-[0.7rem] font-semibold ${r.responses ? "rounded-md bg-primary/5 px-2 py-1 text-primary-dark/70" : "text-slate-400"}`}
                    title={r.responses ? "Times students picked this option" : undefined}
                  >
                    {r.responses ? `${fmt(r.responses)} answer${r.responses === 1 ? "" : "s"}` : "Not used yet"}
                  </span>
                  <span className="w-20 shrink-0">
                    <Switch checked={r.status} onChange={(v) => update(r._key, "status", v)} label={r.status ? "Shown" : "Off"} />
                  </span>
                  <span className="ml-auto flex shrink-0 items-center">
                    <IconBtn title="Move up" onClick={() => move(r._key, -1)} disabled={i === 0}>
                      <HiOutlineArrowUp className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Move down" onClick={() => move(r._key, 1)} disabled={i === rows.length - 1}>
                      <HiOutlineArrowDown className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn
                      title={r.responses ? `Used in ${fmt(r.responses)} answers. Switch it off instead.` : "Remove"}
                      onClick={() => remove(r._key)}
                      disabled={r.responses > 0}
                      danger
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </IconBtn>
                  </span>
                </li>
              ))}
            </ol>
            {!rows.length ? (
              <div className="rounded-2xl border border-dashed border-primary/20 py-10 text-center">
                <HiOutlineListBullet className="mx-auto h-8 w-8 text-primary/30" />
                <p className="mt-2 text-sm font-semibold text-primary-dark/70">No options yet</p>
                <p className="text-xs text-slate-400">Add at least two options, e.g. Disagree and Agree.</p>
              </div>
            ) : null}
          </Section>

          <div className="space-y-5 xl:sticky xl:top-36 xl:self-start">
            <Section id="preview" title="Student preview" subtitle="How a rating question looks" Icon={HiOutlineEye} delay={120}>
              <div className="rounded-2xl bg-primary/[0.03] p-4">
                <p className="text-sm font-medium text-primary-dark/80">1. The course was well organized.</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {enabled.map((r) => (
                    <span key={r._key} className="inline-flex items-center gap-2 text-sm italic text-slate-600">
                      <span className="h-4 w-4 shrink-0 rounded-full bg-white ring-1 ring-inset ring-slate-300" />
                      {r.option.trim() || <span className="text-slate-400">Untitled</span>}
                    </span>
                  ))}
                  {!enabled.length ? <span className="text-xs text-slate-400">No options are switched on.</span> : null}
                </div>
              </div>
              <p className="mt-2 text-[0.7rem] text-slate-400">Students see the labels only; scores are used in reports.</p>
            </Section>

            <Section id="check" title="Scale check" subtitle="Before you save" Icon={HiOutlineCheckCircle} delay={180}>
              <ul className="space-y-2.5 text-xs text-primary-dark/70">
                <li className="flex items-start gap-2">
                  {enabled.length >= 2 ? <HiOutlineCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary-accent" /> : <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />}
                  <span>
                    <b>{enabled.length}</b> option{enabled.length === 1 ? "" : "s"} shown to students{enabled.length < 2 ? " (at least two needed)" : ""}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  {rising ? <HiOutlineCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary-accent" /> : <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                  <span>
                    {rising ? "Scores rise from the first option to the last" : "Scores don't rise from first to last, so a higher average would mean less agreement"} · <b>{range}</b>
                  </span>
                </li>
                {hidden ? (
                  <li className="flex items-start gap-2">
                    <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                      <b>{hidden}</b> switched off, kept for past answers
                    </span>
                  </li>
                ) : null}
                {changedInUse.length ? (
                  <li className="flex items-start gap-2">
                    <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>You've renamed or re-scored {changedInUse.length} option{changedInUse.length === 1 ? "" : "s"} students already used</span>
                  </li>
                ) : null}
              </ul>
            </Section>
          </div>
        </div>
      </Form>
    </main>
  );
}

export default PgAISEvaluationScale;
