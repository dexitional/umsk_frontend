import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISResitStudentCard from "../../components/ais/AISResitStudentCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchResitSessionList(params.sessionId);
  console.log("Resit: ", data);
  return { data };
}

function PgAISResitSessionStudent({}: Props) {
  const { data }: any = useLoaderData();

  if (data?.message)
    return (
      <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
        <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
        <span className="text-primary/40 font-medium capitalize">
          {data?.message}
        </span>
      </div>
    );

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data?.map((resitData: any, i: number) => (
          <AISResitStudentCard title={resitData[0]} data={resitData[1]} />
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

export default PgAISResitSessionStudent;
