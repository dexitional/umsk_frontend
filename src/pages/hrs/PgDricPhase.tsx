import React from "react";
import SubPageTitle from "../../components/hrs/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { FaCalendarAlt, FaMoneyBill, FaTrash } from "react-icons/fa";
import { FcAddRow, FcViewDetails } from "react-icons/fc";
import { MdEditDocument, MdLocalActivity } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { Form, Link, redirect, useLoaderData } from "react-router-dom";
import Logo from "../../assets/img/logo/ucc/logo.png";
import Service from "../../utils/aisService";

type Props = {};

// Delete Action for Activity
export async function action({ params }) {
  await Service.deleteActivity(params.activityId);
  // return redirect(`/dric/phases/${params.projectId}`);
  return redirect(
    `/dric/projects/${params.projectId}/phases/${params.phaseId}`
  );
}

// Load Data for Phase
export async function loader({ params }) {
  const data = await Service.fetchPhase(params.phaseId);
  return { data };
}

function PgDricPhase({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={data?.title} page="Phase" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-4 h-16 w-16 md:h-48 md:w-44 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-14 w-14 md:h-40 md:w-40 object-contain"
            />
          </div>
          <Link
            to={`edit`}
            className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex"
          >
            <TbEdit className="h-5 w-5 text-gray-300" />
          </Link>

          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 md:h-48 md:w-44 border rounded-xl shadow-lg bg-white">
                <img
                  src={Logo}
                  className="h-14 w-14 md:h-40 md:w-40 object-contain"
                />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-blue-950/70">
                {data?.title}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-x-2 text-zinc-400 text-lg">
              <div className="space-x-2">
                <span className="tracking-widest font-semibold text-[0.6rem] md:text-sm">
                  PHASE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span className="tracking-wider font-bold text-xs md:text-sm text-blue-950/70">
                  {data.completed ? "COMPLETED" : "IN-PROGRESS"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              </div>
              <div className="flex items-center space-x-1">
                <MdLocalActivity className="h-5 w-5 text-blue-950/70" />
                <span className="text-sm">Project: {data?.project?.title}</span>
              </div>
            </div>
            <p className="text-gray-400 md:text-gray-600 text-xs md:text-base">
              {data.description}
            </p>
          </div>
        </section>
        <section className="grid md:grid-cols-2 md:gap-x-4 md:gap-y-0 gap-y-2">
          <div className="p-2 md:py-4 md:px-6 flex items-center space-x-10 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              PHASE BUDGET
            </h1>
            <pre className="text-gray-500 text-sm md:text-lg font-semibold">
              ${data?.phase_amount || 0}
            </pre>
          </div>
          <div className="p-2 md:py-4 md:px-6 flex items-center space-x-10 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-4 w-fit  text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              PROJECT B/F
            </h1>
            <pre className="text-gray-500 text-sm md:text-lg font-semibold">
              ${data?.project_amount || 0}
            </pre>
          </div>
        </section>

        <section className="grid md:grid-cols-2 md:gap-x-8 md:gap-y-0 gap-y-4">
          {/* Record */}
          <div className="p-2 md:py-4 md:px-6 border rounded-md md:rounded-xl bg-white space-y-3">
            {/* Principal */}
            <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-red-950/50 text-white tracking-widest uppercase -skew-x-6">
              DISBURSED AMOUNT
            </h1>
            <div className="md:pl-6">
              <div className="flex items-center space-x-6">
                <FaMoneyBill className="h-5 w-6 text-red-950/70" />
                <div className="flex items-center space-x-2">
                  <pre className="text-sm md:text-base text-gray-500 font-semibold">
                    $ {data.amount_disburse || 0}
                  </pre>
                </div>
              </div>
            </div>

            {/* Co-Investigator */}
            <h1 className="py-0.5 px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-green-950/50 text-white tracking-widest uppercase -skew-x-6">
              PHASE BALANCE
            </h1>
            <div className="md:pl-6 space-y-4">
              <div className="flex items-center space-x-6">
                <FaMoneyBill className="h-5 w-6 text-green-950/70" />
                <div className="flex items-center space-x-2">
                  <pre className="text-sm md:text-base text-gray-500 font-semibold">
                    $ {data.amount_balance || 0}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          {/* Secure Access */}
          <div className="p-2 md:py-4 md:px-6 border rounded-md md:rounded-xl bg-white md:space-y-6 space-y-2">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              EXECUTION PERIOD
            </h1>
            <div className="md:pl-6 space-y-4">
              {/* <div className="flex items-center space-x-6">
                      <FaGlobe className="h-5 w-6 text-blue-950/70" />
                      <span className="text-base text-gray-500 italic">https://google.com</span>
                  </div> */}
              <div className="flex items-center md:space-x-6 space-x-2">
                <FaCalendarAlt className="w-3 h-3 md:h-5 md:w-6 text-green-950/70" />
                <div className="flex items-center md:space-x-6 space-x-3">
                  <span className="py-0.5 px-0.5 md:px-2 bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 uppercase">
                    &nbsp;BEGINS&nbsp;&nbsp;
                  </span>
                  <span className="text-[0.65rem] md:text-xs text-gray-500 font-semibold tracking-wider uppercase">
                    {data?.start && moment(data?.start).format("MMMM DD, YYYY")}
                  </span>
                </div>
              </div>
              <div className="flex items-center md:space-x-6 space-x-2">
                <FaCalendarAlt className="w-3 h-3 md:h-5 md:w-6 text-red-950/70" />
                <div className="flex items-center md:space-x-6 space-x-3">
                  <span className="py-0.5 px-0.5 md:px-2 bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 uppercase">
                    FINISHES
                  </span>
                  <span className="text-[0.65rem] md:text-xs text-gray-500 font-semibold tracking-wider uppercase">
                    {data?.end && moment(data.end).format("MMMM DD, YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <Link
            to={`activities/create`}
            className="py-1 px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded-bl rounded-tr flex items-center space-x-2"
          >
            <FcAddRow className="h-5 w-5 text-gray-300" />
            <span className="text-xs md:text-sm font-medium text-gray-500">
              New Activity
            </span>
          </Link>
          {/* Project Phases */}
          <div className="px-2 py-4 md:py-6 md:px-6 border rounded-xl bg-white md:space-y-6 space-y-2">
            <h1 className="py-0.5 px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              PHASE ACTIVITIES
            </h1>
            <div className="pl-2 md:pl-6 space-y-4">
              <div className="flex flex-col space-y-3">
                {/* <MdOutlineNumbers className="h-5 w-6 text-blue-950/70" /> */}
                {data?.activities?.map((row: any, i: number) => (
                  <div
                    key={row.id}
                    className="px-2 py-2 md:p-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 group border md:border-0"
                  >
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                      <span className="py-0.5 px-2 bg-red-100 border font-semibold text-xs text-gray-500 uppercase">
                        ACTIVITY {i + 1}
                      </span>
                      <code className="pl-2 md:pl-0 text-xs md:text-sm text-gray-500 font-medium">
                        {row?.title}
                      </code>
                    </div>
                    <span className="py-0.5 px-2 bg-slate-200 font-semibold text-xs text-gray-500 uppercase">
                      BUDGET - ${row.amount}
                    </span>
                    <div className="w-fit flex md:hidden md:group-hover:flex items-center justify-evenly space-x-2">
                      <Link
                        to={`activities/${row.id}`}
                        className="p-1 md:px-2 rounded-full flex items-center space-x-1 bg-blue-950/50"
                      >
                        <FcViewDetails className="h-3 w-3 text-white" />
                        <span className="hidden md:flex text-[0.55rem] text-white font-semibold">
                          VIEW
                        </span>
                      </Link>
                      <Link
                        to={`activities/${row.id}/edit`}
                        className="p-1 md:px-2 rounded-full flex items-center space-x-1 bg-green-950/50"
                      >
                        <MdEditDocument className="h-3 w-3 text-green-100" />
                        <span className="hidden md:flex text-[0.55rem] text-white font-semibold">
                          EDIT
                        </span>
                      </Link>
                      <Form
                        method="post"
                        action={`activities/${row?.id}/destroy`}
                        onSubmit={(e) => {
                          if (!confirm("Do you want to delete"))
                            e.preventDefault();
                          return false;
                        }}
                        className="p-1 md:px-2 rounded-full flex items-center space-x-1 bg-red-950/50"
                      >
                        <FaTrash className="h-3 w-3 text-pink-100" />
                        <button
                          type="submit"
                          className="hidden md:flex text-[0.55rem] text-white font-semibold"
                        >
                          DELETE
                        </button>
                      </Form>
                    </div>
                  </div>
                ))}

                {!data?.activities.length ? (
                  <h3 className="italic text-gray-400">No Activity records</h3>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {data?.finalReport ? (
          <section>
            {/* Project Report */}
            <div className="p-2 md:py-6 md:px-6 border rounded-xl bg-white md:space-y-6 space-y-2">
              <h1 className="py-0.5 px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
                PHASE REPORT
              </h1>
              <div className="px-6 space-y-4">
                <div className="text-gray-600 text-sm md:text-base">
                  {data?.finalReport}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default PgDricPhase;
