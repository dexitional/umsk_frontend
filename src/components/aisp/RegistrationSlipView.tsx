import moment from "moment";
import React from "react";
import toast from "react-hot-toast";
import { HiOutlineArrowPath, HiOutlineCheckBadge, HiOutlinePrinter } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import AISPEmpty from "./AISPEmpty";
import { AISPPhotoBlend } from "./AISPPhotoBlend";
import RegistrationSlipItem from "./RegistrationSlipItem";

type Props = {
  data?: any;
  title?: string;
};

function RegistrationSlipView({ title, data }: Props) {
  const navigate = useNavigate();
  const totalCredit = data.reduce((sum, cur) => sum + cur.course.creditHour, 0);

  const reset = async () => {
    if (data?.length) {
      if (!window.confirm("Revoke your registration? You will need to register again.")) return;
      const resp = await Service.deleteRegistration(data[0].indexno);
      if (resp) navigate(0);
    } else {
      toast.error("Please select your courses");
    }
  };

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <section className="aisp-rise relative overflow-hidden rounded-3xl p-6 md:p-7 text-white bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-700 shadow-xl shadow-emerald-500/20">
        <AISPPhotoBlend photo="students" className="opacity-40" />
        <div className="pointer-events-none absolute inset-0 aisp-grid opacity-70" />
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/[0.15] ring-1 ring-inset ring-white/25 flex items-center justify-center">
            <HiOutlineCheckBadge className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight">You're registered!</h2>
            <p className="text-sm text-white/80">{title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/print/registration" className="aisp-btn-light">
              <HiOutlinePrinter className="h-4 w-4" />
              Print Slip
            </Link>
            <button onClick={reset} className="aisp-btn-glass">
              <HiOutlineArrowPath className="h-4 w-4" />
              Revoke
            </button>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Courses", value: data?.length || 0 },
            { label: "Total Credits", value: totalCredit },
            { label: "Date", value: moment().format("MMM DD, YYYY") },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-2xl bg-white/10 ring-1 ring-inset ring-white/[0.15]">
              <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/70">{s.label}</span>
              <span className="block mt-0.5 text-sm md:text-base font-bold truncate">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="aisp-rise aisp-card overflow-hidden">
        <div className="aisp-thead grid-cols-5">
          <div>Code</div>
          <div className="col-span-2">Course</div>
          <div>Credit</div>
          <div>&nbsp;</div>
        </div>
        <div>
          {data?.map((row: any) => (
            <RegistrationSlipItem key={row.id} row={row} />
          ))}
          {!data.length && <AISPEmpty title="No Courses" />}
        </div>
      </section>
    </div>
  );
}

export default RegistrationSlipView;
