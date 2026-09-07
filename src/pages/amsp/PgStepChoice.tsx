import React, { useState } from "react";
import {
  Form,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import Helper from "../../utils/aisService";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
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
      programId: mdata[`programId_${i}`],
      majorId: mdata[`majorId_${i}`],
      serial: serial,
    };
    data.push(row);
  }

  let resp = await Service.saveStepChoice(data);
  if (resp) {
    return redirect(stepUrl.nextUrl);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const programs = await Helper.fetchProgramList();
  const majors = await Helper.fetchMajorList();
  const applicant = await Service.fetchMyApplicant();
  const data = await Service.fetchStepChoice(serial);
  return { data, programs,majors, stepUrl, applicant };
}

function PgStepChoice({}: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { data, programs, majors, stepUrl, applicant }: any = useLoaderData();
  const [rows, setRows] = useState(data || [{}]);
  const years = () => {
    var yrs: any = [];
    for (var i = new Date().getFullYear(); i >= 1975; i--) {
      yrs.push(i);
    }
    return yrs;
  };

  const addRecord = (e) => {
    const cm = window.confirm(`ADD PROGRAMME CHOICE ${rows.length + 1} ?`);
    if (cm) {
      const data = {};
      setRows([...rows, data]);
    }
  };

  const delRecord = (id) => {
    const cm = window.confirm(`REMOVE PROGRAMME CHOICE ${id + 1} ?`);
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
              <span className="text-center">Programme Choices</span>
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
                  CHOICE #{i + 1}
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
              <div className=" w-full grid grid-cols-1 md:grid-cols-1 gap-y-2 md:gap-x-4 ">
                <div className="px-2 space-y-4">
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Programme of Study
                    </span>
                    <select
                      arial-label="programId"
                      name={`programId_${i}`}
                      defaultValue={rec?.programId}
                      required
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                      onChange={ (e) => setRows((prev) => {
                        const programId = e.target.value;
                        let dm = [...prev];
                            dm[i].programId = programId;
                        return (dm)
                       })}>
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {programs &&
                        programs?.map((row: any) => {
                          if (row.category == applicant.stage.categoryId)
                            return (
                              <option key={row.id} value={row.id}>
                                {row.longName?.toUpperCase()}
                              </option>
                            );
                        })}
                    </select>
                  </label>
                </div>
                { rec?.programId && (
                <div className="px-2 space-y-4">
                    <label className="flex flex-col space-y-2">
                        <span className="text-sm md:text-base text-gray-500 font-medium">Programme Major</span>
                        <select arial-label="majorId" name={`majorId_${i}`} defaultValue={rec?.majorId} className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md">
                          <option selected disabled>-- Choose --</option>
                          { majors && majors?.filter((row:any) => row.programId == rec?.programId)?.map((row:any) =>(
                            <option key={row.id} value={row.id}>{row.shortName?.toUpperCase()}</option>
                          ))}
                          </select>
                    </label>
                    </div>
                )}
              </div>
            </div>
          ))}

          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-66">
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

export default PgStepChoice;
