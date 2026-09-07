import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISStudentCard from "../../components/ais/AISStudentCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchProgramStudent(params.programId);
  return { data };
}

function PgAISProgramStudent({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data &&
          Array.from(data).map(([title, row]: any, i: number) => (
            <AISStudentCard
              key={title}
              title={title.toUpperCase()}
              data={row}
            />
          ))}
        {!data.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">
              No Student Records ...
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgAISProgramStudent;
