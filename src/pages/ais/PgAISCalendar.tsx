import React, { useRef, useState } from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { BiLoaderCircle } from "react-icons/bi";
import { CiWarning } from "react-icons/ci";
import { MdNumbers, MdOutlineNotificationsActive } from "react-icons/md";
import {
  PiNumberCircleOneBold,
  PiNumberCircleThreeBold,
  PiNumberCircleTwoBold,
} from "react-icons/pi";
import { RiCommunityFill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteSession(params.calendarId);
  return redirect(`/ais/calendars/${params.calendarId}`);
}

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchSession(params.calendarId);
  return { data, params };
}

function PgAISCalendar({}: Props) {
  const navigate = useNavigate();
  const { data, params }: any = useLoaderData();
  const fileRef: any = useRef(null);
  // clerk gets view-only access — no edit link, no trigger-action buttons on this page.
  const canEditCalendar = useHasRole("ais", ["calendar::admin"]);
  const canManageCalendar = useHasRole("ais", ["calendar::admin"]);
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  const stageSheet = async () => {
    const ok = window.confirm("Setup Scoresheets?");
    if (ok) {
      const resp = await Service.stageSheet(params?.calendarId);
      navigate(0);
    }
  };

  const stageProgression = async () => {
    const ok = window.confirm("Setup Semester Progressions?");
    if (ok) {
      const resp = await Service.progressStudents(params?.calendarId);
      if (resp) navigate(0);
    }
  };

  const activateSession = async () => {
    const ok = window.confirm("Set Default?");
    if (ok) {
      const resp = await Service.activateSession(params?.calendarId);
      if (resp) navigate(0);
    }
  };

  const activateEntry = async () => {
    const ok = window.confirm("Update Late Entry Status?");
    if (ok) {
      const status = !!!data.assignLateSheet;
      const resp = await Service.updateSession(params?.calendarId, {
        assignLateSheet: !!!data.assignLateSheet,
      });
      if (resp) navigate(0);
    }
  };

  const [sendingReg, setSendingReg] = useState(false);
  const [sendingResit, setSendingResit] = useState(false);

  const remindRegistration = async () => {
    const resp = await Service.fetchRegistrationReminderCount(params?.calendarId);
    if (!resp?.count) return window.alert("No unregistered students found.");
    const ok = window.confirm(
      `Send registration reminder to ${resp.count} student(s)?`
    );
    if (!ok) return;
    setSendingReg(true);
    await Service.sendRegistrationReminder(params?.calendarId);
    setSendingReg(false);
  };

  const remindResit = async () => {
    const resp = await Service.fetchResitReminderCount(params?.calendarId);
    if (!resp?.count) return window.alert("No students with outstanding resits found.");
    const ok = window.confirm(
      `Send resit reminder to ${resp.count} student(s)?`
    );
    if (!ok) return;
    setSendingResit(true);
    await Service.sendResitReminder(params?.calendarId);
    setSendingResit(false);
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

          {canEditCalendar ? (
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
          ) : null}

          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {data?.title?.toUpperCase()}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.tag?.toUpperCase()}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  {data?.year}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  {data?.semester}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <RiCommunityFill className="md:h-5 md:w-5 text-primary/70" />
                <span className="text-xs md:text-base tracking-wider font-medium capitalize">
                  ADMISSION PREFIXER: {data?.admissionPrefix || "00"}
                </span>
              </div>
            </div>
            {/* <p className="text-gray-400 md:text-gray-500 text-xs md:text-sm font-noto">{data?.admissionPrefix || '00'}</p> */}
          </div>
        </section>
        <section className="w-full">
          <div className="p-3 md:p-6 grid md:grid-cols-3 gap-2 md:gap-4 border bg-white rounded-xl">
            {canManageCalendar ? (
              <>
                {/* Session Activation */}
                <button
                  onClick={!data?.default ? activateSession : undefined}
                  className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
                    data?.default
                      ? "bg-green-500/5 border-green-500/20 cursor-not-allowed"
                      : "bg-secondary-accent/5 border-secondary-accent/20"
                  } border shadow`}
                >
                  <PiNumberCircleOneBold
                    className={`${
                      data?.default
                        ? "text-green-900/60 border-green-900/20"
                        : "text-secondary-accent border-secondary-accent/20"
                    } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
                  />
                  <span
                    className={`font-semibold text-sm md:text-base ${
                      data?.default ? "text-green-950/50" : "text-secondary-accent"
                    } font-noto`}
                  >
                    {data?.default ? "Session Activated" : "Activate Session"}
                  </span>
                </button>

                {/* Level Progression  */}
                <button
                  onClick={!data?.progressStudent ? stageProgression : undefined}
                  className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
                    data?.progressStudent
                      ? "bg-green-500/5 border-green-500/20 cursor-not-allowed"
                      : "bg-secondary-accent/5 border-secondary-accent/20"
                  } border shadow`}
                >
                  <PiNumberCircleTwoBold
                    className={`${
                      data?.progressStudent
                        ? "text-green-900/60 border-green-900/20"
                        : "text-secondary-accent border-secondary-accent/20"
                    } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
                  />
                  <span
                    className={`font-semibold text-sm md:text-base ${
                      data?.progressStudent
                        ? "text-green-950/50"
                        : "text-secondary-accent"
                    } font-noto`}
                  >
                    {data?.progressStudent
                      ? "Levels Progressed"
                      : "Progress Levels"}
                  </span>
                </button>
                {/* Scoresheet Generation */}
                <button
                  onClick={!data?.stageSheet ? stageSheet : undefined}
                  className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
                    data?.stageSheet
                      ? "bg-green-500/5 border-green-500/30 cursor-not-allowed"
                      : "bg-secondary-accent/5 border-secondary-accent/20"
                  } border shadow`}
                >
                  <PiNumberCircleThreeBold
                    className={`${
                      data?.stageSheet
                        ? "text-green-900/60 border-green-900/20"
                        : "text-secondary-accent border-secondary-accent/20"
                    } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
                  />
                  <span
                    className={`font-semibold text-sm md:text-base ${
                      data?.stageSheet
                        ? "text-green-950/50"
                        : "text-secondary-accent"
                    } font-noto`}
                  >
                    {data?.stageSheet
                      ? "Scoresheets Generated"
                      : "Setup Scoresheets"}
                  </span>
                </button>

                {/* Pardon Registration */}
                <button
                  onClick={!data?.assignLateSheet ? activateEntry : undefined}
                  className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
                    data?.assignLateSheet
                      ? "bg-amber-500/5 border-amber-500/20 cursor-not-allowed"
                      : "bg-secondary-accent/5 border-secondary-accent/20"
                  } border shadow`}
                >
                  <CiWarning
                    className={`${
                      data?.assignLateSheet
                        ? "text-amber-900/60 border-amber-600/30"
                        : "text-secondary-accent border-secondary-accent/20"
                    } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
                  />
                  <span
                    className={`font-semibold text-sm md:text-base ${
                      data?.assignLateSheet
                        ? "text-amber-900/50"
                        : "text-secondary-accent"
                    } font-noto`}
                  >
                    {data?.assignLateSheet
                      ? "Late Entries Activated"
                      : "Activate Late Entries"}
                  </span>
                </button>

                {/* Registration Reminder */}
                <button
                  onClick={!sendingReg ? remindRegistration : undefined}
                  className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border-secondary-accent/20 border shadow"
                >
                  {sendingReg ? (
                    <BiLoaderCircle className="h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full text-secondary-accent border-secondary-accent/20 animate-spin" />
                  ) : (
                    <MdOutlineNotificationsActive className="h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full text-secondary-accent border-secondary-accent/20" />
                  )}
                  <span className="font-semibold text-sm md:text-base text-secondary-accent font-noto">
                    {sendingReg ? "Sending..." : "Registration Reminder"}
                  </span>
                </button>

                {/* Resit Reminder */}
                <button
                  onClick={!sendingResit ? remindResit : undefined}
                  className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border-secondary-accent/20 border shadow"
                >
                  {sendingResit ? (
                    <BiLoaderCircle className="h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full text-secondary-accent border-secondary-accent/20 animate-spin" />
                  ) : (
                    <MdOutlineNotificationsActive className="h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full text-secondary-accent border-secondary-accent/20" />
                  )}
                  <span className="font-semibold text-sm md:text-base text-secondary-accent font-noto">
                    {sendingResit ? "Sending..." : "Resit Reminder"}
                  </span>
                </button>
              </>
            ) : null}
          </div>
        </section>
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-3 md:px-3 grid md:grid-cols-2 md:gap-4 gap-2 border rounded-sm md:rounded-xl bg-white">
            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-lg bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                ORIENTATION INFO
              </h1>
              <div className="space-y-2">
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    ORIENTATION
                    STARTS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.orientStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    ORIENTATION
                    ENDS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.orientEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                REGISTRATION INFO
              </h1>
              <div className="space-y-2">
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    REGISTRATION
                    OPENS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.registerStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    REGISTRATION
                    CLOSES:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.registerStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    LATE REGISTRATION CLOSES:&nbsp;&nbsp;{" "}
                    {moment(data?.registerStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                LECTURES INFO
              </h1>
              <div className="space-y-2">
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    LECTURES
                    STARTS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.lectureStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    LECTURES
                    ENDS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.lectureEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                EXAMS INFO
              </h1>
              <div className="space-y-2">
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    EXAMINATION
                    STARTS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.examStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    EXAMINATION
                    ENDS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.examEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                SCORE ENTRIES INFO
              </h1>
              <div className="space-y-2">
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    SCORE ENTRY
                    STARTS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.entryStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    SCORE ENTRY
                    ENDS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.entryEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-secondary-accent/80 text-white tracking-widest uppercase -skew-x-6">
                ACTIVATIONS & FLAGS
              </h1>
              <div className="space-y-2">
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    REGISTRATION
                    STATUS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.entryStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    LATE ENTRY
                    STATUS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.entryEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    PROGRESSION
                    STATUS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.entryEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 md:py-4 md:px-6 flex-1 flex flex-col space-y-3 md:space-y-3 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-sm font-semibold rounded-md bg-primary/70 text-white tracking-widest uppercase -skew-x-6">
                MATRICULATION & MEDICALS INFO
              </h1>
              <div className="space-y-2">
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    MEDICAL SCREENS
                    STARTS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.medicalStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    MEDICAL SCREENS
                    ENDS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.medicalEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    MATRICULATION
                    STARTS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.matriculateStart)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
                <div className="pb-3 md:pb-0 flex md:items-center space-x-1 border-b md:border-none">
                  <MdNumbers className="w-3 h-3 md:h-5 md:w-6 text-primary/70" />
                  <div className="flex-1 text-xs md:text-[0.82rem] text-gray-500 font-semibold">
                    FEES PAYMENT
                    DEADLINE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {moment(data?.paymentEnd)
                      ?.format("MMM DD, YY")
                      ?.toUpperCase() || "Not Set"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAISCalendar;
