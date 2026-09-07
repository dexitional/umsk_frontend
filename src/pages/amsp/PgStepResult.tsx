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
    const scount = Number(mdata[`scount_${i}`]);
    let grades: any = [];
    for (let j = 0; j < scount; j++) {
      const subj = {
        id: mdata[`sid_${j}_${j}`],
        subjectId: mdata[`subjectId_${i}_${j}`],
        gradeWeightId: mdata[`gradeWeightId_${i}_${j}`],
        gradeValue: Number(mdata[`gradeValue_${i}_${j}`]) || 0,
        serial: serial,
      };
      grades.push(subj);
    }

    const row = {
      id: mdata[`id_${i}`],
      certCategoryId: mdata[`certCategoryId_${i}`],
      indexNumber: mdata[`indexNumber_${i}`],
      sitting: Number(mdata[`sitting_${i}`]) || null,
      startYear: Number(mdata[`startYear_${i}`]) || null,
      grades,
      serial: serial,
    };
    data.push(row);
  }
  console.log(data);

  let resp = await Service.saveStepResult(data);
  if (resp) {
    return redirect(stepUrl.nextUrl);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const subjects = await Service.fetchSubjects();
  const grades = await Service.fetchGradeWeights();
  const certcats = await Service.fetchCertCategories();
  const data = (await Service.fetchStepResult(serial)) || [{ grades: [{}] }];
  return { data, subjects, certcats, grades, stepUrl };
}

function PgStepResult({}: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { data, subjects, certcats, grades, stepUrl }: any = useLoaderData();
  const [rows, setRows] = useState(data || [{ grades: [{}] }]);

  const years = () => {
    var yrs: any = [];
    for (var i = new Date().getFullYear(); i >= 1975; i--) {
      yrs.push(i);
    }
    return yrs;
  };

  const addRecord = (e) => {
    const cm = window.confirm(`ADD EDUCATIONAL RECORD ${rows.length + 1} ?`);
    if (cm) {
      const data = {};
      setRows([...rows, data]);
    }
  };

  const delRecord = (id) => {
    const cm = window.confirm(`REMOVE EDUCATIONAL RECORD ${id + 1} ?`);
    if (cm) {
      setRows([...rows.filter((r, i) => i !== id)]);
    }
  };

  const addSubject = async (id) => {
    const cm = window.confirm(`ADD SUBJECT INFORMATION ${id + 1}?`);
    if (cm) {
      const newrows = rows.map((r, i) => {
        if (i == id) {
          const rb = { ...r, grades: [...r.grades, {}] };
          return rb;
        }
        return r;
      });
      setRows(newrows);
    }
  };

  const delSubject = async (rid, id) => {
    const cm = window.confirm(`REMOVE SUBJECT ${id + 1}?`);
    if (cm) {
      const newrows = rows.map((r, i) => {
        if (i == rid) {
          const grades = r?.grades?.filter((rt, j) => j !== id);
          const rb = { ...r, grades };
          return rb;
        }
        return r;
      });
      setRows(newrows);
    }
  };

  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-3 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="px-3 py-4 md:py-1 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 rounded-md border md:border-0 text-base md:text-xl tracking-wide font-semibold text-primary/80 uppercase">
              <span className="text-center">Result History</span>
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
                <h1 className="text-base font-semibold text-primary/70 tracking-widest">
                  RESULT INFORMATION {i + 1}
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
                <input
                  type="hidden"
                  name={`scount_${i}`}
                  value={Number(rec?.grades?.length)}
                />
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-4 ">
                <div className="px-2 space-y-4">
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Examination Type
                    </span>
                    <select
                      arial-label="certCategoryId"
                      name={`certCategoryId_${i}`}
                      defaultValue={rec?.certCategoryId}
                      required
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {certcats &&
                        certcats?.map((row: any) => (
                          <option key={row.id} value={row.id}>
                            {row.title?.toUpperCase()}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Index Number <Asterix />
                    </span>
                    <input
                      arial-label="indexNumber"
                      name={`indexNumber_${i}`}
                      defaultValue={rec?.indexNumber}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                </div>

                <div className="px-2 space-y-4">
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Exams Sitting
                    </span>
                    <select
                      arial-label="sitting"
                      name={`sitting_${i}`}
                      defaultValue={rec?.sitting}
                      required
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      <option value={1}>FIRST</option>
                      <option value={2}>SECOND</option>
                      <option value={3}>THIRD</option>
                      <option value={4}>FOURTH</option>
                      <option value={5}>FIFTH</option>
                    </select>
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Exams Year
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
              </div>
              <div className="my-6 mx-4 px-4 py-4 border rounded-xl flex flex-col space-y-2">
                <div className="my-2 md:my-2 w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <h1 className="text-xs md:text-sm font-semibold text-primary-accent/80 tracking-widest">
                    SUBJECTS & GRADES
                  </h1>
                  <button
                    type="button"
                    onClick={() => addSubject(i)}
                    className="px-4 py-1 rounded-full font-semibold text-xs bg-primary-accent text-white"
                  >
                    ADD
                  </button>
                </div>
                {/* Heading */}
                <div className="w-full space-y-2">
                  <div className="px-4 py-1 border border-gray-200/80 rounded grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-4 ">
                    <label className="">
                      <span className="text-sm md:text-base text-gray-500 font-medium">
                        SUBJECT
                      </span>
                    </label>
                    <label className="">
                      <span className="text-sm md:text-base text-gray-500 font-medium">
                        GRADE
                      </span>
                    </label>
                  </div>
                  {/* Subject Content */}
                  {rec?.grades?.map((subj, j) => (
                    <div className="relative px-3 py-3 w-full border border-gray-200/80 bg-slate-100/30 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-4 ">
                      <button
                        type="button"
                        onClick={() => delSubject(i, j)}
                        className="z-20 absolute right-2 top-0 py-0.5 px-2.5 rounded-b bg-primary/80 text-xs text-white font-bold"
                      >
                        X
                      </button>
                      <input
                        type="hidden"
                        name={`sid_${i}_${j}`}
                        defaultValue={subj?.id}
                        value={subj?.id}
                      />
                      <label className="w-full z-10">
                        <select
                          arial-label="subjectId"
                          name={`subjectId_${i}_${j}`}
                          defaultValue={subj?.subjectId}
                          required
                          className="w-full capitalize focus:ring-0 border focus:border-slate-300  border-primary/30 bg-primary/5 text-sm md:text-base text-gray-600 rounded-md"
                        >
                          <option selected disabled>
                            -- Choose --
                          </option>
                          {subjects &&
                            subjects?.map((row: any) => (
                              <option key={row.id} value={row.id}>
                                {row.title?.toUpperCase()}
                              </option>
                            ))}
                        </select>
                      </label>
                      <label className="w-full">
                        <select
                          arial-label="gradeWeightId"
                          name={`gradeWeightId_${i}_${j}`}
                          defaultValue={subj?.gradeWeightId}
                          required
                          className="w-full md:w-4/5 capitalize focus:ring-0 border focus:border-slate-300  border-primary/30 bg-primary/5 text-sm md:text-base text-gray-600 rounded-md"
                        >
                          <option selected disabled>
                            -- Choose --
                          </option>
                          {grades &&
                            grades?.map((row: any) => (
                              <option key={row.id} value={row.id}>
                                {row.title?.toUpperCase()}
                              </option>
                            ))}
                        </select>
                      </label>
                    </div>
                  ))}
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

export default PgStepResult;
