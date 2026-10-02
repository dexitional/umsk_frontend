import moment from "moment";
import React from "react";
import { IconType } from "react-icons";
import {
  HiArrowUpRight,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineExclamationTriangle,
  HiOutlineHandRaised,
  HiOutlineIdentification,
  HiOutlineKey,
  HiOutlinePrinter,
  HiOutlineReceiptPercent,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";
import { AISPCrest, AISPPhotoBlend } from "../../components/aisp/AISPPhotoBlend";
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

const QUICK_LINKS: { title: string; caption: string; url: string; Icon: IconType; tint: string }[] = [
  { title: "My Profile", caption: "Bio & contact details", url: "/aisp/profile", Icon: HiOutlineIdentification, tint: "from-sky-400 to-blue-600 shadow-sky-500/30" },
  { title: "Fees & Charges", caption: "Statement & balance", url: "/aisp/fees", Icon: HiOutlineBanknotes, tint: "from-emerald-400 to-teal-600 shadow-emerald-500/30" },
  { title: "Course Registration", caption: "Pick this semester's courses", url: "/aisp/registration", Icon: HiOutlineClipboardDocumentList, tint: "from-indigo-400 to-violet-600 shadow-indigo-500/30" },
  { title: "Academic Results", caption: "Grades, GPA & CGPA", url: "/aisp/results", Icon: HiOutlineChartBar, tint: "from-fuchsia-400 to-pink-600 shadow-fuchsia-500/30" },
  { title: "Service Requests", caption: "Transcripts & documents", url: "/aisp/services", Icon: HiOutlineDocumentText, tint: "from-amber-400 to-orange-500 shadow-amber-500/30" },
  { title: "Evaluations", caption: "Rate your courses", url: "/aisp/evaluation", Icon: HiOutlineChatBubbleLeftRight, tint: "from-cyan-400 to-sky-600 shadow-cyan-500/30" },
  { title: "Elections Portal", caption: "Vote in SRC elections", url: "/evs/dash", Icon: HiOutlineHandRaised, tint: "from-rose-400 to-red-600 shadow-rose-500/30" },
  { title: "Change Password", caption: "Keep your account safe", url: "/aisp/changepwd", Icon: HiOutlineKey, tint: "from-slate-500 to-slate-700 shadow-slate-500/30" },
];

const NOTICE_ICONS: IconType[] = [
  HiOutlineCalendarDays,
  HiOutlineReceiptPercent,
  HiOutlineExclamationTriangle,
  HiOutlineClipboardDocumentCheck,
];

function greeting() {
  const hour = moment().hour();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Where today sits in the registration window, for the hero's progress bar.
// Only shown while the window is actually open and the student hasn't
// registered yet — otherwise there's nothing to count down to.
function registrationWindow(mount: any, registered: boolean) {
  if (registered || !mount?.registerStart || !mount?.registerEnd) return null;
  const start = moment(mount.registerStart);
  const end = moment(mount.registerEnd);
  const now = moment();
  if (now.isBefore(start) || now.isAfter(end)) return null;
  const total = Math.max(end.diff(start), 1);
  const progress = Math.min(100, Math.max(0, (now.diff(start) / total) * 100));
  const daysLeft = end.diff(now, "days");
  return { progress, daysLeft, end };
}

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
  const { student }: any = useRouteLoaderData("aisp-student") || {};
  const notices = buildNotices(loaderData);
  const { mount, slip } = loaderData;
  const registered = !!slip?.length;
  const regWindow = registrationWindow(mount, registered);
  const programme = student?.program?.longName || user?.user?.descriptor || "Student Portal";

  return (
    <div className="xl:col-span-2 min-w-0 space-y-6 md:space-y-8">
      {/* Hero */}
      <section className="aisp-rise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-sky-700 text-white shadow-2xl shadow-primary/25">
        <AISPPhotoBlend photo="students" className="opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 aisp-grid [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-sky-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <AISPCrest className="hidden md:block right-8 bottom-8 h-28 opacity-[0.22] mix-blend-luminosity" />

        <div className="relative p-6 md:p-9 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-inset ring-white/[0.15] backdrop-blur text-[0.7rem] font-semibold tracking-wide text-sky-100">
            <HiOutlineSparkles className="h-3.5 w-3.5" />
            {mount?.session || "Welcome back"}
          </span>

          <div className="space-y-2 max-w-xl">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {greeting()},{" "}
              <span className="capitalize bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                {user?.user?.fname?.toLowerCase()}
              </span>
            </h1>
            <p className="text-sm md:text-base text-sky-100/80 capitalize">{programme?.toLowerCase()}</p>
          </div>

          {regWindow ? (
            <div className="max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-sky-100/90">Registration window</span>
                <span className="text-white">
                  {regWindow.daysLeft > 0 ? `${regWindow.daysLeft} day${regWindow.daysLeft == 1 ? "" : "s"} left` : "Closes today"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.15] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-300 via-white to-amber-200 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  style={{ width: `${regWindow.progress}%` }}
                />
              </div>
              <p className="text-[0.7rem] text-sky-100/70">Closes {regWindow.end.format("dddd, MMMM D YYYY")}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2.5 pt-1">
            {registered ? (
              <Link to="/print/registration" className="aisp-btn-light">
                <HiOutlinePrinter className="h-4 w-4" />
                Print Registration Slip
              </Link>
            ) : (
              <Link to="/aisp/registration" className="aisp-btn-light">
                <HiOutlineClipboardDocumentList className="h-4 w-4" />
                {mount?.session ? "Register Courses" : "Course Registration"}
              </Link>
            )}
            <Link to="/aisp/results" className="aisp-btn-glass">
              <HiOutlineChartBar className="h-4 w-4" />
              View Results
            </Link>
          </div>
        </div>
      </section>

      {/* Status notices */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Notices &amp; Reminders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Your personal status for the current semester</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {notices.map((notice: any, i: number) => (
            <AISPStatusNotice
              key={notice.title}
              Icon={NOTICE_ICONS[i]}
              style={{ animationDelay: `${80 + i * 60}ms` }}
              {...notice}
            />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Quick Actions</h2>
          <p className="text-xs text-slate-400 mt-0.5">Everything you need, one tap away</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {QUICK_LINKS.map((link, i) => (
            <Link
              key={link.title}
              to={link.url}
              style={{ animationDelay: `${200 + i * 40}ms` }}
              className="aisp-rise aisp-card group relative p-4 md:p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/[0.08] transition-all duration-300 motion-reduce:hover:translate-y-0"
            >
              <div className="flex items-start justify-between">
                <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg ${link.tint}`}>
                  <link.Icon className="h-5 w-5" />
                </div>
                <HiArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-sky-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-sm font-bold text-slate-900 leading-tight">{link.title}</span>
                <span className="block text-[0.72rem] text-slate-400 leading-snug">{link.caption}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PgAISPDash;
