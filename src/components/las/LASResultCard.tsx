import React, { useState } from "react";
import { MdOutlineFilterAlt } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { TbReportSearch } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import Service from "../../utils/evsService";

type Props = {
  exportData: (type: string) => void;
};

function LASResultCard({ exportData }: Props) {
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
        <h1 className="p-2 md:px-6 md:py-3 bg-blue-950/50 text-white font-medium flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 uppercase tracking-widest">
            <TbReportSearch className="hidden md:block h-8 w-8 " />
            <span className="text-sm md:text-lg">
              GENERAL VOTING STATISTICS
            </span>
          </div>
        </h1>

        {/* <div className="p-2 md:px-6 md:py-3 text-blue-950/50 font-medium flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
                <MdOutlineFilterAlt className="hidden md:block h-5 w-5 -skew-x-12" />
                <span className="text-sm md:text-lg tracking-wide italic">Best Lecturer Award - Top 20</span>
            </div>
             <button type="submit" className="p-1 h-9 w-9 rounded-full bg-[#01A4A6] flex items-center justify-center">
               <SiMicrosoftexcel className="md:h-5 md:w-5 text-white -skew-x-12" />
            </button>
        </div>
        <div className="p-2 md:px-6 md:py-3 text-blue-950/50 font-medium flex items-center justify-between space-x-4">
            <div className="flex-1 flex items-center space-x-4">
                <MdOutlineFilterAlt className="hidden md:block h-5 w-5 -skew-x-12" />
                <span className="text-sm md:text-lg tracking-wide italic">Best Lecturer Award - Top 50</span>
            </div>
            <button type="submit" className="p-1 h-9 w-9 rounded-full bg-[#01A4A6] flex items-center justify-center">
               <SiMicrosoftexcel className="md:h-5 md:w-5 text-white -skew-x-12" />
            </button>
        </div> */}
        <div className="p-2 md:px-6 md:py-3 text-blue-950/50 font-medium flex items-center justify-between space-x-4">
          <div className="flex-1 flex items-center space-x-4">
            <MdOutlineFilterAlt className="hidden md:block h-5 w-5 -skew-x-12" />
            <span className="text-sm md:text-lg tracking-wide italic">
              Best Lecturer Award - All Candidates with votes
            </span>
          </div>
          <button
            onClick={() => exportData("candidates")}
            className="p-1 h-9 w-9 rounded-full bg-[#01A4A6] flex items-center justify-center"
          >
            <SiMicrosoftexcel className="md:h-5 md:w-5 text-white -skew-x-12" />
          </button>
        </div>
        <div className="p-2 md:px-6 md:py-3 text-blue-950/50 font-medium flex items-center justify-between space-x-4">
          <div className="flex-1 flex items-center space-x-4">
            <MdOutlineFilterAlt className="hidden md:block h-5 w-5 -skew-x-12" />
            <span className="text-sm md:text-lg tracking-wide italic">
              Best Lecturer Award - All Votes by students{" "}
            </span>
          </div>
          <button
            onClick={() => exportData("voters")}
            className="p-1 h-9 w-9 rounded-full bg-[#01A4A6] flex items-center justify-center"
          >
            <SiMicrosoftexcel className="md:h-5 md:w-5 text-white -skew-x-12" />
          </button>
        </div>
      </div>
    </>
  );
}

export default LASResultCard;
