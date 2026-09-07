import React from "react";
import SubPageTitle from "../../components/hrs/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { FaCalendarAlt } from "react-icons/fa";
import { MdLocalActivity } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";
import Logo from "../../assets/img/logo/ucc/logo.png";
import Service from "../../utils/aisService";

type Props = {};

//  // Delete Action for Activity
//  export async function action({ params }) {
//    await Service.deleteActivity(params.activityId);
//    return redirect(`/dric/projects/${params.activityId}`);
//  }

// Load Data for Activity
export async function loader({ params }) {
  const data = await Service.fetchActivity(params.activityId);
  const { activityId, phaseId, projectId } = params;
  console.log(params.activityId);
  return { data: { ...data, activityId, phaseId, projectId } };
}

function PgDricActivity({}: Props) {
  const { data, activityId, projectId }: any = useLoaderData();
  console.log(activityId);
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle
        title={data?.title}
        page="Activity"
        link={`/dric/projects/${projectId}`}
      />
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
            <TbEdit className="h-3 w-3 md:h-5 md:w-5 text-gray-300" />
          </Link>
          <div className="flex-1 flex flex-col space-y-4 md:space-y-2">
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
                  ACTIVITY
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span className="tracking-wider font-bold text-xs md:text-sm text-blue-950/70">
                  {data?.completed ? "COMPLETED" : "IN-PROGRESS"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              </div>
              <div className="flex items-center space-x-1">
                <MdLocalActivity className="h-5 w-5 text-blue-950/70" />
                <span className="text-sm">Phase: {data?.phase?.title}</span>
              </div>
            </div>
            <p className="text-gray-400 md:text-gray-600 text-xs md:text-base">
              {data?.description}
            </p>
          </div>
        </section>
        <section className="grid md:grid-cols-2 md:gap-x-4 md:gap-y-0 gap-y-2">
          <div className="p-2 md:py-4 md:px-6 flex items-center space-x-10 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              ACTIVITY BUDGET
            </h1>
            <pre className="text-gray-500 text-sm md:text-lg font-semibold">
              $ {data?.amount}
            </pre>
          </div>
          <div className="p-2 md:py-4 md:px-6 flex items-center space-x-10 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              ACTIVITY DURATION
            </h1>
            <pre className="text-gray-500 text-sm md:text-lg font-semibold">
              {moment(data?.end).diff(data?.start, "months")} Months
            </pre>
          </div>
        </section>

        <section className="grid md:grid-cols-2 md:gap-x-8 md:gap-y-0 gap-y-4">
          {/* Record */}
          <div className="p-2 md:py-4 md:px-6 border rounded-md md:rounded-xl bg-white space-y-3">
            {/* Principal */}
            <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-green-950/50 text-white tracking-widest uppercase -skew-x-6">
              ACTIVITY PERSONNELS
            </h1>
            <div className="md:pl-6 space-y-2">
              {data?.personels?.map((row: any) => (
                <div
                  key={row.identity}
                  className="flex items-center md:space-x-6 space-x-3"
                >
                  {/* <ImProfile className="h-5 w-6 text-green-950/70" /> */}
                  <div className="relative md:h-12 md:w-12 p-0.5 rounded-full border-2 border-slate-10 bg-slate-50 overflow-hidden">
                    <img
                      className="h-6 w-6 md:h-10 md:w-10 object-contain"
                      src={`https://cdn.ucc.edu.gh/photos/?tag=${row?.identity}`}
                      alt=""
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs md:text-base text-gray-500 font-medium ">
                      {`${row?.fname} ${row?.mname && row?.mname + " "}${
                        row?.lname
                      }`}
                      , {row?.identity}
                    </span>
                  </div>
                </div>
              ))}
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

        {data?.delivComment ? (
          <section>
            {/* Project Report */}
            <div className="p-2 md:py-6 md:px-6 border rounded-xl bg-white md:space-y-6 space-y-2">
              <h1 className="py-0.5 px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
                ACTIVITY REPORT
              </h1>
              <div className="px-6 space-y-4">
                <div className="text-gray-600 text-sm md:text-base">
                  {data?.delivComment}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default PgDricActivity;
