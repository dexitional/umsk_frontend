import moment from "moment";
import React from "react";
import toast from "react-hot-toast";
import { IoPrint, IoRefreshSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
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
      const resp = await Service.deleteRegistration(data[0].indexno);
      if (resp) navigate(0);
    } else {
      toast.error("Please select your courses");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-sm font-bold text-primary">{title}</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/print/registration"
            className="px-4 py-2 rounded-lg bg-secondary-accent text-white text-xs font-semibold flex items-center gap-2 hover:bg-secondary-accent/90 transition-colors"
          >
            <IoPrint className="h-4 w-4" />
            <span>Print Slip</span>
          </Link>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-semibold flex items-center gap-2 hover:bg-red-100 transition-colors"
          >
            <IoRefreshSharp className="h-4 w-4" />
            <span>Revoke Registration</span>
          </button>
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 hidden md:grid grid-cols-5 gap-4 items-center border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div>Code</div>
          <div className="col-span-2">Course</div>
          <div>Credit</div>
          <div>&nbsp;</div>
        </div>
        <div>
          {data?.map((row: any) => (
            <RegistrationSlipItem key={row.id} row={row} />
          ))}
          {!data.length && (
            <div className="py-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
              No Courses
            </div>
          )}
        </div>

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-6 gap-3 md:items-center border-t border-slate-100 bg-slate-50/50">
          <div className="md:col-span-2" />
          <div className="md:col-span-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>
              Total Credits:&nbsp;
              <span className="text-secondary-accent">{totalCredit}</span>
            </span>
          </div>
          <div className="md:col-span-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>
              Date of Registration:&nbsp;
              <span className="text-secondary-accent">
                {moment().format("MMM DD, YYYY") || "Not Set"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSlipView;
