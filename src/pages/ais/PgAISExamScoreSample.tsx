import React from "react";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import Service from "../../utils/aisService";
import { jsonToExcel } from "../../utils/util";

type Props = {};

// Narrower clone of PgAISBacklogSample: only the fields uploadExamScore
// actually reads -- sessionId, courseId, semesterNum, type (N/R, used with
// the other fields purely to find/confirm the matching assessment record),
// indexno, and a blank examScore placeholder. No Grading Scheme (schemeId)
// -- this never creates an assessment record, only updates examScore/
// totalScore on an existing one.
export async function action({ request }) {
  const formData = await request.formData();
  let data: any = Object.fromEntries(formData);
  data.indexno = "41329275";
  data.examScore = " -- LEAVE BLANK IF NO SCORE / IC -- MAX 40 -- ";

  jsonToExcel([data], `EXAM_SCORES_${data.courseId}_YEAR${Math.ceil(data.semesterNum / 2)}`);
  return false;
}

export async function loader() {
  const sessions = await Service.fetchSessionList();
  const courses = await Service.fetchCourseList();
  return { courses, sessions };
}

function PgAISExamScoreSample({}: Props) {
  const navigate = useNavigate();
  const { courses, sessions }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle title={`Create Exam Score Upload Sample`} page="ExamScore Module" />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              Create Exam Score Upload Sample
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:text-base tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        <Form method="post" className="grid md:grid-cols-1 gap-y-2 md:gap-y-4">
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">ACADEMIC SESSION</span>
                <select
                  arial-label="sessionId"
                  name="sessionId"
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {sessions &&
                    sessions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()} &nbsp; ({row.default && `DEFAULT`})
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  COURSE
                </span>
                <select
                  arial-label={`courseId`}
                  name={`courseId`}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
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
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  YEAR & SEMESTER LEVEL
                </span>
                <select
                  arial-label={`semesterNum`}
                  name={`semesterNum`}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
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
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  ASSESSMENT TYPE
                </span>
                <select
                  arial-label={`type`}
                  name={`type`}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="N">NORMAL ASSESSMENT</option>
                  <option value="R">RESIT ASSESSMENT</option>
                </select>
              </label>
            </div>
          </div>
          <div className="flex items-center">
            <button
              disabled={loading === "submitting"}
              className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
              type="submit"
            >
              {loading === "submitting" ? (
                <span className="animate-pulse">GENERATING ...</span>
              ) : (
                " GENERATE"
              )}
            </button>
            <button
              disabled={loading === "submitting"}
              onClick={() => {
                if (confirm("Cancel")) navigate("/ais/examscores");
              }}
              className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
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

export default PgAISExamScoreSample;
