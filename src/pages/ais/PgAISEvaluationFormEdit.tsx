import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowDown,
  HiOutlineArrowPath,
  HiOutlineArrowUp,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineDocumentDuplicate,
  HiOutlineExclamationTriangle,
  HiOutlineIdentification,
  HiOutlineLightBulb,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Service from "../../utils/aisService";
import { BackPill, IconBtn, INPUT, INPUT_ERR, Keyed, Section, Segmented, strip, Switch, uid } from "../../components/ais/EvalEditorKit";

type Props = {};

type QuestionDraft = {
  id?: string;
  question: string;
  category: string;
  yearGroup: string; // '' = applies to every year group
  type: string; // 'likert' | 'text'
  orderNum: number;
  required: boolean;
  status: boolean;
};

type GuideDraft = {
  id?: string;
  title: string;
  description: string;
  yearGroup: string; // '' = applies to every year group / whole form
  orderNum: number;
  status: boolean;
};

const YEAR_GROUP_OPTIONS = [1, 2, 3, 4];

function normalizeQuestion(q: any): QuestionDraft {
  return {
    id: q.id,
    question: q.question || "",
    category: q.category || "",
    yearGroup: q.yearGroup != null ? String(q.yearGroup) : "",
    type: q.type || "likert",
    orderNum: q.orderNum ?? 1,
    required: !!q.required,
    status: q.status !== false,
  };
}

function normalizeGuide(g: any): GuideDraft {
  return {
    id: g.id,
    title: g.title || "",
    description: g.description || "",
    yearGroup: g.yearGroup != null ? String(g.yearGroup) : "",
    orderNum: g.orderNum ?? 0,
    status: g.status !== false,
  };
}

function questionPayload(q: QuestionDraft, formId: string) {
  return {
    formId,
    question: q.question,
    category: q.category,
    yearGroup: q.yearGroup === "" ? null : Number(q.yearGroup),
    type: q.type,
    orderNum: Number(q.orderNum),
    required: !!q.required,
    status: !!q.status,
  };
}

function guidePayload(g: GuideDraft, formId: string) {
  return {
    formId,
    title: g.title || null,
    description: g.description,
    yearGroup: g.yearGroup === "" ? null : Number(g.yearGroup),
    orderNum: Number(g.orderNum),
    status: !!g.status,
  };
}

