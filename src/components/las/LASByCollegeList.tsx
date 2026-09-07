import React from "react";
import { FaRegRectangleList } from "react-icons/fa6";
import {
  MdHomeFilled,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { Link, useLoaderData } from "react-router-dom";
import Service from "../../utils/evsService";

type Props = {};

export async function loader({ params, request }) {
  const data: any = await Service.fetchColleges();
  return { data };
}

function LASByCollegeList({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="border bg-blue-50/20 rounded-xl divide-y shadow-md overflow-hidden">
      <h1 className="p-2 md:px-6 md:py-3 bg-blue-950/50 text-white text-sm md:text-base font-medium flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4">
        <div className="flex item-center space-x-4 uppercase tracking-widest">
          <MdHomeFilled className="hidden md:block h-5 w-5" />
          <span>Filter Leturers By College</span>
        </div>
        <Link
          to="/las/dash"
          className="py-0 px-1 rounded border border-white flex items-center justify-center"
        >
          <MdKeyboardArrowLeft className="h-6 w-6" />
          <span>Go Back</span>
        </Link>
      </h1>

      {data &&
        data.map((row: any) => (
          <Link
            key={row.collegeid}
            to={`${row.collegeid}/faculties`}
            className="p-2 md:px-6 md:py-3 text-blue-950/50 text-sm md:text-base font-medium flex items-center justify-between space-x-4"
          >
            <div className="flex item-center space-x-4">
              <FaRegRectangleList className="hidden md:block h-5 w-5" />
              <span>{row.college_name}</span>
            </div>
            <MdKeyboardArrowRight className="h-6 w-6" />
          </Link>
        ))}
    </div>
  );
}

export default LASByCollegeList;
