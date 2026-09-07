import React, { useRef } from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { BiCalendarCheck, BiLoaderCircle } from "react-icons/bi";
import { TbEdit } from "react-icons/tb";
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import SubNavLink from "../../components/ais/SubNavLink";
import LoaderInner from "../../components/LoaderInner";
import Service from "../../utils/aisService";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteResitSession(params.sessionId);
  return redirect(`/ais/resit-sessions`);
}

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchResitSession(params.sessionId);
  return { data, params };
}

function PgAISResitSession({}: Props) {
  const navigate = useNavigate();
  const { data, params }: any = useLoaderData();
  const fileRef: any = useRef(null);
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  const stageSheet = async () => {
    const ok = window.confirm("Setup Scoresheets?");
    if (ok) {
      const resp = await Service.stageSheet(params?.sessionId);
      navigate(0);
    }
  };

  const stageProgression = async () => {
    const ok = window.confirm("Setup Semester Progressions?");
    if (ok) {
      const resp = await Service.progressStudents(params?.sessionId);
      if (resp) navigate(0);
    }
  };

  const activateSession = async () => {
    const ok = window.confirm("Set Default?");
    if (ok) {
      const resp = await Service.activateSession(params?.sessionId);
      if (resp) navigate(0);
    }
  };

  const activateEntry = async () => {
    const ok = window.confirm("Update Late Entry Status?");
    if (ok) {
      const status = !!!data.assignLateSheet;
      const resp = await Service.updateSession(params?.sessionId, {
        assignLateSheet: !!!data.assignLateSheet,
      });
      if (resp) navigate(0);
    }
  };

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="CALENDAR" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          <Link
            to={loading ? `#` : `edit`}
            className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex"
          >
            {/* <span className="text-gray-400">EDIT</span> */}
            {loading ? (
              <BiLoaderCircle className="h-5 w-5 text-gray-300 animate-spin" />
            ) : (
              <TbEdit className="h-5 w-5 text-gray-300" />
            )}
          </Link>
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-2xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {data?.title?.toUpperCase()}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                {data?.default && (
                  <span className="px-2 py-0.5 text-xs font-medium tracking-wider capitalize bg-primary rounded text-white">
                    DEFAULT
                  </span>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-sm font-semibold capitalize">
                  {data?.status ? "ACTIVE" : "INACTIVE"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <BiCalendarCheck className="md:h-5 md:w-5 text-primary/70" />
                <span className="text-xs md:text-base tracking-wider font-medium capitalize">
                  Resit Session Date: {moment(data?.period).format("LL")}
                </span>
              </div>
            </div>
            {/* <p className="text-gray-400 md:text-gray-500 text-xs md:text-sm font-noto">{data?.admissionPrefix || '00'}</p> */}
          </div>
        </section>

        <section>
          <nav className="p-2 w-full md:p-3 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 border border-primary/5 rounded-md md:rounded-xl bg-primary/5 text-primary-dark/70 text-xs font-noto font-semibold tracking-wider">
            <SubNavLink title="STUDENTS" url="students" />
            <SubNavLink title="SCORES" url="scores" />
            <SubNavLink title="CAPTURE" url="capture" />
            {/* <SubNavLink title="SESSION MANAGER" url="action" /> */}
            {/* <SubNavLink title="ACTIVITY" url="activity" /> */}
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

export default PgAISResitSession;
