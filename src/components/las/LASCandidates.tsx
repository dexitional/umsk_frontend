import React from "react";
import { MdHomeFilled, MdKeyboardArrowLeft } from "react-icons/md";
import { Link, useLoaderData } from "react-router-dom";
import Service from "../../utils/evsService";
import LASCandidate from "./LASCandidate";

type Props = {};

export async function loader({ params, request }) {
  const data = await Service.fetchCandidates(params.deptId);
  return { data, params };
}

function LASCandidates({}: Props) {
  const { data, params }: any = useLoaderData();
  console.log(params);
  return (
    <div className="border bg-blue-50/20 rounded-xl divide-y shadow-md overflow-hidden">
      <h1 className="px-6 py-3 bg-blue-950/50 text-white font-medium flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 flex flex-row item-center space-x-4 uppercase tracking-widest">
          <MdHomeFilled className="hidden md:block h-5 w-5" />
          <span className="text-xs md:text-sm">
            {data && data[0].department}
          </span>
        </div>
        <Link
          to={`/las/dash/colleges/${params.collegeId}/faculties/${params.facultyId}/departments`}
          className="py-0.5 px-2 w-28 h-fit rounded border border-white flex items-center justify-center"
        >
          <MdKeyboardArrowLeft className="h-6 w-6" />
          <span>Go Back</span>
        </Link>
      </h1>
      <div className="p-3 h-[39.5rem] grid md:grid-cols-3 gap-3 overflow-y-scroll">
        {data &&
          data.map((row: any) => (
            <LASCandidate key={row.staff_no} data={row} />
          ))}
      </div>
    </div>
  );
}

export default LASCandidates;
