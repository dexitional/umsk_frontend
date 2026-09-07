import React from "react";
import { FaSearch } from "react-icons/fa";
import { ImFilter } from "react-icons/im";
import { MdArrowUpward } from "react-icons/md";
import { useLoaderData } from "react-router-dom";
import DashCardItem from "../../components/hrs/DashCardItem";
import Service from "../../utils/aisService";

type Props = {};

export async function loader() {
  const { funders, projects, investigators } = await Service.fetchDashboard();
  return { funders, projects, investigators };
}

function PgDricDash({}: Props) {
  const { funders, projects, investigators }: any = useLoaderData();

  return (
    <main className="p-4 md:p-8 grid grid-cols-1 gap-y-10">
      <section className="grid md:grid-cols-3 gap-4">
        <DashCardItem
          title="Total Funders"
          total={funders?.length}
          active={funders && funders?.filter((r) => r.status == 1)?.length}
          added={funders?.length}
          theme="info"
        />
        <DashCardItem
          title="Total Projects"
          total={projects?.length}
          active={projects && projects.filter((r) => !r.completed).length}
          added={projects?.length}
          theme="warning"
        />
        <DashCardItem
          title="Total Investigators"
          total={investigators?.length}
          active={
            investigators && investigators.filter((r) => r.status == 1).length
          }
          added={investigators?.length}
          theme="dark"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <section className="md:col-span-2">
          <div className="py-4 px-2 md:px-6 md:py-4 bg-blue-50/40 rounded-2xl">
            <div className="px-2 md:px-0 md:space-y-10 space-y-1">
              <div className="flex justify-between">
                <h2 className="font-sans text-sm md:text-base font-medium text-blue-950/70">
                  On-going Projects
                </h2>
                <div className="hidden space-x-2">
                  <div className="flex items-center space-x-1.5">
                    <FaSearch className="h-3 w-3" />
                    <span className="text-sm">Search</span>
                  </div>

                  <div className="p-0 pl-2 flex items-center space-x-1.5">
                    <ImFilter className="h-3 w-3" />
                    <span className="text-sm">Filter</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-full border-collapse space-y-6 overflow-x-scroll md:overflow-visible">
                  <div className="w-full hidden md:grid grid-cols-5 text-[0.7rem] font-noto text-[#7B899F]">
                    <div className="col-span-2">Project name</div>
                    <div>Funder name</div>
                    <div>Estimated cost</div>
                    <div>Progress</div>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 md:gap-y-0">
                    {projects &&
                      projects?.map((row: any) => (
                        <div
                          key={row.id}
                          className="py-3 md:py-0 grid md:grid-cols-5 gap-y-4 md:gap-y-0 bg-white md:bg-transparent border md:border-none rounded-lg text-sm font-sans text-gray-600"
                        >
                          <div className="px-2 md:px-0 md:col-span-2 grid gap-y-2 md:gap-y-0">
                            <span className="block md:hidden px-3 py-1 text-xs font-noto rounded-md bg-slate-100">
                              Project name
                            </span>
                            <span className="px-3 md:px-0">{row.title}</span>
                          </div>
                          <div className="px-2 md:px-0 grid gap-y-2 md:gap-y-0">
                            <span className="block md:hidden px-3 py-1 text-xs font-noto rounded-md bg-slate-100">
                              Funder name
                            </span>
                            <span className="px-3 md:px-0">
                              {row?.funder?.title}
                            </span>
                          </div>
                          <div className="px-2 md:px-0 grid gap-y-2 md:gap-y-0">
                            <span className="block md:hidden px-3 py-1 text-xs font-noto rounded-md bg-slate-100">
                              Estimated cost
                            </span>
                            <span className="px-3 md:px-0">{row.amount}</span>
                          </div>
                          <div className="px-2 md:px-0 grid gap-y-2 md:gap-y-0">
                            <span className="block md:hidden px-3 py-1 text-xs font-noto rounded-md bg-slate-100">
                              Progress
                            </span>
                            <div
                              role="progressbar"
                              aria-valuenow={50}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuetext="progress nuo"
                              className="px-3 md:px-0 w-24 h-2 rounded-full text-blue-300 bg-blue-950/70"
                            ></div>
                          </div>
                        </div>
                      ))}
                    {!projects && (
                      <h1 className="text-gray-400 text-center text-xs italic tracking-wide">
                        No Projects found !
                      </h1>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="col-span-1 flex flex-col items-center">
          <div className="p-6 min-h-fit w-full border rounded-3xl">
            <div className="space-y-5">
              <div className="flex justify-between">
                <h2 className="font-sans text-sm">Top Five Funders</h2>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-1.5">
                    <MdArrowUpward className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-4 gap-x-2 text-[0.7rem] font-noto text-[#7B899F]">
                  <div className="col-span-2">Name</div>
                  <div className="text-center">Funded</div>
                  <div className="text-right">Projects</div>
                </div>
                <div className="grid grid-cols-1 gap-y-6 text-sm">
                  {funders &&
                    funders
                      ?.sort((a, b) => b.projects?.length - a.projects?.length)
                      .map((row: any) => (
                        <div className="grid grid-cols-4 gap-x-2 font-sans text-gray-600">
                          <div className="col-span-2">{row.title}</div>
                          <div className="text-center">
                            {row.projects?.reduce(
                              (acc, cur) => acc + cur.amount,
                              0
                            ) || 0}
                          </div>
                          <div className="text-center">
                            {row.projects?.length || 0}
                          </div>
                        </div>
                      ))}
                  {!funders && (
                    <h1 className="text-gray-400 text-center text-xs italic tracking-wide">
                      No Funders found !
                    </h1>
                  )}
                </div>
              </div>
            </div>
            {/* Number of Projects Funded, estimated Total Value */}
          </div>
        </section>
      </section>
      <section className="p-4 grid md:grid-cols-3 gap-4 rounded-2xl bg-blue-50/40">
        <div className="p-4 md:col-span-2 rounded-xl bg-white/80">
          <h1 className="px-3 py-1 w-fit -skew-x-12  rounded bg-blue-950/50 text-white font-bold tracking-wider">
            System User Guide
          </h1>
          <div className="py-4 px-3 h-80 grid gap-y-3 overflow-y-scroll [&_dl]:border-b [&_dl]:border-dashed [&_dl]:border-spacing-60 [&_dl]:border-blue-200/60 [&_dl]:pb-4 last:[&_dl]:border-0 last:[&_dl]:pb-0">
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">
                Funders Module
              </dt>
              <dd className="text-sm space-y-2">
                <p>
                  <b>Funders</b> contain list of all project donors and their
                  profiles thus ; project budget, countries and contact details.
                </p>
                <p>
                  Creation of a <b>funder</b> requires that you have list of{" "}
                  <b>countries</b> populated in the form.{" "}
                </p>
              </dd>
            </dl>
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">
                Projects Module
              </dt>
              <dd className="text-sm space-y-2">
                <p>
                  <b>Projects</b> outline the <b>activities</b> grouped into{" "}
                  <b>phases</b> of an on-going or completed event.
                </p>
                <p>
                  Creation of a <b>project</b> requires that there's an existing{" "}
                  <b>investigator</b> record for both{" "}
                  <em className="font-medium">principal</em> and{" "}
                  <em className="font-medium">co-investigator</em>, an existing{" "}
                  <b>funder</b> record and an existing <b>country</b> record.
                </p>
              </dd>
            </dl>
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">
                Phases Module
              </dt>
              <dd className="text-sm space-y-1">
                <p>
                  <b>Phase</b> outlines a group of required <b>activities</b>{" "}
                  within a project with dedicated budgets.
                </p>
                <p>
                  <b>Phase</b> is nested inside a project - thus when you expand
                  a project to view the details.{" "}
                </p>
              </dd>
            </dl>
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">
                Activities Module
              </dt>
              <dd className="text-sm space-y-2">
                <p>
                  <b>Activties</b> outlines a group of required{" "}
                  <b>activities</b> within a project with a dedicated budget.
                </p>
                <p>
                  Creation of an <b>activity</b> requires that there's an
                  existing <b>personel</b> record.{" "}
                </p>
              </dd>
            </dl>
            <dl className="space-y-2">
              <dt className="text-gray-500 font-medium text-base">
                Investigators Module
              </dt>
              <dd className="text-sm space-y-2">
                <p>
                  <b>Investigators</b> contains list of qualified staff for both{" "}
                  <em className="font-medium">principal</em> and{" "}
                  <em className="font-medium">co-investigator</em> roles.
                </p>
              </dd>
            </dl>
            <dl className="space-y-2">
              <dt className="text-gray-500 font-medium text-base">
                Personels Module
              </dt>
              <dd className="text-sm space-y-2">
                <p>
                  <b>Personels</b> contains list of qualified{" "}
                  <em className="font-medium">Staff</em> or{" "}
                  <em className="font-medium">NSS</em> personel who can partake
                  in an <b>activity</b>.
                </p>
              </dd>
            </dl>
            <dl className="space-y-2">
              <dt className="text-gray-500 font-medium text-base">
                Reports Module
              </dt>
              <dd className="text-sm space-y-2">
                <p>
                  <b>Reports</b> contains list of customized reports
                  downloadable in excel format only.
                </p>
              </dd>
            </dl>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/80">
          <h1 className="px-3 py-1 w-fit -skew-x-12  rounded bg-blue-950/50 text-white font-bold tracking-wider">
            Role Guide
          </h1>
          <div className="py-4 px-3 h-80 grid gap-y-6 overflow-y-scroll [&_dl]:border-b [&_dl]:border-dashed [&_dl]:border-spacing-60 [&_dl]:border-pink-200/60 [&_dl]:pb-4 last:[&_dl]:border-0 last:[&_dl]:pb-0">
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">
                DRIC NSS Role
              </dt>
              <dd className="text-sm space-y-3">
                <p>
                  Responsible for data entries. This role is not permitted to
                  delete any record.
                </p>
              </dd>
            </dl>
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">
                DRIC Clerk Role
              </dt>
              <dd className="text-sm space-y-3">
                <p>
                  Responsible for data entries. This role might have delete
                  permissions in some modules.
                </p>
              </dd>
            </dl>
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">
                DRIC Admin Role
              </dt>
              <dd className="text-sm space-y-3">
                <p>
                  Responsible for total administration of system. This role has
                  permissions to manage users and their roles.
                </p>
              </dd>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PgDricDash;
