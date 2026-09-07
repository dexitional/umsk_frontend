import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISChangeCard from "../../components/ais/AISChangeCard";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchProgramStudent(params.programId);
  return { data };
}

function PgAISProgramChange({}: Props) {
  const { data }: any = useLoaderData();
  const canManageChange = useHasRole("ais", ["program::admin"]);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data &&
         <AISChangeCard
              key={0}
              title={`CHANGE OF PROGRAM`}
              data={data}
              canManage={canManageChange}
            />
        }

        {!data.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">
              No Program Change Records ...
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgAISProgramChange;
