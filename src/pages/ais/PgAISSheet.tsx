import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import { HiAcademicCap } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { Link, Outlet, redirect, useLoaderData, useNavigation } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import SubNavLink from "../../components/ais/SubNavLink";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { getStudyMode } from "../../utils/util";
import { BiLoaderCircle } from "react-icons/bi";
import LoaderInner from "../../components/LoaderInner";
import { useHasRole } from "../../utils/roles";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteSheet(params.sheetId);
  return redirect(`/ais/sheets/${params.sheetId}`);
}

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchSheet(params.sheetId);
  return { data };
}

function PgAISSheet({}: Props) {
  const { data }: any = useLoaderData();
  const { user } = useUserStore((state) => state);
  const canEditSheet = useHasRole("ais", ["sheet::admin"]);
  // Scores + Sheet Manager: every sheet/mysheet role gets these.
  const canViewScores = useHasRole("ais", [
    "sheet::admin",
    "sheet::dean",
    "sheet::hod",
    "sheet::head",
    "sheet::pg-registry",
    "sheet::ug-registry",
    "mysheet::assessor",
  ]);
  // Capture: dean/hod don't get this — only admin, the registry roles, and the assessor.
  const canViewCapture = useHasRole("ais", [
    "sheet::admin",
    "sheet::pg-registry",
    "sheet::ug-registry",
    "mysheet::assessor",
  ]);
  const canManageSheet = useHasRole("ais", [
    "sheet::admin",
    "sheet::dean",
    "sheet::hod",
    "sheet::head",
    "sheet::pg-registry",
    "sheet::ug-registry",
    "mysheet::assessor",
  ]);
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="SHEET" link="" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          {!data.finalized && canEditSheet ? (
            <Link
              to={loading ? `#`: `edit`}
              className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex"
            >
              {/* <span className="text-gray-400">EDIT</span> */}
              { loading 
                  ? <BiLoaderCircle className="h-5 w-5 text-gray-300 animate-spin" />
                  : <TbEdit className="h-5 w-5 text-gray-300" />
              }
            </Link>
          ) : null}
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {data?.course?.title?.toUpperCase()} - {data?.course?.id}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2 font-semibold">
                <span className="px-3 py-0.5 text-xs md:text-sm font-bold tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.courseId}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  YEAR {Math.ceil(data?.semesterNum / 2)}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <HiAcademicCap className="md:h-5 md:w-5 text-primary/70" />
                <span className="text-xs md:text-base tracking-wider font-medium uppercase">
                  {data?.session?.title}{" "}
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2 font-semibold">
                <span className="px-3 py-0.5 text-xs md:text-sm font-bold tracking-wider capitalize bg-primary-accent/80 rounded-md text-white">
                  {data?.finalized
                    ? "CLOSED"
                    : data?.certified
                    ? "PUBLISHED"
                    : data?.certified
                    ? "SUBMITTED"
                    : "CAPTURE MODE"}
                </span>
                {data?.studyMode && (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    <span className="tracking-wider text-xs md:text-base uppercase">{`${getStudyMode(
                      data?.studyMode
                    )} Session`}</span>
                  </>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <HiAcademicCap className="md:h-5 md:w-5 text-primary/70" />
                <span className="text-xs md:text-base tracking-wider font-medium uppercase">
                  {data?.session?.cohort
                    ? `COHORT ${data.session.cohort}`
                    : data?.session?.tag?.toLowerCase() == "main"
                    ? "MAIN STREAM"
                    : "JANUARY/SUB STREAM"}
                </span>
              </div>
            </div>

            {data?.assignee && (
              <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
                <div className="flex items-center space-x-2 font-semibold">
                  <span className="px-2 py-0.5 text-xs md:text-xs font-bold tracking-wider capitalize bg-primary/80 rounded text-white">
                    ASSIGNED TO
                  </span>
                  <span className="tracking-wider text-xs md:text-xs uppercase">
                    &nbsp;&nbsp;{data?.assignee?.fname}{" "}
                    {data?.assignee?.mname && data?.assignee?.mname + " "}
                    {data?.assignee?.lname} ( {data?.assignStaffId} )
                  </span>
                </div>
              </div>
            )}
            {data?.assessor && (
              <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
                <div className="flex items-center space-x-2 font-semibold">
                  <span className="px-2 py-0.5 text-xs md:text-xs font-bold tracking-wider capitalize bg-primary/80 rounded text-white">
                    ASSESSOR
                  </span>
                  <span className="tracking-wider text-xs md:text-xs uppercase">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {data?.assessor?.fname}{" "}
                    {data?.assessor?.mname && data?.assessor?.mname + " "}
                    {data?.assessor?.lname} ( {data?.assessorId} )
                  </span>
                </div>
              </div>
            )}
            {data?.certifier && (
              <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
                <div className="flex items-center space-x-2 font-semibold">
                  <span className="px-2 py-0.5 text-xs md:text-xs font-bold tracking-wider capitalize bg-primary/80 rounded text-white">
                    PUBLISHER
                  </span>
                  <span className="tracking-wider text-xs md:text-xs uppercase">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data?.certifier?.fname}{" "}
                    {data?.certifier?.mname && data?.certifier?.mname + " "}
                    {data?.certifier?.lname} ( {data?.certifierId} )
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <nav className="p-2 w-full md:p-3 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 border border-primary/5 rounded-md md:rounded-xl bg-primary/5 text-primary-dark/70 text-xs font-noto font-semibold tracking-wider">
            <SubNavLink title="STUDENTS" url="students" />

            {canViewScores ? <SubNavLink title="SCORES" url="scores" /> : null}

            {canViewCapture ? <SubNavLink title="CAPTURE" url="capture" /> : null}

            {canManageSheet ? <SubNavLink title="SHEET MANAGER" url="account" /> : null}
            {/* <SubNavLink title="ACTIVITY" url="activity" /> */}
          </nav>
        </section>
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            { loading &&  <LoaderInner />}
            { !loading && <Outlet /> }
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAISSheet;
