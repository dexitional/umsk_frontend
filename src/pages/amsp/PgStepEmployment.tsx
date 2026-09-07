import React, { useState } from "react";
import {
  Form,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import Asterix from "../../components/aisp/Asterix";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
import { monthList } from "../../utils/util";
import { CgSpinner } from "react-icons/cg";

type Props = {};

// Save Form
export async function action({ request }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const formData = await request.formData();
  let mdata = Object.fromEntries(formData);
  let data: any = [];
  for (let i = 0; i < mdata.count; i++) {
    const row = {
      id: mdata[`id_${i}`],
      employerName: mdata[`employerName_${i}`],
      employerAddress: mdata[`employerAddress_${i}`],
      jobTitle: mdata[`jobTitle_${i}`],
      phone: mdata[`phone_${i}`],
      email: mdata[`email_${i}`] || null,
      startMonth: Number(mdata[`startMonth_${i}`]) || null,
      startYear: Number(mdata[`startYear_${i}`]) || null,
      endMonth: Number(mdata[`endMonth_${i}`]) || null,
      endYear: Number(mdata[`endYear_${i}`]) || null,
      serial: serial,
    };
    data.push(row);
  }
  let resp = await Service.saveStepEmployment(data);
  if (resp) {
    return redirect(stepUrl.nextUrl);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const data = await Service.fetchStepEmployment(serial);
  return { data, stepUrl };
}

function PgStepEmployment({}: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { data, stepUrl }: any = useLoaderData();
  const [rows, setRows] = useState(data || [{}]);
  const years = () => {
    var yrs: any = [];
    for (var i = new Date().getFullYear(); i >= 1975; i--) {
      yrs.push(i);
    }
    return yrs;
  };

  const addRecord = (e) => {
    const cm = window.confirm(`ADD EMPLOYMENT RECORD ${rows.length + 1} ?`);
    if (cm) {
      const data = {};
      setRows([...rows, data]);
    }
  };

  const delRecord = (id) => {
    const cm = window.confirm(`REMOVE EMPLOYMENT RECORD ${id + 1} ?`);
    if (cm) {
      setRows([...rows.filter((r, i) => i !== id)]);
    }
  };

  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-3 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="px-3 py-4 md:py-1 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 rounded-md border md:border-0 text-base md:text-xl tracking-wide font-semibold text-primary/80 uppercase">
              <span className="text-center">Employment History</span>
              <button
                onClick={addRecord}
                className="px-4 py-1 w-fit rounded-full font-semibold text-xs bg-primary/70 text-white"
              >
                ADD EXTRA RECORD
              </button>
            </h1>
            {/* <div className="flex flex-col space-y-3 md:space-y-1 text-zinc-500 text-base">
                 <span className="text-sm md:tracking-wider">1. Please complete required information for successful enrolment.</span>
                 <span className="text-sm md:tracking-wider">2. You are required to upload a <b>scanned</b> or <b>electronic copy</b>  of <b>NSS Posting Letter</b>.</span>
                 <span className="text-sm md:tracking-wider">3. Your Information is enrolled once but updated later from your <b>UCC NSS Portal</b>.</span>
                 <span className="text-sm md:tracking-wider">4. After successful enrolment, You will be able to log into the portal using <b>Sign In with SSO Credentials</b>.</span>
              </div> */}
          </div>
        </section>
        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          className="w-full grid grid-cols-1 md:grid-cols-1 gap-y-2 md:gap-y-4 md:gap-x-2"
        >
          {/* Record */}
          {rows?.map((rec, i) => (
            <div className="p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white">
              <div className="px-2 py-4 w-full flex flex-col md:flex-row space-y-2 md:space-y-0 items-center justify-between">
                <h1 className="text-sm font-semibold text-primary/70 tracking-widest">
                  EMPLOYMENT RECORD {i + 1}
                </h1>
                {i != 0 && (
                  <button
                    onClick={() => delRecord(i)}
                    className="px-4 py-1 rounded-full font-semibold text-xs bg-primary-accent text-white"
                  >
                    REMOVE
                  </button>
                )}
                <input
                  type="hidden"
                  name={`id_${i}`}
                  defaultValue={rec?.id}
                  value={rec?.id}
                />
              </div>
              <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-4 ">
                <div className="px-2 space-y-4">
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Employer Name <Asterix />
                    </span>
                    <input
                      arial-label="employerName"
                      name={`employerName_${i}`}
                      defaultValue={rec?.employerName}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Job Title <Asterix />
                    </span>
                    <input
                      arial-label="jobTitle"
                      name={`jobTitle_${i}`}
                      defaultValue={rec?.jobTitle}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Phone Number <Asterix />
                    </span>
                    <input
                      arial-label="phone"
                      name={`phone_${i}`}
                      defaultValue={rec?.phone}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>

                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Start Month
                    </span>
                    <select
                      arial-label="startMonth"
                      name={`startMonth_${i}`}
                      defaultValue={rec?.startMonth}
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {monthList?.map((r) => (
                        <option value={r?.id}>{r?.title?.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Start Year
                    </span>
                    <select
                      arial-label="startYear"
                      name={`startYear_${i}`}
                      defaultValue={rec?.startYear}
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {years().map((yr, i) => (
                        <option value={yr}>{yr}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="px-2 space-y-4">
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Employer Address <Asterix />
                    </span>
                    <textarea
                      arial-label="employerAddress"
                      name={`employerAddress_${i}`}
                      rows={5}
                      defaultValue={rec?.employerAddress}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Employer Email Address{" "}
                    </span>
                    <input
                      arial-label="email"
                      name={`email_${i}`}
                      defaultValue={rec?.email}
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>

                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      End Month
                    </span>
                    <select
                      arial-label="endMonth"
                      name={`endMonth_${i}`}
                      defaultValue={rec?.endMonth}
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {monthList?.map((r) => (
                        <option value={r?.id}>{r?.title?.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      End Year
                    </span>
                    <select
                      arial-label="endYear"
                      name={`endYear_${i}`}
                      defaultValue={rec?.endYear}
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {years().map((yr, i) => (
                        <option value={yr}>{yr}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-66">
            <div className="px-2 space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="hidden"
                  name="count"
                  value={Number(rows?.length)}
                />
                <Link
                  to={stepUrl?.prevUrl}
                  className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
                >
                  PREVIOUS
                </Link>
                <button
                  className="py-1 px-4 md:w-96 rounded-md bg-primary/70 disabled:bg-primary/40 text-white font-semibold flex items-center justify-center space-x-2"
                  type="submit"
                  disabled={fetcher.state !== "idle"}
                >
                  { fetcher.state !== "idle" ? 
                    <div className="flex items-center justify-center space-x-2">
                      <CgSpinner className="my-1 h-5 w-5 animate-spin" />
                      <span className="text-sm text-white font-semibold">SAVING ...</span>
                    </div> : 
                    'NEXT'
                  }
                </button>
                <button
                  onClick={() => {
                    if (confirm("Cancel")) navigate("/login");
                  }}
                  className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
                  type="button"
                >
                  EXIT
                </button>
              </div>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </main>
  );
}

export default PgStepEmployment;