export async function action({ request, params }) {
  const id = params?.formId || 0;
  const formData = await request.formData();

  const questions: QuestionDraft[] = JSON.parse(String(formData.get("questionsJson") || "[]"));
  const originalQuestions: QuestionDraft[] = JSON.parse(String(formData.get("originalQuestionsJson") || "[]"));
  const guides: GuideDraft[] = JSON.parse(String(formData.get("guidesJson") || "[]"));
  const originalGuides: GuideDraft[] = JSON.parse(String(formData.get("originalGuidesJson") || "[]"));
  const yearGroups = formData.getAll("yearGroups") as string[];
  const originalYearGroups: string[] = JSON.parse(String(formData.get("originalYearGroupsJson") || "[]"));

  const data: any = {
    key: formData.get("key"),
    name: formData.get("name"),
    description: formData.get("description") || null,
    status: formData.get("status") == "1",
    startDate: formData.get("startDate") ? moment(formData.get("startDate") as string) : null,
    endDate: formData.get("endDate") ? moment(formData.get("endDate") as string) : null,
  };

  let formResp;
  if (id != 0) formResp = await Service.updateEvaluationForm(id, data);
  else formResp = await Service.postEvaluationForm(data);

  const formId = id != 0 ? id : formResp?.id;
  if (!formId) return null;

  // Questions: 3-way diff against what the loader originally handed us.
  const currentQuestionIds = new Set(questions.filter((q) => q.id).map((q) => q.id));
  const toDeleteQuestions = originalQuestions.filter((q) => q.id && !currentQuestionIds.has(q.id));
  const toCreateQuestions = questions.filter((q) => !q.id);
  const originalQById = new Map(originalQuestions.map((q) => [q.id, q]));
  const toUpdateQuestions = questions.filter(
    (q) => q.id && JSON.stringify(q) !== JSON.stringify(originalQById.get(q.id))
  );

  await Promise.all(
    toDeleteQuestions.map(async (q) => {
      try {
        await Service.deleteEvaluationQuestion(q.id as string, true);
      } catch {
        // Question already has submitted responses — disable instead of losing history.
        await Service.updateEvaluationQuestion(q.id as string, { status: false }, true);
      }
    })
  );
  await Promise.all(
    toCreateQuestions.map((q) => Service.postEvaluationQuestion(questionPayload(q, formId), true))
  );
  await Promise.all(
    toUpdateQuestions.map((q) => Service.updateEvaluationQuestion(q.id as string, questionPayload(q, formId), true))
  );

  // Guides: same 3-way diff.
  const currentGuideIds = new Set(guides.filter((g) => g.id).map((g) => g.id));
  const toDeleteGuides = originalGuides.filter((g) => g.id && !currentGuideIds.has(g.id));
  const toCreateGuides = guides.filter((g) => !g.id);
  const originalGById = new Map(originalGuides.map((g) => [g.id, g]));
  const toUpdateGuides = guides.filter(
    (g) => g.id && JSON.stringify(g) !== JSON.stringify(originalGById.get(g.id))
  );

  await Promise.all(toDeleteGuides.map((g) => Service.deleteEvaluationGuide(g.id as string, true)));
  await Promise.all(toCreateGuides.map((g) => Service.postEvaluationGuide(guidePayload(g, formId), true)));
  await Promise.all(
    toUpdateGuides.map((g) => Service.updateEvaluationGuide(g.id as string, guidePayload(g, formId), true))
  );

  // Year groups: simple 2-way diff (add/remove only).
  const toAddYearGroups = yearGroups.filter((yg) => !originalYearGroups.includes(yg));
  const toRemoveYearGroups = originalYearGroups.filter((yg) => !yearGroups.includes(yg));
  await Promise.all(toRemoveYearGroups.map((yg) => Service.deleteEvaluationFormYearGroup(formId, yg, true)));
  await Promise.all(toAddYearGroups.map((yg) => Service.postEvaluationFormYearGroup(formId, yg, true)));

  return redirect(`/ais/evaluation-forms/${encodeURIComponent(formId)}`);
}

export async function loader({ params }) {
  const id = params?.formId || 0;
  let data: any = { id: 0, status: true, questions: [], guides: [], yearGroups: [] };
  if (id != 0) data = await Service.fetchEvaluationForm(id);
  // The shared rating scale, for the student preview; the editor still works
  // without it (the preview falls back to the default four-point scale).
  const options = await Service.fetchEvaluationOptions().catch(() => []);
  return { data, options: Array.isArray(options) ? options : [] };
}

// --- Editor UI ---------------------------------------------------------------

// Canonical datetime-local value ("YYYY-MM-DDTHH:mm") -- accepted by every browser.
const toLocalInput = (d: any) => (d ? moment(d).format("YYYY-MM-DDTHH:mm") : "");

// Shown in the student preview when the rating scale couldn't be loaded.
const LIKERT = ["Strongly disagree", "Disagree", "Agree", "Strongly agree"];

