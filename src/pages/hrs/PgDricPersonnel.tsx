import React from "react";
import { FaEnvelope, FaNewspaper, FaPhone } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import SubPageTitle from "../../components/hrs/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { FcDepartment } from "react-icons/fc";
import { TbEdit } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";
import Logo from "../../assets/img/logo/ucc/logo.png";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchPersonel(params.personelId);
  return { data };
}

function PgDricPersonnel({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle
        title={`${data?.title} ${data?.fname} ${
          data?.mname && data?.mname + " "
        }${data?.lname}`}
        page="Personnels"
      />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-4 h-16 w-16 md:h-48 md:w-44 border rounded-xl shadow-lg bg-white">
            <img
              src={
                `https://cdn.ucc.edu.gh/photos/?tag=${data?.identity}` ?? Logo
              }
              className="h-14 w-14 md:h-40 md:w-40 object-cover  object-center"
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
                  src={
                    `https://cdn.ucc.edu.gh/photos/?tag=${data?.identity}` ??
                    Logo
                  }
                  className="h-14 w-14 md:h-40 md:w-40 object-contain"
                />
              </div>
              <div className="w-full flex flex-col text-zinc-400 text-lg">
                <h1 className="text-base md:text-3xl md:tracking-wide leading-5 font-semibold text-blue-950/70">
                  {data?.title} {data?.fname} {data?.mname && data?.mname + " "}
                  {data?.lname}
                </h1>
                <div className="space-x-2">
                  <span className="text-xs md:text-lg tracking-wider">
                    {data?.identity}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span className="text-xs md:text-lg">{data?.location}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-1">
                <FcDepartment className="h-3.5 w-3.5 md:h-5 md:w-5 text-blue-950/70" />
                <span className="text-sm md:text-lg">{data?.department}</span>
              </div>
            </div>
            <p className="text-gray-600 flex items-center space-x-3">
              <span className="py-0.5 px-2 md:px-3 bg-blue-950/50 text-white text-xs md:text-sm font-semibold rounded uppercase tracking-widest -skew-x-6">
                Ghana Card
              </span>
              <span className="text-xs md:text-base text-gray-600 font-semibold -skew-x-6">
                {data?.ghCardNo}
              </span>
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 md:gap-x-8 md:gap-y-0 gap-y-2">
          {/* Record */}
          <div className="p-2 md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              CONTACT DETAILS
            </h1>
            <div className="md:pl-6 space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3 md:space-x-6">
                <FaPhone className="rotate-90 w-3 h-3 md:h-5 md:w-6 text-blue-950/70" />
                <span className="text-sm md:text-base text-gray-500">
                  {data?.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3 md:space-x-6">
                <FaEnvelope className="w-3 h-3 md:h-5 md:w-6 text-blue-950/70" />
                <span className="text-sm md:text-base text-gray-500">
                  {data?.email}
                </span>
              </div>
              <div className="flex items-center space-x-3 md:space-x-6">
                <MdLocationOn className="w-4 h-4 md:h-6 md:w-6 text-blue-950/70" />
                <span className="text-sm md:text-base text-gray-500">
                  {data?.address}
                </span>
              </div>
            </div>
          </div>
          {/* Secure Access */}
          <div className="p-2 md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              FINANCIAL DETAILS
            </h1>
            <div className="md:pl-6 space-y-3 md:space-y-4">
              {/* <div className="flex items-center space-x-6">
                      <FaGlobe className="h-5 w-6 text-blue-950/70" />
                      <span className="text-base text-gray-500 italic">https://google.com</span>
                  </div> */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="py-0.5 px-1 md:px-2 bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 uppercase">
                    BANK NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  <code className="text-xs md:text-base text-gray-500">
                    {data?.bankName}
                  </code>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="py-0.5 px-1 md:px-2 bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 uppercase">
                    BANK ACC #&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  <code className="text-xs md:text-base text-gray-500">
                    {data?.bankAccount}
                  </code>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="py-0.5 px-1 md:px-2 bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 uppercase">
                    BANK BRANCH
                  </span>
                  <code className="text-xs md:text-base text-gray-500">
                    {data?.bankBranch}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-4">
          {/* Project History */}
          <div className="p-2 md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-base font-semibold rounded-md bg-green-950/50 text-white tracking-widest uppercase -skew-x-6">
              PROJECTS - ACTIVITY PERSONNEL
            </h1>
            <div className="md:pl-6 space-y-4">
              {data?.activities?.map((row) => (
                <div key={row.id} className="flex md:items-center space-x-6">
                  <FaNewspaper className="w-3 h-3 md:h-5 md:w-6 text-blue-950/70" />
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <pre className="text-xs md:text-base text-gray-500">
                      {row?.title}
                    </pre>
                    <span className="py-0.5 px-1 md:px-2 bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 uppercase rounded">
                      START -{" "}
                      {row.start && moment(row.start).format("MMM DD, YYYY")}
                    </span>
                    <span className="py-0.5 px-1 md:px-2 bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 uppercase rounded">
                      END - {row.end && moment(row.end).format("MMM DD, YYYY")}
                    </span>
                  </div>
                </div>
              ))}
              {!data?.activities.length && (
                <h1 className="ml-4 md:ml-0 w-full text-left text-gray-400 text-[0.65rem] md:text-xs font-medium tracking-widest uppercase italic">
                  No Recorded projects ...
                </h1>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgDricPersonnel;
