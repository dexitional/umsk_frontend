import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISSheetStudentCard from "../../components/ais/AISSheetStudentCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.loadSheet(params.sheetId);
  return { data };
}

function PgAISSheetStudent({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data?.length ? (
          <AISSheetStudentCard title={`Students`} data={data} />
        ) : null}
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

export default PgAISSheetStudent;
