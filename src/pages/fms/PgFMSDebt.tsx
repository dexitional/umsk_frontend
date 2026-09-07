import React from "react";
import SubPageTitle from "../../components/fms/SubPageTitle";
// @ts-ignore
import { MdNumbers } from "react-icons/md";
import { RiCommunityFill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { Link, Outlet, redirect, useLoaderData } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import SubNavLink from "../../components/fms/SubNavLink";
import Service from "../../utils/aisService";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteStudent(params.studentId);
  return redirect(`/ais/students/${params.studentId}`);
}

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchStudent(params.studentId);
  return { data };
}

function PgFMSDebt({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="STUDENT PROFILE" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:flex items-center justify-center p-2 md:p-1 h-16 w-16 md:h-28 md:w-28 border rounded-lg shadow-lg bg-white">
            <img
              crossOrigin="anonymous"
              src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}` || Logo}
              className="h-12 w-12 md:h-[6.5rem] md:w-[6.5rem] object-contain rounded-md"
            />
          </div>
          <Link
            to={`edit`}
            className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex"
          >
            {/* <span className="text-gray-400">EDIT</span> */}
            <TbEdit className="h-5 w-5 text-gray-300" />
          </Link>
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img
                  crossOrigin="anonymous"
                  src={
                    `${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}` || Logo
                  }
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {data?.fname} {data?.mname && data?.mname + " "}
                {data?.lname}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.completeStatus
                    ? "COMPLETED"
                    : data?.deferStatus
                    ? "DEFERRED"
                    : "ACTIVE STUDENT"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  {data?.gender == "M" ? "MALE" : "FEMALE"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <RiCommunityFill className="md:h-5 md:w-5 text-primary/70" />
                <span className="text-xs md:text-base tracking-wider font-medium capitalize">
                  {data?.program?.longName}
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                {/* <span className="px-3 py-0.5 text-xs md:text-sm font-semibold tracking-wider capitalize bg-primary/20 rounded-md text-primary-dark/70">{data?.indexno}</span> */}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-sm capitalize font-semibold">
                  {data?.indexno || "No Index Number"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-1">
                <MdNumbers className="md:h-5 md:w-5 text-primary/70" />
                <span className="text-xs md:text-base tracking-wider font-medium capitalize">
                  Student ID: {data?.id}
                </span>
              </div>
            </div>
            {/* <p className="text-gray-400 md:text-gray-500 text-xs md:text-sm font-noto">{data?.id}</p> */}
          </div>
        </section>

        <section>
          <nav className="p-2 w-full md:p-3 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 border border-primary/5 rounded-md md:rounded-xl bg-primary/5 text-primary-dark/70 text-xs font-noto font-semibold tracking-wider">
            <SubNavLink title="PROFILE" url="profile" />
            <SubNavLink title="ACADEMIC STATEMENT" url="transcript" />
            <SubNavLink title="FINANCE STATEMENT" url="finance" />
            <SubNavLink title="ACCOUNT MANAGEMENT" url="account" />
            <SubNavLink title="ID CARD" url="idcard" />
          </nav>
        </section>
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgFMSDebt;
