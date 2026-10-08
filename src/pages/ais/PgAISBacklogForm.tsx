import React, { useState } from "react";
import { MdOutlineRemoveCircle } from "react-icons/md";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { scoreMax } from "../../utils/scoreRange";

type Props = {};

// Assessment scores: Class = Quiz + Midsem + Assignment (an older entry with
// no breakdown keeps its class score), Total = Class + Exam. The server
// recomputes the same way when saving.
const num = (v: any) => (v === "" || v == null || isNaN(parseFloat(v)) ? null : parseFloat(v));
const round2 = (v: number | null) => (v == null ? "" : Math.round(v * 100) / 100);
const classOf = (r: any) => {
  const parts = [r?.scoreQuiz, r?.scoreMidsem, r?.scoreAssignment].map(num);
  return parts.every((p) => p == null) ? num(r?.scoreClass) : parts.reduce((a: number, p) => a + (p ?? 0), 0);
};
const totalOf = (r: any) => {
  const c = classOf(r), e = num(r?.scoreExam);
  return c == null && e == null ? num(r?.scoreTotal) : (c ?? 0) + (e ?? 0);
};
let rowKey = 0;
const withKey = (r: any) => ({ ...r, _key: ++rowKey });

// Save Form
export async function action({ request, params }) {
  const id = params?.backlogId || 0;
  const user = useUserStore.getState().user;
  
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
      data.userId = user?.user?.tag;

  let resp;
  if (id != 0) resp = await Service.updateBacklog(id, data);
  else resp = await Service.postBacklog(data);
  console.log(resp);
  if (resp) {
    return redirect(`/ais/backlogs/${resp?.data?.id}`);
  }
  return null;
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const sessions = await Service.fetchSessionList();
  const departments = await Service.fetchDepartments();
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();
  const courses = await Service.fetchCourseList();
  const schemes = await Service.fetchSchemeList();

  const id = params?.backlogId || 0;
  if (id != 0) data = await Service.fetchBacklog(id);
  return { data, departments, programs, courses, sessions, majors, schemes };
}

