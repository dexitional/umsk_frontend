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
  const id = params?.programId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.semesterTotal = +data.semesterTotal;
  data.creditTotal = +data.creditTotal;
  data.hasMajor = data.hasMajor == 1;
  data.shallAdmit = data.shallAdmit == 1;
  data.status = data.status == 1;

  let resp;
  if (id != 0) resp = await Service.updateProgram(id, data);
  else resp = await Service.postProgram(data);

  if (resp) {
    return redirect(`/ais/programs/${encodeURIComponent(resp.id)}/curriculum`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const departments = await Service.fetchDepartments();
  const schemes = await Service.fetchSchemeList();

  const id = params?.programId || 0;
  if (id != 0) data = await Service.fetchProgram(id);
  return { data, departments, schemes };
}

function PgAISProgramForm({}: Props) {
  const navigate = useNavigate();
  const { data, departments, schemes }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Program`}
        page="Programs"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Program
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
                  Code
                </span>
                <input
                  arial-label="code"
                  name="code"
                  defaultValue={data?.code}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Prefix <sup>* For Index number</sup>
                </span>
                <input
                  arial-label="prefix"
                  name="prefix"
                  defaultValue={data?.prefix}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Short Title
                </span>
                <input
                  arial-label="shortName"
                  name="shortName"
                  defaultValue={data?.shortName}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Long Title
                </span>
                <input
                  arial-label="longName"
                  name="longName"
                  defaultValue={data?.longName}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Duration In Semesters
                </span>
                <input
                  arial-label="semesterTotal"
                  name="semesterTotal"
                  defaultValue={data?.semesterTotal}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Minimum Credit Hour Completion
                </span>
                <input
                  arial-label="creditTotal"
                  name="creditTotal"
                  defaultValue={data?.creditTotal}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Program Category
                </span>
                <select
                  arial-label="category"
                  name="category"
                  defaultValue={data?.category}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="CP">CERTIFICATE</option>
                  <option value="DP">DIPLOMA</option>
                  <option value="UG">UNDERGRAD</option>
                  <option value="PG">POSTGRAD</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Grading Scheme
                </span>
                <select
                  arial-label="schemeId"
                  name="schemeId"
                  defaultValue={data?.schemeId}
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
                  Department
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
                  Show for Admissions?
                </span>
                <select
                  arial-label="shallAdmit"
                  name="shallAdmit"
                  defaultValue={Number(data?.shallAdmit)}
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
                  Program has Majors?
                </span>
                <select
                  arial-label="hasMajor"
                  name="hasMajor"
                  defaultValue={Number(data?.hasMajor)}
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

export default PgAISProgramForm;
