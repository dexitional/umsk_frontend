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
      instituteCategoryId: mdata[`instituteCategoryId_${i}`],
      certCategoryId: mdata[`certCategoryId_${i}`],
      instituteName: mdata[`instituteName_${i}`],
      certName: mdata[`certName_${i}`],
      classValue: Number(mdata[`classValue_${i}`]) || null,
      gradeValue: Number(mdata[`gradeValue_${i}`]) || null,
      startMonth: Number(mdata[`startMonth_${i}`]) || null,
      startYear: Number(mdata[`startYear_${i}`]) || null,
      endMonth: Number(mdata[`endMonth_${i}`]) || null,
      endYear: Number(mdata[`endYear_${i}`]) || null,
      serial: serial,
    };
    data.push(row);
  }
  let resp = await Service.saveStepEducation(data);
  if (resp) {
    return redirect(stepUrl.nextUrl);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const institutecats = await Service.fetchInstituteCategories();
  const certcats = await Service.fetchCertCategories();
  const awardclasses = await Service.fetchAwardClasses();
  const applicant = await Service.fetchMyApplicant();
  const data = await Service.fetchStepEducation(serial);
  return { data, applicant, institutecats, certcats, stepUrl, awardclasses };
}

function PgStepEducation({}: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    data,
    applicant,
    institutecats,
    certcats,
    stepUrl,
    awardclasses,
  }: any = useLoaderData();
  const [rows, setRows] = useState(data || [{}]);
  //const [ rows,setRows ] = useState( data || [{}]);
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

  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-3 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="px-3 py-4 md:py-1 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 rounded-md border md:border-0 text-base md:text-xl tracking-wide font-semibold text-primary/80 uppercase">
              <span className="text-center">Educational History</span>
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
                  EDUCATIONAL RECORD {i + 1}
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
                      Institution Type
                    </span>
                    <select
                      arial-label="instituteCategoryId"
                      name={`instituteCategoryId_${i}`}
                      defaultValue={rec?.instituteCategoryId}
                      required
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {institutecats &&
                        institutecats?.map((row: any) => {
                          if (
                            ["DEGREE/OTHERS", "DIPLOMA/DEGREE/OTHERS"].includes(
                              applicant?.applyType?.title.toUpperCase()
                            ) &&
                            row.title.toUpperCase() == "TERTIARY"
                          )
                            return (
                              <option key={row.id} value={row.id} selected>
                                {row.title?.toUpperCase()}
                              </option>
                            );
                          if (
                            [
                              "WASSCE/SSCE/ABCE/GBCE",
                              "IB/IGCSE/GCSE",
                              "MATURED APPLICANT",
                            ].includes(
                              applicant?.applyType?.title.toUpperCase()
                            ) &&
                            row.title.toUpperCase() == "SECONDARY"
                          )
                            return (
                              <option key={row.id} value={row.id} selected>
                                {row.title?.toUpperCase()}
                              </option>
                            );
                        })}
                    </select>
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Institution Name <Asterix />
                    </span>
                    <input
                      arial-label="instituteName"
                      name={`instituteName_${i}`}
                      defaultValue={rec?.instituteName}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>

                  {["DEGREE/OTHERS", "DIPLOMA/DEGREE/OTHERS"].includes(
                    applicant?.applyType?.title?.toUpperCase()
                  ) ? (
                    <label className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">
                        Awarded Class{" "}
                      </span>
                      {/* <input arial-label="classValue" name={`classValue_${i}`} defaultValue={rec?.classValue} className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md" /> */}
                      <select
                        arial-label="classValue"
                        name={`classValue_${i}`}
                        defaultValue={rec?.classValue}
                        className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                      >
                        <option selected disabled>
                          -- Choose --
                        </option>
                        {awardclasses?.map((r) => (
                          <option value={r?.id}>
                            {r?.title?.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {[
                    "WASSCE/SSCE/ABCE/GBCE",
                    "IB/IGCSE/GCSE",
                    "MATURED APPLICANT",
                  ].includes(applicant?.applyType?.title?.toUpperCase()) ? (
                    <label className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">
                        Aggregate Obtained{" "}
                        <em>
                          <small>
                            <b>( ** Zero(0) for Awaiting students ** )</b>
                          </small>
                        </em>
                      </span>
                      <input
                        arial-label="gradeValue"
                        name={`gradeValue_${i}`}
                        defaultValue={rec?.gradeValue}
                        className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                      />
                    </label>
                  ) : null}

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
                      Certificate Type
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
                        certcats?.map((row: any) => {
                          if (
                            [
                              "WASSCE/SSCE/ABCE/GBCE",
                              "IB/IGCSE/GCSE",
                              "MATURED APPLICANT",
                            ].includes(
                              applicant?.applyType?.title.toUpperCase()
                            ) &&
                            [
                              "WASSCE",
                              "SSCE",
                              "GCE",
                              "ABCE",
                              "NABTEX",
                              "GSCE",
                              "IB",
                              "IGCSE",
                            ].includes(row.title.toUpperCase())
                          )
                            return (
                              <option key={row.id} value={row.id}>
                                {row.title?.toUpperCase()}
                              </option>
                            );
                          if (
                            ["DEGREE/OTHERS", "DIPLOMA/DEGREE/OTHERS"].includes(
                              applicant?.applyType?.title.toUpperCase()
                            ) &&
                            [
                              "DEGREE",
                              "HND",
                              "DIPLOMA",
                              "ABCE",
                              "NABTEX",
                              "GSCE",
                              "IB",
                              "IGCSE",
                            ].includes(row.title.toUpperCase())
                          )
                            return (
                              <option key={row.id} value={row.id}>
                                {row.title?.toUpperCase()}
                              </option>
                            );
                        })}
                    </select>
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Programme Pursued / Awarded Certificate <Asterix />
                    </span>
                    <input
                      arial-label="certName"
                      name={`certName_${i}`}
                      defaultValue={rec?.certName}
                      required
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

export default PgStepEducation;
