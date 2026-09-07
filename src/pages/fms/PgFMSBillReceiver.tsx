import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISStudentCard from "../../components/ais/AISStudentCard";
import Service from "../../utils/fmsService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.billReceivers(params.billId);
  console.log(data);
  return { data };
}

function PgFMSBillReceiver({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data && (
          <AISStudentCard
            key={``}
            title={`BILL RECEIVERS`}
            data={data?.map((r: any) => r?.student)}
          />
        )}
        {!data?.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-14 w-14 text-primary/30 border rounded-md" />
            <span className="text-xs text-primary/40 font-medium">
              No Receivers
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgFMSBillReceiver;
