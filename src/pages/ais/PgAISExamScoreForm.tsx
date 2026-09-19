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

type Props = {};

// Edit-only form for a pending Exam Score batch (this module is upload-only,
// there's no manual create form). Narrower clone of PgAISBacklogForm's
// ASSESSMENT branch: indexno, courseId, semesterNum, scoreType, scoreExam --
// no classScore/scoreTotal (recomputed on approve) and no schemeId.
export async function action({ request, params }) {
  const id = params?.examId;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const resp = await Service.updateExamScoreUpload(id, data);
  if (resp) {
    return redirect(`/ais/examscores/${id}`);
  }
  return null;
}

export async function loader({ params }) {
  const sessions = await Service.fetchSessionList();
  const courses = await Service.fetchCourseList();
  const data = await Service.fetchExamScoreUpload(params.examId);
  return { data, sessions, courses };
}

function PgAISExamScoreForm({}: Props) {
  const navigate = useNavigate();
  const { data, courses, sessions }: any = useLoaderData();
  const [form, setForm] = useState(data);
  const [meta, setMeta] = useState(data.meta ?? [{ indexno: "" }]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const addMeta = () => setMeta([...meta, { indexno: "" }]);
  const removeMeta = (index) => setMeta([...meta.filter((r, i) => i != index)]);
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle title="Edit Exam Score Batch" page="Exam Scores" link={`/ais/examscores/${data?.id}`} />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              Edit Exam Score Batch
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
                        {row.title?.toUpperCase()} &nbsp; ( {row.tag}{" "}
                        {row.default && ` - DEFAULT`} )
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </div>

          <div className="relative p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              EXAM SCORE DATA
            </h1>
            <button
              type="button"
              onClick={() => addMeta()}
              className="absolute top-0 right-10 px-4 py-0.5 bg-primary/70 rounded text-white text-xs font-bold tracking-widest"
            >
              ADD
            </button>
            <div className="md:pl-6 space-y-4">
              {meta?.map((r: any, i: number) => {
                return (
                  <div key={i} className="relative md:pl-6 grid grid-cols-1 md:grid-cols-5 gap-3">
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
                    <label className="flex flex-col space-y-2">
                      <span className="text-xs md:text-xs text-gray-400 font-bold">
                        EXAM SCORE
                      </span>
                      <input
                        arial-label={`${i + 1}_scoreExam`}
                        name={`${i + 1}_scoreExam`}
                        defaultValue={r?.scoreExam}
                        className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-bold tracking-widest text-gray-500 rounded-md"
                      />
                    </label>
                  </div>
                );
              })}
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

export default PgAISExamScoreForm;
