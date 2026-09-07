import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISResultCard from "../../components/ais/AISResultCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  // gpa/cgpa are computed server-side (fetchStudentTranscript) — the single
  // source of truth shared with the student self-service view, so both
  // always agree instead of each re-deriving its own.
  const data = await Service.fetchStudentTranscript(params.studentId);
  return { data };
}

function PgAISStudentTranscript({}: Props) {
  const { data }: any = useLoaderData();

  if (!data?.length)
    return (
      <div className="p-3 ">
        <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
          No Academic Statement ...
        </h1>
      </div>
    );
  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
      <div className="w-full flex items-start space-x-3 p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <BsInfoCircle className="h-4 w-4 md:h-5 md:w-5 text-primary/60 shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-primary-dark/70 font-noto">
          Courses marked <span className="font-bold">I</span> (Incomplete) are not counted toward GPA/CGPA until a final score is recorded.
        </p>
      </div>
      {data &&
        Array.from(data)?.map(([title, row, meta]: any) => (
          <AISResultCard
            key={title}
            title={title.toUpperCase()}
            data={row}
            meta={meta}
          />
        ))}
    </div>
  );
}

export default PgAISStudentTranscript;
