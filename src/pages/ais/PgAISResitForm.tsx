import React, { useState } from "react";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import Service from "../../utils/aisService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.backlogId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);

  let resp;
  if (id != 0) resp = await Service.updateBacklog(id, data);
  else resp = await Service.postBacklog(data);

  if (resp) {
    return redirect(`/ais/backlogs`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const sessions = await Service.fetchSessionList();
  const departments = await Service.fetchDepartments();
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();
  const courses = await Service.fetchCourseList();
  const schemes = await Service.fetchSchemeList();

  const id = params?.backlogId || 0;
  if (id != 0) data = await Service.fetchBacklog(id);
  return { data, departments, programs, courses, sessions, majors, schemes };
}

function PgAISResitForm({}: Props) {
  const navigate = useNavigate();
  const { data, courses, sessions, schemes }: any = useLoaderData();
  const [form, setForm] = useState(data);
  const [meta, setMeta] = useState(data.meta ?? [{ indexno: "" }]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const addMeta = () => setMeta([...meta, { indexno: "" }]);
  const removeMeta = (index) => setMeta([...meta.filter((r, i) => i != index)]);

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Backlog`}
        page="Backlog"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Backlog
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
          onChange={onChange}
          className="grid md:grid-cols-1 gap-y-2 md:gap-y-4"
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
                  defaultValue={form?.title}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base tracking-widest text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Calendar
                </span>
                <select
                  arial-label="sessionId"
                  name="sessionId"
                  defaultValue={form?.sessionId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {sessions &&
                    sessions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()} &nbsp; ( {row.tag}{" "}
                        {row.default && ` - DEFAULT`} )
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Academic Scheme
                </span>
                <select
                  arial-label="schemeId"
                  name="schemeId"
                  defaultValue={form?.schemeId}
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
                  Action Type
                </span>
                <select
                  arial-label="type"
                  name="type"
                  defaultValue={form?.type}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="REGISTRATION">REGISTRATION</option>
                  <option value="ASSESSMENT">ASSESSMENT</option>
                  <option value="DELETION">DELETION</option>
                </select>
              </label>
            </div>
          </div>

          <div className="relative p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              BACKLOG {form?.type} DATA
            </h1>
            <button
              type="button"
              onClick={() => addMeta()}
              className="absolute top-0 right-10 px-4 py-0.5 bg-primary/70 rounded text-white text-xs font-bold tracking-widest"
            >
              ADD
            </button>
            <div className="md:pl-6 space-y-4">
              {/* Registration */}
              {form.type == "REGISTRATION" ? (
                <>
                  {meta?.map((r: any, i: number) => {
                    return (
                      <div className="relative md:pl-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => removeMeta(i)}
                          className="absolute -top-1 right-2"
                        >
                          <MdOutlineRemoveCircle className="h-6 w-6 text-primary-dark" />
                        </button>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            INDEX NUMBER
                          </span>
                          <input
                            arial-label={`${i + 1}_indexno`}
                            name={`${i + 1}_indexno`}
                            defaultValue={r?.indexno}
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          />
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            COURSE
                          </span>
                          <select
                            arial-label={`${i + 1}_courseId`}
                            name={`${i + 1}_courseId`}
                            defaultValue={r?.courseId}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            {courses &&
                              courses?.map((row: any) => (
                                <option key={row.id} value={row.id}>
                                  {row.id} - {row.title?.toUpperCase()}{" "}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            SEMESTER LEVEL
                          </span>
                          <select
                            arial-label={`${i + 1}_semesterNum`}
                            name={`${i + 1}_semesterNum`}
                            defaultValue={r?.semesterNum}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="1">L100-SEM1</option>
                            <option value="2">L100-SEM2</option>
                            <option value="3">L200-SEM1</option>
                            <option value="4">L200-SEM2</option>
                            <option value="5">L300-SEM1</option>
                            <option value="6">L300-SEM2</option>
                            <option value="7">L400-SEM1</option>
                            <option value="8">L400-SEM2</option>
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            ASSESSMENT TYPE
                          </span>
                          <select
                            arial-label={`${i + 1}_scoreType`}
                            name={`${i + 1}_scoreType`}
                            defaultValue={r?.scoreType}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="N">NORMAL</option>
                            <option value="R">RESIT</option>
                          </select>
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : null}

              {/* Assessment */}
              {form.type == "ASSESSMENT" ? (
                <>
                  {meta?.map((r: any, i: number) => {
                    return (
                      <div className="relative md:pl-6 grid grid-cols-1 md:grid-cols-6 gap-3">
                        <button
                          type="button"
                          onClick={() => removeMeta(i)}
                          className="absolute top-0 right-2"
                        >
                          <MdOutlineRemoveCircle className="h-6 w-6 text-primary-dark" />
                        </button>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            INDEX NUMBER
                          </span>
                          <input
                            arial-label={`${i + 1}_indexno`}
                            name={`${i + 1}_indexno`}
                            defaultValue={r?.indexno}
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          />
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            COURSE
                          </span>
                          <select
                            arial-label={`${i + 1}_courseId`}
                            name={`${i + 1}_courseId`}
                            defaultValue={r?.courseId}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            {courses &&
                              courses?.map((row: any) => (
                                <option key={row.id} value={row.id}>
                                  {row.id} - {row.title?.toUpperCase()}{" "}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            SEMESTER LEVEL
                          </span>
                          <select
                            arial-label={`${i + 1}_semesterNum`}
                            name={`${i + 1}_semesterNum`}
                            defaultValue={r?.semesterNum}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="1">L100-SEM1</option>
                            <option value="2">L100-SEM2</option>
                            <option value="3">L200-SEM1</option>
                            <option value="4">L200-SEM2</option>
                            <option value="5">L300-SEM1</option>
                            <option value="6">L300-SEM2</option>
                            <option value="7">L400-SEM1</option>
                            <option value="8">L400-SEM2</option>
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            ASSESSMENT TYPE
                          </span>
                          <select
                            arial-label={`${i + 1}_scoreType`}
                            name={`${i + 1}_scoreType`}
                            defaultValue={r?.scoreType}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="N">NORMAL</option>
                            <option value="R">RESIT</option>
                          </select>
                        </label>
                        <div className="grid grid-cols-3 gap-2 col-span-2 ">
                          <label className="flex flex-col space-y-2">
                            <span className="text-xs md:text-xs text-gray-400 font-bold">
                              CLASS
                            </span>
                            <input
                              arial-label={`${i + 1}_scoreClass`}
                              name={`${i + 1}_scoreClass`}
                              defaultValue={r?.scoreClass}
                              className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-bold tracking-widest text-gray-500 rounded-md"
                            />
                          </label>
                          <label className="flex flex-col space-y-2">
                            <span className="text-xs md:text-xs text-gray-400 font-bold">
                              EXAMS
                            </span>
                            <input
                              arial-label={`${i + 1}_scoreExam`}
                              name={`${i + 1}_scoreExam`}
                              defaultValue={r?.scoreExam}
                              className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-bold tracking-widest text-gray-500 rounded-md"
                            />
                          </label>
                          <label className="flex flex-col space-y-2">
                            <span className="text-xs md:text-xs text-gray-400 font-bold">
                              TOTAL
                            </span>
                            <input
                              arial-label={`${i + 1}_scoreTotal`}
                              name={`${i + 1}_scoreTotal`}
                              onFocus={(e) =>
                                setForm({
                                  ...form,
                                  [`${i + 1}_scoreTotal`]:
                                    parseFloat(form[`${i + 1}_scoreClass`]) +
                                    parseFloat(form[`${i + 1}_scoreExam`]),
                                })
                              }
                              defaultValue={r?.scoreTotal}
                              className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-bold tracking-widest text-gray-500 rounded-md"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}

              {/* Deletion */}
              {form.type == "DELETION" ? (
                <>
                  {meta?.map((r: any, i: number) => {
                    return (
                      <div className="relative md:pl-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => removeMeta(i)}
                          className="absolute -top-1 right-2"
                        >
                          <MdOutlineRemoveCircle className="h-6 w-6 text-primary-dark" />
                        </button>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            INDEX NUMBER
                          </span>
                          <input
                            arial-label={`${i + 1}_indexno`}
                            name={`${i + 1}_indexno`}
                            defaultValue={r?.indexno}
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          />
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            COURSE
                          </span>
                          <select
                            arial-label={`${i + 1}_courseId`}
                            name={`${i + 1}_courseId`}
                            defaultValue={r?.courseId}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            {courses &&
                              courses?.map((row: any) => (
                                <option key={row.id} value={row.id}>
                                  {row.id} - {row.title?.toUpperCase()}{" "}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            SEMESTER LEVEL
                          </span>
                          <select
                            arial-label={`${i + 1}_semesterNum`}
                            name={`${i + 1}_semesterNum`}
                            defaultValue={r?.semesterNum}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="1">L100-SEM1</option>
                            <option value="2">L100-SEM2</option>
                            <option value="3">L200-SEM1</option>
                            <option value="4">L200-SEM2</option>
                            <option value="5">L300-SEM1</option>
                            <option value="6">L300-SEM2</option>
                            <option value="7">L400-SEM1</option>
                            <option value="8">L400-SEM2</option>
                          </select>
                        </label>
                        <label className="flex flex-col space-y-2">
                          <span className="text-xs md:text-xs text-gray-400 font-bold">
                            ASSESSMENT TYPE
                          </span>
                          <select
                            arial-label={`${i + 1}_scoreType`}
                            name={`${i + 1}_scoreType`}
                            defaultValue={r?.scoreType}
                            required
                            className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-xs md:text-xs font-semibold text-gray-600 rounded-md"
                          >
                            <option selected disabled>
                              -- Choose --
                            </option>
                            <option value="N">NORMAL</option>
                            <option value="R">RESIT</option>
                          </select>
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : null}
              <hr className="outline-none border-t" />
              <div className="flex items-center">
                <input type="hidden" name="metaNum" value={meta?.length} />
                <button
                  className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold"
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

export default PgAISResitForm;
