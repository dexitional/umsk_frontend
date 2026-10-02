import React from "react";
import toast from "react-hot-toast";
import {
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlinePencilSquare,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import AISPEmpty from "./AISPEmpty";
import RegistrationListItem from "./RegistrationListItem";

type Props = {
  data?: any;
  title?: string;
};

// The mount endpoint returns condition:false plus a terse reason when the
// student's record isn't ready for registration — turn it into something a
// student can act on.
function blockedReason(message?: string) {
  if (/index/i.test(message || "")) {
    return {
      title: "Your index number hasn't been issued yet",
      body: "You can view your courses, but you can't submit a registration until your index number is generated. Please contact the Academic Affairs office (Registry) to have it issued, then come back to register.",
      fixProfile: false,
    };
  }
  if (/major|program|level/i.test(message || "")) {
    return {
      title: "Your programme details are incomplete",
      body: "Your programme, level or major hasn't been set on your record yet. If you're asked to choose a major, update your profile; otherwise please contact the Registry to complete your record before registering.",
      fixProfile: true,
    };
  }
  return {
    title: "Registration is unavailable for your account",
    body: message || "Please contact the Registry for assistance.",
    fixProfile: false,
  };
}

function RegistrationListView({ title, data }: Props) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const blocked = data?.condition === false ? blockedReason(data?.message) : null;

  const courses = useUserStore((state) => state.courses);

  const chosenCredit = data?.courses?.reduce((sum, cur) => {
    const isChosen = courses.find((course: any) => course == cur.code);
    if (isChosen) return sum + cur.credit;
    return sum + 0;
  }, 0);
  const chosenCount = data?.courses?.filter((row: any) => courses?.includes(row.code))?.length || 0;

  const reset = () => {
    const cdata = data?.courses
      ?.filter((row: any) => row.type == "C" || (row.type == "E" && row.lock))
      ?.map((row: any) => row.code);
    useUserStore.setState({ courses: cdata });
  };

  const submit = async () => {
    if (blocked) return toast.error(blocked.title);
    const cdata = data?.courses?.filter((row: any) => {
      const isChosen = courses.find((course: any) => course == row.code);
      return !!isChosen;
    });

    if (cdata.length) {
      const resp = await Service.postRegistration(cdata);
      if (resp?.totalCourses) navigate("/print/registration");
    } else {
      toast.error("Please select your courses");
    }
  };

  return (
    <div className="space-y-5">
      {blocked ? (
        <div className="aisp-rise p-5 md:p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-white ring-1 ring-inset ring-amber-200 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <HiOutlineExclamationTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm md:text-base font-bold text-slate-900">{blocked.title}</h3>
            <p className="text-sm text-slate-600">{blocked.body}</p>
          </div>
          {blocked.fixProfile ? (
            <Link to={`/aisp/profile/${encodeURIComponent(user?.user?.tag)}/edit`} className="aisp-btn-soft w-fit">
              <HiOutlinePencilSquare className="h-4 w-4" />
              Update Profile
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="aisp-rise p-4 rounded-2xl bg-sky-50/70 ring-1 ring-inset ring-sky-100 flex items-start gap-3">
        <HiOutlineInformationCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">
          Compulsory courses are automatically selected and locked. Tap an elective to add it, tap it again to remove it.
        </p>
      </div>

      <section className="aisp-rise aisp-card overflow-hidden">
        <header className="px-5 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{data?.courses?.length || 0} courses available</p>
          </div>
          {courses?.length ? (
            <button onClick={reset} className="aisp-btn-soft h-9 px-4 text-xs w-fit">
              <HiOutlineArrowPath className="h-4 w-4" />
              Restart Selection
            </button>
          ) : (
            <span className="w-fit px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 text-xs font-semibold">
              Please choose your courses and submit
            </span>
          )}
        </header>
        <div className="aisp-thead grid-cols-6">
          <div>Code</div>
          <div className="col-span-2">Course</div>
          <div>Credit</div>
          <div>Type</div>
          <div className="text-right">Selection</div>
        </div>
        <div>
          {data?.courses &&
            data?.courses?.map((row: any, i: number) => (<RegistrationListItem key={i} row={row} />))}
          {!data?.courses?.length && (
            <AISPEmpty
              title="No courses mounted"
              message="There are no courses available for registration at this time. Please check back later or contact your department."
              Icon={HiOutlineBookOpen}
            />
          )}
        </div>
      </section>

      {/* Sticky summary + submit */}
      {courses && data?.courses?.length && !blocked ? (
        <div className="sticky bottom-4 z-20">
          <div className="p-3 md:p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-5 px-2 flex-1">
              <div className="flex items-center gap-2.5">
                <HiOutlineCheckCircle className="h-6 w-6 text-emerald-400" />
                <div className="leading-tight">
                  <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/50">Selected</span>
                  <span className="block text-base font-extrabold tabular-nums">{chosenCount} course{chosenCount == 1 ? "" : "s"}</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="leading-tight">
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/50">Chosen Credits</span>
                <span className="block text-base font-extrabold tabular-nums text-sky-300">{chosenCredit}</span>
              </div>
            </div>
            {courses?.length ? (
              <button onClick={submit} className="aisp-btn h-12 px-6 bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-lg shadow-sky-500/30 hover:brightness-110">
                <HiOutlinePaperAirplane className="h-4 w-4" />
                Submit Registration
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RegistrationListView;