function PgAISEvaluationFormEdit({}: Props) {
  const navigate = useNavigate();
  const { data, options }: any = useLoaderData();
  const navigation = useNavigation();
  const saving = navigation?.state === "submitting";
  // Rating-scale options students pick from, in display order.
  const scale = useMemo(() => {
    const live = (options || []).filter((o: any) => o.status);
    return live.length ? live.map((o: any) => `${o.value} · ${o.option}`) : LIKERT.map((l, i) => `${i + 1} · ${l}`);
  }, [options]);
  const formRef = useRef<HTMLFormElement>(null);
  const savingRef = useRef(saving);
  savingRef.current = saving;

  // General (controlled so the header, preview and validation stay live)
  const [general, setGeneral] = useState({
    key: data?.key || "",
    name: data?.name || "",
    description: data?.description || "",
    status: data?.status !== false,
    startDate: toLocalInput(data?.startDate),
    endDate: toLocalInput(data?.endDate),
  });
  const setG = (k: keyof typeof general, v: any) => setGeneral((g) => ({ ...g, [k]: v }));

  const [questions, setQuestions] = useState<Keyed<QuestionDraft>[]>(() => (data?.questions || []).map((q: any) => ({ ...normalizeQuestion(q), _key: uid() })));
  const [guides, setGuides] = useState<Keyed<GuideDraft>[]>(() => (data?.guides || []).map((g: any) => ({ ...normalizeGuide(g), _key: uid() })));
  const [yearGroups, setYearGroups] = useState<string[]>((data?.yearGroups || []).map((yg: any) => String(yg.yearGroup)));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const originalQuestionsJson = useMemo(() => JSON.stringify((data?.questions || []).map(normalizeQuestion)), [data]);
  const originalGuidesJson = useMemo(() => JSON.stringify((data?.guides || []).map(normalizeGuide)), [data]);
  const originalYearGroupsJson = useMemo(() => JSON.stringify((data?.yearGroups || []).map((yg: any) => String(yg.yearGroup))), [data]);
  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        g: { key: data?.key || "", name: data?.name || "", description: data?.description || "", status: data?.status !== false, startDate: toLocalInput(data?.startDate), endDate: toLocalInput(data?.endDate) },
        q: originalQuestionsJson,
        gd: originalGuidesJson,
        y: [...JSON.parse(originalYearGroupsJson)].sort(),
      }),
    [data]
  );
  const dirty = JSON.stringify({ g: general, q: JSON.stringify(strip(questions)), gd: JSON.stringify(strip(guides)), y: [...yearGroups].sort() }) !== initialSnapshot;

  // Validation
  const errors = useMemo(() => {
    const e: { section: string; message: string }[] = [];
    if (!general.key.trim()) e.push({ section: "general", message: "Key is required." });
    else if (!/^[a-z0-9_-]+$/.test(general.key)) e.push({ section: "general", message: "Key may only use lowercase letters, digits, - and _." });
    if (!general.name.trim()) e.push({ section: "general", message: "Name is required." });
    if (general.startDate && general.endDate && moment(general.endDate).isSameOrBefore(moment(general.startDate)))
      e.push({ section: "schedule", message: "Closing time must be after the opening time." });
    const noText = questions.filter((q) => !q.question.trim()).length;
    const noCat = questions.filter((q) => !q.category.trim()).length;
    if (noText) e.push({ section: "questions", message: `${noText} question${noText === 1 ? " has" : "s have"} no text.` });
    if (noCat) e.push({ section: "questions", message: `${noCat} question${noCat === 1 ? " has" : "s have"} no category.` });
    const noGuideText = guides.filter((g) => !g.description.trim()).length;
    if (noGuideText) e.push({ section: "guides", message: `${noGuideText} guide${noGuideText === 1 ? " has" : "s have"} no text.` });
    return e;
  }, [general, questions, guides]);
  const sectionHasError = (s: string) => showErrors && errors.some((e) => e.section === s);

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
      // Open every question with a problem so it can be fixed.
      setExpanded((x) => ({ ...x, ...Object.fromEntries(questions.filter((q) => !q.question.trim() || !q.category.trim()).map((q) => [q._key, true])) }));
      jump(errors[0].section);
    }
  };
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const cancel = () => {
    if (!dirty || window.confirm("Discard your unsaved changes?")) navigate(-1);
  };
  // Header back button: the form's overview when editing, the list when new.
  const back = data?.id
    ? { label: "Form overview", to: `/ais/evaluation-forms/${encodeURIComponent(data.id)}` }
    : { label: "Evaluation Manager", to: "/ais/evaluation-forms" };
  const goBack = () => {
    if (!dirty || window.confirm("Discard your unsaved changes?")) navigate(back.to);
  };

  // Questions
  const categories = useMemo(() => {
    const m = new Map<string, number>();
    questions.forEach((q) => q.category.trim() && m.set(q.category.trim(), (m.get(q.category.trim()) || 0) + 1));
    return Array.from(m.entries());
  }, [questions]);
  const renumber = <T extends { orderNum: number }>(rows: T[], base: number) => rows.map((r, i) => ({ ...r, orderNum: i + base }));
  const addQuestion = () => {
    const key = uid();
    setQuestions((qs) => [
      ...qs,
      { _key: key, question: "", category: catFilter || qs[qs.length - 1]?.category || "", yearGroup: "", type: "likert", orderNum: Math.max(0, ...qs.map((q) => Number(q.orderNum) || 0)) + 1, required: true, status: true },
    ]);
    setExpanded((x) => ({ ...x, [key]: true }));
    setFilter("");
    setTimeout(() => document.getElementById(`q-${key}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };
  const updateQuestion = (key: string, field: keyof QuestionDraft, value: any) => setQuestions((qs) => qs.map((q) => (q._key === key ? { ...q, [field]: value } : q)));
  const removeQuestion = (q: Keyed<QuestionDraft>) => {
    if (q.id && !window.confirm("Remove this question? If students have already answered it, it will be disabled instead of deleted.")) return;
    setQuestions((qs) => qs.filter((x) => x._key !== q._key));
  };
  const duplicateQuestion = (q: Keyed<QuestionDraft>) => {
    const key = uid();
    setQuestions((qs) => {
      const i = qs.findIndex((x) => x._key === q._key);
      const copy = { ...q, id: undefined, _key: key, question: `${q.question} (copy)` };
      return renumber([...qs.slice(0, i + 1), copy, ...qs.slice(i + 1)], 1);
    });
    setExpanded((x) => ({ ...x, [key]: true }));
  };
  const moveQuestion = (key: string, dir: -1 | 1) =>
    setQuestions((qs) => {
      const i = qs.findIndex((x) => x._key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= qs.length) return qs;
      const next = [...qs];
      [next[i], next[j]] = [next[j], next[i]];
      return renumber(next, 1);
    });
  const filtering = !!(filter.trim() || catFilter);
  const shownQuestions = questions.filter(
    (q) => (!catFilter || q.category.trim() === catFilter) && (!filter.trim() || `${q.question} ${q.category}`.toLowerCase().includes(filter.trim().toLowerCase()))
  );
  const setAllExpanded = (v: boolean) => setExpanded(Object.fromEntries(questions.map((q) => [q._key, v])));

  // Guides
  const addGuide = () => setGuides((gs) => [...gs, { _key: uid(), title: "", description: "", yearGroup: "", orderNum: gs.length, status: true }]);
  const updateGuide = (key: string, field: keyof GuideDraft, value: any) => setGuides((gs) => gs.map((g) => (g._key === key ? { ...g, [field]: value } : g)));
  const removeGuide = (g: Keyed<GuideDraft>) => {
    if (g.id && !window.confirm("Remove this guide?")) return;
    setGuides((gs) => gs.filter((x) => x._key !== g._key));
  };
  const moveGuide = (key: string, dir: -1 | 1) =>
    setGuides((gs) => {
      const i = gs.findIndex((x) => x._key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= gs.length) return gs;
      const next = [...gs];
      [next[i], next[j]] = [next[j], next[i]];
      return renumber(next, 0);
    });

  const toggleYearGroup = (yg: string) => setYearGroups((cur) => (cur.includes(yg) ? cur.filter((v) => v !== yg) : [...cur, yg]));

  // Live window summary
  const windowSummary = (() => {
    const s = general.startDate ? moment(general.startDate) : null;
    const e = general.endDate ? moment(general.endDate) : null;
    if (!s && !e) return "No window set: open whenever the form is enabled (and the calendar's evaluation period is open).";
    if (s && e && !e.isAfter(s)) return null;
    const parts: string[] = [];
    if (s && e) parts.push(`Open for ${moment.duration(e.diff(s)).humanize()}`);
    if (s) parts.push(s.isAfter(moment()) ? `opens ${s.fromNow()}` : `opened ${s.fromNow()}`);
    if (e) parts.push(e.isAfter(moment()) ? `closes ${e.fromNow()}` : `closed ${e.fromNow()}`);
    return parts.join(" · ");
  })();

  const nav = [
    { id: "general", label: "General", Icon: HiOutlineIdentification, count: null as number | null },
    { id: "schedule", label: "Window & audience", Icon: HiOutlineCalendarDays, count: null },
    { id: "questions", label: "Questions", Icon: HiOutlineBookOpen, count: questions.length },
    { id: "guides", label: "Guides", Icon: HiOutlineLightBulb, count: guides.length },
  ];

  return (
    <main className="md:pl-10 p-3 md:p-6 font-roboto">
      <Form ref={formRef} method="post" onSubmit={onSubmit} noValidate className="space-y-5">
        <input type="hidden" name="questionsJson" value={JSON.stringify(strip(questions))} readOnly />
        <input type="hidden" name="originalQuestionsJson" value={originalQuestionsJson} readOnly />
        <input type="hidden" name="guidesJson" value={JSON.stringify(strip(guides))} readOnly />
        <input type="hidden" name="originalGuidesJson" value={originalGuidesJson} readOnly />
        <input type="hidden" name="originalYearGroupsJson" value={originalYearGroupsJson} readOnly />
        {yearGroups.map((yg) => (
          <input key={yg} type="hidden" name="yearGroups" value={yg} />
        ))}

        {/* Sticky action bar */}
        <div className="sticky top-0 z-30 -mx-3 px-3 pt-1 md:-mx-6 md:px-6">
          <div className="dash-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-primary to-secondary-accent px-5 py-4 text-white shadow-xl shadow-primary/25 md:px-6">
            <div className="pointer-events-none absolute inset-0 aisp-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3 sm:block">
                <BackPill label={back.label} onClick={goBack} className="sm:mb-2.5" />
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-extrabold md:text-xl">
                    {data?.id ? "Edit" : "New"} evaluation form{general.name ? <span className="font-semibold text-sky-100/80"> · {general.name}</span> : null}
                  </h1>
                  <p className="hidden text-xs text-sky-100/80 sm:block">
                    {questions.length} question{questions.length === 1 ? "" : "s"} · {categories.length} categor{categories.length === 1 ? "y" : "ies"} · {guides.length} guide
                    {guides.length === 1 ? "" : "s"} · {yearGroups.length ? `Year ${[...yearGroups].sort().join(", ")}` : "All years"}
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
                  disabled={saving}
                  title="Save (Ctrl/Cmd + S)"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:hover:translate-y-0"
                >
                  {saving ? (
                    <>
                      <HiOutlineArrowPath className="h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <HiOutlineCheck className="h-4 w-4" /> Save form
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
                <li key={e.message}>
                  <button type="button" onClick={() => jump(e.section)} className="text-left hover:underline">{e.message}</button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[13rem_minmax(0,1fr)]">
          {/* Section nav */}
          <nav className="hidden xl:block">
            <ul className="sticky top-36 space-y-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => jump(n.id)} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-primary-dark/70 transition-colors hover:bg-primary/5">
                    <n.Icon className="h-4 w-4 text-secondary-accent" />
                    <span className="flex-1">{n.label}</span>
                    {sectionHasError(n.id) ? <span className="h-2 w-2 rounded-full bg-rose-500" title="Needs attention" /> : null}
                    {n.count != null ? <span className="rounded-md bg-primary/5 px-1.5 text-[0.7rem] font-bold tabular-nums">{n.count}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-5">
            {/* General */}
            <Section id="general" title="General" subtitle="How the form is identified" Icon={HiOutlineIdentification} delay={60}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key</span>
                  <input
                    name="key"
                    value={general.key}
                    onChange={(e) => setG("key", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    required
                    placeholder="e.g. sts"
                    className={`${INPUT} font-semibold ${showErrors && (!general.key.trim() || !/^[a-z0-9_-]+$/.test(general.key)) ? INPUT_ERR : ""}`}
                  />
                  <span className="block text-[0.7rem] text-slate-400">Unique · lowercase letters, digits, - and _</span>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</span>
                  <input
                    name="name"
                    value={general.name}
                    onChange={(e) => setG("name", e.target.value)}
                    required
                    maxLength={150}
                    placeholder="e.g. Supported Teaching in School Appraisal"
                    className={`${INPUT} ${showErrors && !general.name.trim() ? INPUT_ERR : ""}`}
                  />
                  <span className="block text-right text-[0.7rem] text-slate-400">{general.name.length}/150</span>
                </label>
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</span>
                  <textarea name="description" value={general.description} onChange={(e) => setG("description", e.target.value)} rows={3} placeholder="What this evaluation is for (shown to staff)" className={INPUT} />
                </label>
                <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-primary-dark/80">Accepting responses</p>
                    <p className="text-xs text-slate-400">Turn off to hide the form from students without deleting it.</p>
                  </div>
                  <Switch checked={general.status} onChange={(v) => setG("status", v)} label={general.status ? "Enabled" : "Disabled"} name="status" />
                </div>
              </div>
            </Section>

            {/* Window & audience */}
            <Section id="schedule" title="Window & audience" subtitle="When it's open and who answers it" Icon={HiOutlineCalendarDays} delay={120}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Opens</span>
                  <input type="datetime-local" name="startDate" value={general.startDate} onChange={(e) => setG("startDate", e.target.value)} className={INPUT} />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Closes</span>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={general.endDate}
                    min={general.startDate || undefined}
                    onChange={(e) => setG("endDate", e.target.value)}
                    className={`${INPUT} ${showErrors && sectionHasError("schedule") ? INPUT_ERR : ""}`}
                  />
                </label>
              </div>
              <div className={`mt-3 flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs ${windowSummary ? "bg-primary/5 text-primary-dark/70" : "bg-rose-50 text-rose-700"}`}>
                <HiOutlineClock className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{windowSummary || "Closing time must be after the opening time."}</span>
              </div>
              <p className="mt-2 text-[0.7rem] text-slate-400">
                This window is separate from the Academic Calendar's evaluation period. Both must be open for students to see the form.
              </p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Year groups</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {YEAR_GROUP_OPTIONS.map((yg) => {
                    const on = yearGroups.includes(String(yg));
                    return (
                      <button
                        key={yg}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleYearGroup(String(yg))}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                          on ? "bg-secondary-accent text-white shadow-md shadow-primary/20" : "bg-primary/5 text-primary-dark/70 hover:bg-primary/10"
                        }`}
                      >
                        {on ? <HiOutlineCheck className="h-4 w-4" /> : null} Year {yg}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[0.7rem] text-slate-400">{yearGroups.length ? "Only the selected year groups are asked." : "None selected: every year group is asked."}</p>
              </div>
            </Section>

            {/* Questions */}
            <Section
              id="questions"
              title="Questions"
              subtitle={`${questions.length} question${questions.length === 1 ? "" : "s"} in ${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
              Icon={HiOutlineBookOpen}
              delay={180}
              action={
                <button type="button" onClick={addQuestion} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-dark/70 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark">
                  <HiOutlinePlus className="h-4 w-4" /> Add question
                </button>
              }
            >
              {questions.length ? (
                <div className="mb-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-0 flex-1 basis-60">
                      <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search questions" className={`${INPUT} pl-9`} />
                    </div>
                    <div className="flex shrink-0">
                      <button type="button" onClick={() => setAllExpanded(true)} className="rounded-xl px-3 py-2 text-xs font-semibold text-primary-dark/70 hover:bg-primary/5">
                        Expand all
                      </button>
                      <button type="button" onClick={() => setAllExpanded(false)} className="rounded-xl px-3 py-2 text-xs font-semibold text-primary-dark/70 hover:bg-primary/5">
                        Collapse all
                      </button>
                    </div>
                  </div>
                  {categories.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {[["", questions.length] as [string, number], ...categories].map(([c, n]) => (
                        <button
                          key={c || "__all"}
                          type="button"
                          aria-pressed={catFilter === c}
                          onClick={() => setCatFilter(c)}
                          className={`rounded-lg px-2.5 py-1 text-[0.7rem] font-semibold transition-colors ${catFilter === c ? "bg-primary-dark/70 text-white" : "bg-primary/5 text-primary-dark/70 hover:bg-primary/10"}`}
                        >
                          {c || "All"} <span className="opacity-70">{n}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <datalist id="eval-categories">
                {categories.map(([c]) => (
                  <option key={c} value={c} />
                ))}
              </datalist>

              <ol className="space-y-3">
                {shownQuestions.map((q) => {
                  const idx = questions.findIndex((x) => x._key === q._key);
                  const isOpen = !!expanded[q._key];
                  const bad = showErrors && (!q.question.trim() || !q.category.trim());
                  return (
                    <li
                      key={q._key}
                      id={`q-${q._key}`}
                      className={`dash-fade-up overflow-hidden rounded-2xl ring-1 ring-inset transition-shadow ${bad ? "ring-rose-300" : "ring-primary/10"} ${isOpen ? "shadow-md shadow-primary/10" : ""} ${!q.status ? "opacity-70" : ""}`}
                    >
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-primary/[0.03] px-3 py-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-dark/70 text-xs font-bold text-white">{idx + 1}</span>
                        <button type="button" onClick={() => setExpanded((x) => ({ ...x, [q._key]: !isOpen }))} aria-expanded={isOpen} className="min-w-0 flex-1 basis-48 text-left">
                          <span className={`block truncate text-sm ${q.question.trim() ? "font-semibold text-primary-dark/80" : "italic text-slate-400"}`}>{q.question.trim() || "New question"}</span>
                          <span className="mt-0.5 flex flex-wrap gap-1">
                            {q.category ? <span className="rounded-md bg-white px-1.5 text-[0.65rem] font-semibold text-primary-dark/70">{q.category}</span> : null}
                            <span className="rounded-md bg-white px-1.5 text-[0.65rem] font-semibold text-primary-dark/70">{q.type === "likert" ? "Rating scale" : "Free text"}</span>
                            <span className="rounded-md bg-white px-1.5 text-[0.65rem] font-semibold text-primary-dark/70">{q.yearGroup ? `Year ${q.yearGroup}` : "All years"}</span>
                            {q.required ? <span className="rounded-md bg-secondary-accent px-1.5 text-[0.65rem] font-semibold text-white">Required</span> : null}
                            {!q.status ? <span className="rounded-md bg-slate-200 px-1.5 text-[0.65rem] font-semibold text-slate-600">Disabled</span> : null}
                          </span>
                        </button>
                        <div className="ml-auto flex shrink-0 items-center">
                          <IconBtn title="Move up" onClick={() => moveQuestion(q._key, -1)} disabled={filtering || idx === 0}>
                            <HiOutlineArrowUp className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn title="Move down" onClick={() => moveQuestion(q._key, 1)} disabled={filtering || idx === questions.length - 1}>
                            <HiOutlineArrowDown className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn title="Duplicate" onClick={() => duplicateQuestion(q)}>
                            <HiOutlineDocumentDuplicate className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn title="Remove" onClick={() => removeQuestion(q)} danger>
                            <HiOutlineTrash className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn title={isOpen ? "Collapse" : "Expand"} onClick={() => setExpanded((x) => ({ ...x, [q._key]: !isOpen }))}>
                            <HiOutlineChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                          </IconBtn>
                        </div>
                      </div>
                      {isOpen ? (
                        <div className="space-y-4 p-4">
                          <label className="block space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Question</span>
                            <textarea
                              value={q.question}
                              onChange={(e) => updateQuestion(q._key, "question", e.target.value)}
                              rows={2}
                              maxLength={500}
                              placeholder="e.g. My coach supports me to become familiar with the school"
                              className={`${INPUT} ${showErrors && !q.question.trim() ? INPUT_ERR : ""}`}
                            />
                            <span className="block text-right text-[0.7rem] text-slate-400">{q.question.length}/500</span>
                          </label>
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-1.5">
                              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</span>
                              <input
                                list="eval-categories"
                                value={q.category}
                                onChange={(e) => updateQuestion(q._key, "category", e.target.value)}
                                maxLength={100}
                                placeholder="Pick or type a category"
                                className={`${INPUT} ${showErrors && !q.category.trim() ? INPUT_ERR : ""}`}
                              />
                            </label>
                            <label className="space-y-1.5">
                              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Year group</span>
                              <select value={q.yearGroup} onChange={(e) => updateQuestion(q._key, "yearGroup", e.target.value)} className={INPUT}>
                                <option value="">All years</option>
                                {YEAR_GROUP_OPTIONS.map((yg) => (
                                  <option key={yg} value={yg}>Year {yg}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <Segmented
                              value={q.type}
                              onChange={(v) => updateQuestion(q._key, "type", v)}
                              options={[
                                { value: "likert", label: "Rating scale", Icon: HiOutlineAdjustmentsHorizontal },
                                { value: "text", label: "Free text", Icon: HiOutlineChatBubbleBottomCenterText },
                              ]}
                            />
                            <div className="flex items-center gap-5">
                              <Switch checked={q.required} onChange={(v) => updateQuestion(q._key, "required", v)} label="Required" />
                              <Switch checked={q.status} onChange={(v) => updateQuestion(q._key, "status", v)} label="Enabled" />
                            </div>
                          </div>
                          {/* What students will see */}
                          <div className="rounded-xl bg-primary/[0.03] p-3">
                            <p className="mb-2 flex items-center justify-between gap-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                              Student preview
                              {q.type === "likert" ? <span className="normal-case tracking-normal">Shared rating scale · Evaluation Manager</span> : null}
                            </p>
                            {q.type === "likert" ? (
                              <div className="grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-1.5">
                                {scale.map((l: string) => (
                                  <span key={l} className="rounded-lg bg-white px-2 py-1.5 text-center text-[0.7rem] font-semibold text-primary-dark/70 ring-1 ring-inset ring-primary/10">
                                    {l}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="h-14 rounded-lg bg-white px-3 py-2 text-xs text-slate-400 ring-1 ring-inset ring-primary/10">Student types an answer…</div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              {!questions.length ? (
                <div className="rounded-2xl border border-dashed border-primary/20 py-10 text-center">
                  <HiOutlineBookOpen className="mx-auto h-8 w-8 text-primary/30" />
                  <p className="mt-2 text-sm font-semibold text-primary-dark/70">No questions yet</p>
                  <p className="text-xs text-slate-400">Add the first question students will answer.</p>
                </div>
              ) : !shownQuestions.length ? (
                <p className="py-6 text-center text-xs text-slate-400">No questions match your search.</p>
              ) : null}
              {filtering && shownQuestions.length ? <p className="mt-3 text-[0.7rem] text-slate-400">Clear the search and category filter to reorder questions.</p> : null}
            </Section>

            {/* Guides */}
            <Section
              id="guides"
              title="Instructions & guides"
              subtitle="Shown to students before the questions"
              Icon={HiOutlineLightBulb}
              delay={240}
              action={
                <button type="button" onClick={addGuide} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-dark/70 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark">
                  <HiOutlinePlus className="h-4 w-4" /> Add guide
                </button>
              }
            >
              <ol className="space-y-3">
                {guides.map((g, i) => {
                  const bad = showErrors && !g.description.trim();
                  return (
                    <li key={g._key} className={`dash-fade-up rounded-2xl p-4 ring-1 ring-inset ${bad ? "ring-rose-300" : "ring-primary/10"} ${!g.status ? "opacity-70" : ""}`}>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary ring-1 ring-primary/20">{i + 1}</span>
                        <input value={g.title} onChange={(e) => updateGuide(g._key, "title", e.target.value)} maxLength={200} placeholder="Title (optional)" className={`${INPUT} flex-1 py-2 font-semibold`} />
                        <IconBtn title="Move up" onClick={() => moveGuide(g._key, -1)} disabled={i === 0}>
                          <HiOutlineArrowUp className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn title="Move down" onClick={() => moveGuide(g._key, 1)} disabled={i === guides.length - 1}>
                          <HiOutlineArrowDown className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn title="Remove" onClick={() => removeGuide(g)} danger>
                          <HiOutlineTrash className="h-4 w-4" />
                        </IconBtn>
                      </div>
                      <textarea
                        value={g.description}
                        onChange={(e) => updateGuide(g._key, "description", e.target.value)}
                        rows={3}
                        placeholder="Instruction or rubric text students read before answering"
                        className={`${INPUT} ${bad ? INPUT_ERR : ""}`}
                      />
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <select value={g.yearGroup} onChange={(e) => updateGuide(g._key, "yearGroup", e.target.value)} className={`${INPUT.replace("w-full ", "")} w-40 py-2`}>
                          <option value="">All years</option>
                          {YEAR_GROUP_OPTIONS.map((yg) => (
                            <option key={yg} value={yg}>Year {yg}</option>
                          ))}
                        </select>
                        <Switch checked={g.status} onChange={(v) => updateGuide(g._key, "status", v)} label={g.status ? "Shown" : "Hidden"} />
                      </div>
                    </li>
                  );
                })}
              </ol>
              {!guides.length ? (
                <div className="rounded-2xl border border-dashed border-primary/20 py-10 text-center">
                  <HiOutlineLightBulb className="mx-auto h-8 w-8 text-primary/30" />
                  <p className="mt-2 text-sm font-semibold text-primary-dark/70">No guides yet</p>
                  <p className="text-xs text-slate-400">Add instructions such as how the rating scale works.</p>
                </div>
              ) : null}
            </Section>
          </div>
        </div>
      </Form>
    </main>
  );
}

export default PgAISEvaluationFormEdit;
