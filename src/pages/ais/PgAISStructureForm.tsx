import React from "react";
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

// Save Form
export async function action({ request, params }) {
  const id = params?.curriculumId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.semesterNum = +data.semesterNum;
  data.lock = data.lock == 1;
  data.status = data.status == 1;

  let resp;
  if (id != 0) resp = await Service.updateCurriculum(id, data);
  else resp = await Service.postCurriculum(data);

  if (resp) {
    // return redirect(`/ais/programs/${encodeURIComponent(resp.programId)}/curriculum`)
    return redirect(`/ais/curriculums`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const departments = await Service.fetchDepartments();
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();
  const courses = await Service.fetchCourseList();

  const id = params?.curriculumId || 0;
  if (id != 0) data = await Service.fetchCurriculum(id);
  return { data, departments, programs, majors, courses };
}

function PgAISStructureForm({}: Props) {
  const navigate = useNavigate();
  const { data, departments, programs, majors, courses }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Curriculum`}
        page="Curriculums"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Curriculum
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
          className="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-4"
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Course
                </span>
                <select
                  arial-label="courseId"
                  name="courseId"
                  defaultValue={data?.courseId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {courses &&
                    courses?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()} &nbsp; ( {row.id} )
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Program
                </span>
                <select
                  arial-label="programId"
                  name="programId"
                  defaultValue={data?.programId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {programs &&
                    programs?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.longName?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Semester
                </span>
                <select
                  arial-label="semesterNum"
                  name="semesterNum"
                  defaultValue={data?.semesterNum}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="1">YEAR 1, SEMESTER 1</option>
                  <option value="2">YEAR 1, SEMESTER 2</option>
                  <option value="3">YEAR 2, SEMESTER 1</option>
                  <option value="4">YEAR 2, SEMESTER 2</option>
                  <option value="5">YEAR 3, SEMESTER 1</option>
                  <option value="6">YEAR 3, SEMESTER 2</option>
                  <option value="7">YEAR 4, SEMESTER 1</option>
                  <option value="8">YEAR 4, SEMESTER 2</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Category
                </span>
                <select
                  arial-label="type"
                  name="type"
                  defaultValue={data?.type}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="C">COMPULSORY</option>
                  <option value="E">ELECTIVE</option>
                  <option value="O">OPTIONAL</option>
                </select>
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:pl-6 space-y-4">
            <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Major 
                  {/* {JSON.stringify(majors)} */}
                </span>
                <select
                  arial-label="majorId"
                  name="majorId"
                  defaultValue={data?.majorId}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option value="" selected>
                    -- NONE --
                  </option>
                  {majors &&
                    majors?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.program?.shortName?.toUpperCase()} - {row.shortName?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Department In Charge 
                </span>
                <select
                  arial-label="unitId"
                  name="unitId"
                  defaultValue={data?.unitId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {departments &&
                    departments?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Lock on Registration{" "}
                  <sup className="text-primary/80">
                    <em>** Electives only</em>
                  </sup>
                </span>
                <select
                  arial-label="lock"
                  name="lock"
                  defaultValue={Number(data?.lock)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={0}>NO</option>
                  <option value={1}>YES</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Status
                </span>
                <select
                  arial-label="status"
                  name="status"
                  defaultValue={Number(data?.status)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={0}>NO</option>
                  <option value={1}>YES</option>
                </select>
              </label>
              <div className="flex items-center">
                {/* <input type="hidden" name="studentId" defaultValue={data?.id} /> */}
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

export default PgAISStructureForm;
