import React from "react";
import { FaFolder } from "react-icons/fa";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { Link } from "react-router-dom";

type Props = {
  data: any;
};

function ResitCourseCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-base md:text-base font-semibold font-noto text-gray-500 uppercase">
        {data?.courseTitle?.toUpperCase()}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">
            {data?.courseId}
          </div>
          {data?.creditHour ? (
            <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
              {data.creditHour} CREDIT{data.creditHour == 1 ? "" : "S"}
            </div>
          ) : null}
        </div>
      </div>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-4">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
            Registered for Resit:&nbsp;&nbsp;
            <b>{data?.count}</b>
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-between space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.courseId)}/students`}
            className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary/60"
          >
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResitCourseCardItem;
