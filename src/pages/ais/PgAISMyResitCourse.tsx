import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
import { Outlet, useNavigation, useParams } from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import SubNavLink from "../../components/ais/SubNavLink";
import LoaderInner from "../../components/LoaderInner";
import { useHasRole } from "../../utils/roles";

type Props = {};

// No loader here — unlike the old session shell, there's no separate
// "course info" record to fetch; the course's title/credit hours already
// show up via the STUDENTS/SCORES/CAPTURE tab cards themselves (their
// `title` prop is the same "<courseId> - <courseTitle>" label the backend
// already builds). The header just echoes the courseId from the URL.
function PgAISMyResitCourse({}: Props) {
  const { courseId } = useParams();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canAccess = useHasRole("ais", ["resit::admin", "resit::assessor"]);

  if (!canAccess) {
    return (
      <main className="md:pl-10 p-3 md:p-6">
        <div className="p-4 md:p-6 border bg-amber-50 rounded-xl">
          <p className="text-sm md:text-base text-amber-700 font-medium">
            You do not have access to this resit course.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="MY RESITS" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-2xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {courseId?.toUpperCase()}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <span className="px-2 py-0.5 text-xs font-medium tracking-wider capitalize bg-primary rounded text-white">
                ACTIVE RESIT SESSION
              </span>
            </div>
          </div>
        </section>

        <section>
          <nav className="p-2 w-full md:p-3 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 border border-primary/5 rounded-md md:rounded-xl bg-primary/5 text-primary-dark/70 text-xs font-noto font-semibold tracking-wider">
            <SubNavLink title="STUDENTS" url="students" />
            <SubNavLink title="SCORES" url="scores" />
            <SubNavLink title="CAPTURE" url="capture" />
          </nav>
        </section>
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            {loading && <LoaderInner />}
            {!loading && <Outlet />}
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAISMyResitCourse;
