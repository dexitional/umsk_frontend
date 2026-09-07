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
  const id = params?.defermentId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.semesterNum = Number(data.semesterNum);
  data.durationInYears = Number(data.durationInYears);
  data.letterDate = data.letterDate ? moment(data.letterDate) : null;
  data.start = data.start ? moment(data.start) : null;
  data.end = data.end ? moment(data.end) : null;

  let resp;
  if (id != 0) resp = await Service.updateDeferment(id, data);
  else resp = await Service.postDeferment(data);

  if (resp) {
    return redirect(`/ais/deferments`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const sessions = await Service.fetchSessionList();

  const id = params?.defermentId || 0;
  if (id != 0) data = await Service.fetchDeferment(id);
  return { data, sessions };
}

function PgAISDefermentForm({}: Props) {
  const navigate = useNavigate();
  const { data, sessions }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Deferment Profile`}
        page="Deferment"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Deferment Profile
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
              Personal Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Deferred Academic Session
                </span>
                <select
                  arial-label="sessionId"
                  name="sessionId"
                  defaultValue={data?.sessionId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {sessions?.map((row: any) => (
                    <option key={row.id} value={row.id}>
                      {row.title} - {row.tag}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Index Number of Student
                </span>
                <input
                  arial-label="indexno"
                  name="indexno"
                  defaultValue={data?.indexno}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Current Level & Semester
                </span>
                <select
                  arial-label="semesterNum"
                  name="semesterNum"
                  defaultValue={Number(data?.semesterNum)}
                  required
                  className="w-full focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={1}>LEVEL 100, SEMESTER 1</option>
                  <option value={2}>LEVEL 100, SEMESTER 2</option>
                  <option value={3}>LEVEL 200, SEMESTER 1</option>
                  <option value={4}>LEVEL 200, SEMESTER 2</option>
                  <option value={5}>LEVEL 300, SEMESTER 1</option>
                  <option value={6}>LEVEL 300, SEMESTER 2</option>
                  <option value={7}>LEVEL 400, SEMESTER 1</option>
                  <option value={8}>LEVEL 400, SEMESTER 2</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Duration of Deferment
                </span>
                <select
                  arial-label="durationInYears"
                  name="durationInYears"
                  defaultValue={data?.durationInYears}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="1">One (1) Year</option>
                  <option value="2">Two (2) Year</option>
                </select>
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            {/* <h1 className="py-0.5 px-4 w-fit text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">SECURE PORTAL</h1> */}
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Deferment Letter Date
                </span>
                <input
                  arial-label="letterDate"
                  name="letterDate"
                  type="date"
                  defaultValue={
                    data?.letterDate &&
                    moment(data?.letterDate).format("YYYY-MM-DD")
                  }
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Deferment Reason
                </span>
                <textarea
                  arial-label="reason"
                  name="reason"
                  rows={10}
                  defaultValue={data?.reason}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <div className="flex items-center">
                <input
                  type="hidden"
                  name="status"
                  defaultValue={data?.status}
                />
                <input type="hidden" name="start" defaultValue={data?.start} />
                <input type="hidden" name="end" defaultValue={data?.end} />
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

export default PgAISDefermentForm;
