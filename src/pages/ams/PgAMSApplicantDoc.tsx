import React from "react";
import { useLoaderData } from "react-router-dom";
import AISResultCard from "../../components/ais/AISResultCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  // gpa/cgpa are computed server-side (fetchStudentTranscript) — the single
  // source of truth shared with every transcript view, so this always
  // agrees with the others instead of re-deriving its own.
  const data = await Service.fetchStudentTranscript(params.studentId);
  return { data };
}

function PgAMSApplicantDoc({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
      {data &&
        Array.from(data).map(([title, row, meta]: any) => (
          <AISResultCard
            key={title}
            title={title.toUpperCase()}
            data={row}
            meta={meta}
          />
        ))}
      {!data.length ? (
        <div className="p-3 ">
          <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
            No Academic Statement ...
          </h1>
        </div>
      ) : null}
    </div>
  );
}

export default PgAMSApplicantDoc;
