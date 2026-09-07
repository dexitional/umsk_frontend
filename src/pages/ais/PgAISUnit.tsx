import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import { HiAcademicCap } from "react-icons/hi2";
import { MdNumbers } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import Service from "../../utils/aisService";

type Props = {};

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchScheme(params.schemeId);
  return { data };
}

function PgAISUnit({}: Props) {
  const { data }: any = useLoaderData();
  console.log(data);
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="SCHEMES" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
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
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {data?.title}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="tracking-wider text-xs md:text-base capitalize">
                  PASS MARK
                </span>
                <span className="px-3 py-0.5 text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.passMark}%
                </span>
              </div>
            </div>
            <p className="text-gray-400 md:text-gray-500 text-xs md:text-sm font-noto">
              {data?.department?.longName}
            </p>
          </div>
        </section>

        <section className="gap-y-2">
          <div className="p-2 w-full md:py-3 md:px-3 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 border rounded-sm md:rounded-xl bg-white">
            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-lg bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                GRADE SYSTEM
              </h1>
              <div className="space-y-4">
                {data.gradeMeta.map((row: any) => (
                  <div className="pb-3 md:pb-0 flex md:items-center space-x-4 border-b md:border-none">
                    <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
                      <span className="w-20 text-xs md:text-sm text-gray-500">
                        {row.max} - {row.min}
                      </span>
                      <span className="py-0.5 px-2 w-8 bg-primary/10 font-semibold text-center text-[0.6rem] md:text-xs text-gray-500 rounded uppercase">
                        {row.grade}
                      </span>
                      <span className="py-0.5 px-2 w-32 bg-primary-accent/10 font-semibold text-[0.6rem] md:text-xs text-gray-500 rounded uppercase">
                        {row.remark}{" "}
                      </span>
                      <span className="py-0.5 px-2 w-8 bg-primary/10 font-semibold text-[0.6rem] md:text-xs text-gray-500 rounded uppercase">
                        {row.gradepoint}{" "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                CLASS SYSTEM
              </h1>
              <div className="space-y-4">
                {data.classMeta.map((row: any) => (
                  <div className="pb-3 md:pb-0 flex md:items-center space-x-4 border-b md:border-none">
                    <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
                      <span className="w-20 text-xs md:text-sm text-gray-500">
                        {row.max} - {row.min}
                      </span>
                      <span className="py-0.5 px-2 w-fit bg-primary-accent/10 font-semibold text-[0.6rem] md:text-xs text-gray-500 rounded uppercase">
                        {row.class}{" "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          {/* Project History */}
          <div className="p-2 md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
            <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/60 text-white tracking-widest uppercase -skew-x-6">
              PROGRAMS ATTACHED
            </h1>
            <div className="space-y-2">
              {data?.program?.map((row: any) => (
                <div className="flex md:items-center space-x-4">
                  <HiAcademicCap className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
                    <span className="w-fit text-[0.65rem] md:text-xs font-noto text-gray-500 tracking-wider">
                      {row.longName} ({row.shortName})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAISUnit;
