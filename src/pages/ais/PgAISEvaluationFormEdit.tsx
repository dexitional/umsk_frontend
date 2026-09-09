import moment from "moment";
import React, { useState } from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Service from "../../utils/aisService";

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
  return { data };
}

function PgAISEvaluationFormEdit({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  const [questions, setQuestions] = useState<QuestionDraft[]>(
    (data?.questions || []).map(normalizeQuestion)
  );
  const [guides, setGuides] = useState<GuideDraft[]>((data?.guides || []).map(normalizeGuide));
  const [yearGroups, setYearGroups] = useState<string[]>(
    (data?.yearGroups || []).map((yg: any) => String(yg.yearGroup))
  );

  const originalQuestionsJson = JSON.stringify((data?.questions || []).map(normalizeQuestion));
  const originalGuidesJson = JSON.stringify((data?.guides || []).map(normalizeGuide));
  const originalYearGroupsJson = JSON.stringify(
    (data?.yearGroups || []).map((yg: any) => String(yg.yearGroup))
  );

  const addQuestion = () =>
    setQuestions((qs) => [
      ...qs,
      { question: "", category: "", yearGroup: "", type: "likert", orderNum: qs.length + 1, required: true, status: true },
    ]);
  const updateQuestion = (idx: number, field: keyof QuestionDraft, value: any) =>
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  const removeQuestion = (idx: number) => setQuestions((qs) => qs.filter((_, i) => i !== idx));

  const addGuide = () =>
    setGuides((gs) => [...gs, { title: "", description: "", yearGroup: "", orderNum: gs.length, status: true }]);
  const updateGuide = (idx: number, field: keyof GuideDraft, value: any) =>
    setGuides((gs) => gs.map((g, i) => (i === idx ? { ...g, [field]: value } : g)));
  const removeGuide = (idx: number) => setGuides((gs) => gs.filter((_, i) => i !== idx));

  const toggleYearGroup = (yg: string) =>
    setYearGroups((cur) => (cur.includes(yg) ? cur.filter((v) => v !== yg) : [...cur, yg]));

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Evaluation Form
            </h1>
            <span className="text-xs md:text-base tracking-wider text-zinc-400">
              Note: this form's own Start/End window is separate from the Academic Calendar's
              general evaluation period — both must be open for students to see it.
            </span>
          </div>
        </section>

        <Form method="post" className="space-y-6">
          <input type="hidden" name="questionsJson" value={JSON.stringify(questions)} readOnly />
          <input type="hidden" name="originalQuestionsJson" value={originalQuestionsJson} readOnly />
          <input type="hidden" name="guidesJson" value={JSON.stringify(guides)} readOnly />
          <input type="hidden" name="originalGuidesJson" value={originalGuidesJson} readOnly />
          <input type="hidden" name="originalYearGroupsJson" value={originalYearGroupsJson} readOnly />

          {/* General Information */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="grid md:grid-cols-2 gap-4 md:pl-6">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">Key (unique, e.g. "sts")</span>
                <input
                  aria-label="key"
                  name="key"
                  defaultValue={data?.key}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">Name</span>
                <input
                  aria-label="name"
                  name="name"
                  defaultValue={data?.name}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="md:col-span-2 flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">Description</span>
                <textarea
                  aria-label="description"
                  name="description"
                  defaultValue={data?.description}
                  rows={2}
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">Status</span>
                <select
                  aria-label="status"
                  name="status"
                  defaultValue={Number(data?.status ?? 1)}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option value={1}>ENABLED</option>
                  <option value={0}>DISABLED</option>
                </select>
              </label>
              <div className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">Year Groups (blank = all)</span>
                <div className="flex flex-wrap gap-3">
                  {YEAR_GROUP_OPTIONS.map((yg) => (
                    <label key={yg} className="flex items-center space-x-1.5 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={yearGroups.includes(String(yg))}
                        onChange={() => toggleYearGroup(String(yg))}
                      />
                      <span>Year {yg}</span>
                    </label>
                  ))}
                </div>
                {yearGroups.map((yg) => (
                  <input key={yg} type="hidden" name="yearGroups" value={yg} />
                ))}
              </div>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">Opens</span>
                <input
                  aria-label="startDate"
                  type="datetime-local"
                  name="startDate"
                  defaultValue={data?.startDate ? moment(data.startDate).format("YYYY-MM-DD HH:mm:ss") : ""}
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">Closes</span>
                <input
                  aria-label="endDate"
                  type="datetime-local"
                  name="endDate"
                  defaultValue={data?.endDate ? moment(data.endDate).format("YYYY-MM-DD HH:mm:ss") : ""}
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          {/* Questions */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
                Questions
              </h1>
              <button
                type="button"
                onClick={addQuestion}
                className="py-1 px-3 rounded-md bg-primary/70 text-white text-xs font-semibold"
              >
                + Add Question
              </button>
            </div>
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={idx} className="p-3 border rounded-lg bg-slate-50/50 grid md:grid-cols-6 gap-2 items-start">
                  <textarea
                    className="md:col-span-2 border rounded-md text-sm p-1.5"
                    placeholder="Question text"
                    value={q.question}
                    onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                    rows={2}
                  />
                  <input
                    className="border rounded-md text-sm p-1.5"
                    placeholder="Category"
                    value={q.category}
                    onChange={(e) => updateQuestion(idx, "category", e.target.value)}
                  />
                  <select
                    className="border rounded-md text-sm p-1.5"
                    value={q.type}
                    onChange={(e) => updateQuestion(idx, "type", e.target.value)}
                  >
                    <option value="likert">Likert</option>
                    <option value="text">Text</option>
                  </select>
                  <select
                    className="border rounded-md text-sm p-1.5"
                    value={q.yearGroup}
                    onChange={(e) => updateQuestion(idx, "yearGroup", e.target.value)}
                  >
                    <option value="">All Years</option>
                    {YEAR_GROUP_OPTIONS.map((yg) => (
                      <option key={yg} value={yg}>
                        Year {yg}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      className="w-16 border rounded-md text-sm p-1.5"
                      value={q.orderNum}
                      onChange={(e) => updateQuestion(idx, "orderNum", Number(e.target.value))}
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="py-1 px-2 rounded-md bg-secondary-accent text-white text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="flex items-center space-x-1.5 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(idx, "required", e.target.checked)}
                    />
                    <span>Required</span>
                  </label>
                  <label className="flex items-center space-x-1.5 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={q.status}
                      onChange={(e) => updateQuestion(idx, "status", e.target.checked)}
                    />
                    <span>Enabled</span>
                  </label>
                </div>
              ))}
              {!questions.length && (
                <div className="text-xs text-gray-400">No questions yet — add one above.</div>
              )}
            </div>
          </div>

          {/* Guides */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
                Instructions &amp; Guides
              </h1>
              <button
                type="button"
                onClick={addGuide}
                className="py-1 px-3 rounded-md bg-primary/70 text-white text-xs font-semibold"
              >
                + Add Guide
              </button>
            </div>
            <div className="space-y-3">
              {guides.map((g, idx) => (
                <div key={idx} className="p-3 border rounded-lg bg-slate-50/50 grid md:grid-cols-6 gap-2 items-start">
                  <input
                    className="border rounded-md text-sm p-1.5"
                    placeholder="Title"
                    value={g.title}
                    onChange={(e) => updateGuide(idx, "title", e.target.value)}
                  />
                  <textarea
                    className="md:col-span-3 border rounded-md text-sm p-1.5"
                    placeholder="Instruction / rubric text"
                    value={g.description}
                    onChange={(e) => updateGuide(idx, "description", e.target.value)}
                    rows={2}
                  />
                  <select
                    className="border rounded-md text-sm p-1.5"
                    value={g.yearGroup}
                    onChange={(e) => updateGuide(idx, "yearGroup", e.target.value)}
                  >
                    <option value="">All Years</option>
                    {YEAR_GROUP_OPTIONS.map((yg) => (
                      <option key={yg} value={yg}>
                        Year {yg}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => removeGuide(idx)}
                      className="py-1 px-2 rounded-md bg-secondary-accent text-white text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {!guides.length && (
                <div className="text-xs text-gray-400">No guides yet — add one above.</div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <button
              disabled={loading === "submitting"}
              className="mr-4 py-1 px-4 w-64 rounded-md bg-primary/70 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
              type="submit"
            >
              {loading === "submitting" ? <span className="animate-pulse">SAVING ...</span> : "SAVE"}
            </button>
            <button
              disabled={loading === "submitting"}
              onClick={() => {
                if (confirm("Cancel")) navigate(-1);
              }}
              className="py-1 px-4 rounded-md bg-slate-50 border text-sm text-gray-600"
              type="button"
            >
              CANCEL
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}

export default PgAISEvaluationFormEdit;
