import moment from "moment";
import React from "react";
import { IoPrint } from "react-icons/io5";
import { Link } from "react-router-dom";
import RegistrationSlipItem from "./RegistrationSlipItem";

type Props = {
  data?: any;
  title?: string;
};

function RegistrationSlipView({ title, data }: Props) {
  const totalCredit = data.reduce((sum, cur) => sum + cur.course.creditHour, 0);

  const reset = async () => {
    //  const cdata = data.courses?.filter((row:any) => {
    //     const isChosen = courses.find((course:any) => course == row.code);
    //     return !!isChosen
    //  })
    //  if(cdata.length){
    //     const resp = await Service.deleteRegistration(cdata)
    //     console.log(resp);
    //  } else{
    //    toast.error("Please select your courses")
    //  }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="w-full text-sm md:text-base font-bold font-roboto tracking-wider text-primary-accent/80 flex flex-col md:flex-row justify-between">
        <span>{title}</span>
        <div className="flex space-x-2">
          <Link
            to="/print/registration"
            className="px-3 py-1 bg-primary/80 text-xs md:text-sm text-white md:font-bold flex space-x-2 items-center justify-center rounded"
          >
            <IoPrint className="h-6 w-6 text-white" />
            <span>PRINT SLIP</span>
          </Link>
          {/* <button onClick={reset} className="px-3 py-1 bg-primary-accent/80 text-xs md:text-sm text-white md:font-bold flex space-x-2 items-center justify-center rounded"><IoRefreshSharp className="h-6 w-6 text-white"/><span>REVOKE REGISTRATION</span></button> */}
        </div>
      </h1>
      <div className="pt-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
        <div className="px-6 pb-4  hidden md:grid grid-cols-5 place-items-center border-b border-slate-200 text-xs text-primary font-sans font-semibold uppercase tracking-widest">
          <div className="place-self-start">Code</div>
          <div className="col-span-2 place-self-start">Course</div>
          <div>Credit</div>
          <div>&nbsp;</div>
        </div>
        <div className="grid grid-cols-1 text-sm text-slate-600 font-roboto font-medium tracking-wider">
          {data?.map((row: any) => (
            <RegistrationSlipItem key={row.id} row={row} />
          ))}
          {!data.length && (
            <h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">
              No Courses
            </h1>
          )}
        </div>

        <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-6 gap-y-4 md:place-items-center border-slate-200 text-xs text-primary/70 font-roboto font-semibold uppercase tracking-widest">
          <div className="col-span-2 place-self-start flex items-center justify-between"></div>
          <div className="md:col-span-2 flex items-center justify-between">
            <span>
              Total Credits:&nbsp;&nbsp;&nbsp;
              <span className="text-primary-accent text-sm">{totalCredit}</span>
            </span>
          </div>
          <div className="md:col-span-2 flex items-center justify-between">
            <span>
              Date of Registration:&nbsp;&nbsp;&nbsp;
              <span className="text-primary-accent text-sm">
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
