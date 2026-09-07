import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISResitScoreCard from "../../components/ais/AISResitScoreCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchResitSessionList(params.sessionId);
  return { data };
}

function PgAISResitSessionScore({}: Props) {
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
          <AISResitScoreCard title={resitData[0]} data={resitData[1]} />
        ))}
        {!data.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">No Records ...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgAISResitSessionScore;
