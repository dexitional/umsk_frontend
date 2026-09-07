import React, { useState } from "react";
import { BiSelectMultiple } from "react-icons/bi";
import { IoSearchCircleOutline } from "react-icons/io5";
import { MdKeyboardArrowRight, MdOutlineFilterAlt } from "react-icons/md";
import { Form, Link, useSearchParams } from "react-router-dom";
import Service from "../../utils/evsService";
import LASCandidate from "./LASCandidate";

type Props = {};

function LASByGroup({}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);

  const onSearchChange = async (e) => {
    const { name, value } = e?.target;
    setSearchParams({ [name]: value });
    const resp = await Service.fetchCandidate(value);
    if (resp) setData(resp);
  };

  return (
    <>
      <div className="border bg-blue-50/20 rounded-xl divide-y shadow-md overflow-hidden">
        <h1 className="p-2 md:px-6 md:py-3 bg-blue-950/50 text-white text-sm md:text-base font-medium flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 uppercase tracking-widest">
            <BiSelectMultiple className="hidden md:block h-5 w-5 -skew-x-12" />
            <span>Search or Filter Lecturers</span>
          </div>
        </h1>
        <Link
          to="colleges"
          className="p-2 md:px-6 md:py-3 text-blue-950/50 font-medium flex items-center justify-between space-x-4"
        >
          <div className="flex items-center space-x-4">
            <MdOutlineFilterAlt className="hidden md:block h-5 w-5 -skew-x-12" />
            <span className="text-base md:text-lg tracking-wide italic">
              Filter By College, Faculty or School, Department
            </span>
          </div>
          <button
            type="submit"
            className="p-1 h-8 w-8 rounded-full bg-blue-950/60 flex items-center justify-center animate-pulse"
          >
            <MdKeyboardArrowRight className="h-6 w-6 text-white -skew-x-12" />
          </button>
          {/* <MdKeyboardArrowRight className="h-6 w-6" /> */}
        </Link>
        <Form
          action=""
          className="px-2 md:px-6 py-2 text-blue-950/50 font-medium flex items-center justify-between space-x-2"
        >
          <label className="w-full flex items-center space-x-1 md:space-x-4">
            <input
              name="search"
              type="search"
              onChange={onSearchChange}
              className="order-2 peer animate-pulse focus:animate-none px-2 md:px-4 flex-1 h-10 block rounded-full border-slate-300 focus:ring-0 focus:border-slate-400 placeholder:text-blue-950/50"
              placeholder="Search By Surname, Other names or Staff Number"
            />
            <IoSearchCircleOutline className="order-1 h-6 w-6 md:h-10 md:w-10 animate-spin peer-focus:animate-none" />
          </label>
        </Form>
      </div>

      {searchParams.get("search") ? (
        <div className="px-4 py-4 rounded-xl bg-white/80 border shadow space-y-4">
          <h1 className="px-3 py-0.5 w-fit -skew-x-12  rounded bg-blue-950/50 text-white font-bold tracking-wider">
            Search Results
          </h1>
          <div className="px-0 h-[39.5rem] grid md:grid-cols-3 gap-3 overflow-y-scroll">
            {data &&
              data.map((row: any) => (
                <LASCandidate key={row.staff_no} data={row} />
              ))}
            {!data.length && (
              <LASCandidate
                data={{
                  name: "Not found !",
                  staff_no: 0,
                  department: "Enter Lectures's Last or first name",
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white/80 border shadow">
          <h1 className="px-3 py-1 w-fit -skew-x-12  rounded bg-red-950/50 text-white font-bold tracking-wider">
            Voting Instructions & Guide
          </h1>
          <div className="py-4 px-3 h-80 grid gap-y-3 overflow-y-scroll [&_dl]:border-b [&_dl]:border-dashed [&_dl]:border-spacing-60 [&_dl]:border-blue-200/60 [&_dl]:pb-2 last:[&_dl]:border-0 last:[&_dl]:pb-0">
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">Step 1</dt>
              <dd className="text-base space-y-2">
                <p>
                  "<b>Filter By College, Faculty/School, Department</b>" to list{" "}
                  <em>colleges</em> then <em>faculties</em> or <em>schools</em>{" "}
                  then <em>departments</em> and then finally categorized list of
                  lecturers for selection.
                </p>
                <p className="text-center text-lg text-red-950/50 italic">
                  <b>OR</b>
                </p>
                <p>
                  "<b>Search By Surname, Other names or Staff Number</b>" to
                  present an uncategorized list of lecturers for selection.
                </p>
              </dd>
            </dl>
            <dl className="space-y-3">
              <dt className="text-gray-500 font-medium text-base">Step 2</dt>
              <dd className="text-base space-y-2">
                <p>
                  Click on a <em>candidate</em> card to choose the for voting,
                  then finally click on "<b>Submit vote</b>" at the right
                  sidebar to vote completely.
                </p>
              </dd>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}

export default LASByGroup;