function PgAISBacklogForm({}: Props) {
  const navigate = useNavigate();
  const { data, courses, sessions, schemes }: any = useLoaderData();
  const [form, setForm] = useState(data);
  // Each row gets a stable key so removing one doesn't shift the uncontrolled
  // inputs of the rows below it.
  const [meta, setMeta] = useState(() => (data.meta ?? [{ indexno: "" }]).map(withKey));

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const addMeta = () => setMeta([...meta, withKey({ indexno: "" })]);
  const removeMeta = (index) => setMeta([...meta.filter((r, i) => i != index)]);
  const setScore = (index: number, key: string, value: string) =>
    setMeta(meta.map((r, i) => (i == index ? { ...r, [key]: value } : r)));
  // Max marks come from the chosen academic scheme's score range.
  const scheme = schemes?.find((s: any) => s.id == form?.schemeId);
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Backlog`}
        page="Backlog"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Backlog
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:text-base tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        <Form
          method="post"
          onChange={onChange}
          className="grid md:grid-cols-1 gap-y-2 md:gap-y-4"
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="md:pl-6 space-y-4">
              {/* <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Title
                </span>
                <input
                  arial-label="title"
                  name="title"
                  defaultValue={form?.title}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base tracking-widest text-gray-500 rounded-md"
                />
              </label> */}
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Calendar
                </span>
                <select
                  arial-label="sessionId"
                  name="sessionId"
                  defaultValue={form?.sessionId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {sessions &&
                    sessions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                        {row.default && ` - DEFAULT`} 
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Academic Scheme
                </span>
                <select
                  arial-label="schemeId"
                  name="schemeId"
                  defaultValue={form?.schemeId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {schemes &&
                    schemes?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Action Type
                </span>
                <select
                  arial-label="type"
                  name="type"
                  defaultValue={form?.type}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="REGISTRATION">REGISTRATION</option>
                  <option value="ASSESSMENT">ASSESSMENT</option>
                  <option value="DELETION">DELETION</option>
                </select>
              </label>
            </div>
          </div>

          <div className="relative p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              BACKLOG {form?.type} DATA
            </h1>
            <button
              type="button"
              onClick={() => addMeta()}
              className="absolute top-0 right-10 px-4 py-0.5 bg-primary/70 rounded text-white text-xs font-bold tracking-widest"
            >
              ADD
            </button>
            <div className="md:pl-6 space-y-4">
              {/* Registration */}
              {form.type == "REGISTRATION" ? (
                <>
                  {meta?.map((r: any, i: number) => {
                    return (
                      <div key={r._key} className="relative md:pl-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => removeMeta(i)}
                          className="absolute -top-1 right-2"
                        >
                          <MdOutlineRemoveCircle className="h-6 w-6 text-primary-dark" />
                        </button>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            INDEX NUMBER
                          </span>
                          <input
                            arial-label={`${i + 1}_indexno`}
                            name={`${i + 1}_indexno`}
                            defaultValue={r?.indexno}
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          />
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            COURSE
                          </span>
                          <select
                            arial-label={`${i + 1}_courseId`}
                            name={`${i + 1}_courseId`}
                            defaultValue={r?.courseId}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            {courses &&
                              courses?.map((row: any) => (
                                <option key={row.id} value={row.id}>
                                  {row.id} - {row.title?.toUpperCase()}{" "}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            SEMESTER LEVEL
                          </span>
                          <select
                            arial-label={`${i + 1}_semesterNum`}
                            name={`${i + 1}_semesterNum`}
                            defaultValue={r?.semesterNum}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="1">YEAR 1 - SEM1</option>
                            <option value="2">YEAR 1 - SEM2</option>
                            <option value="3">YEAR 2 - SEM1</option>
                            <option value="4">YEAR 2 - SEM2</option>
                            <option value="5">YEAR 3 - SEM1</option>
                            <option value="6">YEAR 3 - SEM2</option>
                            <option value="7">YEAR 4 - SEM1</option>
                            <option value="8">YEAR 4 - SEM2</option>
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            ASSESSMENT TYPE
                          </span>
                          <select
                            arial-label={`${i + 1}_scoreType`}
                            name={`${i + 1}_scoreType`}
                            defaultValue={r?.scoreType}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="N">NORMAL</option>
                            <option value="R">RESIT</option>
                          </select>
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : null}

              {/* Assessment */}
              {form.type == "ASSESSMENT" ? (
                <>
                  {meta?.map((r: any, i: number) => {
                    return (
                      <div key={r._key} className="relative md:pl-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => removeMeta(i)}
                          className="absolute top-0 right-2"
                        >
                          <MdOutlineRemoveCircle className="h-6 w-6 text-primary-dark" />
                        </button>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            INDEX NUMBER
                          </span>
                          <input
                            arial-label={`${i + 1}_indexno`}
                            name={`${i + 1}_indexno`}
                            defaultValue={r?.indexno}
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          />
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            COURSE
                          </span>
                          <select
                            arial-label={`${i + 1}_courseId`}
                            name={`${i + 1}_courseId`}
                            defaultValue={r?.courseId}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            {courses &&
                              courses?.map((row: any) => (
                                <option key={row.id} value={row.id}>
                                  {row.id} - {row.title?.toUpperCase()}{" "}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            SEMESTER LEVEL
                          </span>
                          <select
                            arial-label={`${i + 1}_semesterNum`}
                            name={`${i + 1}_semesterNum`}
                            defaultValue={r?.semesterNum}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="1">YEAR 1 - SEM1</option>
                            <option value="2">YEAR 1 - SEM2</option>
                            <option value="3">YEAR 2 - SEM1</option>
                            <option value="4">YEAR 2 - SEM2</option>
                            <option value="5">YEAR 3 - SEM1</option>
                            <option value="6">YEAR 3 - SEM2</option>
                            <option value="7">YEAR 4 - SEM1</option>
                            <option value="8">YEAR 4 - SEM2</option>
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            ASSESSMENT TYPE
                          </span>
                          <select
                            arial-label={`${i + 1}_scoreType`}
                            name={`${i + 1}_scoreType`}
                            defaultValue={r?.scoreType}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="N">NORMAL</option>
                            <option value="R">RESIT</option>
                          </select>
                        </label>
                        <div className="md:col-span-4 grid grid-cols-3 md:grid-cols-6 gap-2">
                          {[
                            { key: "scoreQuiz", label: "QUIZ", max: scoreMax(scheme, "quiz") },
                            { key: "scoreMidsem", label: "MIDSEM", max: scoreMax(scheme, "midsem") },
                            { key: "scoreAssignment", label: "ASSIGNMENT", max: scoreMax(scheme, "assignment") },
                          ].map((f) => (
                            <label key={f.key} className="flex flex-col space-y-2">
                              <span className="text-xs md:text-xs text-gray-400 font-bold">
                                {f.label} <span className="font-normal">/ {f.max}</span>
                              </span>
                              <input
                                arial-label={`${i + 1}_${f.key}`}
                                name={`${i + 1}_${f.key}`}
                                type="number"
                                step="any"
                                min={0}
                                max={f.max}
                                value={r?.[f.key] ?? ""}
                                onChange={(e) => setScore(i, f.key, e.target.value)}
                                className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-bold tracking-widest text-gray-500 rounded-md"
                              />
                            </label>
                          ))}
                          <label className="flex flex-col space-y-2">
                            <span className="text-xs md:text-xs text-gray-400 font-bold">
                              CLASS <span className="font-normal">/ {scoreMax(scheme, "class")}</span>
                            </span>
                            <input
                              arial-label={`${i + 1}_scoreClass`}
                              name={`${i + 1}_scoreClass`}
                              value={round2(classOf(r))}
                              readOnly
                              tabIndex={-1}
                              title="Quiz + Midsem + Assignment"
                              className="focus:ring-0 border border-primary-dark/10 bg-slate-100 text-xs md:text-xs font-bold tracking-widest text-gray-600 rounded-md cursor-not-allowed"
                            />
                          </label>
                          <label className="flex flex-col space-y-2">
                            <span className="text-xs md:text-xs text-gray-400 font-bold">
                              EXAMS <span className="font-normal">/ {scoreMax(scheme, "exam")}</span>
                            </span>
                            <input
                              arial-label={`${i + 1}_scoreExam`}
                              name={`${i + 1}_scoreExam`}
                              type="number"
                              step="any"
                              min={0}
                              max={scoreMax(scheme, "exam")}
                              value={r?.scoreExam ?? ""}
                              onChange={(e) => setScore(i, "scoreExam", e.target.value)}
                              className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-bold tracking-widest text-gray-500 rounded-md"
                            />
                          </label>
                          <label className="flex flex-col space-y-2">
                            <span className="text-xs md:text-xs text-gray-400 font-bold">
                              TOTAL
                            </span>
                            <input
                              arial-label={`${i + 1}_scoreTotal`}
                              name={`${i + 1}_scoreTotal`}
                              value={round2(totalOf(r))}
                              readOnly
                              tabIndex={-1}
                              title="Class + Exams"
                              className="focus:ring-0 border border-primary-dark/10 bg-slate-100 text-xs md:text-xs font-bold tracking-widest text-gray-600 rounded-md cursor-not-allowed"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}

              {/* Deletion */}
              {form.type == "DELETION" ? (
                <>
                  {meta?.map((r: any, i: number) => {
                    return (
                      <div key={r._key} className="relative md:pl-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => removeMeta(i)}
                          className="absolute -top-1 right-2"
                        >
                          <MdOutlineRemoveCircle className="h-6 w-6 text-primary-dark" />
                        </button>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            INDEX NUMBER
                          </span>
                          <input
                            arial-label={`${i + 1}_indexno`}
                            name={`${i + 1}_indexno`}
                            defaultValue={r?.indexno}
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          />
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            COURSE
                          </span>
                          <select
                            arial-label={`${i + 1}_courseId`}
                            name={`${i + 1}_courseId`}
                            defaultValue={r?.courseId}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            {courses &&
                              courses?.map((row: any) => (
                                <option key={row.id} value={row.id}>
                                  {row.id} - {row.title?.toUpperCase()}{" "}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            SEMESTER LEVEL
                          </span>
                          <select
                            arial-label={`${i + 1}_semesterNum`}
                            name={`${i + 1}_semesterNum`}
                            defaultValue={r?.semesterNum}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="1">YEAR 1 - SEM1</option>
                            <option value="2">YEAR 1 - SEM2</option>
                            <option value="3">YEAR 2 - SEM1</option>
                            <option value="4">YEAR 2 - SEM2</option>
                            <option value="5">YEAR 3 - SEM1</option>
                            <option value="6">YEAR 3 - SEM2</option>
                            <option value="7">YEAR 4 - SEM1</option>
                            <option value="8">YEAR 4 - SEM2</option>
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            ASSESSMENT TYPE
                          </span>
                          <select
                            arial-label={`${i + 1}_scoreType`}
                            name={`${i + 1}_scoreType`}
                            defaultValue={r?.scoreType}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="N">NORMAL</option>
                            <option value="R">RESIT</option>
                          </select>
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : null}
              <hr className="outline-none border-t" />
              <div className="flex items-center">
                <input type="hidden" name="metaNum" value={meta?.length} />
                <button
                  disabled={loading === "submitting"}
                  className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
                  type="submit"
                >
                  {loading === "submitting" ? (
                    <span className="animate-pulse">SAVING ...</span>
                  ) : (
                    " SAVE"
                  )}
                </button>
                <button
                  disabled={loading === "submitting"}
                  onClick={() => {
                    if (confirm("Cancel")) navigate(-1);
                  }}
                  className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
                  type="button"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}

export default PgAISBacklogForm;
