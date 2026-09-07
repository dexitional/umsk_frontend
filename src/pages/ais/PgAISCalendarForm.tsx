import moment from "moment";
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
  const id = params?.calendarId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.year = data.year;
  data.registerStart = moment(data.registerStart);
  data.registerEnd = moment(data.registerEnd);
  data.registerEndLate = moment(data.registerEndLate);
  data.orientStart = moment(data.orientStart);
  data.orientEnd = moment(data.orientEnd);
  data.lectureStart = moment(data.lectureStart);
  data.lectureEnd = moment(data.lectureEnd);
  data.examStart = moment(data.examStart);
  data.examEnd = moment(data.examEnd);
  data.entryStart = moment(data.entryStart);
  data.entryEnd = moment(data.entryEnd);
  data.medicalEnd = moment(data.medicalEnd);
  data.medicalStart = moment(data.medicalStart);
  data.matriculateStart = moment(data.matriculateStart);
  data.evaluationStart = moment(data.evaluationStart);
  data.evaluationEnd = moment(data.evaluationEnd);
  data.paymentEnd = moment(data.paymentEnd);
  // Optional — left blank for sessions that don't need a cohort number
  // (only PG/postgraduate sheets display it, in place of the stream label).
  data.cohort = data.cohort ? parseInt(data.cohort as string, 10) : null;
  data.registerPause = data.registerPause == 1;
  data.assignLateSheet = data.assignLateSheet == 1;
  data.progressStudent = data.progressStudent == 1;
  //  data.default = data.default == 1
  data.status = data.status == 1;

  let resp;
  if (id != 0) resp = await Service.updateSession(id, data);
  else resp = await Service.postSession(data);

  if (resp) {
    return redirect(`/ais/calendars/${encodeURIComponent(resp.id)}`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const departments = await Service.fetchDepartments();
  const schemes = await Service.fetchSchemeList();

  const id = params?.calendarId || 0;
  if (id != 0) data = await Service.fetchSession(id);
  return { data, departments, schemes };
}

function PgAISCalendarForm({}: Props) {
  const navigate = useNavigate();
  const { data, departments, schemes }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Calendar`}
        page="Academic Calendar"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Academic Calendar
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
                  Title
                </span>
                <input
                  arial-label="title"
                  name="title"
                  defaultValue={data?.title}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Year
                </span>
                <input
                  arial-label="year"
                  name="year"
                  defaultValue={data?.year}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Semester
                </span>
                <select
                  arial-label="semester"
                  name="semester"
                  defaultValue={data?.semester}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="SEM1">FIRST (1)</option>
                  <option value="SEM2">SECOND (2)</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Calendar Stream {data?.tag}
                </span>
                <select
                  arial-label="tag"
                  name="tag"
                  defaultValue={data?.tag?.toUpperCase()}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="MAIN">MAIN STREAM</option>
                  <option value="SUB">SUB STREAM</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Cohort{" "}
                  <em>
                    <sub>( Optional — PG sheets show "COHORT n" instead of the stream label when set )</sub>
                  </em>
                </span>
                <input
                  arial-label="cohort"
                  type="number"
                  name="cohort"
                  defaultValue={data?.cohort ?? ""}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Admission Prefix{" "}
                  <em>
                    <sub>( Must be Set for January/Sub Sessions )</sub>
                  </em>
                </span>
                <input
                  arial-label="admissionPrefix"
                  name="admissionPrefix"
                  defaultValue={data?.admissionPrefix}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Registration Halted?
                </span>
                <select
                  arial-label="registerPause"
                  name="registerPause"
                  defaultValue={Number(data?.registerPause)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="0">NO</option>
                  <option value="1">YES</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Late Entry Activated?
                </span>
                <select
                  arial-label="assignLateSheet"
                  name="assignLateSheet"
                  defaultValue={Number(data?.assignLateSheet)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="0">NO</option>
                  <option value="1">YES</option>
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
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Registration Opens
                </span>
                <input
                  arial-label="registerStart"
                  type="datetime-local"
                  name="registerStart"
                  defaultValue={moment(data?.registerStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Registration Closes
                </span>
                <input
                  arial-label="registerEnd"
                  type="datetime-local"
                  name="registerEnd"
                  defaultValue={moment(data?.registerEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Late Registration Closes
                </span>
                <input
                  arial-label="registerEndLate"
                  type="datetime-local"
                  name="registerEndLate"
                  defaultValue={moment(data?.registerEndLate).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Fees Payment Deadline
                </span>
                <input
                  arial-label="paymentEnd"
                  type="datetime-local"
                  name="paymentEnd"
                  defaultValue={moment(data?.paymentEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Matriculation Date
                </span>
                <input
                  arial-label="matriculateStart"
                  type="datetime-local"
                  name="matriculateStart"
                  defaultValue={moment(data?.matriculateStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              {/* <label className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">Set as Default?</span>
                      <select arial-label="default" name="default" defaultValue={Number(data?.default)} required className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md">
                        <option selected disabled>-- Choose --</option>
                        <option value={0}>NO</option>
                        <option value={1}>YES</option>
                      </select>
                  </label> */}
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Orientation Starts
                </span>
                <input
                  arial-label="orientStart"
                  type="datetime-local"
                  name="orientStart"
                  defaultValue={moment(data?.orientStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Orientation Ends
                </span>
                <input
                  arial-label="orientEnd"
                  type="datetime-local"
                  name="orientEnd"
                  defaultValue={moment(data?.orientEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Medical Screen Starts
                </span>
                <input
                  arial-label="medicalStart"
                  type="datetime-local"
                  name="medicalStart"
                  defaultValue={moment(data?.medicalStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Medical Screen Ends
                </span>
                <input
                  arial-label="medicalEnd"
                  type="datetime-local"
                  name="medicalEnd"
                  defaultValue={moment(data?.medicalEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Lectures Starts
                </span>
                <input
                  arial-label="lectureStart"
                  type="datetime-local"
                  name="lectureStart"
                  defaultValue={moment(data?.lectureStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Lectures Ends
                </span>
                <input
                  arial-label="lectureEnd"
                  type="datetime-local"
                  name="lectureEnd"
                  defaultValue={moment(data?.lectureEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Examination Starts
                </span>
                <input
                  arial-label="examStart"
                  type="datetime-local"
                  name="examStart"
                  defaultValue={moment(data?.examStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Examination Ends
                </span>
                <input
                  arial-label="examEnd"
                  type="datetime-local"
                  name="examEnd"
                  defaultValue={moment(data?.examEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Score Entry Starts
                </span>
                <input
                  arial-label="entryStart"
                  type="datetime-local"
                  name="entryStart"
                  defaultValue={moment(data?.lectureStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Score Entry Ends
                </span>
                <input
                  arial-label="entryEnd"
                  type="datetime-local"
                  name="entryEnd"
                  defaultValue={moment(data?.entryEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Evaluation Starts
                </span>
                <input
                  arial-label="evaluationStart"
                  type="datetime-local"
                  name="evaluationStart"
                  defaultValue={moment(data?.evaluationStart).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Evaluation Ends
                </span>
                <input
                  arial-label="evaluationEnd"
                  type="datetime-local"
                  name="evaluationEnd"
                  defaultValue={moment(data?.evaluationEnd).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
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

export default PgAISCalendarForm;
