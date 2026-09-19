import React from "react";
import { FaFolder } from "react-icons/fa";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { Link } from "react-router-dom";

type Props = {
  data: any;
};

// Narrower clone of BacklogCardItem: no edit/delete (exam score batches are
// upload-only), links to the dedicated /ais/examscores/:id detail+approve page.
function ExamScoreCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group font-roboto">
      <h2 className="text-sm md:text-sm font-semibold text-gray-500 uppercase">
        {data?.title}
      </h2>
      {data?.tag ? (
        <div className="w-fit py-0.5 px-2 rounded bg-slate-200 text-xs text-gray-600 font-semibold tracking-wide">
          {data.tag}
        </div>
      ) : null}
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="w-full flex items-center justify-between space-x-2">
          <div className="flex-1 text-sm md:text-sm text-primary-dark/70 font-bold capitalize">
            EXAM SCORE
          </div>
          <div className="py-0.5 px-2 w-fit text-sm rounded bg-primary/60 text-white font-bold">
            {data?.status ? "APPROVED" : "PENDED"}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span className="text-primary/80 text-xs font-semibold tracking-wider uppercase">
            {data?.session?.title}
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          <Link
            to={`/ais/examscores/${encodeURIComponent(data?.id)}`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span className="bg-primary-dark/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold">
              RECORDS
            </span>
            <span className="font-semibold text-base text-primary/60">
              {data?.meta?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamScoreCardItem;
