import moment from "moment";
import React from "react";
import { FaAddressCard, FaVoteYea } from "react-icons/fa";
import { BiSpreadsheet } from "react-icons/bi";
import { BsReceipt, BsCalendarRange } from "react-icons/bs";
import { MdOutlineAddTask, MdOutlineAssignmentLate, MdOutlineFactCheck } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
import { TbChecklist } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";
import AISPStatCard from "../../components/aisp/AISPStatCard";
import AISPStatusNotice from "../../components/aisp/AISPStatusNotice";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/aisService";

type Props = {};

// Load Data of Single
export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const tag = user?.user?.tag;
  // Registration deadline/registered-status and evaluation status already
  // have their own endpoints (used by the Registration and Evaluation
  // pages) — reused here rather than re-derived. Only resit/fine summary is
  // genuinely new (fetchStudentNoticeSummary).
  const [mount, slip, noticeSummary, evaluation] = await Promise.all([
    Service.fetchRegistrationMount(tag),
    Service.fetchRegistration(tag),
    Service.fetchStudentNoticeSummary(tag),
    Service.fetchEvaluationStatus(tag),
  ]);
  return { mount, slip, noticeSummary, evaluation };
}

const QUICK_LINKS = [
  { title: "My Profile", url: "/aisp/profile", Icon: FaAddressCard, tint: "bg-primary-accent/10", iconColor: "text-primary-accent" },
  { title: "Fees & Charges", url: "/aisp/fees", Icon: BsReceipt, tint: "bg-primary-dark/10", iconColor: "text-primary-dark" },
  { title: "Course Registration", url: "/aisp/registration", Icon: TbChecklist, tint: "bg-primary/10", iconColor: "text-primary" },
  { title: "Academic Results", url: "/aisp/results", Icon: BiSpreadsheet, tint: "bg-primary-accent/10", iconColor: "text-primary-accent" },
  { title: "Service Requests", url: "/aisp/services", Icon: MdOutlineAddTask, tint: "bg-primary-dark/10", iconColor: "text-primary-dark" },
  { title: "Course Evaluation", url: "/aisp/evaluation", Icon: MdOutlineAddTask, tint: "bg-primary/10", iconColor: "text-primary" },
  { title: "Elections Portal", url: "/evs/dash", Icon: FaVoteYea, tint: "bg-primary-accent/10", iconColor: "text-primary-accent" },
  { title: "Change Password", url: "/aisp/changepwd", Icon: PiLockKey, tint: "bg-slate-200", iconColor: "text-slate-500" },
];

