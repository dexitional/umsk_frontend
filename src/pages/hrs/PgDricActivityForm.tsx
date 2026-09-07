import moment from "moment";
import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/hrs/SubPageTitle";
import Service from "../../utils/aisService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.activityId || 0;
  const formData = await request.formData();
  console.log(formData.get("personels"));
  let data = Object.fromEntries(formData);
  data.amount = parseFloat(data.amount);
  data.start = moment(data.start);
  data.end = moment(data.end);
  data.phaseId = params?.phaseId;

  let resp;
  if (id != 0) resp = await Service.updateActivity(id, data);
  else resp = await Service.postActivity(data);

  if (resp) {
    return redirect(
      `/dric/projects/${params.projectId}/phases/${params.phaseId}`
    );
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const personels = await Service.fetchPersonels();
  const id = params?.activityId || 0;
  if (id != 0) data = await Service.fetchActivity(id);
  return { data, personels };
}

function PgDricActivityForm({}: Props) {
  const navigate = useNavigate();
  const { data, personels }: any = useLoaderData();

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Phase`}
        page="Phase"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-blue-950/70">
              {data?.id ? "Edit" : "Create"} Activity
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
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Activity Title
                </span>
                <input
                  arial-label="title"
                  name="title"
                  defaultValue={data?.title}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Activity Description
                </span>
                <textarea
                  arial-label="description"
                  name="description"
                  defaultValue={data?.description}
                  rows={5}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Subject(s) of activity
                </span>
                <input
                  arial-label="title"
                  name="subject"
                  defaultValue={data?.subject}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Activity Budget in Dollars ($)
                </span>
                <input
                  arial-label="amount"
                  type="number"
                  name="amount"
                  defaultValue={data?.amount}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            {/* <h1 className="py-0.5 px-4 w-fit text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">SECURE PORTAL</h1> */}
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <div className="text-sm md:text-base text-gray-500 font-medium flex items-center justify-between">
                  <span>Activity Personnel(s)</span>
                  <span className="hidden font-medium text-[0.7rem] italic">
                    '<b className="">SHIFT</b>' key & a click to select multiple{" "}
                  </span>
                </div>
                <select
                  arial-label="personels"
                  name="personels"
                  defaultValue={data?.personels}
                  multiple
                  className="focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 space-y-2 rounded-md"
                >
                  {personels &&
                    personels?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.identity} - {row.fname}{" "}
                        {row.mname && row.mname + " "}
                        {row.lname}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Activity Place or Location
                </span>
                <input
                  arial-label="place"
                  name="place"
                  defaultValue={data?.place}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-md text-gray-500 rounded-md"
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Activity Start Date
                </span>
                <input
                  arial-label="start"
                  type="date"
                  name="start"
                  defaultValue={
                    data?.start && moment(data?.start).format("YYYY-MM-DD")
                  }
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Activity End Date
                </span>
                <input
                  arial-label="end"
                  type="date"
                  name="end"
                  defaultValue={
                    data?.end && moment(data?.end).format("YYYY-MM-DD")
                  }
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Activity Report
                </span>
                <textarea
                  arial-label="delivComment"
                  name="delivComment"
                  defaultValue={data?.delivComment}
                  rows={5}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <div className="flex items-center space-x-6">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <button
                  className="py-1 px-4 rounded-md bg-blue-950/70 text-white font-semibold"
                  type="submit"
                >
                  SAVE
                </button>
                <button
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

export default PgDricActivityForm;
