import React from "react";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/ams/SubPageTitle";
import Helper from "../../utils/aisService";
import Service from "../../utils/amsService";

type Props = {};

const SEMESTER_LABELS: Record<string, string> = {
  "1": "Year 1",
  "3": "Year 2",
  "5": "Year 3",
};

const SESSION_LABELS: Record<string, string> = {
  M: "Morning",
  E: "Evening",
  W: "Weekend",
};

// Save Form
export async function action({ request, params }) {
  const id = params?.shortlistId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.semesterNum = Number(data.semesterNum);
  data.serial = id;

  try {
    const resp: any = await Service.postMatriculant(data);
    if (resp?.id) {
      return redirect(`/ams/shortlists`);
    }
    // Service resolves (rather than throws) if the backend responded with a
    // non-200 the checkSession/axios layer didn't treat as an error — surface
    // it inline instead of silently doing nothing.
    return {
      error:
        resp?.message ||
        "Unable to process admission. Please check the details and try again.",
    };
  } catch (error: any) {
    // Returning error data (instead of re-throwing) keeps the admin on this
    // form with their selections intact, rather than the whole route being
    // unmounted for the router's full-page error boundary. A 401 is still
    // handled by checkSession's redirect-to-login side effect before it
    // throws, so that case is unaffected.
    return {
      error:
        error?.response?.data?.message ||
        "Unable to process admission. Please check the details and try again.",
    };
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: "" };
  const programs = await Helper.fetchProgramList();
  //  const majors = await Helper.fetchMajorList()

  const id = params?.shortlistId || 0;
  let shortlist: any = null;
  if (id != 0) {
    shortlist = await Service.fetchShortlist(id);
    data = await Service.fetchMatriculant(id);
  }
  return { data, programs, shortlist };
}

function PgAMSShortlistForm({}: Props) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { data, programs, shortlist }: any = useLoaderData();
  const actionData: any = useActionData();
  const isSubmitting = navigation.state === "submitting";

  // The shortlist list page hides the "Admit" link once shortlist.admitted
  // is true, but this route is reachable directly by URL — guard it here
  // too, since re-submitting would upsert over the student record and
  // regenerate a new password (see postMatriculant on the backend).
  if (shortlist?.admitted) {
    return (
      <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
        <SubPageTitle title="Admit Student" page="Admission" />
        <div className="p-4 md:p-6 border bg-amber-50 rounded-xl space-y-3">
          <h1 className="text-lg md:text-xl font-semibold text-amber-800">
            Already admitted
          </h1>
          <p className="text-sm md:text-base text-amber-700">
            This applicant has already been admitted. Re-processing them here
            would reset their student account credentials, so this action is
            blocked.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="py-1 px-4 rounded-md bg-white border border-amber-300 text-sm text-amber-800"
            type="button"
          >
            GO BACK
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Admit"} Student`}
        page="Admission"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary-accent/80">
              {data?.id ? "Edit" : "Admit"} Student
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:text-base tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        {actionData?.error ? (
          <div className="p-3 md:p-4 border border-red-200 bg-red-50 rounded-lg md:rounded-xl">
            <p className="text-sm md:text-base text-red-700 font-medium">
              {actionData.error}
            </p>
          </div>
        ) : null}

        <Form
          method="post"
          className="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-4"
          onSubmit={(e) => {
            const form = e.currentTarget;
            const programId = (form.elements.namedItem("programId") as HTMLSelectElement)?.value;
            const semesterNum = (form.elements.namedItem("semesterNum") as HTMLSelectElement)?.value;
            const sessionMode = (form.elements.namedItem("sessionMode") as HTMLSelectElement)?.value;

            const programName =
              programs?.find((row: any) => row.id === programId)?.longName || "the selected programme";
            const yearLabel = SEMESTER_LABELS[semesterNum] || "the selected year";
            const sessionLabel = SESSION_LABELS[sessionMode] || "the selected session";

            const approved = window.confirm(
              `Admit this applicant into ${programName}, ${yearLabel} (${sessionLabel} session)?\n\n` +
                `This creates their student account, institutional email and billing record, and cannot be undone from this screen.`
            );
            if (!approved) e.preventDefault();
          }}
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            {/* <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">General Information</h1> */}
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Programme
                </span>
                <select
                  arial-label="programId"
                  name="programId"
                  defaultValue={data?.programId}
                  required
                  className="w-full focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {programs &&
                    programs?.map((row: any) => {
                      const category =
                        row.category == "CP"
                          ? "CERTIFICATE"
                          : row.category == "DP"
                          ? "HND"
                          : "DEGREE";
                      return (
                        <option key={row.id} value={row.id}>
                          {row.longName} {category ? `( ${category} )` : ""}
                        </option>
                      );
                    })}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Entry Year
                </span>
                <select
                  arial-label="semesterNum"
                  name="semesterNum"
                  defaultValue={data?.semesterNum}
                  required
                  className="w-full focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="1">Year 1</option>
                  <option value="3">Year 2</option>
                  <option value="5">Year 3</option>
                </select>
              </label>
              {/* <label className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">Major</span>
                      <select arial-label="majorId" name="majorId" defaultValue={data?.majorId} required className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md">
                        <option selected disabled>-- Choose --</option>
                      </select>
                  </label> */}
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Session
                </span>
                <select
                  arial-label="sessionMode"
                  name="sessionMode"
                  defaultValue={data?.sessionMode}
                  required
                  className="w-full focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="M">MORNING</option>
                  <option value="E">EVENING</option>
                  <option value="W">WEEKEND</option>
                </select>
              </label>

              <div className="flex items-center">
                {/* <input type="hidden" name="studentId" defaultValue={data?.id} /> */}
                <button
                  className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary-accent/80 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "PROCESSING..." : "PROCESS ADMISSION"}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Cancel")) navigate(-1);
                  }}
                  className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
                  type="button"
                  disabled={isSubmitting}
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

export default PgAMSShortlistForm;