// Derives the 4 personalized status notices from the loader's data. Kept as
// a plain function (not inline in JSX) since each notice has its own small
// branching logic.
function buildNotices({ mount, slip, noticeSummary, evaluation }: any) {
  const now = moment();
  const registered = !!slip?.length;
  const registerEnd = mount?.registerEnd ? moment(mount.registerEnd) : null;
  const registerEndLate = mount?.registerEndLate ? moment(mount.registerEndLate) : null;
  const isPastDeadline = !!registerEnd && now.isAfter(registerEnd);

  // Registration
  let registration: any;
  if (!mount?.session) {
    registration = { tone: "neutral", badge: "N/A", title: "Registration Status", message: "No active registration period at this time." };
  } else if (registered) {
    registration = { tone: "good", badge: "REGISTERED", title: "Registration Status", message: `You are registered for ${mount.session}.` };
  } else if (registerEnd && now.isBefore(registerEnd)) {
    registration = { tone: "warning", badge: "OPEN", title: "Registration Status", message: `Registration for ${mount.session?.toLowerCase()} closes on ${registerEnd.format("MMMM DD, YYYY")?.toLowerCase()}. Register now to avoid penalties.` };
  } else if (registerEndLate && now.isBefore(registerEndLate)) {
    registration = { tone: "warning", badge: "LATE WINDOW", title: "Registration Status", message: `Registration deadline has passed. Late registration is open until ${registerEndLate.format("MMM DD, YYYY")}, but may incur a fee.` };
  } else {
    registration = { tone: "urgent", badge: "CLOSED", title: "Registration Status", message: `Registration is closed for ${mount.session}. Contact the registry immediately — this risks automatic deferment of your programme.` };
  }

  // Late fine
  const fine = noticeSummary?.fine;
  let fineNotice: any;
  if (fine?.charged) {
    fineNotice = { tone: "urgent", badge: "FINE CHARGED", title: "Late Fine", message: `A late fee of ${fine.amount} ${fine.currency} has been added to your account for late registration.` };
  } else if (!registered && isPastDeadline && fine?.configuredAmount) {
    fineNotice = { tone: "warning", badge: "AT RISK", title: "Late Fine", message: `Registering after the deadline may attract a late fee of ${fine.configuredAmount} ${fine.configuredCurrency}.` };
  } else {
    fineNotice = { tone: "good", badge: "NONE", title: "Late Fine", message: "No late fees on your account." };
  }

  // Resit
  const resit = noticeSummary?.resit;
  let resitNotice: any;
  if (resit?.count > 0) {
    const listed = resit.items.slice(0, 2).map((r: any) => `${r.courseId} (${r.trailSessionTitle || "period unknown"})`).join(", ");
    const more = resit.count > 2 ? `, and ${resit.count - 2} more` : "";
    resitNotice = { tone: "warning", badge: `${resit.count} OUTSTANDING`, title: "Resit Status", message: `You have outstanding resit(s): ${listed}${more}. Pay and register promptly.` };
  } else {
    resitNotice = { tone: "good", badge: "CLEAR", title: "Resit Status", message: "No outstanding resits." };
  }

  // Evaluation
  let evalNotice: any;
  if (evaluation?.status === "completed") {
    evalNotice = { tone: "good", badge: "COMPLETED", title: "Course Evaluation", message: "You have completed your course evaluations for this semester." };
  } else if (evaluation?.status === "started") {
    evalNotice = { tone: "warning", badge: "PENDING", title: "Course Evaluation", message: "You have pending course evaluations for this semester." };
  } else if (evaluation?.status === "not started") {
    evalNotice = { tone: "neutral", badge: "NOT OPEN", title: "Course Evaluation", message: "Course evaluation for this semester has not opened yet." };
  } else {
    evalNotice = { tone: "neutral", badge: "N/A", title: "Course Evaluation", message: "No course evaluation available for this semester." };
  }

  return [registration, fineNotice, resitNotice, evalNotice];
}

function PgAISPDash({}: Props) {
  const user = useUserStore((state) => state.user);
  const loaderData: any = useLoaderData();
  const notices = buildNotices(loaderData);

  return (
    <div className="p-4 md:p-0 md:col-span-2 space-y-6 md:space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">
            Welcome,{" "}
            <span className="capitalize">{user?.user?.fname?.toLowerCase()}</span>
            !
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {user?.user?.descriptor || "Student Portal"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-semibold">
            STUDENT NO: {user?.user?.tag}
          </span>
        </div>
      </div>

      {/* Stat cards — at-a-glance summary of the same 4 notices below */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <AISPStatCard Icon={BsCalendarRange} {...notices[0]} />
        <AISPStatCard Icon={BsReceipt} {...notices[1]} />
        <AISPStatCard Icon={MdOutlineAssignmentLate} {...notices[2]} />
        <AISPStatCard Icon={MdOutlineFactCheck} {...notices[3]} />
      </div> */}

      {/* Notices */}
      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-primary">
          Student Notices &amp; Reminders
        </h2>
        <div className="space-y-2">
          <AISPStatusNotice Icon={BsCalendarRange} {...notices[0]} />
          <AISPStatusNotice Icon={BsReceipt} {...notices[1]} />
          <AISPStatusNotice Icon={MdOutlineAssignmentLate} {...notices[2]} />
          <AISPStatusNotice Icon={MdOutlineFactCheck} {...notices[3]} />
        </div>
      </div>

      {/* Quick-link cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.title}
            to={link.url}
            className="dash-fade-up p-4 md:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col space-y-3 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${link.tint}`}>
              <link.Icon className={`h-5 w-5 ${link.iconColor}`} />
            </div>
            <span className="text-sm font-semibold text-primary leading-tight">
              {link.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PgAISPDash;
